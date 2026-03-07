 (function() {
      "use strict";

      // --- clock functionality (same as before) ---
      const timeElement = document.getElementById('time');
      const dateElement = document.getElementById('date');

      function pad(num) {
        return num < 10 ? '0' + num : num;
      }

      function formatDate(date) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
      }

      function updateClock() {
        const now = new Date();
        timeElement.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        dateElement.textContent = formatDate(now);
      }
      updateClock();
      setInterval(updateClock, 1000);

      // --- new: background switching logic ---
      const body = document.getElementById('mainBody');
      
      // define background gradients (or solid colors) for each theme
      const themes = {
        dark: 'linear-gradient(145deg, #0b1120 0%, #1a2639 100%)',
        ocean: 'linear-gradient(145deg, #164e63 0%, #0b3b4f 50%, #0a4d68 100%)',
        sunset: 'linear-gradient(145deg, #9e1828 0%, #c2414c 30%, #f97316 100%)',
        forest: 'linear-gradient(145deg, #1e3a2e 0%, #2d6a4f 50%, #40916c 100%)'
      };

      // add click listeners to all bg-btn
      document.querySelectorAll('.bg-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          const theme = this.getAttribute('data-bg');  // "dark", "ocean", etc.
          if (themes[theme]) {
            body.style.background = themes[theme];
          }
        });
      });

      // optional: set default to dark (already is, but ensure)
      // (the initial body style in css matches dark, but we keep it)
    })();