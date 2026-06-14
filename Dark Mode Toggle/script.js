// Day / Night theme toggle
// Saves the user's choice in localStorage so it stays the same on the next visit

const root = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');

function getPreferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'day' || saved === 'night') {
    return saved;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'night' : 'day';
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const current = root.getAttribute('data-theme');
  const next = current === 'night' ? 'day' : 'night';
  applyTheme(next);
  localStorage.setItem('theme', next);
}

applyTheme(getPreferredTheme());

toggleBtn.addEventListener('click', toggleTheme);
