import { loadContent, store } from './content.js';
import { initTheme, toggleTheme, current as currentTheme } from './theme.js';
import { esc, icon, copyText, toast } from './ui.js';
import { homeView, guideView, commandsIndexView, categoryView, notFoundView, finish } from './views.js';
import { initSearch, openSearch } from './search.js';

const $ = (sel, root = document) => root.querySelector(sel);
const main = $('#main');
const sidebar = $('#sidebar');
const tocEl = $('#toc');
let tocObserver;

initTheme();

/* ------------------------------------------------------------------ routing */
function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  return { parts: path.split('/').filter(Boolean), s: new URLSearchParams(query).get('s') };
}

function resolve({ parts }) {
  const [a, b] = parts;
  if (!a) return homeView();
  if (a === 'docs') return (b && guideView(b)) || notFoundView();
  if (a === 'commands') {
    if (!b) return commandsIndexView();
    if (store.categories.some((c) => c.id === b)) return categoryView(b);
    const cmd = store.byName.get(b);
    if (cmd) { const v = categoryView(cmd.category.id); v.focus = `cmd-${cmd.name}`; return v; }
  }
  return notFoundView();
}

let lastKey = '';
function render() {
  const route = parseHash();
  const view = resolve(route);
  const key = route.parts.join('/');
  const samePage = key === lastKey;
  lastKey = key;

  const target = route.s || view.focus;
  if (samePage && target) { scrollToId(target); return; }

  main.innerHTML = view.html;
  document.body.classList.toggle('is-home', !!view.home);
  document.title = view.title ? `${view.title} · ${store.site.name} Docs` : `${store.site.name} · Discord bot documentation`;
  $('meta[name="description"]').setAttribute('content', view.description || store.site.description);

  finish(main);
  view.after?.(main);
  buildToc(view);
  markActive(view.focus ? '' : (view.nav || (view.home ? '' : key)));
  closeDrawer();

  if (target) requestAnimationFrame(() => scrollToId(target));
  else window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  if (!target) { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }); }
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
}

