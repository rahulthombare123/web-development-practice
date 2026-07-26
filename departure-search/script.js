/* ============================================
   DEPARTURE SEARCH — split-flap autosuggest
   Vanilla JS, no frameworks, no dependencies
   ============================================ */

// ---- 1. Data --------------------------------------------------
// A small "airport board" style dataset: airport code, city, country.
const DESTINATIONS = [
  { code: 'JFK', city: 'New York',     country: 'USA' },
  { code: 'LHR', city: 'London',       country: 'UK' },
  { code: 'CDG', city: 'Paris',        country: 'France' },
  { code: 'HND', city: 'Tokyo',        country: 'Japan' },
  { code: 'DXB', city: 'Dubai',        country: 'UAE' },
  { code: 'SIN', city: 'Singapore',    country: 'Singapore' },
  { code: 'SYD', city: 'Sydney',       country: 'Australia' },
  { code: 'BOM', city: 'Mumbai',       country: 'India' },
  { code: 'DEL', city: 'Delhi',        country: 'India' },
  { code: 'PNQ', city: 'Pune',         country: 'India' },
  { code: 'BLR', city: 'Bengaluru',    country: 'India' },
  { code: 'HKG', city: 'Hong Kong',    country: 'China' },
  { code: 'ICN', city: 'Seoul',        country: 'South Korea' },
  { code: 'FRA', city: 'Frankfurt',    country: 'Germany' },
  { code: 'AMS', city: 'Amsterdam',    country: 'Netherlands' },
  { code: 'MAD', city: 'Madrid',       country: 'Spain' },
  { code: 'FCO', city: 'Rome',         country: 'Italy' },
  { code: 'IST', city: 'Istanbul',     country: 'Turkey' },
  { code: 'GRU', city: 'Sao Paulo',    country: 'Brazil' },
  { code: 'YYZ', city: 'Toronto',      country: 'Canada' },
  { code: 'LAX', city: 'Los Angeles',  country: 'USA' },
  { code: 'ORD', city: 'Chicago',      country: 'USA' },
  { code: 'MEX', city: 'Mexico City',  country: 'Mexico' },
  { code: 'JNB', city: 'Johannesburg', country: 'South Africa' },
  { code: 'CAI', city: 'Cairo',        country: 'Egypt' },
  { code: 'BKK', city: 'Bangkok',      country: 'Thailand' },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia' },
  { code: 'ZRH', city: 'Zurich',       country: 'Switzerland' },
  { code: 'VIE', city: 'Vienna',       country: 'Austria' },
  { code: 'CPT', city: 'Cape Town',    country: 'South Africa' },
];

const ROW_COUNT = 5;
const COLUMNS = [
  { key: 'code',    length: 3 },
  { key: 'city',    length: 12 },
  { key: 'country', length: 12 },
];

// ---- 2. DOM references -----------------------------------------
const input      = document.getElementById('destination-input');
const flapBoard  = document.getElementById('flapBoard');
const statusLine = document.getElementById('statusLine');
const clockEl    = document.getElementById('clock');

let activeIndex = -1;   // currently keyboard-highlighted row
let currentRows = [];   // the data currently shown on the board

// ---- 3. Build the empty board (once) ---------------------------
function buildBoard() {
  for (let r = 0; r < ROW_COUNT; r++) {
    const row = document.createElement('li');
    row.className = 'flap-row';
    row.dataset.index = r;
    row.setAttribute('role', 'option');
    row.setAttribute('tabindex', '-1');

    COLUMNS.forEach(col => {
      const group = document.createElement('div');
      group.className = `flap-group flap-group--${col.key}`;

      for (let i = 0; i < col.length; i++) {
        const cell = document.createElement('span');
        cell.className = 'flap-cell';
        cell.dataset.char = ' ';

        const face = document.createElement('span');
        face.className = 'flap-face';
        face.innerHTML = '&nbsp;';

        cell.appendChild(face);
        group.appendChild(cell);
      }
      row.appendChild(group);
    });

    row.addEventListener('click', () => {
      if (currentRows[r] && currentRows[r].city.trim()) {
        selectRow(r);
      }
    });

    flapBoard.appendChild(row);
  }
}

// ---- 4. Filtering ------------------------------------------------
function getMatches(query) {
  const q = query.trim().toLowerCase();

  if (!q) {
    return DESTINATIONS.slice(0, ROW_COUNT);
  }

  const matches = DESTINATIONS.filter(d =>
    d.city.toLowerCase().includes(q) ||
    d.country.toLowerCase().includes(q) ||
    d.code.toLowerCase().includes(q)
  );

  // rank "starts with" matches above "contains" matches
  matches.sort((a, b) => {
    const aStarts = a.city.toLowerCase().startsWith(q) ? 0 : 1;
    const bStarts = b.city.toLowerCase().startsWith(q) ? 0 : 1;
    return aStarts - bStarts;
  });

  return matches.slice(0, ROW_COUNT);
}

