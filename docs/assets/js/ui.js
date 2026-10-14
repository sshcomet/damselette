export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const slugify = (s) =>
  String(s).toLowerCase().replace(/<[^>]*>/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/>',
  ticket: '<path d="M3 9a2 2 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a2 2 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v3z"/><path d="M14 5v14" stroke-dasharray="2 2.5"/>',
  settings: '<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3M14 9l2 2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  tip: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  warn: '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/>',
  dm: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 6.2A9 9 0 0 1 22 12a14 14 0 0 1-3.2 4M6.5 6.6A14 14 0 0 0 2 12s3.5 7 10 7a9 9 0 0 0 4-.9"/>',
  log: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
  hash: '<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>',
  github: '<path fill="currentColor" stroke="none" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z"/><path d="m13.5 6.5 4 4"/>',
};

export const icon = (name, cls = '') =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[name] || P.hash}</svg>`;

/* ---------- Markdown ---------- */
const marked = window.marked;
marked.use({ gfm: true, breaks: false });
export const md = (s) => marked.parse(String(s ?? ''));
export const inline = (s) => marked.parseInline(String(s ?? ''));

/** Strip markdown to plain text for search snippets. */
export const plain = (s) =>
  String(s ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\{\{[^}]+\}\}/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^>\s*\[!\w+\]\s*/gm, '')
    .replace(/[`*_>#|]/g, ' ')
    .replace(/^\s*[-:]{3,}.*$/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const CALLOUTS = {
  NOTE: { title: 'Note', icon: 'info' },
  TIP: { title: 'Tip', icon: 'tip' },
  WARNING: { title: 'Warning', icon: 'warn' },
  IMPORTANT: { title: 'Important', icon: 'warn' },
};

/**
 * Turns rendered markdown into the final DOM: callouts, heading anchors, copy buttons,
 * scrollable tables and automatic links from `/command` mentions to the command reference.
 */
export function enhance(root, { commandNames = new Set() } = {}) {
  // Callouts
  root.querySelectorAll('blockquote').forEach((bq) => {
    const p = bq.querySelector('p');
    const m = p && p.textContent.match(/^\s*\[!(\w+)\]\s*/);
    if (!m || !CALLOUTS[m[1].toUpperCase()]) return;
    const kind = m[1].toUpperCase();
    p.innerHTML = p.innerHTML.replace(/^\s*\[!\w+\]\s*(<br\s*\/?>)?\s*/i, '');
    const div = document.createElement('div');
    div.className = `callout callout--${kind.toLowerCase()}`;
    div.setAttribute('role', 'note');
    div.innerHTML = `<div class="callout__title">${icon(CALLOUTS[kind].icon)}<span>${CALLOUTS[kind].title}</span></div><div class="callout__body">${bq.innerHTML}</div>`;
    bq.replaceWith(div);
  });

  // Headings
  const used = new Set();
  root.querySelectorAll('h2, h3').forEach((h) => {
    if (h.classList.contains('anchored') || !h.closest('.prose')) return;
    let id = slugify(h.textContent) || 'section';
    for (let i = 2; used.has(id); i++) id = `${slugify(h.textContent)}-${i}`;
    used.add(id);
    h.id = id;
    h.classList.add('anchored');
    h.insertAdjacentHTML('beforeend',
      `<button class="anchor" type="button" data-anchor="${id}" aria-label="Copy link to this section">${icon('link')}</button>`);
  });

  // Tables
  root.querySelectorAll('table').forEach((t) => {
    if (t.parentElement.classList.contains('table-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    t.replaceWith(wrap);
    wrap.appendChild(t);
  });

  // Code blocks
  root.querySelectorAll('pre').forEach((pre) => {
    if (pre.parentElement.classList.contains('code')) return;
    const wrap = document.createElement('div');
    wrap.className = 'code';
    pre.replaceWith(wrap);
    wrap.appendChild(pre);
    wrap.insertAdjacentHTML('beforeend',
      `<button class="copy" type="button" data-copy aria-label="Copy to clipboard">${icon('copy')}<span>Copy</span></button>`);
  });

  // Links
  root.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (/^https?:\/\//i.test(href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  });

  // `/command` mentions -> links
  root.querySelectorAll('code').forEach((c) => {
    if (c.closest('pre, a, .no-autolink')) return;
    const m = c.textContent.match(/^\/([a-z]+)(?:\s|$)/);
    if (m && commandNames.has(m[1])) {
      const a = document.createElement('a');
      a.href = `#/commands/${m[1]}`;
      a.className = 'cmd-link';
      c.replaceWith(a);
      a.appendChild(c);
    }
  });
  return root;
}

export const debounce = (fn, ms = 80) => {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};

export function toast(msg) {
  let box = document.getElementById('toasts');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toasts';
    box.setAttribute('aria-live', 'polite');
    document.body.appendChild(box);
  }
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  box.appendChild(t);
  requestAnimationFrame(() => t.classList.add('is-in'));
  setTimeout(() => { t.classList.remove('is-in'); setTimeout(() => t.remove(), 300); }, 2200);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } finally { ta.remove(); }
  }
}
