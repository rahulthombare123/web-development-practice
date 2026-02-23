# 🌐 Responsive Navbar Component

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML) 
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS) 
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) 
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A lightweight, fixed navigation bar with a **modern glass blur effect** and **mobile-responsive hamburger menu**.

---

## 🚀 Features

- **Fixed Header** – Stays at the top of the page.  
- **Backdrop Blur** – Semi-transparent background with smooth blur effect.  
- **Desktop View** – Horizontal navigation links with hover effect.  
- **Mobile View** – Collapses into a hamburger menu on screens ≤720px.  
- **Interactive Icon** – Menu icon toggles to a close (X) when open.  
- **No Dependencies** – Only uses Boxicons for the menu icon (external CDN).  

---

## 📂 File Structure

- `index.html` – Contains the navbar HTML structure.  
- `style.css` – All styling for the navbar.  
- `script.js` – JavaScript for the mobile menu toggle.  
- `background.jpg` – Background image (optional, can be replaced).  

---

## ⚡ Usage

1. Include the HTML markup for the header in your page.  
2. Link the `style.css` and `script.js` files.  
3. Add the Boxicons CDN in your `<head>`.  
4. Ensure you have a background image or adjust the body styling as needed.  

---

## 🎨 Customization

- **Logo** – Replace the text inside `.logo` or use an image.  
- **Navigation Links** – Update the `<a>` tags in the unordered list.  
- **Colors & Blur** – Modify the CSS properties in `.header` and `.nav-link:hover`.  
- **Breakpoint** – Change the `max-width` value in the media query.  

---

## 🌐 Browser Support

Works on all modern browsers that support `backdrop-filter` (Chrome, Firefox, Edge, Safari).  
Fallback: solid background for older browsers.  

---

## 📝 License

MIT License