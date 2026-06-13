/* ============================================================
   PassMetrics — Password Strength Metrics Tracker
   script.js
   ============================================================ */

'use strict';

// ── DOM refs ─────────────────────────────────────────────────
const passwordInput   = document.getElementById('passwordInput');
const toggleBtn       = document.getElementById('toggleBtn');
const eyeIcon         = document.getElementById('eyeIcon');
const eyeOffIcon      = document.getElementById('eyeOffIcon');
const strengthBar     = document.getElementById('strengthBar');
const strengthLabel   = document.getElementById('strengthLabel');
const ringProgress    = document.getElementById('ringProgress');
const scoreNumber     = document.getElementById('scoreNumber');
const clearBtn        = document.getElementById('clearBtn');
const generateBtn     = document.getElementById('generateBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyList     = document.getElementById('historyList');
const historyEmpty    = document.getElementById('historyEmpty');
const tipsList        = document.getElementById('tipsList');
const inputCard       = document.querySelector('.input-card');

const valLength  = document.getElementById('val-length');
const valUpper   = document.getElementById('val-upper');
const valLower   = document.getElementById('val-lower');
const valDigits  = document.getElementById('val-digits');
const valSpecial = document.getElementById('val-special');
const valEntropy = document.getElementById('val-entropy');

const badgeLength  = document.getElementById('badge-length');
const badgeUpper   = document.getElementById('badge-upper');
const badgeLower   = document.getElementById('badge-lower');
const badgeDigits  = document.getElementById('badge-digits');
const badgeSpecial = document.getElementById('badge-special');
const badgeEntropy = document.getElementById('badge-entropy');

const crackOnline = document.getElementById('crack-online');
const crackSlow   = document.getElementById('crack-slow');
const crackFast   = document.getElementById('crack-fast');

// ── Constants ────────────────────────────────────────────────
const RING_CIRCUMFERENCE = 314; // 2π × r(50)

const COMMON_SEQUENCES = [
  'abcdefghijklmnopqrstuvwxyz',
  '0123456789',
  'qwertyuiopasdfghjklzxcvbnm',
  'password', 'letmein', 'welcome', 'admin', 'login',
];

const STRENGTH_LEVELS = [
  { label: 'Very Weak', cls: 's-weak',        barWidth: '12%',  color: '#FF4C6A', lv: 'weak'        },
  { label: 'Weak',      cls: 's-weak',        barWidth: '25%',  color: '#FF4C6A', lv: 'weak'        },
  { label: 'Fair',      cls: 's-fair',        barWidth: '45%',  color: '#FF8C42', lv: 'fair'        },
  { label: 'Good',      cls: 's-good',        barWidth: '65%',  color: '#F7C948', lv: 'good'        },
  { label: 'Strong',    cls: 's-strong',      barWidth: '82%',  color: '#3EFFB4', lv: 'strong'      },
  { label: 'Very Strong',cls: 's-very-strong',barWidth: '100%', color: '#00D4FF', lv: 'very-strong' },
];

// ── Session history ──────────────────────────────────────────
let history = [];
let debounceTimer;
let lastPassword = '';

// ── Toggle visibility ────────────────────────────────────────
toggleBtn.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  eyeIcon.style.display    = isPassword ? 'none'  : 'block';
  eyeOffIcon.style.display = isPassword ? 'block' : 'none';
});

// ── Clear ────────────────────────────────────────────────────
clearBtn.addEventListener('click', () => {
  passwordInput.value = '';
  analyse('');
  passwordInput.focus();
});

