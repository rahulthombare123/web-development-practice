/* ─────────────────────────────────────────────
   Study Timetable Creator — script.js
   Local-storage powered weekly scheduler
───────────────────────────────────────────── */

/* ══════════════════════════════════════════
   CONFIG
══════════════════════════════════════════ */
const DAYS  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const TIMES = [
  '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
  '6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'
];
const SLOT_DURATION = 1; // hours per row

const SUBJECT_COLORS = [
  '#7c6ef5','#5ec9f5','#43d98a','#f5a052','#f05b72',
  '#c96ef5','#52c4f5','#f5e552','#f58c52','#72f57c',
  '#f5528c','#5275f5','#a8f552'
];

const STORAGE_KEY = 'studyboard_data';

/* ══════════════════════════════════════════
   STATE
══════════════════════════════════════════ */
let timetableData = {};   // { "Mon-6:00 AM": { subject, color, note } }
let timetableName = '';
let editingCell   = null; // { day, time }
let selectedColor = SUBJECT_COLORS[0];
let subjectColorMap = {}; // subject name → colour

/* ══════════════════════════════════════════
   TEMPLATES
══════════════════════════════════════════ */
const TEMPLATES = [
  {
    name: 'School Student',
    desc: 'Morning sessions with breaks and evening revision.',
    tags: ['School','Balanced'],
    data: {
      name: 'School Student Plan',
      slots: [
        // Weekday morning sessions
        ...['Monday','Tuesday','Wednesday','Thursday','Friday'].flatMap(d => [
          [d,'8:00 AM',  'Mathematics',  '#7c6ef5', 'Focus on problems'],
          [d,'9:00 AM',  'Science',      '#43d98a', 'Theory + notes'],
          [d,'10:00 AM', 'English',      '#5ec9f5', 'Reading'],
          [d,'12:00 PM', 'History/GK',   '#f5a052', ''],
          [d,'5:00 PM',  'Revision',     '#c96ef5', 'Previous topics'],
          [d,'7:00 PM',  'Homework',     '#f5e552', ''],
        ]),
        // Weekend lighter load
        ['Saturday','9:00 AM',  'Mathematics',  '#7c6ef5', 'Practice test'],
        ['Saturday','11:00 AM', 'Science',      '#43d98a', 'Lab notes'],
        ['Sunday',  '10:00 AM', 'Revision',     '#c96ef5', 'Weekly review'],
        ['Sunday',  '5:00 PM',  'English',      '#5ec9f5', 'Essay writing'],
      ]
    }
  },
  {
    name: 'College / University',
    desc: 'Subject-heavy schedule with exam prep slots.',
    tags: ['College','Intensive'],
    data: {
      name: 'College Semester Plan',
      slots: [
        ...['Monday','Wednesday','Friday'].flatMap(d => [
          [d,'8:00 AM',  'Data Structures','#7c6ef5','Algo practice'],
          [d,'10:00 AM', 'OS / Networks',  '#5ec9f5',''],
          [d,'12:00 PM', 'DBMS',           '#43d98a','SQL exercises'],
          [d,'3:00 PM',  'Mathematics',    '#f5a052','Calculus'],
          [d,'7:00 PM',  'Project Work',   '#c96ef5',''],
        ]),
        ...['Tuesday','Thursday'].flatMap(d => [
          [d,'9:00 AM',  'Theory Subjects','#f5e552',''],
          [d,'11:00 AM', 'Lab Work',       '#52c4f5','Practicals'],
          [d,'4:00 PM',  'Revision',       '#f05b72',''],
          [d,'8:00 PM',  'Assignments',    '#72f57c','Submission prep'],
        ]),
        ['Saturday','9:00 AM',  'Mock Tests',   '#f05b72','Full paper'],
        ['Saturday','2:00 PM',  'Weak Topics',  '#7c6ef5','Self study'],
        ['Sunday',  '10:00 AM', 'Free Review',  '#5ec9f5','Past papers'],
      ]
    }
  },
  {
    name: 'Competitive Exam',
    desc: 'High-intensity UPSC / JEE / NEET style plan.',
    tags: ['Exam Prep','Intensive'],
    data: {
      name: 'Competitive Exam Plan',
      slots: [
        ...DAYS.flatMap(d => [
          [d,'6:00 AM', 'Current Affairs', '#5ec9f5','Newspaper + notes'],
          [d,'8:00 AM', 'Subject 1',       '#7c6ef5','Deep study'],
          [d,'10:00 AM','Subject 2',       '#43d98a','Concept building'],
          [d,'12:00 PM','Revision',        '#f5a052','Previous notes'],
          [d,'2:00 PM', 'Practice MCQs',   '#c96ef5','Timed sets'],
          [d,'4:00 PM', 'Subject 3',       '#f05b72',''],
          [d,'6:00 PM', 'Break / Walk',    '#72f57c','Refresh'],
          [d,'7:00 PM', 'Mock Test / PYQ', '#f5e552','Analysis after'],
          [d,'9:00 PM', 'Light Revision',  '#52c4f5','Flash cards'],
        ])
      ]
    }
  },
  {
    name: 'Working Professional',
    desc: 'Evening & weekend upskilling schedule.',
    tags: ['Upskilling','Flexible'],
    data: {
      name: 'Upskilling Plan',
      slots: [
        ...['Monday','Tuesday','Wednesday','Thursday','Friday'].flatMap(d => [
          [d,'7:00 AM','Morning Reading',  '#5ec9f5','10 pages/day'],
          [d,'7:00 PM','Online Course',    '#7c6ef5','1 module'],
          [d,'9:00 PM','Practice / Code',  '#43d98a','30 min hands-on'],
        ]),
        ['Saturday','9:00 AM',  'Deep Work',      '#f5a052','Project / course'],
        ['Saturday','12:00 PM', 'Practice',       '#c96ef5','Exercises'],
        ['Saturday','4:00 PM',  'Side Project',   '#f05b72','Build something'],
        ['Sunday',  '10:00 AM', 'Weekly Review',  '#7c6ef5','Progress check'],
        ['Sunday',  '12:00 PM', 'Reading',        '#5ec9f5','Books / articles'],
        ['Sunday',  '5:00 PM',  'Plan Next Week', '#72f57c',''],
      ]
    }
  },
  {
    name: 'Balanced Life',
    desc: 'Light study with hobbies and rest built in.',
    tags: ['Easy','Balanced'],
    data: {
      name: 'Balanced Life Plan',
      slots: [
        ...['Monday','Tuesday','Wednesday','Thursday','Friday'].flatMap(d => [
          [d,'9:00 AM', 'Study Block 1', '#7c6ef5','Core topic'],
          [d,'11:00 AM','Study Block 2', '#43d98a','Practice'],
          [d,'4:00 PM', 'Creative Time', '#f5a052','Hobby / art'],
          [d,'7:00 PM', 'Light Reading', '#5ec9f5',''],
        ]),
        ['Saturday','10:00 AM','Revision',     '#c96ef5','Week recap'],
        ['Saturday','2:00 PM', 'Hobby',        '#f5a052','Music / sport'],
        ['Sunday',  '11:00 AM','Free Reading', '#5ec9f5','Your choice'],
        ['Sunday',  '3:00 PM', 'Prep Ahead',   '#7c6ef5','Next week topics'],
      ]
    }
  },
];

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildTable();
  buildColorPicker();
  buildTemplateGrid();
  loadFromStorage();
  bindEvents();
});

