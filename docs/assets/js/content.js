import { plain } from './ui.js';

const getJSON = async (path) => {
  const r = await fetch(path, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`Could not load ${path} (${r.status})`);
  return r.json();
};
const getText = async (path) => {
  const r = await fetch(path, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`Could not load ${path} (${r.status})`);
  return r.text();
};

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  m[1].split(/\r?\n/).forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return { meta, body: m[2] };
}

export const store = {
  site: null,
  guides: [],
  groups: [],      // [{ title, guides: [] }]
  categories: [],
  commands: [],    // flattened top-level commands, each with .category
  byName: new Map(),
  names: new Set(),
  subcommandCount: 0,
};

export async function loadContent() {
  const [site, manifest] = await Promise.all([getJSON('content/site.json'), getJSON('content/manifest.json')]);
  store.site = site;

  const guides = await Promise.all(manifest.guides.map(async (file) => {
    const { meta, body } = parseFrontMatter(await getText(`content/${file}`));
    const slug = file.split('/').pop().replace(/\.md$/, '');
    return {
      slug, file: `content/${file}`,
      title: meta.title || slug, description: meta.description || '', group: meta.group || 'Guides',
      body,
    };
  }));
  store.guides = guides;
  const groups = new Map();
  guides.forEach((g) => { if (!groups.has(g.group)) groups.set(g.group, []); groups.get(g.group).push(g); });
  store.groups = [...groups].map(([title, list]) => ({ title, guides: list }));

  const cats = await Promise.all(manifest.commandCategories.map(async (file) => {
    const c = await getJSON(`content/${file}`);
    c.file = `content/${file}`;
    return c;
  }));
  store.categories = cats;

  store.commands = [];
  store.byName.clear();
  store.subcommandCount = 0;
  cats.forEach((cat) => cat.commands.forEach((cmd) => {
    cmd.category = cat;
    cmd.subcommands = cmd.subcommands || [];
    store.subcommandCount += cmd.subcommands.length;
    store.commands.push(cmd);
    store.byName.set(cmd.name, cmd);
  }));
  store.names = new Set(store.byName.keys());
  return store;
}

/* ---------- search index ---------- */
export function buildIndex() {
  const out = [];
  store.guides.forEach((g) => {
    out.push({ type: 'Guide', title: g.title, crumb: g.group, href: `#/docs/${g.slug}`, text: plain(g.description), weight: 3 });
    // one entry per heading
    const parts = g.body.split(/^(#{2,3})\s+(.+)$/m);
    for (let i = 1; i < parts.length; i += 3) {
      const heading = parts[i + 1].trim();
      const text = plain(parts[i + 2] || '');
      const id = heading.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
      out.push({ type: 'Guide', title: heading, crumb: g.title, href: `#/docs/${g.slug}?s=${id}`, text, weight: 1 });
    }
  });
  store.categories.forEach((cat) => {
    out.push({ type: 'Commands', title: cat.title, crumb: 'Command category', href: `#/commands/${cat.id}`, text: plain(cat.description), weight: 3 });
    cat.commands.forEach((cmd) => {
      const optText = (o = []) => o.map((x) => `${x.name} ${x.description}`).join(' ');
      out.push({
        type: 'Command', title: `/${cmd.name}`, crumb: cat.title, href: `#/commands/${cmd.name}`,
        text: plain([cmd.summary, cmd.description, optText(cmd.options), (cmd.notes || []).join(' ')].join(' ')),
        weight: 4, name: cmd.name,
      });
      cmd.subcommands.forEach((sub) => {
        out.push({
          type: 'Command', title: `/${cmd.name} ${sub.name}`, crumb: cat.title, href: `#/commands/${cmd.name}?s=cmd-${cmd.name}-${sub.name}`,
          text: plain([sub.summary, sub.description, optText(sub.options), (sub.notes || []).join(' ')].join(' ')),
          weight: 3, name: `${cmd.name} ${sub.name}`,
        });
      });
    });
  });
  return out.map((e) => ({ ...e, _t: e.title.toLowerCase(), _x: e.text.toLowerCase() }));
}

export function search(index, query, limit = 12) {
  const q = query.toLowerCase().replace(/^\//, '').trim();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const scored = [];
  for (const e of index) {
    const title = e._t.replace(/^\//, '');
    const hay = `${title} ${e.crumb.toLowerCase()} ${e._x}`;
    if (!tokens.every((t) => hay.includes(t))) continue;
    let s = e.weight;
    if (title === q) s += 120;
    else if (title.startsWith(q)) s += 70;
    else if (title.includes(q)) s += 40;
    for (const t of tokens) {
      if (title.startsWith(t)) s += 14;
      else if (title.includes(t)) s += 9;
      if (e.crumb.toLowerCase().includes(t)) s += 3;
      const first = e._x.indexOf(t);
      if (first >= 0) s += 4 + Math.max(0, 3 - first / 200);
    }
    scored.push({ e, s });
  }
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, limit).map((x) => x.e);
}