// ── Generate strong password ─────────────────────────────────
generateBtn.addEventListener('click', () => {
  const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower   = 'abcdefghijklmnopqrstuvwxyz';
  const digits  = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const all     = upper + lower + digits + symbols;

  let pwd = [
    upper[rnd(upper.length)],
    upper[rnd(upper.length)],
    lower[rnd(lower.length)],
    lower[rnd(lower.length)],
    digits[rnd(digits.length)],
    digits[rnd(digits.length)],
    symbols[rnd(symbols.length)],
    symbols[rnd(symbols.length)],
  ];

  for (let i = 0; i < 8; i++) pwd.push(all[rnd(all.length)]);
  pwd = shuffle(pwd).join('');

  passwordInput.type = 'text';
  eyeIcon.style.display    = 'none';
  eyeOffIcon.style.display = 'block';
  passwordInput.value = pwd;
  analyse(pwd);
});

function rnd(max) { return Math.floor(Math.random() * max); }
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Core input listener ──────────────────────────────────────
passwordInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const pwd = passwordInput.value;
  analyse(pwd);

  // Add to history after 600ms of no typing
  debounceTimer = setTimeout(() => {
    if (pwd.length > 0 && pwd !== lastPassword) {
      lastPassword = pwd;
      addToHistory(pwd);
    }
  }, 600);
});

// ── Main analysis function ───────────────────────────────────
function analyse(pwd) {
  const metrics = computeMetrics(pwd);
  const score   = computeScore(metrics);
  const level   = getStrengthLevel(score);

  renderStrength(score, level);
  renderMetrics(metrics);
  renderChecklist(metrics, pwd);
  renderCrackTime(metrics);
  renderTips(metrics, pwd);
}

// ── Compute metrics ──────────────────────────────────────────
function computeMetrics(pwd) {
  const upper    = (pwd.match(/[A-Z]/g) || []).length;
  const lower    = (pwd.match(/[a-z]/g) || []).length;
  const digits   = (pwd.match(/[0-9]/g) || []).length;
  const special  = (pwd.match(/[^A-Za-z0-9]/g) || []).length;
  const length   = pwd.length;

  // Character pool size for entropy
  let pool = 0;
  if (upper)   pool += 26;
  if (lower)   pool += 26;
  if (digits)  pool += 10;
  if (special) pool += 32;

  const entropy  = pool > 0 ? +(length * Math.log2(pool)).toFixed(1) : 0;

  const hasRepeat   = /(.)\1{2,}/.test(pwd);
  const hasSequence = COMMON_SEQUENCES.some(seq => {
    const l = pwd.toLowerCase();
    for (let i = 0; i <= seq.length - 3; i++) {
      if (l.includes(seq.slice(i, i + 3))) return true;
    }
    return false;
  });

  return { length, upper, lower, digits, special, entropy, hasRepeat, hasSequence, pool };
}

// ── Compute score (0–100) ─────────────────────────────────────
function computeScore(m) {
  if (m.length === 0) return 0;
  let s = 0;

  // Length (up to 35 pts)
  s += Math.min(m.length * 2.5, 35);

  // Character variety (up to 40 pts)
  if (m.upper   >= 1) s += 8;
  if (m.upper   >= 2) s += 2;
  if (m.lower   >= 1) s += 8;
  if (m.lower   >= 2) s += 2;
  if (m.digits  >= 1) s += 8;
  if (m.digits  >= 2) s += 2;
  if (m.special >= 1) s += 8;
  if (m.special >= 2) s += 4;

  // Entropy bonus (up to 20 pts)
  s += Math.min(m.entropy / 5, 20);

  // Penalties
  if (m.hasRepeat)   s -= 10;
  if (m.hasSequence) s -= 10;

  return Math.max(0, Math.min(100, Math.round(s)));
}

// ── Strength level ────────────────────────────────────────────
function getStrengthLevel(score) {
  if (score === 0)  return null;
  if (score < 20)   return STRENGTH_LEVELS[0];
  if (score < 40)   return STRENGTH_LEVELS[1];
  if (score < 55)   return STRENGTH_LEVELS[2];
  if (score < 70)   return STRENGTH_LEVELS[3];
  if (score < 85)   return STRENGTH_LEVELS[4];
  return STRENGTH_LEVELS[5];
}

