// ============================================
//   TICTACTOE — Game Logic
//   script.js
// ============================================

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

// ── State ──────────────────────────────────
let board      = Array(9).fill(null);
let current    = "X";
let gameOver   = false;
let scores     = { X: 0, O: 0, Draw: 0 };

// ── DOM Refs ───────────────────────────────
const cells       = document.querySelectorAll(".cell");
const turnBadge   = document.getElementById("turn-badge");
const turnSymbol  = document.getElementById("turn-symbol");
const turnText    = document.getElementById("turn-text");
const xScore      = document.getElementById("x-score");
const oScore      = document.getElementById("o-score");
const drawScore   = document.getElementById("draw-score");
const scoreX      = document.getElementById("score-x");
const scoreO      = document.getElementById("score-o");
const resetBtn    = document.getElementById("reset-btn");
const clearBtn    = document.getElementById("clear-btn");
const modalOverlay = document.getElementById("modal-overlay");
const modalSymbol  = document.getElementById("modal-symbol");
const modalTitle   = document.getElementById("modal-title");
const modalSub     = document.getElementById("modal-sub");
const modalBtn     = document.getElementById("modal-btn");

// ── Init ───────────────────────────────────
function init() {
  board      = Array(9).fill(null);
  current    = "X";
  gameOver   = false;

  cells.forEach(cell => {
    cell.textContent = "";
    cell.className   = "cell";
  });

  updateTurnUI();
  closeModal();
}

// ── Cell Click ─────────────────────────────
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const idx = parseInt(cell.dataset.index);
    if (gameOver || board[idx]) return;

    // Place mark
    board[idx]       = current;
    cell.textContent = current;
    cell.classList.add("taken", current.toLowerCase());

    // Check result
    const winCombo = getWinCombo();
    if (winCombo) {
      highlightWinners(winCombo);
      scores[current]++;
      updateScores();
      gameOver = true;
      setTimeout(() => showModal("win", current), 500);
    } else if (board.every(Boolean)) {
      scores.Draw++;
      updateScores();
      gameOver = true;
      setTimeout(() => showModal("draw"), 500);
    } else {
      current = current === "X" ? "O" : "X";
      updateTurnUI();
    }
  });
});

// ── Win Detection ──────────────────────────
function getWinCombo() {
  return WIN_COMBOS.find(([a, b, c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  ) || null;
}

function highlightWinners(combo) {
  combo.forEach(idx => cells[idx].classList.add("winner"));
}

// ── UI Updates ─────────────────────────────
function updateTurnUI() {
  turnSymbol.textContent = current;
  turnBadge.className    = `turn-badge ${current === "X" ? "x-turn" : "o-turn"}`;
  scoreX.classList.toggle("active", current === "X");
  scoreO.classList.toggle("active", current === "O");
}

function updateScores() {
  xScore.textContent    = scores.X;
  oScore.textContent    = scores.O;
  drawScore.textContent = scores.Draw;

  // Animate the changed score
  const el = current === "X" ? xScore : oScore;
  el.style.transform = "scale(1.4)";
  el.style.transition = "transform 0.15s";
  setTimeout(() => { el.style.transform = "scale(1)"; }, 200);
}

// ── Modal ──────────────────────────────────
function showModal(type, player = null) {
  if (type === "win") {
    modalSymbol.textContent = player;
    modalSymbol.className   = `modal-symbol ${player.toLowerCase()}`;
    modalTitle.textContent  = `Player ${player} Wins!`;
    modalSub.textContent    = "The grid has been claimed.";
  } else {
    modalSymbol.textContent = "—";
    modalSymbol.className   = "modal-symbol draw";
    modalTitle.textContent  = "It's a Draw!";
    modalSub.textContent    = "No one claimed the grid.";
  }
  modalOverlay.classList.add("show");
}

function closeModal() {
  modalOverlay.classList.remove("show");
}

// ── Buttons ────────────────────────────────
resetBtn.addEventListener("click", init);

clearBtn.addEventListener("click", () => {
  scores = { X: 0, O: 0, Draw: 0 };
  updateScores();
  init();
});

modalBtn.addEventListener("click", init);

// ── Start ──────────────────────────────────
init();
