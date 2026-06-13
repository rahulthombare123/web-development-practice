# 🔐 PassMetrics — Password Strength Metrics Tracker

A sleek, fully client-side password strength analyzer with real-time metrics, entropy calculation, crack-time estimation, and session history — no backend required.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Live Strength Bar** | Animated progress bar that reacts in real-time as you type |
| **Score Ring (0–100)** | Animated circular gauge showing overall password strength |
| **6 Metric Cards** | Length, Uppercase, Lowercase, Digits, Symbols, and Entropy |
| **Requirements Checklist** | 8 rule-based checks that pass/fail as you type |
| **Crack Time Estimator** | Estimates time to crack via Online, Slow Hash, and Fast Hash attacks |
| **Personalized Tips** | Adaptive improvement suggestions based on what's missing |
| **Session History** | Tracks last 10 passwords analyzed (masked for privacy) |
| **Generate Strong Password** | One-click strong password generator |
| **Show/Hide Toggle** | Toggle password visibility at any time |
| **Responsive Design** | Works on desktop, tablet, and mobile |

---

## 🚀 Getting Started

### Option 1 — Open directly in browser

No setup required. Just open `index.html` in any modern browser:

```
double-click index.html
```

### Option 2 — Use a local development server

Using VS Code + Live Server extension:

1. Open the project folder in VS Code
2. Right-click `index.html`
3. Select **"Open with Live Server"**

Using Node.js:

```bash
npx serve .
```

---

## 📁 Project Structure

```
password-strength-tracker/
│
├── index.html      # Main HTML structure & layout
├── style.css       # Dark space theme styles with CSS custom properties
├── script.js       # All JavaScript logic — metrics, scoring, rendering
└── README.md       # This file
```

---

## 🧠 How the Score Is Calculated

The score (0–100) is computed from:

| Factor | Max Points |
|---|---|
| Password length (×2.5 per char, up to 16) | 35 pts |
| Uppercase letters present (1 = +8, 2+ = +10) | 10 pts |
| Lowercase letters present (1 = +8, 2+ = +10) | 10 pts |
| Digits present (1 = +8, 2+ = +10) | 10 pts |
| Special characters (1 = +8, 2+ = +12) | 12 pts |
| Shannon entropy bonus | 20 pts |
| **Penalties** | |
| Repeated characters (e.g., `aaa`) | −10 pts |
| Common sequences (e.g., `abc`, `123`) | −10 pts |

---

## 🔢 Entropy Calculation

Entropy is computed using the formula:

```
Entropy (bits) = Length × log₂(Pool Size)
```

Where **Pool Size** is the number of distinct character types used:

- Lowercase a–z → +26
- Uppercase A–Z → +26
- Digits 0–9 → +10
- Special characters → +32

A higher entropy means more possible combinations and a harder-to-crack password.

---

## ⏱️ Crack Time Estimation

Crack time is estimated by dividing the total combination space by the attacker's guess rate:

| Scenario | Guess Rate | Typical use |
|---|---|---|
| Online Attack | 100/sec | Throttled login pages |
| Offline Slow Hash | 10,000/sec | bcrypt / scrypt |
| Offline Fast Hash | 10,000,000,000/sec | MD5 / SHA-1 on GPU |

> ⚠️ These are estimates based on character pool size only. Real-world strength also depends on dictionary attacks and pattern recognition.

---

## ✅ Checklist Rules

The 8 rules checked in real time:

1. At least **8 characters**
2. At least **12 characters** (recommended)
3. Contains an **uppercase** letter (A–Z)
4. Contains a **lowercase** letter (a–z)
5. Contains a **number** (0–9)
6. Contains a **special character** (!@#$%^&*…)
7. No **3+ consecutive repeated characters** (e.g., `aaa`)
8. No **common keyboard/dictionary sequences** (e.g., `abc`, `123`, `qwerty`)

---

## 🎨 Design Tokens

| Token | Value | Purpose |
|---|---|---|
| `--bg` | `#0b0c14` | App background |
| `--surface` | `#11131f` | Card background |
| `--violet` | `#6C63FF` | Primary accent |
| `--cyan` | `#00D4FF` | Secondary accent / crack time |
| `--weak` | `#FF4C6A` | Weak password |
| `--fair` | `#FF8C42` | Fair password |
| `--good` | `#F7C948` | Good password |
| `--strong` | `#3EFFB4` | Strong password |
| `--very-strong` | `#00D4FF` | Very strong password |

Fonts: **Space Grotesk** (display/body) + **JetBrains Mono** (data/code)

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure, SVG icons
- **CSS3** — CSS custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — Zero dependencies, no frameworks
- **Google Fonts** — Space Grotesk + JetBrains Mono (CDN)

---

## 🔒 Privacy

- ✅ **100% client-side** — passwords never leave your browser
- ✅ **No cookies, no tracking, no analytics**
- ✅ Session history is stored in memory only — cleared on page refresh
- ✅ Passwords in history are masked (first + last char visible only)

---

## 📸 Strength Level Reference

| Score | Label | Color |
|---|---|---|
| 0–19 | Very Weak | 🔴 `#FF4C6A` |
| 20–39 | Weak | 🔴 `#FF4C6A` |
| 40–54 | Fair | 🟠 `#FF8C42` |
| 55–69 | Good | 🟡 `#F7C948` |
| 70–84 | Strong | 🟢 `#3EFFB4` |
| 85–100 | Very Strong | 🔵 `#00D4FF` |

---

## 👤 Author

**Rahul Thombare**  
Frontend Developer  
GitHub: [github.com/rahulthombare123](https://github.com/rahulthombare123)  
LinkedIn: [linkedin.com/in/rahul-thombare-971619236](https://linkedin.com/in/rahul-thombare-971619236)

---

## 📄 License

MIT License — free to use, modify, and distribute.
