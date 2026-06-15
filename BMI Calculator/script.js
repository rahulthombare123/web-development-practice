/* =====================================================
   BMI CALCULATOR — SCRIPT
   100% client-side. Inputs are read from the form,
   all calculations happen in this file, and results
   are written back to the page. Nothing is ever sent
   to a server. BMI history is saved only in this
   browser's localStorage.
   ===================================================== */

/* ---------------------------------------------------
   1. ELEMENT REFERENCES
   --------------------------------------------------- */
const form = document.getElementById('bmi-form');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const ageInput = document.getElementById('age');
const sexSelect = document.getElementById('sex');
const activitySelect = document.getElementById('activity');
const errorMsg = document.getElementById('error-msg');

const resultSection = document.getElementById('result');
const bmiNumberEl = document.getElementById('bmi-number');
const bmiCategoryEl = document.getElementById('bmi-category');
const scaleMarker = document.getElementById('scale-marker');

const idealWeightEl = document.getElementById('ideal-weight');
const calorieNeedsEl = document.getElementById('calorie-needs');
const healthTipEl = document.getElementById('health-tip');

const historyEmpty = document.getElementById('history-empty');
const historyTable = document.getElementById('history-table');
const historyBody = document.getElementById('history-body');
const clearHistoryBtn = document.getElementById('clear-history');

/* ---------------------------------------------------
   2. BMI SCALE RANGE (for positioning the marker)
   Must match the segment widths defined in style.css
   (Underweight 15-18.5, Normal 18.5-25, Overweight
   25-30, Obese 30-35).
   --------------------------------------------------- */
const SCALE_MIN = 15; // BMI value at the left edge of the bar
const SCALE_MAX = 35; // BMI value at the right edge of the bar

/* ---------------------------------------------------
   3. CATEGORY CONFIG
   Each entry defines: a label, the badge color class,
   the BMI range test, and a short health tip shown in
   the "Health Tip" insight card.
   --------------------------------------------------- */
const CATEGORIES = [
  {
    key: 'under',
    label: 'Underweight',
    badgeClass: 'badge--under',
    test: (bmi) => bmi < 18.5,
    tip: 'You may benefit from adding more nutrient-dense foods like nuts, dairy, whole grains, and healthy oils. Strength training can help build muscle alongside weight gain. A doctor or dietitian can help you build a safe plan.'
  },
  {
    key: 'normal',
    label: 'Normal',
    badgeClass: 'badge--normal',
    test: (bmi) => bmi >= 18.5 && bmi < 25,
    tip: 'Great work — your BMI is in the typical healthy range. Keep up a balanced diet rich in vegetables, lean protein, and whole grains, and aim for at least 150 minutes of moderate exercise each week.'
  },
  {
    key: 'over',
    label: 'Overweight',
    badgeClass: 'badge--over',
    test: (bmi) => bmi >= 25 && bmi < 30,
    tip: 'Small, sustainable changes can make a real difference over time — try cutting back on sugary drinks, adding more vegetables to meals, and taking a 30-minute walk most days.'
  },
  {
    key: 'obese',
    label: 'Obese',
    badgeClass: 'badge--obese',
    test: (bmi) => bmi >= 30,
    tip: 'Your BMI is in a range that can increase long-term health risks. It is worth speaking with a healthcare provider about a personalized plan, and starting with small steps like daily walks and reducing processed foods.'
  }
];

/* ---------------------------------------------------
   4. HELPER FUNCTIONS — VALIDATION & CATEGORY
   --------------------------------------------------- */

// Show a validation error and hide any previous result
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add('visible');
  resultSection.classList.add('hidden');
}

// Clear any visible error message
function clearError() {
  errorMsg.textContent = '';
  errorMsg.classList.remove('visible');
}

// Return the matching category object for a given BMI value
function getCategory(bmi) {
  return CATEGORIES.find((category) => category.test(bmi));
}

// Move the triangle marker along the BMI scale bar
function updateScaleMarker(bmi) {
  const clamped = Math.min(Math.max(bmi, SCALE_MIN), SCALE_MAX);
  const percent = ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
  scaleMarker.style.left = `${percent}%`;
}

/* ---------------------------------------------------
   5. HELPER FUNCTIONS — IDEAL WEIGHT & CALORIES
   --------------------------------------------------- */

// Ideal weight range = weight that gives a BMI of 18.5 to 24.9
// at this height (weight = BMI x height(m)^2)
function getIdealWeightRange(heightM) {
  const min = 18.5 * heightM * heightM;
  const max = 24.9 * heightM * heightM;
  return { min, max };
}

// BMR via the Mifflin-St Jeor equation, then TDEE = BMR x activity factor
function getCalorieNeeds(weightKg, heightCm, age, sex, activityFactor) {
  let bmr;
  if (sex === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  return bmr * activityFactor;
}

/* ---------------------------------------------------
   6. HISTORY (localStorage)
   --------------------------------------------------- */
const HISTORY_KEY = 'bmiHistory';
const HISTORY_LIMIT = 10;

// Load saved history (array of { date, bmi, category }) from localStorage
function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

// Save history array back to localStorage
function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    // localStorage may be unavailable (e.g. private browsing) — fail silently
  }
}

