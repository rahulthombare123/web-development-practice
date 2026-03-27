// =============================
//   PHOTO GALLERY - script.js
// =============================

// --- Select Elements ---
const filterBtns   = document.querySelectorAll('.filter-btn');
const cards        = document.querySelectorAll('.card');
const searchInput  = document.getElementById('searchInput');
const noResults    = document.getElementById('noResults');
const galleryGrid  = document.getElementById('galleryGrid');

// Lightbox elements
const lightbox      = document.getElementById('lightbox');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCat   = document.getElementById('lightboxCat');
const closeBtn      = document.getElementById('closeBtn');
const viewBtns      = document.querySelectorAll('.view-btn');

// --- Current Filter State ----
let activeFilter = 'all';
let searchQuery  = '';

// =============================
//   FILTER FUNCTION
// =============================
function filterCards() {
  let visibleCount = 0;

  cards.forEach(card => {
    const category = card.getAttribute('data-category');    // e.g. "nature"
    const title    = card.querySelector('.card-title').textContent.toLowerCase();

    // Check filter match
    const matchFilter = (activeFilter === 'all') || (category === activeFilter);

    // Check search match
    const matchSearch = title.includes(searchQuery.toLowerCase());

    if (matchFilter && matchSearch) {
      // Show card
      card.style.display = 'block';
      visibleCount++;
    } else {
      // Hide card
      card.style.display = 'none';
    }
  });

  // Show / hide "No results" message
  if (visibleCount === 0) {
    noResults.classList.add('show');
  } else {
    noResults.classList.remove('show');
  }
}

// =============================
//   FILTER BUTTONS CLICK-
// =============================
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));

    // Add active class to clicked button
    btn.classList.add('active');

    // Update active filter
    activeFilter = btn.getAttribute('data-filter');

    // Run filter
    filterCards();
  });
});

// =============================
//   SEARCH INPUT
// =============================
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  filterCards();
});

// =============================
//   LIGHTBOX - OPEN
// =============================
viewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const imgSrc = btn.getAttribute('data-img');
    const title  = btn.getAttribute('data-title');
    const cat    = btn.getAttribute('data-cat');

    // Set lightbox content
    lightboxImg.src          = imgSrc;
    lightboxImg.alt          = title;
    lightboxTitle.textContent = title;
    lightboxCat.textContent   = cat;

    // Open lightbox
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  });
});

// =============================
//   LIGHTBOX - CLOSE
// =============================
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';  // Restore scroll
  lightboxImg.src = '';               // Clear image
}

// Close button click
closeBtn.addEventListener('click', closeLightbox);

// Click on overlay to close
lightboxOverlay.addEventListener('click', closeLightbox);

// Press Escape key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

// =============================
//   INITIAL LOAD
// =============================
filterCards();  // Run once on page load
