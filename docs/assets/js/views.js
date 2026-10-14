import { store } from './content.js';
import { esc, icon, md, inline, enhance } from './ui.js';

const imgFallback = {
  avatar: 'assets/img/avatar.svg',
  banner: 'assets/img/banner.svg',
};

/* ------------------------------------------------------------------ helpers */
const pill = (text, cls = '', ic = '') => `<span class="pill ${cls}">${ic ? icon(ic) : ''}${esc(text)}</span>`;

const usageBlock = (lines = []) => lines.length
  ? `<div class="code code--usage" data-label="Usage"><pre><code>${esc(lines.join('\n'))}</code></pre><button class="copy" type="button" data-copy aria-label="Copy usage">${icon('copy')}<span>Copy</span></button></div>`
  : '';

function optionsTable(options = []) {
  if (!options.length) return '';
  const rows = options.map((o) => `
    <tr>
      <td data-label="Option"><code>${esc(o.name)}</code>${o.required ? '<span class="req">required</span>' : '<span class="opt">optional</span>'}</td>
      <td data-label="Type"><span class="type">${esc(o.type)}</span></td>
      <td data-label="Description">${inline(o.description)}</td>
    </tr>`).join('');
  return `<div class="block"><h4 class="block__title">Options</h4>
    <div class="table-wrap table-wrap--options"><table class="options"><thead><tr><th>Option</th><th>Type</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}

function permBlock(p = {}, access) {
  const user = p.user ?? [];
  const bot = p.bot ?? [];
  const chips = (list, empty) => list.length
    ? list.map((x) => `<span class="chip">${esc(x)}</span>`).join('')
    : `<span class="chip chip--muted">${empty}</span>`;
  return `<div class="block perms"><h4 class="block__title">Permissions</h4>
    <div class="perms__grid">
      <div><div class="perms__label">You need</div><div class="chips">${chips(user, 'No special permission')}</div></div>
      <div><div class="perms__label">Damselette needs</div><div class="chips">${chips(bot, 'Nothing extra')}</div></div>
    </div>${access ? `<p class="perms__access">${inline(access)}</p>` : ''}</div>`;
}

function examples(list = []) {
  if (!list.length) return '';
  return `<div class="block"><h4 class="block__title">${list.length > 1 ? 'Examples' : 'Example'}</h4>${list.map((e) => `
    <div class="example"><div class="code code--example"><pre><code>${esc(e.command)}</code></pre><button class="copy" type="button" data-copy aria-label="Copy example">${icon('copy')}<span>Copy</span></button></div>
    ${e.note ? `<p class="example__note">${inline(e.note)}</p>` : ''}</div>`).join('')}</div>`;
}

const notes = (list = []) => list.length
  ? `<div class="block"><h4 class="block__title">Good to know</h4><ul class="notes">${list.map((n) => `<li>${inline(n)}</li>`).join('')}</ul></div>`
  : '';

function badges(cmd) {
  const b = [];
  const user = cmd.permissions?.user ?? [];
  if (user.length) b.push(pill(user.join(' + '), 'pill--perm', 'key'));
  else if (!cmd.access) b.push(pill('Everyone', 'pill--open', 'sparkles'));
  if (cmd.logged) b.push(pill('Logged as a case', '', 'log'));
  if (cmd.notifiesUser) b.push(pill('DMs the member', '', 'dm'));
  if (cmd.private) b.push(pill('Private reply', '', 'eyeoff'));
  if (cmd.dm) b.push(pill('Works in DMs', '', 'dm'));
  return b.join('');
}

const anchorBtn = (id) =>
  `<button class="anchor" type="button" data-anchor="${id}" aria-label="Copy link to this command">${icon('link')}</button>`;

function subSection(cmd, sub) {
  const id = `cmd-${cmd.name}-${sub.name}`;
  const perms = sub.permissions ? permBlock(sub.permissions) : '';
  return `<section class="sub" id="${id}">
    <h3 class="sub__name anchored"><span class="slash">/${esc(cmd.name)}</span> ${esc(sub.name)}${anchorBtn(id)}</h3>
    <p class="sub__summary">${inline(sub.summary)}</p>
    ${sub.description ? `<div class="prose">${md(sub.description)}</div>` : ''}
    ${usageBlock(sub.usage)}${optionsTable(sub.options)}${perms}${examples(sub.examples)}${notes(sub.notes)}
  </section>`;
}

function commandCard(cmd) {
  const id = `cmd-${cmd.name}`;
  const hasSubs = cmd.subcommands.length > 0;
  return `<article class="cmd" id="${id}">
    <header class="cmd__head">
      <h2 class="cmd__name anchored"><span class="slash">/</span>${esc(cmd.name)}${anchorBtn(id)}</h2>
      <div class="badges">${badges(cmd)}</div>
    </header>
    <p class="cmd__summary">${inline(cmd.summary)}</p>
    <div class="prose">${md(cmd.description)}</div>
    ${usageBlock(cmd.usage)}
    ${hasSubs ? '' : optionsTable(cmd.options)}
    ${cmd.permissions || cmd.access ? permBlock(cmd.permissions, cmd.access) : ''}
    ${hasSubs ? `<div class="subs"><h4 class="block__title">Subcommands</h4>${cmd.subcommands.map((s) => subSection(cmd, s)).join('')}</div>` : ''}
    ${hasSubs ? '' : examples(cmd.examples)}
    ${notes(cmd.notes)}
  </article>`;
}

function pager(prev, next) {
  if (!prev && !next) return '';
  const a = (item, dir) => item
    ? `<a class="pager__link pager__link--${dir}" href="${item.href}"><span class="pager__dir">${dir === 'prev' ? icon('left') + 'Previous' : 'Next' + icon('arrow')}</span><span class="pager__title">${esc(item.title)}</span></a>`
    : '<span></span>';
  return `<nav class="pager" aria-label="Pagination">${a(prev, 'prev')}${a(next, 'next')}</nav>`;
}

const editLink = (file) => {
  const base = store.site.editBase;
  return base ? `<a class="edit-link" href="${esc(base + file)}" target="_blank" rel="noopener noreferrer">${icon('edit')}Edit this page</a>` : '';
};

/** Replaces `{{tokens}}` in guide markdown. */
function expandTokens(src) {
  return src
    .replace(/\{\{permissions-table\}\}/g, () => permissionsTable())
    .replace(/\{\{command-count\}\}/g, String(store.commands.length));
}

function permissionsTable() {
  const rows = [];
  store.commands.forEach((cmd) => {
    const row = (name, perms, access, anchor) => {
      const user = (perms?.user ?? []).join(', ');
      const bot = (perms?.bot ?? []).join(', ');
      rows.push(`| [\`${name}\`](#/commands/${anchor}) | ${user || (access ? '_See below_' : 'Anyone')} | ${bot || '_None_'} |`);
    };
    row(`/${cmd.name}`, cmd.permissions, cmd.access, cmd.name);
    cmd.subcommands.forEach((s) => {
      if (s.permissions) row(`/${cmd.name} ${s.name}`, s.permissions, null, `${cmd.name}?s=cmd-${cmd.name}-${s.name}`);
    });
  });
  return `| Command | You need | Damselette needs |\n|---|---|---|\n${rows.join('\n')}`;
}

