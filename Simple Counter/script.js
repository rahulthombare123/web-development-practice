// Get references to the element and button
const counterDisplay = document.getElementById('counter');
const button = document.getElementById('clickBtn');

let count = 0;  // initial value

// Function to update the display and increment
function handleClick() {
  count++;
  counterDisplay.textContent = count;
}

// Attach the event listener to the button
button.addEventListener('click', handleClick);