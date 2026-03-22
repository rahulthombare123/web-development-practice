const Days = document.getElementById("days");
const Hours = document.getElementById("hours");
const Minutes = document.getElementById("minutes");
const Seconds = document.getElementById("seconds");

// ✅ Dynamic next month
const now = new Date();
let targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();

// 🎯 Animate Numbers
function animateValue(element, start, end, duration) {
    let startTime = null;

    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = currentTime - startTime;

        const value = Math.floor(
            start + (end - start) * (progress / duration)
        );

        element.innerText = value;

        if (progress < duration) {
            requestAnimationFrame(animation);
        } else {
            element.innerText = end;
        }
    }

    requestAnimationFrame(animation);
}

// ⏳ Timer
function timer(){
    const currentDate = new Date().getTime();
    const distance = targetDate - currentDate;

    // If month completed → reset
    if(distance < 0){
        const now = new Date();
        targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    animateValue(Days, Number(Days.innerText), days, 300);
    animateValue(Hours, Number(Hours.innerText), hours, 300);
    animateValue(Minutes, Number(Minutes.innerText), minutes, 300);
    animateValue(Seconds, Number(Seconds.innerText), seconds, 300);
}

// Run every second
setInterval(timer, 1000);

// 🌌 Particle Background
particlesJS("particles-js", {
  particles: {
    number: { value: 80 },
    size: { value: 3 },
    move: { speed: 2 },
    line_linked: { enable: true }
  }
});