/* ------------------------------------------------------------------ views */
export function homeView() {
  const { site } = store;
  const systems = store.guides.filter((g) => g.group === 'Systems');
  const iconFor = { moderation: 'shield', tickets: 'ticket', antinuke: 'settings' };
  const cards = systems.map((g) => `
    <a class="card feature" href="#/docs/${g.slug}">
      <span class="feature__icon">${icon(iconFor[g.slug] || 'sparkles', 'icon--lg')}</span>
      <h3 class="feature__title">${esc(g.title)}</h3>
      <p>${esc(g.description)}</p>
      <span class="feature__more">Read the guide ${icon('arrow')}</span>
    </a>`).join('');

  const steps = [
    ['Invite Damselette', 'Add the bot and move its role to the top of your list.', 'getting-started'],
    ['Pick a mod log', 'Run <code>/config modlog</code> so every case has a home.', 'getting-started'],
    ['Open your support desk', 'Optional: <code>/ticket setup</code> posts the Open Ticket panel.', 'tickets'],
    ['Check protection', 'Anti-nuke is on by default. <code>/antinuke status</code> confirms it.', 'antinuke'],
  ].map(([t, d, g], i) => `
    <li class="step"><span class="step__n">${String(i + 1).padStart(2, '0')}</span><div><h3>${t}</h3><p>${d}</p></div><a class="step__go" href="#/docs/${g}" aria-label="Open ${esc(t)}">${icon('arrow')}</a></li>`).join('');

  const catCards = store.categories.map((c) => `
    <a class="card cat" href="#/commands/${c.id}">
      <span class="cat__icon">${icon(c.icon || 'hash')}</span>
      <div><h3>${esc(c.title)}</h3><p>${c.commands.length} command${c.commands.length === 1 ? '' : 's'}</p></div>
      ${icon('right', 'cat__chev')}
    </a>`).join('');

  const html = `
  <section class="hero">
    <div class="hero__banner"><img src="${esc(site.images.banner)}" alt="" data-fallback="banner" decoding="async" fetchpriority="high"></div>
    <div class="hero__body">
      <img class="hero__avatar" src="${esc(site.images.avatar)}" alt="${esc(site.name)} avatar" width="132" height="132" data-fallback="avatar">
      <div class="hero__text">
        <p class="eyebrow">Discord bot · Documentation</p>
        <h1 class="display hero__title">${esc(site.name)}</h1>
        <p class="hero__tagline">${esc(site.tagline)}</p>
        <div class="hero__cta">
          <a class="btn btn--primary" href="#/docs/getting-started">${icon('flag')}Get started</a>
          <a class="btn" href="#/commands">${icon('hash')}Browse commands</a>
          ${site.links.invite ? `<a class="btn btn--ghost" href="${esc(site.links.invite)}" target="_blank" rel="noopener noreferrer">${icon('plus')}Invite</a>` : ''}
        </div>
      </div>
    </div>
    <ul class="stats" aria-label="At a glance">
      <li><span class="stats__n display">${String(store.commands.length).padStart(2, '0')}</span><span class="stats__l">Commands</span></li>
      <li><span class="stats__n display">${String(store.commands.length + store.subcommandCount).padStart(2, '0')}</span><span class="stats__l">Ways to use them</span></li>
      <li><span class="stats__n display">${String(systems.length).padStart(2, '0')}</span><span class="stats__l">Core systems</span></li>
      <li><span class="stats__n display">24/7</span><span class="stats__l">On watch</span></li>
    </ul>
  </section>

  <section class="section">
    <div class="section__head"><p class="eyebrow">Systems</p><h2 class="display">Everything under one moon</h2></div>
    <div class="grid grid--3">${cards}</div>
  </section>

  <section class="section">
    <div class="section__head"><p class="eyebrow">Quick start</p><h2 class="display">Ready in four steps</h2></div>
    <ol class="steps">${steps}</ol>
  </section>

  <section class="section">
    <div class="section__head"><p class="eyebrow">Reference</p><h2 class="display">Command reference</h2></div>
    <div class="grid grid--2">${catCards}</div>
    <p class="section__foot"><a class="textlink" href="#/commands">View every command ${icon('arrow')}</a></p>
  </section>`;

  return { html, title: '', description: site.description, home: true };
}

