const ps5 = document.getElementById("ps5");
const xbox = document.getElementById("xbox");

const sound = new Audio("assets/audio/ps5.wav");

ps5.addEventListener("mouseenter", () => {
   sound.play();
});

xbox.addEventListener("mouseenter", () => {
   sound.play();
});

const panels = document.querySelectorAll(".panel");

panels.forEach((panel) => {

   panel.addEventListener("mousemove", (e) => {

      const image = panel.querySelector(".panel-image");

      const x = (window.innerWidth / 2 - e.pageX) / 40;
      const y = (window.innerHeight / 2 - e.pageY) / 40;

      image.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;

   });

   panel.addEventListener("mouseleave", () => {

      const image = panel.querySelector(".panel-image");

      image.style.transform = "translate(0px,0px) scale(1)";

   });

});