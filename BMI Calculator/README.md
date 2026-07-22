# BMI Calculator

A free, privacy-first BMI calculator with ideal weight range, daily
calorie (BMR/TDEE) estimate, personalized health tips, and local BMI
history tracker — built with plain HTML, CSS, and JavaScript.

## Features

- BMI calculation with category (Underweight / Normal / Overweight / Obese)
- Visual BMI spectrum bar with a moving marker
- Ideal weight range for the entered height
- Daily calorie needs (BMR via Mifflin-St Jeor + activity level)
- Personalized health tip per category
- BMI history saved in the browser (localStorage) with a "Clear history" option
- Glassmorphism UI with an original, non-copyright SVG pattern background
- SEO-ready: meta description, Open Graph tags, FAQ structured data, written content
- Ad placeholders ready for Google AdSense
- Privacy Policy & Terms modals (zero-data-collection statement + medical disclaimer)

## File structure

```
index.html        Page structure, content, SEO tags
style.css         Styling (glassmorphism, layout, responsive rules)
script.js         All calculations + history + modal logic
images/
  pattern-bg.svg  Original hand-drawn background pattern (no copyright)
README.md         This file
```

## Running locally

No build tools needed. Just open `index.html` in any modern browser, or
serve the folder with a simple local server (recommended so the SVG
background loads correctly from `file://` in some browsers):

```bash
# Python 3
python3 -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

## Customizing

- **Colors / fonts** — edit the `:root` variables and Google Fonts link at
  the top of `style.css` / `index.html`.
- **Background pattern** — edit or replace `images/pattern-bg.svg`. It's a
  simple tiled SVG, so any vector editor (or hand-editing the paths) works.
- **Activity levels / calorie formula** — edit the `<select id="activity">`
  options in `index.html` and `getCalorieNeeds()` in `script.js`.
- **Health tips** — edit the `tip` text inside the `CATEGORIES` array in
  `script.js`.
- **History limit** — change `HISTORY_LIMIT` in `script.js` (default: 10).

## Adding your own photos

The current background is a hand-drawn SVG (free to use, no attribution
needed). If you'd like real photos (healthy food, gym, running, yoga, etc.),
these sites offer genuinely copyright-free images for commercial use,
no attribution required:

- https://unsplash.com — search "healthy lifestyle", "fitness", "balanced diet"
- https://www.pexels.com — search "wellness", "gym", "BMI", "nutrition"
- https://pixabay.com — search "health", "exercise", "weight scale"

To use one:
1. Download the image and save it in the `images/` folder (e.g. `images/hero.jpg`).
2. Reference it in `style.css`, e.g.:
   ```css
   body {
     background-image:
       linear-gradient(rgba(55,48,163,0.75), rgba(236,72,153,0.75)),
       url("images/hero.jpg");
     background-size: cover;
     background-position: center;
   }
   ```
   The gradient overlay keeps text readable on top of the photo

## Privacy & disclaimer

All calculations and history run entirely in the visitor's browser —
nothing is sent to a server. This is reflected in the Privacy Policy modal.
The Terms & Conditions modal includes a medical disclaimer stating the tool
is for informational purposes only and is not a substitute for professional
medical advice.

## License

This code is free to use, modify, and distribute for personal or
commercial projects.
