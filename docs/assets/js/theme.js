const KEY = 'damselette-theme';
const root = document.documentElement;
const media = window.matchMedia('(prefers-color-scheme: dark)');

const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v) => { try { localStorage.setItem(KEY, v); } catch { /* storage unavailable */ } };

export const current = () => root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');

export function apply(theme) {
  root.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0c0a1a' : '#f6f3ff');
  document.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
}

export function initTheme() {
  apply(read() || (media.matches ? 'dark' : 'light'));
  media.addEventListener?.('change', (e) => { if (!read()) apply(e.matches ? 'dark' : 'light'); });
}

export function toggleTheme() {
  const next = current() === 'dark' ? 'light' : 'dark';
  write(next);
  apply(next);
}
