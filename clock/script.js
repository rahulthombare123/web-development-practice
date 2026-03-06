(function() {
      "use strict";

      const timeElement = document.getElementById('time');
      const dateElement = document.getElementById('date');

      // helper: add leading zero
      function pad(num) {
        return num < 10 ? '0' + num : num;
      }

      // format date as "Mon 14 Apr 2025" (example)
      function formatDate(date) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${dayName} ${day} ${month} ${year}`;
      }

      // update clock
      function updateClock() {
        const now = new Date();

        // time: HH:MM:SS (24h format)
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        timeElement.textContent = `${hours}:${minutes}:${seconds}`;

        // date
        dateElement.textContent = formatDate(now);
      }

      // initial call
      updateClock();

      // set interval to update every second
      setInterval(updateClock, 1000);
    })();