/* ══════════════════════════════════════════
   BUILD TABLE
══════════════════════════════════════════ */
function buildTable() {
  const headerRow = document.getElementById('header-row');
  DAYS.forEach(day => {
    const th = document.createElement('th');
    th.textContent = day.slice(0,3).toUpperCase();
    headerRow.appendChild(th);
  });

  const tbody = document.getElementById('timetable-body');
  TIMES.forEach(time => {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.className = 'time-label';
    td.textContent = time;
    tr.appendChild(td);

    DAYS.forEach(day => {
      const cell = document.createElement('td');
      const key  = cellKey(day, time);
      cell.className = 'slot-cell';
      cell.dataset.day  = day;
      cell.dataset.time = time;
      cell.id = `cell-${key}`;
      cell.addEventListener('click', () => openCellModal(day, time));
      tr.appendChild(cell);
    });

    tbody.appendChild(tr);
  });
}

/* ══════════════════════════════════════════
   RENDER CELLS
══════════════════════════════════════════ */
function renderAll() {
  // Clear filled classes first
  document.querySelectorAll('.slot-cell').forEach(cell => {
    cell.classList.remove('filled');
    cell.innerHTML = '';
  });

  subjectColorMap = {};
  TIMES.forEach(time => {
    DAYS.forEach(day => {
      const key  = cellKey(day, time);
      const data = timetableData[key];
      if (!data) return;

      const cell = document.getElementById(`cell-${key}`);
      if (!cell) return;

      cell.classList.add('filled');
      cell.style.background = hexToRgba(data.color, 0.22);
      cell.style.borderLeft = `3px solid ${data.color}`;

      const div = document.createElement('div');
      div.className = 'cell-content';
      const subEl = document.createElement('div');
      subEl.className = 'cell-subject';
      subEl.textContent = data.subject;
      div.appendChild(subEl);

      if (data.note) {
        const noteEl = document.createElement('div');
        noteEl.className = 'cell-note-text';
        noteEl.textContent = data.note;
        div.appendChild(noteEl);
      }

      const editBtn = document.createElement('button');
      editBtn.className = 'cell-edit-btn';
      editBtn.textContent = '✎';
      editBtn.title = 'Edit slot';
      editBtn.addEventListener('click', e => {
        e.stopPropagation();
        openCellModal(day, time);
      });

      cell.appendChild(div);
      cell.appendChild(editBtn);

      // Track colour map
      subjectColorMap[data.subject] = data.color;
    });
  });

  updateLegend();
  updateStats();
}

