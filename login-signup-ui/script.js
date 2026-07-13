// Form toggle functionality
function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const successMessage = document.getElementById('successMessage');

    // Hide success message when switching forms
    successMessage.style.display = 'none';

    if (formType === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        toggleButtons[0].classList.add('active');
        toggleButtons[1].classList.remove('active');
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Sign in to your account';
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        toggleButtons[1].classList.add('active');
        toggleButtons[0].classList.remove('active');
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Join us today';
    }

    // Clear all error messages
    clearAllErrors();
}

// Toggle password visibility
function togglePassword(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        iconElement.classList.remove('fa-eye');
        iconElement.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        iconElement.classList.remove('fa-eye-slash');
        iconElement.classList.add('fa-eye');
    }
}

// Clear all error messages
function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.style.display = 'none';
    });
}

// Show error message
function showError(errorId) {
    const errorElement = document.getElementById(errorId);
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}

// Show success message
function showSuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const submitBtn = document.getElementById('loginSubmitBtn');

    let isValid = true;

    // Validate email
    if (!email) {
        showError('loginEmailError');
        isValid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById('loginEmailError').textContent = 'Please enter a valid email address';
        showError('loginEmailError');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError('loginPasswordError');
        isValid = false;
    }

    if (isValid) {
        // Simulate API call
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Signing In...';

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Sign In';
            
            // Store user data (simulated)
            const userData = {
                email: email,
                rememberMe: rememberMe,
                loginTime: new Date().toISOString()
            };
            
            if (rememberMe) {
                localStorage.setItem('userData', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('userData', JSON.stringify(userData));
            }

            showSuccessMessage('Login successful! Redirecting...');
            
            // Clear form
            document.getElementById('loginForm').reset();
            
            // Simulate redirect
            setTimeout(() => {
                alert('Welcome back! You have been logged in successfully.');
            }, 1500);
        }, 2000);
    }
});

// Sign up form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const submitBtn = document.getElementById('signupSubmitBtn');

    let isValid = true;

    // Validate name
    if (!name) {
        showError('signupNameError');
        isValid = false;
    } else if (name.length < 2) {
        document.getElementById('signupNameError').textContent = 'Name must be at least 2 characters';
        showError('signupNameError');
        isValid = false;
    }

    // Validate email
    if (!email) {
        showError('signupEmailError');
        isValid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById('signupEmailError').textContent = 'Please enter a valid email address';
        showError('signupEmailError');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError('signupPasswordError');
        isValid = false;
    } else if (password.length < 8) {
        document.getElementById('signupPasswordError').textContent = 'Password must be at least 8 characters';
        showError('signupPasswordError');
        isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        document.getElementById('signupPasswordError').textContent = 'Password must contain uppercase, lowercase, and numbers';
        showError('signupPasswordError');
        isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
        showError('signupConfirmPasswordError');
        isValid = false;
    } else if (password !== confirmPassword) {
        document.getElementById('signupConfirmPasswordError').textContent = 'Passwords do not match';
        showError('signupConfirmPasswordError');
        isValid = false;
    }

    if (isValid) {
        // Simulate API call
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Creating Account...';

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Create Account';
            
            // Store user data (simulated)
            const userData = {
                name: name,
                email: email,
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('registeredUser', JSON.stringify(userData));
            
            showSuccessMessage('Account created successfully! Please sign in.');
            
            // Clear form
            document.getElementById('signupForm').reset();
            
            // Switch to login form
            setTimeout(() => {
                toggleForm('login');
            }, 1500);
        }, 2000);
    }
});

// Social login buttons
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.getAttribute('title');
        showSuccessMessage(`Connecting to ${platform}...`);
        
        setTimeout(() => {
            alert(`${platform} login is not implemented in this demo.`);
        }, 1000);
    });
});

// Forgot password link
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    
    if (email && isValidEmail(email)) {
        showSuccessMessage('Password reset link sent to your email!');
    } else {
        alert('Please enter your email address first.');
    }
});

// Check for remembered user
window.addEventListener('load', function() {
    const rememberedUser = localStorage.getItem('userData');
    if (rememberedUser) {
        const userData = JSON.parse(rememberedUser);
        document.getElementById('loginEmail').value = userData.email;
        document.getElementById('rememberMe').checked = true;
    }
});
