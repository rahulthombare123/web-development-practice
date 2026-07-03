# Mood Ink

A page that stains itself with your typing speed. Type slow, and it stays a
pale, still paper tone. Type fast, and ink floods in — deep indigo, then
wine, then near-black — while soft blots pulse and drift behind the words,
and a thin tide bar along the bottom edge fills up with your pace.

No frameworks, no build step. Vanilla HTML, CSS and JavaScript only.

**Live concept:** typing rhythm → background color, ink-accent color, text
contrast, blot scale/opacity, and a bottom "tide" bar — all driven by one
rolling window of keystroke timestamps.

---

## How it works

- Every `input` event on the textarea timestamps itself into a rolling
  window of the last 8 keystrokes.
- The average interval between those keystrokes gives an instantaneous
  words-per-minute reading (`charsPerSecond * 60 / 5`).
- That raw reading is the **target** speed. A `requestAnimationFrame` loop
  eases the **displayed** speed toward the target every frame, so the page
  glides between moods instead of snapping.
- If there's been no input for ~550ms, the target speed decays on its own,
  so the ink settles back toward stillness when you stop typing.
- The eased speed (0–1) is used to interpolate across five named color
  stops — `still → settling → flowing → surging → blotting` — for the
  background, the ink accent (used by the blots and tide bar), and the
  text color, so contrast always stays readable even as the background
  goes from pale paper to near-black.

## File structure

```
mood-ink/
├── index.html     structure: HUD, typing canvas, blot layer, tide bar
├── style.css       paper grain, ink blots, type + layout
├── script.js       keystroke timing, color ramp, animation loop
└── README.md       this file
```

## Running it

No build step needed — open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Customizing

- **Color stops** — edit the `STOPS` array at the top of `script.js`. Each
  stop has a `bg`, an `ink` accent, and a `text` color; add more stops for
  a longer gradient, or swap the palette entirely.
- **Sensitivity** — change the `130` cap or the `/ 120` divisor in
  `script.js` to make the page react to a faster or slower typist.
- **Blot count** — add or remove `<span class="blot">` elements in
  `index.html`; each one reads its position from the `--i` custom property.

## Reset

Press `Esc` while typing to clear the text and let the page settle back to
still.

---

Fonts: [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif)
and [Space Mono](https://fonts.google.com/specimen/Space+Mono), both via
Google Fonts.


© 2026 RT Dev. All rights reserved.