/* ══════════════════════════════════════════
   LEGEND
══════════════════════════════════════════ */
function updateLegend() {
  const chips = document.getElementById('legend-chips');
  chips.innerHTML = '';
  Object.entries(subjectColorMap).forEach(([subj, color]) => {
    const chip = document.createElement('div');
    chip.className = 'legend-chip';
    chip.style.background = hexToRgba(color, 0.25);
    chip.style.border = `1px solid ${hexToRgba(color, 0.5)}`;
    chip.innerHTML = `<span class="legend-chip-dot" style="background:${color}"></span>${subj}`;
    chips.appendChild(chip);
  });
}

/* ══════════════════════════════════════════
   STATS
══════════════════════════════════════════ */
function updateStats() {
  const filled   = Object.keys(timetableData).length;
  const subjects = new Set(Object.values(timetableData).map(d => d.subject)).size;
  const hours    = filled * SLOT_DURATION;

  document.getElementById('stat-filled').innerHTML   = `Filled: <span>${filled}</span>`;
  document.getElementById('stat-hours').innerHTML    = `Hours/week: <span>${hours} h</span>`;
  document.getElementById('stat-subjects').innerHTML = `Subjects: <span>${subjects}</span>`;
}

/* ══════════════════════════════════════════
   CELL MODAL
══════════════════════════════════════════ */
function openCellModal(day, time) {
  editingCell = { day, time };
  const key  = cellKey(day, time);
  const data = timetableData[key] || {};

  document.getElementById('modal-meta').textContent = `${day} · ${time}`;
  document.getElementById('cell-subject').value = data.subject || '';
  document.getElementById('cell-note').value    = data.note    || '';

  selectedColor = data.color || SUBJECT_COLORS[0];
  updateColorSwatches();

  document.getElementById('cell-modal').classList.add('active');
  setTimeout(() => document.getElementById('cell-subject').focus(), 80);
}

function closeCellModal() {
  document.getElementById('cell-modal').classList.remove('active');
  editingCell = null;
}

function saveCellModal() {
  const subject = document.getElementById('cell-subject').value.trim();
  const note    = document.getElementById('cell-note').value.trim();
  if (!editingCell) return;
  const key = cellKey(editingCell.day, editingCell.time);

  if (subject) {
    // Reuse existing colour for same subject name
    const existingColor = subjectColorMap[subject];
    timetableData[key] = {
      subject,
      color: existingColor || selectedColor,
      note
    };
  } else {
    delete timetableData[key];
  }

  closeCellModal();
  renderAll();
}

function clearSlot() {
  if (!editingCell) return;
  delete timetableData[cellKey(editingCell.day, editingCell.time)];
  closeCellModal();
  renderAll();
}

/* ══════════════════════════════════════════
   COLOUR PICKER
══════════════════════════════════════════ */
function buildColorPicker() {
  const row = document.getElementById('color-picker-row');
  SUBJECT_COLORS.forEach(color => {
    const sw = document.createElement('button');
    sw.className = 'color-swatch';
    sw.style.background = color;
    sw.dataset.color = color;
    sw.title = color;
    sw.addEventListener('click', () => {
      selectedColor = color;
      updateColorSwatches();
    });
    row.appendChild(sw);
  });
}

function updateColorSwatches() {
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.classList.toggle('selected', sw.dataset.color === selectedColor);
  });
}

