# FitRasoi 🍲💪
**High-protein Indian recipes for hostel & PG students, built with plain HTML, CSS and JavaScript.**

A 3-page static website: a hero-led homepage, a filterable recipe collection (9 recipes), and an about/contact page. No frameworks, no build step — open `index.html` and it runs.

---

## Tech stack

| Layer | Choice |
|---|---|
| Structure | Semantic HTML5 |
| Styling | Hand-written CSS3 with custom properties (design tokens), CSS Grid + Flexbox, no framework |
| Behaviour | Vanilla JavaScript (ES6, no libraries) |
| Fonts | Anton (display), Open Sans (body), Space Mono (data/labels) — via Google Fonts |
| SEO | Meta tags, Open Graph tags, `schema.org/Recipe` + `WebSite` JSON-LD, `sitemap.xml`, `robots.txt` |

## Folder structure

```
fitrasoi/
├── index.html          Homepage — hero, why-protein section, 3 featured recipes, protein calculator
├── recipes.html         All 9 recipes with category filter + live search, Recipe schema markup
├── about.html            Project story, hostel-cooking "rules", contact form (static demo)
├── css/style.css         Full design system — color tokens, typography, components
├── js/main.js            Nav toggle, recipe accordions, filter/search, calculator, form handling
├── images/favicon.svg
├── robots.txt
├── sitemap.xml
└── README.md
```

## Design decisions

- **No stock photography.** Food photo sites are the AI-generic default and carry real copyright risk (most "free" stock photos aren't as free as they look). Instead, the whole visual identity is built from hand-coded SVG — most visibly the **interactive steel thali** in the hero, where each katori (bowl) represents a protein source. It's the signature element and it directly explains the site's premise: build your daily protein "plate" from small, realistic additions.
- **Color palette** is a spice-tin palette, not the generic "wellness green": deep masala-tin green (`#123328`) as the dominant background, turmeric-paper cream (`#FBF2DD`) for content surfaces, marigold (`#F4A324`) and chili-vermillion (`#D6401F`) as accents. Category tags (breakfast/snack/meal/drink) each get their own accent so the recipe grid is scannable at a glance.
- **Typography**: Anton (bold, condensed, poster-like) for headlines gives the truck-art / spice-label energy the subject calls for; Open Sans carries all body copy for readability; Space Mono is used only for data — protein grams, prices, timers — so numbers read like they're stamped on a label.
- **Recipe cards double as a small design system component**: scalloped header edge (spice-packet die-cut), a protein "stamp" chip, and an accordion body — so the full ingredient/steps list only loads visually on demand but is still present in the HTML (see SEO note below).

## SEO features

- Every recipe's full text (ingredients + steps) is real HTML in the DOM from page load — the accordion only hides it with CSS `max-height`, so it's crawlable, unlike content that's fetched via JS after the fact.
- `schema.org/Recipe` structured data (JSON-LD) for all 9 recipes on `recipes.html`, so Google can show rich recipe results (time, ingredients, protein content).
- Descriptive, keyword-relevant `<title>` and meta description per page, Open Graph tags, canonical URLs.
- Semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`) and a heading hierarchy that goes h1 → h2 → h3 in order.

## Before deploying for real

- Replace `https://fitrasoi.example.com` in the meta tags, canonical links, JSON-LD and `sitemap.xml` with your real domain.
- The contact form on `about.html` is a static front-end demo — wire it to Formspree, EmailJS, or your own backend endpoint.
- Swap in a real `images/og-cover.png` (1200×630) for social share previews.

---

## Interview talking points

**"Walk me through this project."**
It's a 3-page recipe site solving a specific problem — hostel students training at the gym but eating protein-light mess food. I scoped 9 recipes against a hard constraint list (under 20 min, no oven, under ₹35, common ingredients), then designed and built the front end from scratch with no frameworks.

**"Why no framework — no React?"**
The content is fundamentally static and SEO matters a lot here (recipes need to be crawlable and indexable). Vanilla JS keeps the whole thing dependency-free, fast to load, and easy for anyone to open and read — and it shows I understand the DOM directly rather than only through a framework's abstractions.

**"How did you approach the CSS?"**
Token-first: every color, font and radius is a CSS custom property defined once in `:root`, so the whole palette can be re-themed by editing a handful of variables. Components (cards, pills, buttons) are built from those tokens rather than one-off hex values, which is the same mental model as a design system in a larger codebase.

**"How is this accessible?"**
Semantic elements throughout, visible `:focus-visible` states, `aria-expanded`/`aria-controls` on the recipe accordions and mobile nav toggle, `aria-pressed` on filter pills, alt/title text on SVG icons, and a skip-to-content link. `prefers-reduced-motion` is respected globally.

**"How would you scale this if it had 100 recipes instead of 9?"**
I'd move recipe data into a JSON file and render cards + schema markup with JS (or a static site generator, like I did on an earlier project) instead of hand-writing each `<article>` — right now it's hand-authored because 9 recipes is manageable and keeps everything crawlable without a build step.

**"What would you improve with more time?"**
Real image assets (photographed dishes) with proper `srcset`/lazy loading once I have a shoot; a working backend for the contact form; and a `prefers-color-scheme` dark/light toggle since the palette is currently fixed.

---
Built by Rahul Thombare · [github.com/rahulthombare123](https://github.com/rahulthombare123)
