# Departure Search — Split-Flap Autosuggest

A search bar styled as an airport split-flap (Solari) departure board. Type a city, country, or airport code and matching destinations flip into place on the board, character by character, with a synthesized mechanical clack.

## Features

- Real-time autosuggest search across 30 world destinations (by city, country, or airport code)
- Authentic split-flap flip animation per character — only the characters that actually change are flipped
- Mechanical "clack" sound synthesized live with the Web Audio API (no audio files used)
- Full keyboard navigation (Arrow Up / Arrow Down, Enter, Escape)
- Debounced input (150ms) for smooth typing performance
- Live clock in the board header
- Responsive layout; falls back to horizontal scroll on very small screens to preserve board alignment
- Respects `prefers-reduced-motion` and includes visible keyboard focus states

## Tech Stack

- HTML5
- CSS3 (Flexbox, keyframe animations, custom properties)
- Vanilla JavaScript (ES6+) — no frameworks, no libraries
- Web Audio API for procedural sound

## File Structure

```
departure-search/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run

Open `index.html` directly in any modern browser. No build step, no server, no dependencies to install.

## How to Use

1. Click the input field and type a city, country, or airport code.
2. Matching destinations flip into the board in real time.
3. Use Arrow Up / Arrow Down + Enter to select a destination via keyboard, or click a row directly.