// ── Render strength ───────────────────────────────────────────
function renderStrength(score, level) {
  // Remove all strength classes
  inputCard.className = 'input-card card';

  if (!level || score === 0) {
    strengthBar.style.width = '0';
    strengthLabel.textContent = '—';
    strengthLabel.style.color = '';
    scoreNumber.textContent = '0';
    scoreNumber.style.color = '';
    ringProgress.style.strokeDashoffset = RING_CIRCUMFERENCE;
    ringProgress.style.stroke = '';
    return;
  }

  inputCard.classList.add(level.cls);

  strengthBar.style.width       = level.barWidth;
  strengthLabel.textContent     = level.label;
  scoreNumber.textContent       = score;

  const offset = RING_CIRCUMFERENCE - (score / 100) * RING_CIRCUMFERENCE;
  ringProgress.style.strokeDashoffset = offset;
}

// ── Render metrics cards ──────────────────────────────────────
function renderMetrics(m) {
  valLength.textContent  = m.length;
  valUpper.textContent   = m.upper;
  valLower.textContent   = m.lower;
  valDigits.textContent  = m.digits;
  valSpecial.textContent = m.special;
  valEntropy.textContent = m.entropy;

  setBadge(badgeLength,  m.length >= 16 ? 'good' : m.length >= 8 ? 'warn' : 'bad',
                         m.length >= 16 ? 'Excellent' : m.length >= 8 ? 'OK' : 'Too Short');
  setBadge(badgeUpper,   m.upper >= 2   ? 'good' : m.upper >= 1   ? 'warn' : 'bad',
                         m.upper >= 2   ? 'Great' : m.upper >= 1   ? 'OK'  : 'Missing');
  setBadge(badgeLower,   m.lower >= 2   ? 'good' : m.lower >= 1   ? 'warn' : 'bad',
                         m.lower >= 2   ? 'Great' : m.lower >= 1   ? 'OK'  : 'Missing');
  setBadge(badgeDigits,  m.digits >= 2  ? 'good' : m.digits >= 1  ? 'warn' : 'bad',
                         m.digits >= 2  ? 'Great' : m.digits >= 1  ? 'OK'  : 'Missing');
  setBadge(badgeSpecial, m.special >= 2 ? 'good' : m.special >= 1 ? 'warn' : 'bad',
                         m.special >= 2 ? 'Great' : m.special >= 1 ? 'OK'  : 'Missing');
  setBadge(badgeEntropy, m.entropy >= 60 ? 'good' : m.entropy >= 36 ? 'warn' : 'bad',
                         m.entropy >= 60 ? 'High' : m.entropy >= 36 ? 'Medium' : 'Low');
}

function setBadge(el, type, text) {
  el.className = 'metric-badge';
  el.classList.add('badge-' + type);
  el.textContent = text;
}

// ── Render checklist ──────────────────────────────────────────
function renderChecklist(m, pwd) {
  setCheck('chk-len8',      m.length >= 8);
  setCheck('chk-len12',     m.length >= 12);
  setCheck('chk-upper',     m.upper >= 1);
  setCheck('chk-lower',     m.lower >= 1);
  setCheck('chk-digit',     m.digits >= 1);
  setCheck('chk-special',   m.special >= 1);
  setCheck('chk-norepeat',  !m.hasRepeat  && pwd.length > 0);
  setCheck('chk-nosequence',!m.hasSequence && pwd.length > 0);
}

function setCheck(id, pass) {
  const el = document.getElementById(id);
  el.className = 'check-item ' + (pass ? 'pass' : (document.getElementById('passwordInput').value.length > 0 ? 'fail' : ''));
}