/* ══════════════════════════════════════════
   TEMPLATE MODAL
══════════════════════════════════════════ */
function buildTemplateGrid() {
  const grid = document.getElementById('template-grid');
  TEMPLATES.forEach((tmpl, idx) => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.innerHTML = `
      <h3>${tmpl.name}</h3>
      <p>${tmpl.desc}</p>
      <div class="template-tags">
        ${tmpl.tags.map(t => `<span class="template-tag">${t}</span>`).join('')}
      </div>`;
    card.addEventListener('click', () => applyTemplate(idx));
    grid.appendChild(card);
  });
}

function applyTemplate(idx) {
  const tmpl = TEMPLATES[idx];
  // Confirm if there is existing data
  if (Object.keys(timetableData).length > 0) {
    if (!confirm(`Load "${tmpl.name}"? This will replace your current timetable.`)) return;
  }
  timetableData = {};
  tmpl.data.slots.forEach(([day, time, subject, color, note]) => {
    timetableData[cellKey(day, time)] = { subject, color, note: note || '' };
  });
  timetableName = tmpl.data.name;
  document.getElementById('timetable-name').value = timetableName;
  closeTemplateModal();
  renderAll();
  autoSave();
  showToast(`✅ Template "${tmpl.name}" loaded!`);
}

function openTemplateModal() {
  document.getElementById('template-modal').classList.add('active');
}
function closeTemplateModal() {
  document.getElementById('template-modal').classList.remove('active');
}

/* ══════════════════════════════════════════
   LOCAL STORAGE
══════════════════════════════════════════ */
function saveToStorage() {
  timetableName = document.getElementById('timetable-name').value.trim();
  const payload = { name: timetableName, slots: timetableData, savedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  updateSaveStatus(payload.savedAt);
  showToast('💾 Timetable saved!');
}

function autoSave() {
  // Silent save without toast
  timetableName = document.getElementById('timetable-name').value.trim();
  const payload = { name: timetableName, slots: timetableData, savedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  updateSaveStatus(payload.savedAt);
}

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    updateSaveStatus(null);
    return;
  }
  try {
    const payload = JSON.parse(raw);
    timetableData = payload.slots || {};
    timetableName = payload.name  || '';
    document.getElementById('timetable-name').value = timetableName;
    updateSaveStatus(payload.savedAt);
    renderAll();
  } catch {
    updateSaveStatus(null);
  }
}

function updateSaveStatus(isoString) {
  const el = document.getElementById('save-status');
  if (!isoString) {
    el.textContent = 'Not saved yet';
    return;
  }
  const d = new Date(isoString);
  el.textContent = `Last saved: ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

function clearAll() {
  if (!confirm('Clear the entire timetable? This cannot be undone.')) return;
  timetableData = {};
  document.getElementById('timetable-name').value = '';
  localStorage.removeItem(STORAGE_KEY);
  updateSaveStatus(null);
  renderAll();
  showToast('🗑️ Timetable cleared.');
}

/* ══════════════════════════════════════════
   EVENTS
══════════════════════════════════════════ */
function bindEvents() {
  document.getElementById('btn-save').addEventListener('click', saveToStorage);
  document.getElementById('btn-clear').addEventListener('click', clearAll);
  document.getElementById('btn-template').addEventListener('click', openTemplateModal);

  document.getElementById('modal-save').addEventListener('click', saveCellModal);
  document.getElementById('modal-cancel').addEventListener('click', closeCellModal);
  document.getElementById('modal-clear-slot').addEventListener('click', clearSlot);

  document.getElementById('tmpl-cancel').addEventListener('click', closeTemplateModal);

  // Close modal on overlay click
  document.getElementById('cell-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeCellModal();
  });
  document.getElementById('template-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeTemplateModal();
  });

  // Enter key in modal inputs
  ['cell-subject','cell-note'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') saveCellModal();
    });
  });

  // Auto-colour: when typing a subject that already has a colour, reflect it
  document.getElementById('cell-subject').addEventListener('input', e => {
    const val = e.target.value.trim();
    if (subjectColorMap[val]) {
      selectedColor = subjectColorMap[val];
      updateColorSwatches();
    }
  });

  // Keyboard escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCellModal(); closeTemplateModal(); }
  });
}

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

/* ══════════════════════════════════════════
   UTILS
══════════════════════════════════════════ */
function cellKey(day, time) {
  return `${day}-${time}`.replace(/\s/g, '_');
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}
