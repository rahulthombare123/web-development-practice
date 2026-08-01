# Study Timetable Creator

A clean, premium weekly study timetable that runs entirely in your browser.
No sign-up. No internet required after loading. Everything saves to your browser's Local Storage.

---

## How to Use

### 1. Open the App
Double-click `index.html` in this folder. It opens directly in your browser — no server needed.

---

### 2. Load a Ready-Made Template (fastest way to start)

1. Click the **Templates** button in the header.
2. Pick a template:

| Template | Best For |
|---|---|
| School Student | Class 6-12 students, morning + evening sessions |
| College / University | Semester subjects, labs, assignments |
| Competitive Exam | UPSC, JEE, NEET — high-intensity daily plan |
| Working Professional | Evening and weekend upskilling |
| Balanced Life | Light study with hobbies and rest |

3. Click the card — it loads instantly. Edit any slot to personalise.

---

### 3. Build Your Own Timetable

1. Type a name in the **Timetable Name** field (e.g. "Semester 1 Plan").
2. Click any cell in the grid. Rows = time slots, columns = days.
3. In the modal that opens:
   - Enter the **Subject / Activity** name.
   - Pick a **colour** for visual grouping.
   - Add an optional **Note** (e.g. "Chapter 3 revision").
   - Click **Save Slot**.
4. Repeat for every slot you want to fill.

Tip: If you type the same subject name in multiple slots, the app automatically reuses the same colour for that subject.

---

### 4. Save Your Timetable

Click **Save** in the header. Your timetable is stored in the browser's Local Storage.
A "Last saved" timestamp appears below the name field.

---

### 5. Edit or Remove a Slot

- Click any filled cell — the editor opens with existing data pre-filled.
- Or hover and click the pencil icon in the corner.
- Change subject, colour, or note, then click **Save Slot**.
- To remove the slot, click **Clear Slot**.

---

### 6. Clear Everything

Click **Clear All** in the header and confirm. The entire timetable and local storage entry are wiped.

---

## Stats Bar

Below the table you will see three live counters:

| Stat | Meaning |
|---|---|
| Filled | Number of time slots currently filled |
| Hours/week | Total study hours (each slot = 1 hour) |
| Subjects | Number of unique subjects or activities |

---

## Colour Legend

Above the table, a live legend shows every subject with its assigned colour, making the timetable easy to scan at a glance.

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| Enter | Save the current slot (inside the edit modal) |
| Escape | Close any open modal |

---

## File Structure

```
study-timetable/
├── index.html   -- Main app (open this in your browser)
├── style.css    -- All styles (dark mode, layout, animations)
├── script.js    -- Logic: timetable grid, templates, local storage
└── README.md    -- This file
```

---

## Customise

**Add more time slots:** Open `script.js`, edit the `TIMES` array.
**Add or remove days:** Edit the `DAYS` array (e.g. remove 'Sunday' for a 6-day week).
**Change colours:** Edit the `SUBJECT_COLORS` array with any hex values.
**Add templates:** Add an object to the `TEMPLATES` array following the existing pattern.

---

## How Local Storage Works

- Data is saved under the key `studyboard_data` in the browser.
- It persists until you click Clear All or clear your browser site data.
- Data is never uploaded anywhere — it lives only on your device.
- Works fully offline after the first load (Google Fonts need internet; everything else is local).

---

## Requirements

- Any modern browser: Chrome, Edge, Firefox, Safari (2023 or newer)
- No Node.js, no server, no dependencies to install

---

Built with HTML, CSS, and Vanilla JavaScript using Local Storage.
