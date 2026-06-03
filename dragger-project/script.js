/* ============================================
   DRAGGER — Drag & Drop Playground
   script.js
   ============================================ */

const board    = document.getElementById('board');
const dropZone = document.getElementById('dropZone');
const addBtn   = document.getElementById('addBtn');
const resetBtn = document.getElementById('resetBtn');
const countEl  = document.getElementById('cardCount');
const toast    = document.getElementById('toast');

/* ── State ── */
let dragged   = null;   // the card being dragged
let ghostEl   = null;   // placeholder ghost
let cardCount = 6;      // running id counter

const EMOJIS = ['🌈','🦄','🍕','🎸','🧩','🛸','🪐','🌊','🎭','🦋','🍄','🎲'];

/* ── Helpers ── */
function updateCount() {
  countEl.textContent = board.querySelectorAll('.card').length;
}

let toastTimer;
function showToast(msg) {
  toast.classList.remove('hidden');
  toast.textContent = msg;
  // force reflow so transition fires
  toast.getBoundingClientRect();
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 1800);
}

function createCard(label, icon) {
  cardCount++;
  const card = document.createElement('div');
  card.classList.add('card');
  card.draggable = true;
  card.dataset.id = cardCount;
  card.innerHTML = `
    <span class="card-icon">${icon}</span>
    <p>${label}</p>
    <span class="drag-hint">drag me</span>
  `;
  attachCardEvents(card);
  return card;
}

function createGhost(width, height) {
  const g = document.createElement('div');
  g.classList.add('card', 'card-ghost');
  g.style.width  = width  + 'px';
  g.style.height = height + 'px';
  return g;
}

/* ── Card Drag Events ── */
function attachCardEvents(card) {
  card.addEventListener('dragstart', onDragStart);
  card.addEventListener('dragend',   onDragEnd);
}

function onDragStart(e) {
  dragged = e.currentTarget;
  dragged.classList.add('dragging');

  // create ghost placeholder
  const rect = dragged.getBoundingClientRect();
  ghostEl = createGhost(rect.width, rect.height);
  dragged.after(ghostEl);

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragged.dataset.id);
}

function onDragEnd() {
  if (!dragged) return;
  dragged.classList.remove('dragging');
  ghostEl?.remove();
  ghostEl  = null;
  dragged  = null;
  board.classList.remove('drag-over-board');
  dropZone.classList.remove('active');
}

/* ── Board Drag-Over (reorder) ── */
board.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  board.classList.add('drag-over-board');

  const afterEl = getDragAfterElement(board, e.clientY);
  if (!afterEl) {
    board.appendChild(ghostEl);
  } else if (afterEl !== ghostEl) {
    board.insertBefore(ghostEl, afterEl);
  }
});

board.addEventListener('dragleave', e => {
  if (!board.contains(e.relatedTarget)) {
    board.classList.remove('drag-over-board');
  }
});

board.addEventListener('drop', e => {
  e.preventDefault();
  board.classList.remove('drag-over-board');
  if (!dragged) return;

  if (ghostEl && ghostEl.parentNode === board) {
    board.insertBefore(dragged, ghostEl);
    ghostEl.remove();
    ghostEl = null;
  } else {
    board.appendChild(dragged);
  }

  updateCount();
  showToast('Card moved ✓');
});

/* ── Drop Zone (delete) ── */
dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('active');
});

dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('active');
  if (!dragged) return;
  dragged.remove();
  ghostEl?.remove();
  ghostEl = null;
  dragged = null;
  updateCount();
  showToast('Card removed 🗑️');
});

/* ── Utility: Find element to insert before ── */
function getDragAfterElement(container, y) {
  const draggables = [
    ...container.querySelectorAll('.card:not(.dragging):not(.card-ghost)')
  ];

  return draggables.reduce((closest, child) => {
    const box    = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/* ── Add Card ── */
addBtn.addEventListener('click', () => {
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  const card  = createCard(`Task ${cardCount + 1}`, emoji);
  board.appendChild(card);

  // pop-in animation
  card.style.animation = 'none';
  card.getBoundingClientRect();
  card.style.animation = '';

  updateCount();
  showToast('New card added ✦');
});

/* ── Reset ── */
const DEFAULTS = [
  { icon: '🎯', label: 'Task One'   },
  { icon: '🚀', label: 'Task Two'   },
  { icon: '💡', label: 'Task Three' },
  { icon: '🔥', label: 'Task Four'  },
  { icon: '⚡', label: 'Task Five'  },
  { icon: '🎨', label: 'Task Six'   },
];

resetBtn.addEventListener('click', () => {
  board.innerHTML = '';
  cardCount = 0;
  DEFAULTS.forEach(({ icon, label }) => {
    const card = createCard(label, icon);
    board.appendChild(card);
  });
  updateCount();
  showToast('Board reset ↺');
});

/* ── Init: attach events to existing cards ── */
document.querySelectorAll('.card').forEach(attachCardEvents);
updateCount();
