# 🎭 Mood Palette Generator

A single-file vanilla JS mini-app that generates a 5-color design palette based on a selected mood. Built as part of the **100 Code Blueprints** series.

## What it does

- Pick a mood from the dropdown: Cyberpunk, Cozy Autumn, Ocean Calm, Cherry Blossom, Midnight Forest, Desert Sunset.
- Hit **Generate Palette** (or just change the dropdown) — five "paint chip" cards flip over one after another to reveal that mood's hex codes.
- Click any card to copy its hex code straight to your clipboard. A small toast confirms the copy.

## Files

```
mood-palette/
├── index.html      # everything — HTML, CSS, JS — no build step, no dependencies
└── README.md
```

Just open `index.html` in any browser. That's it, no npm install, no server needed.

## How it's built (line-by-line logic, for your own notes)

1. **Data**: `PALETTES` is a plain object — each mood key maps to an array of 5 hex strings. `MOOD_LABELS` maps keys to display names.
2. **Cards**: `buildCards()` generates 5 flip-cards once on load. Each card has a `.face-front` (blank chip, shows "Swatch 01"...) and `.face-back` (the actual color + hex).
3. **CSS variables**: each card's color is applied via `backFace.style.setProperty('--swatch', hex)` — the CSS reads `background: var(--swatch, #333)`, so JS never touches raw CSS strings, just variables.
4. **Flip animation**: `.card-inner` has `transform-style: preserve-3d` and rotates 180° on the Y-axis when `.flipped` is added to the parent `.card`. Cards are staggered with `setTimeout(..., 60 + i*70)` so they flip in sequence, not all at once.
5. **Contrast handling**: `relativeLuminance(hex)` computes WCAG relative luminance so the hex text is always readable — dark text on light chips, light text on dark chips — via a `data-dark` attribute.
6. **Copy to clipboard**: `navigator.clipboard.writeText(hex)` with a `document.execCommand('copy')` fallback for older browsers. A toast (`#toast`) fades in/out to confirm.
7. **Accessibility**: `prefers-reduced-motion` disables the flip transition; focus-visible outlines on the select and button.

## Ideas to extend this blueprint

- Add a "lock" icon per card so re-generating keeps some chips fixed (like a real palette tool).
- Add an "export as CSS variables" button that copies all 5 as a `:root {}` block.
- Add more moods, or let users type a custom mood and pick colors via a simple keyword → hue map.
- Save favorite palettes to `localStorage`.

---
Built with plain HTML/CSS/JS — no frameworks, no build tools. Fonts: Fraunces, Space Grotesk, IBM Plex Mono (Google Fonts).
