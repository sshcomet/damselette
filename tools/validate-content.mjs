
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs');
const errors = [];
const err = (m) => errors.push(m);
const readJSON = (rel) => {
  try { return JSON.parse(readFileSync(join(root, rel), 'utf8')); } catch (e) { err(`${rel}: ${e.message}`); return null; }
};

const site = readJSON('content/site.json');
const manifest = readJSON('content/manifest.json');
if (!site || !manifest) finish();

for (const key of ['avatar', 'banner', 'background']) {
  if (!existsSync(join(root, site.images?.[key] ?? '__missing__'))) err(`site.json: images.${key} points to a missing file`);
}

const guides = new Set();
for (const rel of manifest.guides) {
  const p = join(root, 'content', rel);
  if (!existsSync(p)) { err(`manifest: missing guide ${rel}`); continue; }
  const text = readFileSync(p, 'utf8');
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) err(`${rel}: missing front matter (--- title/description/group ---)`);
  else for (const k of ['title', 'description', 'group']) if (!new RegExp(`^${k}:\\s*\\S`, 'm').test(fm[1])) err(`${rel}: front matter is missing "${k}"`);
  guides.add(rel.split('/').pop().replace(/\.md$/, ''));
}

const categories = new Set();
const commands = new Set();
for (const rel of manifest.commandCategories) {
  const cat = readJSON(`content/${rel}`);
  if (!cat) continue;
  for (const k of ['id', 'title', 'description', 'commands']) if (!cat[k]) err(`${rel}: missing "${k}"`);
  categories.add(cat.id);
  if (cat.guide && !guides.has(cat.guide)) err(`${rel}: guide "${cat.guide}" does not exist`);
  for (const c of cat.commands ?? []) {
    const where = `${rel} → /${c.name ?? '?'}`;
    for (const k of ['name', 'summary', 'description']) if (!c[k]) err(`${where}: missing "${k}"`);
    if (commands.has(c.name)) err(`${where}: duplicate command name`);
    commands.add(c.name);
    const check = (o, label) => (o.options ?? []).forEach((x) => {
      for (const k of ['name', 'type', 'description']) if (!x[k]) err(`${label}: an option is missing "${k}"`);
      if (typeof x.required !== 'boolean') err(`${label}: option "${x.name}" needs "required": true/false`);
    });
    check(c, where);
    const seen = new Set();
    for (const s of c.subcommands ?? []) {
      for (const k of ['name', 'summary']) if (!s[k]) err(`${where}: a subcommand is missing "${k}"`);
      if (seen.has(s.name)) err(`${where}: duplicate subcommand "${s.name}"`);
      seen.add(s.name);
      check(s, `${where} ${s.name}`);
    }
  }
}

const sources = manifest.guides.map((r) => join(root, 'content', r)).concat(manifest.commandCategories.map((r) => join(root, 'content', r)));
for (const file of sources) {
  if (!existsSync(file)) continue;
  for (const m of readFileSync(file, 'utf8').matchAll(/\(#\/(docs|commands)\/([a-z0-9-]+)/g)) {
    const [, kind, name] = m;
    const ok = kind === 'docs' ? guides.has(name) : categories.has(name) || commands.has(name);
    if (!ok) err(`${file.replace(root + '/', '')}: broken link #/${kind}/${name}`);
  }
}

finish();
function finish() {
  if (errors.length) {
    console.error(`\n${errors.length} problem(s) found:\n` + errors.map((e) => `  ✗ ${e}`).join('\n') + '\n');
    process.exit(1);
  }
  console.log(`✓ Content OK: ${guides.size} guides, ${categories.size} categories, ${commands.size} commands.`);
}
