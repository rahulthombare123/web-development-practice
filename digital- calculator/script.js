let display = document.getElementById('display');
let expression = '';
let lastWasOperator = false;

// Append number to display
function appendNumber(num) {
    // Prevent multiple decimal points
    if (num === '.' && display.value.includes('.')) {
        return;
    }

    // Prevent leading zeros
    if (display.value === '0' && num !== '.' && num !== '0') {
        display.value = num;
        expression = num;
        lastWasOperator = false;
        return;
    }

    if (display.value === '0' && num === '0') {
        return;
    }

    display.value += num;
    expression += num;
    lastWasOperator = false;
}

// Append operator to expression
function appendOperator(operator) {
    // Prevent multiple consecutive operators
    if (lastWasOperator && display.value !== '0') {
        expression = expression.slice(0, -1) + operator;
        return;
    }

    if (display.value === '' || display.value === '0') {
        if (operator === '-') {
            expression = '-';
            display.value = '-';
        }
        return;
    }

    expression += operator;
    display.value += ' ' + operator + ' ';
    lastWasOperator = true;
}

// Calculate result
function calculate() {
    try {
        if (expression === '' || lastWasOperator) {
            return;
        }

        // Remove spaces for evaluation
        let cleanExpression = expression.replace(/\s/g, '');

        // Evaluate the expression
        let result = Function('"use strict"; return (' + cleanExpression + ')')();

        // Handle floating point precision
        result = Math.round(result * 100000000) / 100000000;

        // Update display and expression
        display.value = result;
        expression = result.toString();
        lastWasOperator = false;
    } catch (error) {
        display.value = 'Error';
        expression = '';
        lastWasOperator = false;
    }
}

// Clear display
function clearDisplay() {
    display.value = '0';
    expression = '';
    lastWasOperator = false;
}

// Delete last character
function deleteLastChar() {
    if (expression === '') {
        return;
    }

    // Remove last character from expression
    expression = expression.slice(0, -1);

    // Update display
    if (expression === '') {
        display.value = '0';
        lastWasOperator = false;
    } else {
        // Check if last character was an operator
        let lastChar = expression[expression.length - 1];
        if (['+', '-', '*', '/', '%'].includes(lastChar)) {
            lastWasOperator = true;
            display.value = expression.slice(0, -1) + ' ' + lastChar + ' ';
        } else {
            lastWasOperator = false;
            // Rebuild display without spaces
            let cleanDisplay = expression.replace(/\s/g, '');
            display.value = cleanDisplay;
        }
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;

    // Number keys
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    }
    // Decimal point
    else if (key === '.') {
        appendNumber('.');
    }
    // Operators
    else if (key === '+') {
        appendOperator('+');
    }
    else if (key === '-') {
        appendOperator('-');
    }
    else if (key === '*') {
        appendOperator('*');
    }
    else if (key === '/') {
        event.preventDefault();
        appendOperator('/');
    }
    else if (key === '%') {
        appendOperator('%');
    }
    // Enter or equals
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    // Backspace
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteLastChar();
    }
    // Clear
    else if (key.toLowerCase() === 'c') {
        clearDisplay();
    }
});