// Add a new entry to history, keeping only the most recent HISTORY_LIMIT
function addHistoryEntry(bmiRounded, categoryLabel) {
  const history = loadHistory();
  history.unshift({
    date: new Date().toLocaleDateString(),
    bmi: bmiRounded,
    category: categoryLabel
  });
  const trimmed = history.slice(0, HISTORY_LIMIT);
  saveHistory(trimmed);
  renderHistory();
}

// Render the history table (or the "empty" message if there's nothing yet)
function renderHistory() {
  const history = loadHistory();

  if (history.length === 0) {
    historyEmpty.classList.remove('hidden');
    historyTable.classList.add('hidden');
    historyBody.innerHTML = '';
    return;
  }

  historyEmpty.classList.add('hidden');
  historyTable.classList.remove('hidden');

  historyBody.innerHTML = '';
  history.forEach((entry) => {
    const row = document.createElement('tr');

    const dateCell = document.createElement('td');
    dateCell.textContent = entry.date;

    const bmiCell = document.createElement('td');
    bmiCell.textContent = entry.bmi;

    const categoryCell = document.createElement('td');
    categoryCell.textContent = entry.category;

    row.append(dateCell, bmiCell, categoryCell);
    historyBody.appendChild(row);
  });
}

// Clear all saved history
clearHistoryBtn.addEventListener('click', () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

// Render any existing history as soon as the page loads
renderHistory();

/* ---------------------------------------------------
   7. MAIN CALCULATION (runs on form submit)
   --------------------------------------------------- */
form.addEventListener('submit', (event) => {
  event.preventDefault(); // never reload the page / hit a server
  clearError();

  const heightCm = parseFloat(heightInput.value);
  const weightKg = parseFloat(weightInput.value);
  const age = parseInt(ageInput.value, 10);
  const sex = sexSelect.value;
  const activityFactor = parseFloat(activitySelect.value);

  // --- Validation ---
  if (Number.isNaN(heightCm) || Number.isNaN(weightKg) || Number.isNaN(age)) {
    showError('Please enter valid numbers for height, weight, and age.');
    return;
  }
  if (heightCm <= 0 || weightKg <= 0 || age <= 0) {
    showError('Height, weight, and age must be greater than zero.');
    return;
  }
  if (heightCm < 50 || heightCm > 272) {
    showError('Please enter a realistic height between 50 and 272 cm.');
    return;
  }
  if (weightKg < 10 || weightKg > 500) {
    showError('Please enter a realistic weight between 10 and 500 kg.');
    return;
  }
  if (age < 2 || age > 120) {
    showError('Please enter a realistic age between 2 and 120 years.');
    return;
  }

  // --- BMI formula: weight (kg) / height (m)^2 ---
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const bmiRounded = bmi.toFixed(1);

  // --- Determine category ---
  const category = getCategory(bmi);

  // --- Update the BMI number ---
  bmiNumberEl.textContent = bmiRounded;

  // --- Update the category badge (reset classes first) ---
  bmiCategoryEl.textContent = category.label;
  bmiCategoryEl.className = 'badge';
  bmiCategoryEl.classList.add(category.badgeClass);

  // --- Move the marker on the BMI scale bar ---
  updateScaleMarker(bmi);

  // --- Ideal weight range ---
  const { min, max } = getIdealWeightRange(heightM);
  idealWeightEl.textContent = `${min.toFixed(1)} – ${max.toFixed(1)} kg`;

  // --- Daily calorie needs (TDEE) ---
  const tdee = getCalorieNeeds(weightKg, heightCm, age, sex, activityFactor);
  calorieNeedsEl.textContent = `${Math.round(tdee)} kcal/day`;

  // --- Health tip ---
  healthTipEl.textContent = category.tip;

  // --- Save this result to history ---
  addHistoryEntry(bmiRounded, category.label);

  // --- Reveal the result section ---
  resultSection.classList.remove('hidden');

  // --- Scroll result into view on small screens ---
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

/* =====================================================
   8. MODAL LOGIC (Privacy Policy & Terms & Conditions)
   ===================================================== */
const modals = {
  privacy: document.getElementById('privacy-modal'),
  terms: document.getElementById('terms-modal')
};

function openModal(modal) {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

// Open buttons in the footer
document.getElementById('open-privacy').addEventListener('click', () => openModal(modals.privacy));
document.getElementById('open-terms').addEventListener('click', () => openModal(modals.terms));

// "x" close buttons inside each modal
document.querySelectorAll('[data-close-modal]').forEach((btn) => {
  btn.addEventListener('click', (event) => {
    const overlay = event.target.closest('.modal-overlay');
    closeModal(overlay);
  });
});

// Click outside the modal box (on the dark overlay) to close
Object.values(modals).forEach((overlay) => {
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeModal(overlay);
    }
  });
});

// Press "Escape" to close any open modal
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    Object.values(modals).forEach((overlay) => {
      if (overlay.classList.contains('is-open')) closeModal(overlay);
    });
  }
});
