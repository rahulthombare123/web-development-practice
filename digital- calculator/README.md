# Digital Calculator

A modern, responsive digital calculator built with vanilla HTML, CSS, and JavaScript. This calculator provides a clean and intuitive interface for performing basic arithmetic operations.

## 📋 Features

- **Basic Operations**: Addition, subtraction, multiplication, division, and modulo
- **User-Friendly Interface**: Clean and modern design with gradient background
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Keyboard Support**: Use your keyboard for calculations
- **Error Handling**: Handles calculation errors gracefully
- **Delete Function**: Remove the last character with the DEL button
- **Clear Function**: Reset calculator with the C button
- **Real-time Display**: Watch calculations appear on the display as you type

## 📁 Project Structure

```
digital-calculator/
├── index.html       # Main HTML file with calculator layout
├── style.css        # Styling and responsive design
├── script.js        # Calculator logic and keyboard support
└── README.md        # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge, etc.)
- No additional installations or dependencies required

### Installation

1. Extract the downloaded ZIP file
2. Open `index.html` in your web browser
3. Start calculating!

## 🎮 How to Use

### Mouse/Touch
- Click number buttons (0-9) to input numbers
- Click operator buttons (+, -, ×, ÷, %) to select operations
- Click the equals button (=) to calculate the result
- Click C to clear the calculator
- Click DEL to delete the last character

### Keyboard
- **Number Keys**: Press 0-9 to input numbers
- **Decimal**: Press . for decimal point
- **Operators**:
  - Press + for addition
  - Press - for subtraction
  - Press * for multiplication
  - Press / for division
  - Press % for modulo
- **Calculate**: Press Enter or = to get the result
- **Delete**: Press Backspace to delete last character
- **Clear**: Press C to clear the display

## 🎨 Design Features

- **Gradient Background**: Purple and blue gradient background for a modern look
- **Smooth Animations**: Slide-in animation when the page loads
- **Color-Coded Buttons**:
  - Gray buttons for numbers
  - Blue buttons for operators
  - Green button for equals
  - Red button for clear
  - Orange button for delete
- **Hover Effects**: Buttons respond to mouse hover with subtle animations
- **Mobile-Optimized**: Adjusts button sizes and font sizes for smaller screens

## 💻 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## 📝 Technical Details

### HTML (index.html)
- Semantic HTML5 structure
- Meta tags for viewport and charset
- Clean and organized button layout

### CSS (style.css)
- CSS Grid for button layout
- Flexbox for container alignment
- Media queries for responsive design
- CSS animations and transitions
- CSS variables for easy customization

### JavaScript (script.js)
- Pure vanilla JavaScript (no frameworks)
- Event listeners for keyboard support
- Error handling with try-catch
- Floating-point precision handling
- Input validation and state management

## 🔧 Code Explanation

### Key Functions

**appendNumber(num)**
- Adds number to the display and expression
- Prevents multiple decimal points
- Prevents leading zeros

**appendOperator(operator)**
- Adds operator to expression
- Prevents consecutive operators
- Adds spacing for display clarity

**calculate()**
- Evaluates the mathematical expression
- Handles floating-point precision
- Catches and displays errors

**clearDisplay()**
- Resets the calculator to initial state
- Clears display and expression

**deleteLastChar()**
- Removes the last character from expression
- Updates display accordingly

**Keyboard Event Listener**
- Captures keyboard input
- Maps keys to calculator functions
- Prevents default browser behavior where needed

## ⚡ Performance

- Lightweight and fast loading
- No external dependencies
- Minimal CSS and JavaScript
- Optimized for both desktop and mobile

## 🎯 Features to Try

1. **Basic Calculation**: Type 5 + 3 and press Enter
2. **Decimal Numbers**: Calculate 3.14 × 2
3. **Chained Operations**: 10 + 5 × 2 (follows order of operations)
4. **Error Handling**: Try dividing by zero to see error message
5. **Keyboard Use**: Use only your keyboard for a complete calculation
6. **Backspace**: Delete mistakes with the DEL button or Backspace key

## 🐛 Known Limitations

- Large numbers may display in scientific notation
- Very long expressions may cause display overflow
- Keyboard layout may vary by language/region

## 📜 License

This project is open-source and available for personal and commercial use.

## 👨‍💻 Author

Created as a modern calculator application using vanilla web technologies.

## 🤝 Contributing

Feel free to modify and improve this calculator. Suggestions for improvements:

- Add more mathematical functions (square root, percentage, factorial, etc.)
- Implement calculation history
- Add themes (dark mode, light mode)
- Multi-language support
- Scientific calculator mode
- Memory functions (M+, M-, MR, MC)

## 📞 Support

For issues or questions, please review the code and documentation. The code is well-commented and straightforward to understand and modify.

---

**Enjoy your calculations! 🧮**
