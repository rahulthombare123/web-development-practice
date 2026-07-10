// FitRasoi — vanilla JS, no dependencies

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Recipe accordion toggles ---------- */
  document.querySelectorAll('.recipe-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.classList.toggle('open', !expanded);
      var label = btn.querySelector('span');
      if (label) label.textContent = !expanded ? 'Hide recipe' : 'View recipe';
    });
  });

  /* ---------- Category filter + search (recipes.html) ---------- */
  var grid = document.getElementById('recipeGrid');
  var filterButtons = document.querySelectorAll('#categoryFilters .pill');
  var searchInput = document.getElementById('recipeSearch');
  var noResults = document.getElementById('noResults');
  var activeCategory = 'all';

  function applyFilters() {
    if (!grid) return;
    var query = (searchInput && searchInput.value ? searchInput.value : '').trim().toLowerCase();
    var visibleCount = 0;
    grid.querySelectorAll('.recipe-card').forEach(function (card) {
      var cat = card.getAttribute('data-category');
      var name = card.getAttribute('data-name') || '';
      var matchesCategory = activeCategory === 'all' || cat === activeCategory;
      var matchesSearch = query === '' || name.indexOf(query) !== -1;
      var show = matchesCategory && matchesSearch;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    if (noResults) noResults.classList.toggle('show', visibleCount === 0);
  }

  if (filterButtons.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        activeCategory = btn.getAttribute('data-filter');
        applyFilters();
      });
    });
  }
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  /* ---------- Protein calculator (index.html) ---------- */
  var weightInput = document.getElementById('weight');
  var activitySelect = document.getElementById('activity');
  var calcOutput = document.getElementById('calcOutput');
  var calcMeals = document.getElementById('calcMeals');

  function runCalc() {
    if (!weightInput || !activitySelect || !calcOutput) return;
    var weight = parseFloat(weightInput.value);
    var multiplier = parseFloat(activitySelect.value);
    if (isNaN(weight) || weight <= 0) { calcOutput.textContent = '—'; return; }
    var grams = Math.round(weight * multiplier);
    calcOutput.textContent = grams + 'g';
    var meals = Math.max(2, Math.round(grams / 18));
    if (calcMeals) calcMeals.textContent = '≈ ' + meals + ' recipes from this site, spread across the day';
  }
  if (weightInput) weightInput.addEventListener('input', runCalc);
  if (activitySelect) activitySelect.addEventListener('change', runCalc);
  runCalc();

  /* ---------- Contact form (about.html) — static demo ---------- */
  var contactForm = document.getElementById('contactForm');
  var formNote = document.getElementById('formNote');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (formNote) formNote.style.display = 'block';
      contactForm.reset();
    });
  }

});
