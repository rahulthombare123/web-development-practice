# 🔴 The Panic Button

> A button that does NOT want to be clicked. Try your luck.

A tiny, funny, vanilla JS mini-project where a button actively **dodges your cursor** the closer you get to it — and gets visibly more panicked (shaking, glowing red, flashing) with every failed attempt. Catch it, and confetti explodes across the screen.

No frameworks. No libraries. Just HTML, CSS, and JavaScript doing something silly.

---

## 🎮 Live Demo

Open `index.html` in any browser — that's it, no build step required.

*(If hosted on GitHub Pages, drop your live link here)*

---

## ✨ What it does

- Move your mouse near the button → it teleports/flees to a new spot inside the arena
- Every dodge escalates a **"panic level"**: `CALM → ALERT → NERVOUS → FREAKING OUT → MAXIMUM PANIC`
- The button visually reacts — border glow, jitter animation, color shift, screen-flash at max panic
- On-screen taunts change dynamically based on how many times you've failed
- Actually manage to click it? → confetti burst + a little "you did it" card
- Works on both desktop (mouse) and mobile (touch)

---

## 🗂️ Project Structure

```
panic-button/
├── index.html      → Page structure & markup
├── style.css        → All styling, animations, panic-level visual states
├── script.js         → Dodge logic, panic escalation, confetti engine
└── README.md         → You're reading it
```

---

## 🛠️ Built With

- **HTML5** — semantic structure
- **CSS3** — custom properties, keyframe animations, `clamp()` for fluid sizing
- **Vanilla JavaScript** — no dependencies, no frameworks, no build tools
- **Canvas API** — for the confetti effect (hand-written, not a library)

Fonts used: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (display) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (data/labels), loaded via Google Fonts.

---

## 🚀 Run Locally

```bash
git clone https://github.com/your-username/panic-button.git
cd panic-button
```

Then just open `index.html` in your browser. No `npm install`, no server needed.

*(Optional: use VS Code's Live Server extension for auto-reload while editing.)*

---

## 💡 How It Works (quick technical note)

- On every `mousemove` inside the arena, the script calculates the distance between the cursor and the button's center.
- If that distance drops below a "danger radius," the button picks a point roughly *opposite* the cursor's direction (with some randomness) and moves there — clamped so it never leaves the arena bounds.
- Each dodge increments a counter that drives both the **panic level class** (CSS handles the visual escalation) and the **taunt text**.
- Confetti is a lightweight custom particle system on `<canvas>` — no external library — using basic physics (gravity + velocity + fade-out).

---

## 🎨 Customize It

Want to make it your own? Easy tweaks:

| What | Where |
|---|---|
| Change colors | CSS custom properties at the top of `style.css` (`:root`) |
| Change taunts | `TAUNTS` array in `script.js` |
| Change button labels | `CLICK_LABELS` array in `script.js` |
| Make it harder/easier | `dangerRadius` value in `script.js` |
| Change confetti colors | `CONFETTI_COLORS` array in `script.js` |

---

## 📄 License

Free to use, remix, and learn from. Built as a fun mini-project — no restrictions.

---

## 🙋 Why I Built This

Wanted a small, self-contained project that's instantly understandable in a screenshot or 5-second GIF — no explanation needed, just "oh, that's funny, let me try it." Good for portfolios because it shows DOM manipulation, event handling, CSS animation states, and canvas work — all without a single dependency.

---

⭐ If you liked this, a star on the repo is appreciated!
