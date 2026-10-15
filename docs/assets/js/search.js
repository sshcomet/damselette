import { buildIndex, search } from './content.js';
import { esc, icon } from './ui.js';

let index = [];
let modal, input, list, lastFocus;
let results = [];
let active = 0;

const SUGGESTED = [
  ['/ban', '#/commands/ban', 'Command'],
  ['/mute', '#/commands/mute', 'Command'],
  ['/ticket setup', '#/commands/ticket?s=cmd-ticket-setup', 'Command'],
  ['/antinuke', '#/commands/antinuke', 'Command'],
  ['Getting started', '#/docs/getting-started', 'Guide'],
  ['Anti-nuke limits', '#/docs/antinuke?s=what-is-protected', 'Guide'],
];

const typeIcon = { Guide: 'book', Command: 'hash', Commands: 'sparkles' };

function highlight(text, tokens) {
  let out = esc(text);
  tokens.filter(Boolean).forEach((t) => {
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    out = out.replace(re, '<mark>$1</mark>');
  });
  return out;
}

function snippet(e, tokens) {
  const text = e.text || '';
  if (!text) return '';
  const lower = text.toLowerCase();
  const pos = tokens.map((t) => lower.indexOf(t)).filter((n) => n >= 0).sort((a, b) => a - b)[0] ?? 0;
  const start = Math.max(0, pos - 30);
  const s = (start > 0 ? '…' : '') + text.slice(start, start + 110) + (start + 110 < text.length ? '…' : '');
  return highlight(s, tokens);
}

function render(query) {
  const q = query.trim();
  if (!q) {
    results = [];
    list.innerHTML = `<div class="search__hint">Suggestions</div>${SUGGESTED.map(([t, href, type], i) => `
      <a class="search__item" role="option" id="sr-${i}" aria-selected="${i === 0}" href="${href}" data-i="${i}">
        <span class="search__ic">${icon(typeIcon[type] || 'hash')}</span>
        <span class="search__main"><span class="search__title">${esc(t)}</span></span>
        <span class="search__type">${type}</span></a>`).join('')}`;
    results = SUGGESTED.map(([title, href]) => ({ title, href }));
    active = 0;
    return;
  }
  const tokens = q.toLowerCase().replace(/^\//, '').split(/\s+/);
  results = search(index, q);
  active = 0;
  if (!results.length) {
    list.innerHTML = `<div class="search__empty">No results for <strong>${esc(q)}</strong>.<br><span>Try a command name like <code>/ban</code> or a topic like “tickets”.</span></div>`;
    return;
  }
  list.innerHTML = results.map((e, i) => `
    <a class="search__item" role="option" id="sr-${i}" aria-selected="${i === 0}" href="${e.href}" data-i="${i}">
      <span class="search__ic">${icon(typeIcon[e.type] || 'hash')}</span>
      <span class="search__main">
        <span class="search__title">${highlight(e.title, tokens)}</span>
        <span class="search__crumb">${esc(e.crumb)}</span>
        <span class="search__snip">${snippet(e, tokens)}</span>
      </span>
      <span class="search__type">${e.type}</span>
    </a>`).join('');
}

function setActive(n) {
  const items = list.querySelectorAll('.search__item');
  if (!items.length) return;
  active = (n + items.length) % items.length;
  items.forEach((el, i) => el.setAttribute('aria-selected', String(i === active)));
  input.setAttribute('aria-activedescendant', `sr-${active}`);
  items[active].scrollIntoView({ block: 'nearest' });
}

export function openSearch(prefill = '') {
  if (modal.hidden === false) return;
  lastFocus = document.activeElement;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  input.value = prefill;
  render(prefill);
  requestAnimationFrame(() => { modal.classList.add('is-open'); input.focus(); input.select(); });
}

export function closeSearch() {
  if (modal.hidden) return;
  modal.classList.remove('is-open');
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  lastFocus?.focus?.();
}

export function initSearch() {
  index = buildIndex();
  modal = document.getElementById('search');
  input = document.getElementById('search-input');
  list = document.getElementById('search-results');

  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const r = results[active];
      if (r) { closeSearch(); location.hash = r.href; }
    }
  });
  list.addEventListener('click', (e) => { if (e.target.closest('.search__item')) closeSearch(); });
  list.addEventListener('mousemove', (e) => {
    const it = e.target.closest('.search__item');
    if (it && Number(it.dataset.i) !== active) setActive(Number(it.dataset.i));
  });
  modal.addEventListener('mousedown', (e) => { if (e.target === modal) closeSearch(); });
  modal.querySelector('[data-search-close]').addEventListener('click', closeSearch);

  // Trap focus in the dialog
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); closeSearch(); }
    if (e.key === 'Tab') { e.preventDefault(); input.focus(); }
  });

  document.addEventListener('keydown', (e) => {
    const typing = /^(input|textarea|select)$/i.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); modal.hidden ? openSearch() : closeSearch(); }
    else if (e.key === '/' && !typing && modal.hidden) { e.preventDefault(); openSearch(); }
  });
}