// ---- 5. Rendering / flip animation --------------------------------
function padded(str, len) {
  return (str || '').toUpperCase().slice(0, len).padEnd(len, ' ');
}

function updateBoard(rows) {
  currentRows = rows;
  const rowEls = flapBoard.querySelectorAll('.flap-row');
  let stagger = 0;

  rowEls.forEach((rowEl, r) => {
    const data = rows[r] || { code: '', city: '', country: '' };
    const hasData = !!data.city.trim();
    rowEl.dataset.hasData = hasData;
    rowEl.setAttribute('aria-selected', r === activeIndex ? 'true' : 'false');

    COLUMNS.forEach(col => {
      const group = rowEl.querySelector(`.flap-group--${col.key}`);
      const target = padded(data[col.key], col.length);
      const cells = group.querySelectorAll('.flap-cell');

      cells.forEach((cell, i) => {
        const nextChar = target[i];
        if (cell.dataset.char !== nextChar) {
          flipCell(cell, nextChar, stagger);
          stagger += 16; // creates the cascading "clack-clack-clack" feel
        }
      });
    });
  });
}

function flipCell(cell, nextChar, delay) {
  setTimeout(() => {
    playClack();
    cell.classList.remove('flipping');
    void cell.offsetWidth; // force reflow so the animation can restart
    cell.classList.add('flipping');

    // swap the character at the animation's midpoint, while the
    // flap is rotated edge-on and effectively invisible
    setTimeout(() => {
      cell.dataset.char = nextChar;
      const face = cell.querySelector('.flap-face');
      face.innerHTML = nextChar === ' ' ? '&nbsp;' : nextChar;
    }, 115);
  }, delay);
}

// ---- 6. Status line -------------------------------------------------
function updateStatus(query, rows) {
  const q = query.trim();
  const found = rows.filter(r => r.city.trim()).length;

  statusLine.classList.remove('confirmed', 'empty');

  if (!q) {
    statusLine.textContent = 'Showing popular destinations';
  } else if (found === 0) {
    statusLine.textContent = `No destinations match "${q}"`;
    statusLine.classList.add('empty');
  } else {
    statusLine.textContent = `${found} destination${found > 1 ? 's' : ''} found for "${q}"`;
  }
}

// ---- 7. Selection -------------------------------------------------
function selectRow(index) {
  const data = currentRows[index];
  if (!data) return;

  input.value = data.city;
  statusLine.textContent = `Destination set: ${data.city.toUpperCase()}, ${data.country.toUpperCase()}`;
  statusLine.classList.remove('empty');
  statusLine.classList.add('confirmed');

  setActiveIndex(-1);
  input.blur();
}

function setActiveIndex(index) {
  activeIndex = index;
  flapBoard.querySelectorAll('.flap-row').forEach((row, i) => {
    row.classList.toggle('active', i === index);
    row.setAttribute('aria-selected', i === index ? 'true' : 'false');
  });
}

// ---- 8. Debounce -------------------------------------------------
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const handleInput = debounce((value) => {
  const rows = getMatches(value);
  updateBoard(rows);
  updateStatus(value, rows);
}, 150);

// ---- 9. Web Audio: synthesized mechanical "clack" -------------------
let audioCtx;

function getAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

function playClack() {
  if (!audioCtx) return; // not initialised yet (no user gesture seen)
  const ctx = audioCtx;
  const now = ctx.currentTime;

  // short burst of filtered noise = the mechanical "clack"
  const bufferSize = Math.floor(ctx.sampleRate * 0.02);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1200 + Math.random() * 600;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.035);
}

// ---- 10. Live clock -------------------------------------------------
function tickClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hh}:${mm}:${ss}`;
}

// ---- 11. Event wiring -------------------------------------------------
input.addEventListener('keydown', () => getAudioCtx(), { once: true });

input.addEventListener('input', (e) => {
  input.setAttribute('aria-expanded', 'true');
  handleInput(e.target.value);
});

input.addEventListener('blur', () => {
  input.setAttribute('aria-expanded', 'false');
});

input.addEventListener('keydown', (e) => {
  const visibleCount = currentRows.filter(r => r.city.trim()).length;
  if (visibleCount === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setActiveIndex(Math.min(activeIndex + 1, visibleCount - 1));
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setActiveIndex(Math.max(activeIndex - 1, 0));
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (activeIndex >= 0) selectRow(activeIndex);
  } else if (e.key === 'Escape') {
    setActiveIndex(-1);
    input.blur();
  }
});

// ---- 12. Init -------------------------------------------------
buildBoard();
updateBoard(getMatches(''));
updateStatus('', getMatches(''));
tickClock();
setInterval(tickClock, 1000);
