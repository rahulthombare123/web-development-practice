const button = document.getElementById("btn");
const colorCode = document.getElementById("colorCode");

button.addEventListener("click", () => {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  document.body.style.backgroundColor = color;
  colorCode.textContent = color;
});
