# ⬡ Dragger — Drag & Drop Playground

A lightweight, zero-dependency drag-and-drop mini project built with vanilla HTML, CSS, and JavaScript.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## ✨ Features

- 🃏 **Drag & Reorder** — Drag cards to rearrange their order on the board
- 🗑️ **Delete by Dropping** — Drop a card onto the trash zone to remove it
- ➕ **Add Cards** — Instantly add new cards with random emojis
- ↺ **Reset Board** — Restore the board to its original state
- 👻 **Ghost Placeholder** — A live ghost element shows exactly where the card will land
- 🔔 **Toast Notifications** — Subtle feedback messages for every action
- 📱 **Responsive** — Works on desktop and mobile screens

---

## 📂 Project Structure

```
dragger/
├── index.html   # Markup & layout
├── style.css    # All styles & animations
├── script.js    # Drag-and-drop logic
└── README.md    # You're here
```

---

## 🚀 Getting Started

No build tools, no npm, no dependencies.

### Option 1 — Open directly

Just double-click `index.html` in your file manager.

### Option 2 — Local dev server (recommended)

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 How to Use

| Action | How |
|---|---|
| Reorder a card | Drag it and drop onto the board |
| Delete a card | Drag it and drop on the 🗑️ zone |
| Add a card | Click **+ Add Card** |
| Reset everything | Click **↺ Reset** |

---

## 🛠️ How It Works

The project uses the native **HTML5 Drag and Drop API** — no libraries required.

### Key concepts:

- **`dragstart`** — Marks the dragged card, creates a ghost placeholder
- **`dragover`** — Calculates insert position using midpoint of each card's Y axis
- **`drop` on board** — Moves the card before the ghost's position
- **`drop` on trash zone** — Removes the card from the DOM
- **`dragend`** — Cleans up state and removes the ghost

### Ghost Placeholder Logic

```js
function getDragAfterElement(container, y) {
  const draggables = [...container.querySelectorAll('.card:not(.dragging)')];
  return draggables.reduce((closest, child) => {
    const box    = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
```

This function finds the nearest card below the cursor so the ghost snaps into the right slot in real time.

---

## 📸 Preview

```
┌─────────────────────────────────────────┐
│  ⬡ DRAGGER                              │
│  Drag. Drop. Rearrange.                  │
│                                          │
│  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │ 🎯   │  │ 🚀   │  │ 💡   │           │
│  │Task 1│  │Task 2│  │Task 3│           │
│  └──────┘  └──────┘  └──────┘           │
│  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │ 🔥   │  │ ⚡   │  │ 🎨   │           │
│  │Task 4│  │Task 5│  │Task 6│           │
│  └──────┘  └──────┘  └──────┘           │
│                                          │
│  [ 🗑️ Drop here to remove ]              │
│                                          │
│  [+ Add Card]  [↺ Reset]   Cards: 6     │
└─────────────────────────────────────────┘
```

---

## 📄 License

MIT — free to use, modify, and distribute.