// ── Render crack time ─────────────────────────────────────────
function renderCrackTime(m) {
  if (m.length === 0 || m.pool === 0) {
    crackOnline.textContent = '—';
    crackSlow.textContent   = '—';
    crackFast.textContent   = '—';
    return;
  }

  const combinations = Math.pow(m.pool, m.length);

  crackOnline.textContent = formatTime(combinations / 100);
  crackSlow.textContent   = formatTime(combinations / 10000);
  crackFast.textContent   = formatTime(combinations / 10_000_000_000);
}

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds > 1e40) return 'Heat death of universe';
  if (seconds < 1)       return '< 1 second';
  if (seconds < 60)      return Math.round(seconds) + ' sec';
  if (seconds < 3600)    return Math.round(seconds / 60) + ' min';
  if (seconds < 86400)   return Math.round(seconds / 3600) + ' hrs';
  if (seconds < 2.628e6) return Math.round(seconds / 86400) + ' days';
  if (seconds < 3.156e7) return Math.round(seconds / 2.628e6) + ' months';
  if (seconds < 3.156e9) return Math.round(seconds / 3.156e7) + ' years';
  if (seconds < 3.156e12) return (seconds / 3.156e9).toFixed(1) + 'K years';
  if (seconds < 3.156e15) return (seconds / 3.156e12).toFixed(1) + 'M years';
  if (seconds < 3.156e18) return (seconds / 3.156e15).toFixed(1) + 'B years';
  return '∞ years';
}

// ── Render tips ───────────────────────────────────────────────
function renderTips(m, pwd) {
  const tips = [];

  if (pwd.length === 0) {
    tipsList.innerHTML = '<li class="tip-item tip-default">Start typing a password to get personalized tips.</li>';
    return;
  }

  if (m.length < 8)    tips.push('Make it at least 8 characters long.');
  if (m.length < 12)   tips.push('Aim for 12+ characters for better security.');
  if (m.upper < 1)     tips.push('Add uppercase letters (A–Z).');
  if (m.lower < 1)     tips.push('Add lowercase letters (a–z).');
  if (m.digits < 1)    tips.push('Include at least one number (0–9).');
  if (m.special < 1)   tips.push('Add special characters like !@#$%^&*.');
  if (m.special < 2)   tips.push('Use two or more special characters.');
  if (m.hasRepeat)     tips.push('Avoid repeating the same character 3+ times.');
  if (m.hasSequence)   tips.push('Remove common sequences like "abc" or "123".');
  if (m.entropy < 36)  tips.push('Use a wider mix of character types to increase entropy.');

  if (tips.length === 0) {
    tips.push('Excellent password! Consider using a password manager to store it safely.');
    tips.push('Never reuse passwords across different websites.');
  }

  tipsList.innerHTML = tips
    .map(t => `<li class="tip-item">${t}</li>`)
    .join('');
}

// ── History ───────────────────────────────────────────────────
function addToHistory(pwd) {
  const metrics = computeMetrics(pwd);
  const score   = computeScore(metrics);
  const level   = getStrengthLevel(score);

  const masked = maskPassword(pwd);
  const entry  = { masked, score, level };

  history.unshift(entry);
  if (history.length > 10) history.pop();

  renderHistory();
}

function maskPassword(pwd) {
  if (pwd.length <= 4) return '*'.repeat(pwd.length);
  return pwd[0] + '*'.repeat(pwd.length - 2) + pwd[pwd.length - 1];
}

function renderHistory() {
  if (history.length === 0) {
    historyEmpty.style.display = 'block';
    historyList.innerHTML = '';
    return;
  }

  historyEmpty.style.display = 'none';
  historyList.innerHTML = history.map(e => `
    <li class="history-item">
      <span class="history-mask">${e.masked}</span>
      <span class="history-score" style="color: ${e.level ? e.level.color : 'var(--text-3)'}">${e.score}/100</span>
      <span class="history-level lv-${e.level ? e.level.lv : 'weak'}">${e.level ? e.level.label : 'None'}</span>
    </li>
  `).join('');
}

clearHistoryBtn.addEventListener('click', () => {
  history = [];
  lastPassword = '';
  renderHistory();
});

// ── Init ──────────────────────────────────────────────────────
analyse('');
