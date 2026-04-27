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
    const display    = document.getElementById('calc-display');
    const expression = document.getElementById('calc-expression');
    const keypad     = document.querySelector('.calculator__keypad');

    if (!display || !expression || !keypad) return;

    // --- Internal state ----------------------------------------------------

    /** The number currently shown on the display (as a string). */
    let currentInput = '0';

    /** The first operand stored before an operator is pressed. */
    let previousInput = '';

    /** The pending operator symbol (+, −, ×, ÷) or null. */
    let pendingOperator = null;

    /**
     * True once an operation has been evaluated via '='.
     * The next digit press should start a fresh number rather than appending.
     */
    let justEvaluated = false;

    // --- Helpers -----------------------------------------------------------

    /**
     * Formats a finite number for display, keeping up to 10 decimal places
     * and trimming trailing zeros.
     * @param {number} n
     * @returns {string}
     */
    function formatNumber(n) {
        if (!Number.isFinite(n)) return 'Error';
        // Use up to 10 decimal places, no unnecessary trailing zeros
        return parseFloat(n.toPrecision(12)).toString();
    }

    /**
     * Renders currentInput on the display and applies the correct colour-state
     * modifier class. Also triggers the brief bump animation.
     */
    function updateDisplay() {
        display.textContent = currentInput;

        // Apply colour-state modifier classes based on the numeric value
        display.classList.remove(
            'calculator__display--positive',
            'calculator__display--negative'
        );
        const numericValue = parseFloat(currentInput);
        if (!isNaN(numericValue) && numericValue > 0) {
            display.classList.add('calculator__display--positive');
        } else if (!isNaN(numericValue) && numericValue < 0) {
            display.classList.add('calculator__display--negative');
        }

        // Trigger bump animation by forcing a reflow between class removals
        display.classList.remove('calculator__display--bump');
        void display.offsetWidth;
        display.classList.add('calculator__display--bump');
    }

    /**
     * Highlights the active operator button and removes highlight from others.
     * @param {string|null} operator
     */
    function highlightOperator(operator) {
        keypad.querySelectorAll('.calculator__key--operator').forEach(function (btn) {
            btn.classList.toggle('is-active', btn.dataset.value === operator);
        });
    }

    /**
     * Evaluates the pending operation with the current and previous inputs.
     * Returns the numeric result, or null when there is nothing to evaluate.
     * @returns {number|null}
     */
    function evaluate() {
        if (pendingOperator === null || previousInput === '') return null;

        const a = parseFloat(previousInput);
        const b = parseFloat(currentInput);

        switch (pendingOperator) {
            case '+': return a + b;
            case '−': return a - b;
            case '×': return a * b;
            case '÷': return b !== 0 ? a / b : NaN;
            default:  return null;
        }
    }

    // --- Action handlers ---------------------------------------------------

    /** Appends a digit character to the current input. */
    function handleDigit(digit) {
        // After evaluation, a new digit press starts a fresh entry
        if (justEvaluated) {
            currentInput = digit === '0' ? '0' : digit;
            justEvaluated = false;
        } else if (currentInput === '0' && digit !== '.') {
            currentInput = digit;
        } else {
            // Guard against excessively long strings
            if (currentInput.length >= 15) return;
            currentInput += digit;
        }
        updateDisplay();
    }

    /** Appends a decimal point if one is not already present. */
    function handleDecimal() {
        if (justEvaluated) {
            currentInput = '0.';
            justEvaluated = false;
            updateDisplay();
            return;
        }
        if (!currentInput.includes('.')) {
            currentInput += '.';
            updateDisplay();
        }
    }

    /**
     * Stores the current input as the first operand, records the operator,
     * and prepares for the second operand to be entered.
     * @param {string} operator
     */
    function handleOperator(operator) {
        justEvaluated = false;

        // If an operator is already pending and the user has entered a second
        // operand, chain the operations before storing the new operator.
        if (pendingOperator !== null && previousInput !== '') {
            const chained = evaluate();
            if (chained !== null) {
                const resultStr = formatNumber(chained);
                expression.textContent = `${resultStr} ${operator}`;
                previousInput = resultStr;
                currentInput = resultStr;
                pendingOperator = operator;
                highlightOperator(operator);
                updateDisplay();
                return;
            }
        }

        previousInput = currentInput;
        pendingOperator = operator;
        expression.textContent = `${currentInput} ${operator}`;
        highlightOperator(operator);

        // The next digit entry should replace rather than append
        justEvaluated = true;
    }

    /** Evaluates the pending operation and shows the result. */
    function handleEquals() {
        if (pendingOperator === null || previousInput === '') return;

        const result = evaluate();
        if (result === null) return;

        const resultStr = Number.isFinite(result) ? formatNumber(result) : 'Error';

        expression.textContent =
            `${previousInput} ${pendingOperator} ${currentInput} =`;
        currentInput = resultStr;
        previousInput = '';
        pendingOperator = null;
        justEvaluated = true;

        highlightOperator(null);
        updateDisplay();
    }

    /** Resets all state to the initial zero value. */
    function handleReset() {
        currentInput = '0';
        previousInput = '';
        pendingOperator = null;
        justEvaluated = false;
        expression.textContent = '';
        highlightOperator(null);
        updateDisplay();
    }

    // --- Event delegation --------------------------------------------------

    keypad.addEventListener('click', function (event) {
        const key = event.target.closest('.calculator__key');
        if (!key) return;

        const action = key.dataset.action;
        const value  = key.dataset.value;

        switch (action) {
            case 'digit':    handleDigit(value);    break;
            case 'decimal':  handleDecimal();        break;
            case 'operator': handleOperator(value);  break;
            case 'equals':   handleEquals();         break;
            case 'reset':    handleReset();          break;
        }
    });

    // Seed the display at start-up
    updateDisplay();
}

// Contact form handling
function initContactForm() {
    const form = document.querySelector('.contact__form');

    if (!form) return;

    form.addEventListener('submit', function (e) {
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

function validateForm(data) {
    const { name, email, message } = data;

    if (!name || !email || !message) {
        showMessage('Please fill in all required fields.', 'error');
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
    showMessage('Sending message…', 'info');

    // Simulate API call
    setTimeout(() => {
        showMessage('Thank you! Your message has been sent successfully.', 'success');
        document.querySelector('.contact__form').reset();
    }, 1000);
}

/**
 * Renders a status message inside the form's dedicated live region
 * (#contact-form-status) using CSS classes instead of inline styles.
 * The live region's role="status" and aria-live="polite" ensure screen
 * readers announce the update automatically.
 *
 * @param {string} message  Human-readable message text.
 * @param {'success'|'error'|'info'|'warning'} type  Visual variant.
 */
function showMessage(message, type = 'info') {
    const statusRegion = document.getElementById('contact-form-status');

    if (!statusRegion) return;

    // Clear any previous message
    statusRegion.textContent = '';

    // Build the new message element using project CSS classes (no inline styles)
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message--${type}`;
    messageElement.textContent = message;

    statusRegion.appendChild(messageElement);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode === statusRegion) {
            statusRegion.textContent = '';
        }
    }, 5000);
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