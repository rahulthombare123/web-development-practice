/* ===========================================================
   MOOD INK — engine
   Reads typing rhythm, drives background color, ink blots,
   text contrast and the tide bar. No frameworks, no build step.
   =========================================================== */

(function () {
  "use strict";

  const typeArea   = document.getElementById("typeArea");
  const moodLabel  = document.getElementById("moodLabel");
  const wpmReadout = document.getElementById("wpmReadout");
  const tideEl     = document.getElementById("tide");
  const blots      = Array.from(document.querySelectorAll(".blot"));
  const root       = document.documentElement;

  /* ---------------------------------------------------------
     Color ramp: five stops from "still" paper to full "blot".
     Each stop carries a background, an ink accent (used by the
     blots and tide bar) and a readable text color for that bg.
     --------------------------------------------------------- */
  const STOPS = [
    { t: 0.00, bg: "#DAD6C4", ink: "#93A6A0", text: "#221F1A", label: "still"     },
    { t: 0.25, bg: "#C3CBC2", ink: "#5C7A99", text: "#221F1A", label: "settling"  },
    { t: 0.50, bg: "#8FA0B0", ink: "#35316B", text: "#F4F1E6", label: "flowing"   },
    { t: 0.75, bg: "#4A3F63", ink: "#6E1E3D", text: "#EDE7DD", label: "surging"   },
    { t: 1.00, bg: "#150E17", ink: "#170D14", text: "#F5F1E8", label: "blotting"  },
  ];

  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgbToCss([r, g, b]) {
    return `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpRgb(rgbA, rgbB, t) {
    return [
      lerp(rgbA[0], rgbB[0], t),
      lerp(rgbA[1], rgbB[1], t),
      lerp(rgbA[2], rgbB[2], t),
    ];
  }

  // Given normalized speed 0..1, find the two surrounding stops
  // and interpolate bg / ink / text together.
  function colorAt(speed) {
    const s = Math.min(1, Math.max(0, speed));
    let lo = STOPS[0], hi = STOPS[STOPS.length - 1];
    for (let i = 0; i < STOPS.length - 1; i++) {
      if (s >= STOPS[i].t && s <= STOPS[i + 1].t) {
        lo = STOPS[i];
        hi = STOPS[i + 1];
        break;
      }
    }
    const span = hi.t - lo.t || 1;
    const localT = (s - lo.t) / span;
    return {
      bg:   rgbToCss(lerpRgb(hexToRgb(lo.bg), hexToRgb(hi.bg), localT)),
      ink:  rgbToCss(lerpRgb(hexToRgb(lo.ink), hexToRgb(hi.ink), localT)),
      text: rgbToCss(lerpRgb(hexToRgb(lo.text), hexToRgb(hi.text), localT)),
      label: localT < 0.5 ? lo.label : hi.label,
    };
  }

  /* ---------------------------------------------------------
     Speed tracking: rolling window of input timestamps.
     targetWpm reacts instantly to typing, decays when idle.
     displayWpm eases toward targetWpm every frame for smoothness.
     --------------------------------------------------------- */
  const WINDOW = 8;
  let timestamps = [];
  let targetWpm = 0;
  let displayWpm = 0;
  let lastInputAt = performance.now();

  function registerKeystroke() {
    const now = performance.now();
    lastInputAt = now;
    timestamps.push(now);
    if (timestamps.length > WINDOW) timestamps.shift();

    if (timestamps.length >= 2) {
      const span = timestamps[timestamps.length - 1] - timestamps[0];
      const intervals = timestamps.length - 1;
      const avgInterval = span / intervals;
      if (avgInterval > 0) {
        const charsPerSecond = 1000 / avgInterval;
        const wpm = (charsPerSecond * 60) / 5; // 5 chars ≈ 1 word
        targetWpm = Math.min(130, wpm);
      }
    }
  }

  typeArea.addEventListener("input", registerKeystroke);

  typeArea.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      typeArea.value = "";
      timestamps = [];
      targetWpm = 0;
    }
  });

  window.addEventListener("load", () => typeArea.focus());

  /* ---------------------------------------------------------
     Animation loop
     --------------------------------------------------------- */
  const phase = blots.map(() => Math.random() * Math.PI * 2);

  function tick(now) {
    const idleFor = now - lastInputAt;
    if (idleFor > 550) {
      targetWpm *= 0.965; // ink settles back toward stillness
      if (targetWpm < 0.4) targetWpm = 0;
    }

    displayWpm = lerp(displayWpm, targetWpm, 0.07);
    const speed = Math.min(1, displayWpm / 120);
    const c = colorAt(speed);

    root.style.setProperty("--bg", c.bg);
    root.style.setProperty("--ink-current", c.ink);
    root.style.setProperty("--ink-text", c.text);
    document.body.style.background = c.bg;

    tideEl.style.setProperty("--tide-width", `${speed * 100}%`);

    blots.forEach((blot, i) => {
      const wobble = Math.sin(now / 900 + phase[i]) * 0.04;
      const scale = 0.28 + speed * 0.95 + wobble;
      const opacity = speed < 0.03 ? 0 : 0.16 + speed * 0.6;
      blot.style.setProperty("--blot-scale", scale.toFixed(3));
      blot.style.setProperty("--blot-opacity", opacity.toFixed(3));
    });

    moodLabel.textContent = c.label;
    wpmReadout.innerHTML = `${Math.round(displayWpm)} <em>wpm</em>`;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
