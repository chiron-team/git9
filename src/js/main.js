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
    const inputA = document.getElementById('calc-a');
    const inputB = document.getElementById('calc-b');
    const addBtn = document.getElementById('calc-add');
    const subtractBtn = document.getElementById('calc-subtract');
    const result = document.getElementById('calc-result');
    const expression = document.getElementById('calc-expression');

    if (!inputA || !inputB || !addBtn || !subtractBtn || !result || !expression) return;

    function getValues() {
        const a = parseFloat(inputA.value) || 0;
        const b = parseFloat(inputB.value) || 0;
        return { a, b };
    }

    function formatNumber(n) {
        // Use locale string for readability; fall back to plain string
        return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 10 }) : String(n);
    }

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

    addBtn.addEventListener('click', function () {
        const { a, b } = getValues();
        showResult(a + b, `${a} + ${b} =`);
    });

    subtractBtn.addEventListener('click', function () {
        const { a, b } = getValues();
        showResult(a - b, `${a} − ${b} =`);
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