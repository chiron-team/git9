// Main JavaScript file for G-project-2

document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    init();
});

function init() {
    // Smooth scrolling for navigation links
    initSmoothScrolling();

    // Counter widget
    initCounter();

    // Calculator widget
    initCalculator();

    // Form handling
    initContactForm();
    
    // Navigation highlighting
    initNavigationHighlight();

    // Theme toggle (placeholder — functionality to be added in a future task)
    initThemeToggle();
    
    console.log('G-project-2 initialized successfully');
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Adjust based on header height
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Counter widget
function initCounter() {
    const display = document.getElementById('counter-value');
    const addBtn = document.getElementById('counter-add');
    const subtractBtn = document.getElementById('counter-subtract');

    if (!display || !addBtn || !subtractBtn) return;

    let count = 0;

    function updateDisplay() {
        display.textContent = count;

        // Apply colour-state modifier classes
        display.classList.remove('counter__display--positive', 'counter__display--negative');
        if (count > 0) {
            display.classList.add('counter__display--positive');
        } else if (count < 0) {
            display.classList.add('counter__display--negative');
        }

        // Trigger bump animation by cycling the class
        display.classList.remove('counter__display--bump');
        // Force a reflow so the animation re-triggers on every click
        void display.offsetWidth;
        display.classList.add('counter__display--bump');
    }

    addBtn.addEventListener('click', function () {
        count += 1;
        updateDisplay();
    });

    subtractBtn.addEventListener('click', function () {
        count -= 1;
        updateDisplay();
    });
}

// Calculator widget
function initCalculator() {
    const inputA    = document.getElementById('calc-a');
    const inputB    = document.getElementById('calc-b');
    const addBtn    = document.getElementById('calc-add');
    const subtractBtn = document.getElementById('calc-subtract');
    const result    = document.getElementById('calc-result');
    const expression = document.getElementById('calc-expression');
    const errorMsg  = document.getElementById('calc-error');

    if (!inputA || !inputB || !addBtn || !subtractBtn || !result || !expression || !errorMsg) return;

    // --- Helpers -----------------------------------------------------------

    /**
     * Returns true when a string represents a finite number.
     * Rejects empty strings, whitespace-only strings, and non-numeric text.
     * @param {string} value
     * @returns {boolean}
     */
    function isValidNumber(value) {
        return value.trim() !== '' && Number.isFinite(Number(value));
    }

    /**
     * Validates both inputs. Highlights invalid fields and surfaces a human-
     * readable error message. Returns the parsed pair on success, or null.
     * @returns {{ a: number, b: number } | null}
     */
    function validateInputs() {
        const rawA = inputA.value;
        const rawB = inputB.value;

        const validA = isValidNumber(rawA);
        const validB = isValidNumber(rawB);

        // Reset previous error state
        clearError();

        if (!validA || !validB) {
            const invalidFields = [];
            if (!validA) {
                inputA.classList.add('calculator__input--error');
                inputA.setAttribute('aria-invalid', 'true');
                invalidFields.push('First number');
            }
            if (!validB) {
                inputB.classList.add('calculator__input--error');
                inputB.setAttribute('aria-invalid', 'true');
                invalidFields.push('Second number');
            }

            const fieldList = invalidFields.join(' and ');
            showError(`${fieldList} must be a valid number.`);
            return null;
        }

        return { a: Number(rawA), b: Number(rawB) };
    }

    /** Removes all error indicators from both inputs and the error banner. */
    function clearError() {
        [inputA, inputB].forEach(function (input) {
            input.classList.remove('calculator__input--error');
            input.removeAttribute('aria-invalid');
        });
        errorMsg.textContent = '';
    }

    /**
     * Displays an error message in the accessible error banner.
     * @param {string} message
     */
    function showError(message) {
        errorMsg.textContent = message;
    }

    /**
     * Formats a finite number for display using locale-aware notation.
     * @param {number} n
     * @returns {string}
     */
    function formatNumber(n) {
        return Number.isFinite(n)
            ? n.toLocaleString(undefined, { maximumFractionDigits: 10 })
            : String(n);
    }

    /**
     * Updates the result display with a value and its expression label,
     * applies the appropriate colour-state class, and triggers the bump
     * animation so the user gets clear visual feedback on every operation.
     * @param {number} value
     * @param {string} expressionText
     */
    function showResult(value, expressionText) {
        result.textContent = formatNumber(value);
        expression.textContent = expressionText;

        // Apply colour-state modifier classes
        result.classList.remove('calculator__result--positive', 'calculator__result--negative');
        if (value > 0) {
            result.classList.add('calculator__result--positive');
        } else if (value < 0) {
            result.classList.add('calculator__result--negative');
        }

        // Trigger bump animation by cycling the class
        result.classList.remove('calculator__result--bump');
        void result.offsetWidth; // force reflow so animation re-triggers
        result.classList.add('calculator__result--bump');
    }

    // --- Public operations -------------------------------------------------

    /**
     * Adds the two input values and displays the result.
     * Shows an error and aborts if either input is non-numeric.
     */
    function add() {
        const values = validateInputs();
        if (values === null) return;

        const { a, b } = values;
        showResult(a + b, `${formatNumber(a)} + ${formatNumber(b)} =`);
    }

    /**
     * Subtracts the second input value from the first and displays the result.
     * Shows an error and aborts if either input is non-numeric.
     */
    function subtract() {
        const values = validateInputs();
        if (values === null) return;

        const { a, b } = values;
        showResult(a - b, `${formatNumber(a)} − ${formatNumber(b)} =`);
    }

    // --- Event listeners ---------------------------------------------------

    addBtn.addEventListener('click', add);
    subtractBtn.addEventListener('click', subtract);

    // Clear the error state as soon as the user begins correcting a field,
    // so the UI feels responsive and non-intrusive.
    [inputA, inputB].forEach(function (input) {
        input.addEventListener('input', function () {
            if (input.classList.contains('calculator__input--error')) {
                input.classList.remove('calculator__input--error');
                input.removeAttribute('aria-invalid');

                // If both fields are now valid, also clear the banner message.
                if (!inputA.classList.contains('calculator__input--error') &&
                    !inputB.classList.contains('calculator__input--error')) {
                    errorMsg.textContent = '';
                }
            }
        });
    });
}

// Contact form handling
function initContactForm() {
    const form = document.querySelector('.contact__form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (validateForm(data)) {
                // Simulate form submission
                handleFormSubmission(data);
            }
        });
    }
}

