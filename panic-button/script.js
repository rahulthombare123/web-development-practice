/* ============================================
   PANIC BUTTON — Behavior
   The button dodges the cursor. Every dodge raises
   panic level (visual escalation via CSS classes).
   Catch it 3 times in a row without a dodge = win.
   ============================================ */

const arena = document.getElementById('arena');
const btn = document.getElementById('panicBtn');
const btnLabel = document.getElementById('btnLabel');
const dodgeCountEl = document.getElementById('dodgeCount');
const panicLevelEl = document.getElementById('panicLevel');
const tauntEl = document.getElementById('taunt');
const winOverlay = document.getElementById('winOverlay');
const winMessage = document.getElementById('winMessage');
const restartBtn = document.getElementById('restartBtn');

let dodgeCount = 0;
let panicLevel = 0; // 0 to 4
let dangerRadius = 90; // px — how close cursor can get before button flees
let isCaught = false;

const PANIC_LABELS = ['CALM', 'ALERT', 'NERVOUS', 'FREAKING OUT', 'MAXIMUM PANIC'];

const TAUNTS = [
  "It hasn't even noticed you yet.",
  "Oh, it saw that.",
  "Nice try. Really.",
  "It's onto your strategy now.",
  "Getting warmer. It's getting scared-er.",
  "This is basically a boss fight now.",
  "You're better at this than most people.",
  "It's questioning its life choices.",
  "One more and it might actually panic-quit.",
];

const CLICK_LABELS = ['CLICK ME', 'TRY AGAIN', 'ALMOST', 'SO CLOSE', 'PLEASE STOP', 'IM SCARED'];

function getArenaBounds() {
  const rect = arena.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  return {
    minX: btnRect.width / 2 + 12,
    maxX: rect.width - btnRect.width / 2 - 12,
    minY: btnRect.height / 2 + 12,
    maxY: rect.height - btnRect.height / 2 - 12,
    rect,
  };
}

function moveButtonTo(x, y) {
  const bounds = getArenaBounds();
  const clampedX = Math.min(Math.max(x, bounds.minX), bounds.maxX);
  const clampedY = Math.min(Math.max(y, bounds.minY), bounds.maxY);
  btn.style.left = `${clampedX}px`;
  btn.style.top = `${clampedY}px`;
}

function moveButtonRandom() {
  const bounds = getArenaBounds();
  const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
  const y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
  moveButtonTo(x, y);
}

function moveButtonAwayFrom(cursorX, cursorY) {
  const bounds = getArenaBounds();
  const relX = cursorX - bounds.rect.left;
  const relY = cursorY - bounds.rect.top;

  // pick a spot roughly opposite the cursor, with some randomness
  const angle = Math.atan2(
    (bounds.minY + bounds.maxY) / 2 - relY,
    (bounds.minX + bounds.maxX) / 2 - relX
  ) + (Math.random() - 0.5) * 1.2;

  const distance = 140 + Math.random() * 80;
  let targetX = relX + Math.cos(angle) * distance;
  let targetY = relY + Math.sin(angle) * distance;

  moveButtonTo(targetX, targetY);
}

function updatePanicVisuals() {
  btn.classList.remove('level-1', 'level-2', 'level-3', 'level-4');
  if (panicLevel > 0) {
    btn.classList.add(`level-${panicLevel}`);
  }
  panicLevelEl.textContent = PANIC_LABELS[panicLevel];

  const tauntIndex = Math.min(dodgeCount, TAUNTS.length - 1);
  tauntEl.textContent = TAUNTS[tauntIndex];

  const labelIndex = Math.min(dodgeCount, CLICK_LABELS.length - 1);
  btnLabel.textContent = CLICK_LABELS[labelIndex];
}

function registerDodge() {
  dodgeCount++;
  panicLevel = Math.min(4, Math.floor(dodgeCount / 2) + (dodgeCount > 0 ? 1 : 0));
  dodgeCountEl.textContent = dodgeCount;
  dangerRadius = Math.max(40, dangerRadius - 4); // gets slightly harder to trigger flee each time — but also means it feels more "twitchy"
  updatePanicVisuals();
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

/* ---------- Cursor tracking (desktop) ---------- */

let rafPending = false;

function handlePointerMove(clientX, clientY) {
  if (isCaught) return;
  if (rafPending) return;
  rafPending = true;

  requestAnimationFrame(() => {
    rafPending = false;
    const btnRect = btn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const dist = distance(clientX, clientY, btnCenterX, btnCenterY);

    if (dist < dangerRadius) {
      moveButtonAwayFrom(clientX, clientY);
      registerDodge();
    }
  });
}

arena.addEventListener('mousemove', (e) => {
  handlePointerMove(e.clientX, e.clientY);
});

/* touch support — flee on touchmove near the button, but still
   allow an actual tap to register as a catch */
arena.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  if (!touch) return;
  handlePointerMove(touch.clientX, touch.clientY);
}, { passive: true });

/* ---------- Catch handling ---------- */

btn.addEventListener('click', () => {
  if (isCaught) return;
  triggerWin();
});

function triggerWin() {
  isCaught = true;
  btn.classList.add('caught');

  const messages = [
    "Respect. Most people rage quit.",
    "You have the patience of a saint.",
    "The button has accepted defeat.",
    "Achievement unlocked: Actually Clicked It.",
  ];
  winMessage.textContent = messages[Math.floor(Math.random() * messages.length)];

  setTimeout(() => {
    winOverlay.classList.add('show');
    launchConfetti();
  }, 350);
}

restartBtn.addEventListener('click', () => {
  resetGame();
});

function resetGame() {
  dodgeCount = 0;
  panicLevel = 0;
  dangerRadius = 90;
  isCaught = false;

  dodgeCountEl.textContent = '0';
  panicLevelEl.textContent = PANIC_LABELS[0];
  tauntEl.textContent = TAUNTS[0];
  btnLabel.textContent = CLICK_LABELS[0];

  btn.classList.remove('level-1', 'level-2', 'level-3', 'level-4', 'caught');
  winOverlay.classList.remove('show');

  moveButtonRandom();
}

/* ---------- Confetti (lightweight, no libraries) ---------- */

const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];
let confettiAnimId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const CONFETTI_COLORS = ['#ff3b3b', '#4de1ff', '#ffb84d', '#f2f2f5', '#ff8a8a'];

function launchConfetti() {
  confettiParticles = [];
  const count = 140;

  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 8 + 4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.35 + Math.random() * 0.15,
      opacity: 1,
    });
  }

  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let stillAlive = false;

  confettiParticles.forEach((p) => {
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;

    if (p.y > canvas.height * 0.6) {
      p.opacity -= 0.02;
    }

    if (p.opacity > 0) {
      stillAlive = true;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
  });

  if (stillAlive) {
    confettiAnimId = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* ---------- Init ---------- */

window.addEventListener('load', () => {
  moveButtonRandom();
});

window.addEventListener('resize', () => {
  if (!isCaught) moveButtonRandom();
});