export function guideView(slug) {
  const i = store.guides.findIndex((g) => g.slug === slug);
  if (i < 0) return null;
  const g = store.guides[i];
  const rendered = md(expandTokens(g.body));
  const toHref = (x) => x && { title: x.title, href: `#/docs/${x.slug}` };
  const html = `<article class="doc">
    <p class="eyebrow">${esc(g.group)}</p>
    <div class="prose prose--doc" data-prose>${rendered}</div>
    ${editLink(g.file)}
    ${pager(toHref(store.guides[i - 1]), toHref(store.guides[i + 1]))}
  </article>`;
  return { html, title: g.title, description: g.description, toc: 'auto', nav: `docs/${slug}` };
}

export function commandsIndexView() {
  const chips = store.categories.map((c) => `<button type="button" class="filter" data-filter="${c.id}" aria-pressed="false">${esc(c.title)}<span class="filter__n">${c.commands.length}</span></button>`).join('');
  const items = store.commands.map((c) => `
    <a class="card cmdcard" href="#/commands/${c.name}" data-cat="${c.category.id}" data-text="${esc((c.name + ' ' + c.summary).toLowerCase())}">
      <div class="cmdcard__top"><code class="cmdcard__name">/${esc(c.name)}</code><span class="cmdcard__cat">${esc(c.category.title)}</span></div>
      <p>${inline(c.summary)}</p>
      <div class="badges">${badges(c)}</div>
    </a>`).join('');
  const html = `<article class="doc doc--wide">
    <p class="eyebrow">Reference</p>
    <h1 class="display">Commands</h1>
    <p class="lead">Every slash command Damselette offers. Type <code class="no-autolink">/</code> in Discord to use them, or filter below.</p>
    <div class="toolbar">
      <label class="field"><span class="sr-only">Filter commands</span>${icon('search')}<input type="search" id="cmd-filter" placeholder="Filter commands…" autocomplete="off" spellcheck="false"></label>
      <div class="filters" role="group" aria-label="Filter by category">
        <button type="button" class="filter is-active" data-filter="all" aria-pressed="true">All<span class="filter__n">${store.commands.length}</span></button>${chips}
      </div>
    </div>
    <div class="grid grid--cmd" id="cmd-grid">${items}</div>
    <p class="empty" id="cmd-empty" hidden>No commands match your filter.</p>
  </article>`;
  return {
    html, title: 'Commands', description: 'Every Damselette slash command with usage, options and permissions.', nav: 'commands',
    after(root) {
      const input = root.querySelector('#cmd-filter');
      const cards = [...root.querySelectorAll('.cmdcard')];
      const empty = root.querySelector('#cmd-empty');
      let cat = 'all';
      const apply = () => {
        const q = input.value.toLowerCase().replace(/^\//, '').trim();
        let shown = 0;
        cards.forEach((c) => {
          const ok = (cat === 'all' || c.dataset.cat === cat) && (!q || c.dataset.text.includes(q));
          c.hidden = !ok;
          if (ok) shown++;
        });
        empty.hidden = shown > 0;
      };
      input.addEventListener('input', apply);
      root.querySelectorAll('.filter').forEach((b) => b.addEventListener('click', () => {
        cat = b.dataset.filter;
        root.querySelectorAll('.filter').forEach((x) => {
          const on = x === b;
          x.classList.toggle('is-active', on);
          x.setAttribute('aria-pressed', String(on));
        });
        apply();
      }));
    },
  };
}

export function categoryView(id) {
  const i = store.categories.findIndex((c) => c.id === id);
  if (i < 0) return null;
  const cat = store.categories[i];
  const toHref = (x) => x && { title: `${x.title} commands`, href: `#/commands/${x.id}` };
  const guide = cat.guide && store.guides.find((g) => g.slug === cat.guide);
  const html = `<article class="doc doc--commands">
    <p class="eyebrow">Commands</p>
    <h1 class="display">${esc(cat.title)}</h1>
    <p class="lead">${inline(cat.description)}</p>
    ${guide ? `<p><a class="textlink" href="#/docs/${guide.slug}">${icon('book')}Read the ${esc(guide.title)} guide ${icon('arrow')}</a></p>` : ''}
    <div class="cmdlist">${cat.commands.map(commandCard).join('')}</div>
    ${editLink(cat.file)}
    ${pager(toHref(store.categories[i - 1]), toHref(store.categories[i + 1]))}
  </article>`;
  return {
    html, title: `${cat.title} commands`, description: cat.description, nav: `commands/${cat.id}`,
    toc: cat.commands.map((c) => ({ id: `cmd-${c.name}`, text: `/${c.name}`, level: 2 })),
  };
}

export function notFoundView() {
  return {
    html: `<article class="doc"><p class="eyebrow">404</p><h1 class="display">Lost in the moonlight</h1>
      <p class="lead">That page doesn't exist, or it has moved.</p>
      <div class="hero__cta"><a class="btn btn--primary" href="#/">Back home</a><button class="btn" type="button" data-open-search>${icon('search')}Search the docs</button></div></article>`,
    title: 'Page not found', description: '',
  };
}

/* Post-render pass shared by all views. */
export function finish(root) {
  enhance(root, { commandNames: store.names });
  root.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      const fb = imgFallback[img.dataset.fallback];
      if (fb && !img.src.endsWith(fb)) img.src = fb;
    }, { once: true });
  });
}
