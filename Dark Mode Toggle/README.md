# Day & Night Effect - Hero Section

A simple full-screen hero section with a day/night theme toggle.
Built with plain HTML, CSS and JavaScript - no frameworks, no build tools, no external fonts.

## Files

- `index.html` - page structure and content
- `style.css` - styling for both themes (uses CSS variables)
- `script.js` - handles the day/night toggle and remembers the choice

## How it works

- The round button in the top-right corner (sun/moon icon) switches the theme.
- The chosen theme is saved in the browser's `localStorage`, so it stays the
  same the next time the page is opened.
- If no theme has been chosen yet, the page checks the device's system
  setting (light or dark mode) and matches it automatically.

## Fonts

Uses the system font stack (`-apple-system, Segoe UI, Roboto, Helvetica, Arial`)
instead of an external font like Google Fonts. This keeps the page light and
fast, since the browser does not need to download any extra font files.

## How to run

1. Unzip the folder.
2. Open `index.html` in any web browser.

No installation or server needed.

## How to customize

- Change the heading and text inside the `.hero-content` block in `index.html`.
- Change colors by editing the CSS variables at the top of `style.css`
  (`:root` for day theme, `html[data-theme="night"]` for night theme).