function validateForm(data) {
    const { name, email, message } = data;
    
    if (!name || !email || !message) {
        showMessage('Please fill in all fields.', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleFormSubmission(data) {
    // Show loading state
    showMessage('Sending message...', 'info');
    
    // Simulate API call
    setTimeout(() => {
        showMessage('Thank you! Your message has been sent successfully.', 'success');
        document.querySelector('.contact__form').reset();
    }, 1000);
}

function showMessage(message, type = 'info') {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message--${type}`;
    messageElement.textContent = message;
    
    // Add styles
    messageElement.style.cssText = `
        padding: 12px 16px;
        margin-bottom: 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        ${getMessageStyles(type)}
    `;
    
    // Insert message
    const form = document.querySelector('.contact__form');
    form.insertBefore(messageElement, form.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

function getMessageStyles(type) {
    const styles = {
        success: 'background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;',
        error: 'background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;',
        info: 'background-color: #dbeafe; color: #1e40af; border: 1px solid #93c5fd;',
        warning: 'background-color: #fef3c7; color: #92400e; border: 1px solid #fcd34d;'
    };
    
    return styles[type] || styles.info;
}

// Navigation highlighting based on scroll position
function initNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    function highlightNavigation() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('nav__link--active');
            }
        });
    }
    
    // Add CSS for active navigation link
    const style = document.createElement('style');
    style.textContent = `
        .nav__link--active {
            color: var(--color-primary) !important;
            font-weight: var(--font-weight-semibold) !important;
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Initial call
}

// Theme toggle (placeholder — no theme-switching logic yet)
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (!themeToggleBtn) return;

    // TODO: implement light/dark mode switching in a future task.
    // The button is intentionally non-functional at this stage.
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}