/* ------------------------------------------------------------------ sidebar */
function buildSidebar() {
  const link = (href, text, nav, extra = '') => `<a class="nav__link ${extra}" href="${href}" data-nav="${nav}">${esc(text)}</a>`;
  const guideIcon = { 'getting-started': 'flag', moderation: 'shield', tickets: 'ticket', antinuke: 'settings', permissions: 'key', faq: 'help', introduction: 'book' };
  const groups = store.groups.map((g) => `
    <div class="nav__group">
      <p class="nav__label">${esc(g.title)}</p>
      ${g.guides.map((x) => `<a class="nav__link nav__link--icon" href="#/docs/${x.slug}" data-nav="docs/${x.slug}">${icon(guideIcon[x.slug] || 'book')}<span>${esc(x.title)}</span></a>`).join('')}
    </div>`).join('');

  const cmds = store.categories.map((c) => `
    <details class="nav__cat" data-cat="${c.id}">
      <summary><span>${icon(c.icon || 'hash')}${esc(c.title)}</span>${icon('down', 'nav__chev')}</summary>
      <div class="nav__sub">
        ${link(`#/commands/${c.id}`, `All ${c.title.toLowerCase()}`, `commands/${c.id}`, 'nav__link--all')}
        ${c.commands.map((x) => link(`#/commands/${x.name}`, `/${x.name}`, `cmd/${x.name}`, 'nav__link--cmd')).join('')}
      </div>
    </details>`).join('');

  sidebar.innerHTML = `<nav aria-label="Documentation">
    ${groups}
    <div class="nav__group">
      <p class="nav__label">Commands</p>
      <a class="nav__link nav__link--icon" href="#/commands" data-nav="commands">${icon('hash')}<span>All commands</span></a>
      ${cmds}
    </div></nav>`;
}

function markActive(nav) {
  const route = parseHash();
  const cmdName = route.parts[0] === 'commands' && store.byName.has(route.parts[1]) ? `cmd/${route.parts[1]}` : null;
  sidebar.querySelectorAll('.nav__link').forEach((a) => {
    const on = a.dataset.nav === nav || (cmdName && a.dataset.nav === cmdName);
    a.classList.toggle('is-active', !!on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  const catId = route.parts[0] === 'commands'
    ? (store.categories.some((c) => c.id === route.parts[1]) ? route.parts[1] : store.byName.get(route.parts[1])?.category.id)
    : null;
  sidebar.querySelectorAll('.nav__cat').forEach((d) => { if (d.dataset.cat === catId) d.open = true; });
  sidebar.querySelector('.nav__link.is-active')?.scrollIntoView({ block: 'nearest' });
}

/* ------------------------------------------------------------------ table of contents */
function buildToc(view) {
  tocObserver?.disconnect();
  let items = [];
  if (view.toc === 'auto') {
    items = [...main.querySelectorAll('[data-prose] h2, [data-prose] h3')].map((h) => ({
      id: h.id, text: h.textContent, level: h.tagName === 'H3' ? 3 : 2,
    }));
  } else if (Array.isArray(view.toc)) items = view.toc;

  if (items.length < 2) { tocEl.innerHTML = ''; tocEl.hidden = true; return; }
  tocEl.hidden = false;
  tocEl.innerHTML = `<nav aria-label="On this page"><p class="toc__label">On this page</p><ul>
    ${items.map((i) => `<li class="toc__l${i.level}"><a href="#" data-toc="${i.id}">${esc(i.text)}</a></li>`).join('')}</ul></nav>`;

  const links = new Map([...tocEl.querySelectorAll('a')].map((a) => [a.dataset.toc, a]));
  tocObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((l) => l.classList.remove('is-active'));
        links.get(en.target.id)?.classList.add('is-active');
      }
    });
  }, { rootMargin: '-90px 0px -70% 0px' });
  items.forEach((i) => { const el = document.getElementById(i.id); if (el) tocObserver.observe(el); });
}

/* ------------------------------------------------------------------ drawer */
const drawerBtn = $('#menu-btn');
const backdrop = $('#backdrop');
function openDrawer() {
  document.body.classList.add('drawer-open', 'no-scroll');
  drawerBtn.setAttribute('aria-expanded', 'true');
  sidebar.querySelector('a, summary')?.focus();
}
function closeDrawer() {
  if (!document.body.classList.contains('drawer-open')) return;
  document.body.classList.remove('drawer-open', 'no-scroll');
  drawerBtn.setAttribute('aria-expanded', 'false');
}

/* ------------------------------------------------------------------ chrome */
function buildChrome() {
  const { site } = store;
  $('#brand-name').textContent = site.name;
  const logo = $('#brand-logo');
  logo.src = site.images.avatar;
  logo.addEventListener('error', () => { logo.src = 'assets/img/avatar.svg'; }, { once: true });

  // CSS custom properties resolve url() against the stylesheet, so hand it absolute URLs.
  const abs = (p) => new URL(p, document.baseURI).href;
  document.documentElement.style.setProperty('--bg-image-dark', `url("${abs(site.images.background)}")`);
  document.documentElement.style.setProperty('--bg-image-light', `url("${abs(site.images.backgroundLight || site.images.background)}")`);

  const links = [];
  if (site.links.invite) links.push(`<a href="${esc(site.links.invite)}" target="_blank" rel="noopener noreferrer">Invite</a>`);
  if (site.links.support) links.push(`<a href="${esc(site.links.support)}" target="_blank" rel="noopener noreferrer">Support</a>`);
  if (site.links.github) links.push(`<a href="${esc(site.links.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
  $('#footer').innerHTML = `
    <div class="footer__inner">
      <div class="footer__brand"><img src="${esc(site.images.avatar)}" alt="" width="28" height="28" data-fallback="avatar"><span class="display">${esc(site.name)}</span></div>
      <p>${esc(site.footer || '')}</p>
      <nav class="footer__links" aria-label="Footer"><a href="#/docs/getting-started">Docs</a><a href="#/commands">Commands</a>${links.join('')}</nav>
    </div>`;
  const gh = $('#gh-link');
  if (site.links.github) { gh.href = site.links.github; gh.hidden = false; } else gh.hidden = true;
  const invite = $('#invite-link');
  if (site.links.invite) { invite.href = site.links.invite; invite.hidden = false; } else invite.hidden = true;
}

function syncThemeButton() {
  const dark = currentTheme() === 'dark';
  const b = $('#theme-btn');
  b.innerHTML = icon(dark ? 'sun' : 'moon');
  b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  b.title = dark ? 'Light mode' : 'Dark mode';
}

function bindEvents() {
  $('#theme-btn').addEventListener('click', toggleTheme);
  document.addEventListener('themechange', syncThemeButton);
  syncThemeButton();
  drawerBtn.addEventListener('click', () => (document.body.classList.contains('drawer-open') ? closeDrawer() : openDrawer()));
  backdrop.addEventListener('click', closeDrawer);
  $('#search-btn').addEventListener('click', () => openSearch());
  window.addEventListener('hashchange', render);
  window.addEventListener('resize', () => { if (innerWidth >= 1000) closeDrawer(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

  document.addEventListener('click', async (e) => {
    const copy = e.target.closest('[data-copy]');
    if (copy) {
      const code = copy.parentElement.querySelector('code');
      await copyText(code.textContent.trim());
      const label = copy.querySelector('span');
      copy.classList.add('is-done');
      copy.querySelector('svg').outerHTML = icon('check');
      if (label) label.textContent = 'Copied';
      setTimeout(() => {
        copy.classList.remove('is-done');
        copy.querySelector('svg').outerHTML = icon('copy');
        if (label) label.textContent = 'Copy';
      }, 1600);
      return;
    }
    const anchor = e.target.closest('[data-anchor]');
    if (anchor) {
      const base = location.href.split('#')[0];
      const path = (location.hash.replace(/^#/, '').split('?')[0]) || '/';
      await copyText(`${base}#${path}?s=${anchor.dataset.anchor}`);
      history.replaceState(null, '', `#${path}?s=${anchor.dataset.anchor}`);
      scrollToId(anchor.dataset.anchor);
      toast('Link copied');
      return;
    }
    const toc = e.target.closest('[data-toc]');
    if (toc) {
      e.preventDefault();
      const path = (location.hash.replace(/^#/, '').split('?')[0]) || '/';
      history.replaceState(null, '', `#${path}?s=${toc.dataset.toc}`);
      scrollToId(toc.dataset.toc);
      return;
    }
    if (e.target.closest('[data-open-search]')) { openSearch(); return; }
    if (e.target.closest('.brand')) { /* handled by href */ }
  });
}

/* ------------------------------------------------------------------ boot */
(async function boot() {
  try {
    await loadContent();
  } catch (err) {
    console.error(err);
    main.innerHTML = `<article class="doc"><h1 class="display">Couldn't load the docs</h1><p class="lead">Please refresh the page. If the problem continues, try again in a few minutes.</p></article>`;
    return;
  }
  buildChrome();
  buildSidebar();
  initSearch();
  bindEvents();
  render();
  document.body.classList.remove('is-loading');
})();
