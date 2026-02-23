const menuIcon = document.getElementById("menu-icon");
const navList = document.querySelector(".nav-list")

menuIcon.onclick = () => {
    navList.classList.toggle("active");
    menuIcon.classList.toggle("bx-x");
};
