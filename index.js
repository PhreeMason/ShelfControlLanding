/**
 * ShelfControl Landing Page JavaScript
 * Handles interactive features, form submissions, and calculator functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations on scroll
    initScrollAnimations();

    // Handle navbar scroll effects
    handleNavbarScroll();

    // Setup smooth scrolling for CTA buttons
    setupSmoothScroll();

    // Handle early-access form submission
    handleFormSubmission();

    // Animate elements on page load
    animateOnLoad();

    // Set default dates for calculator inputs
    const today = new Date();

    // Set physical book due date to 14 days from today
    const physicalDueDate = new Date(today);
    physicalDueDate.setDate(today.getDate() + 14);
    const physicalDateInput = document.getElementById('demoDays');
    physicalDateInput.value = physicalDueDate.toISOString().split('T')[0];
    physicalDateInput.min = today.toISOString().split('T')[0]; // Prevent past dates

    // Set audiobook due date to 25 days from today
    const audioDueDate = new Date(today);
    audioDueDate.setDate(today.getDate() + 25);
    const audioDateInput = document.getElementById('demoAudioDays');
    audioDateInput.value = audioDueDate.toISOString().split('T')[0];
    audioDateInput.min = today.toISOString().split('T')[0]; // Prevent past dates

    // Initialize calculator with default values
    calculatePhysical();
    calculateAudio();

    // Add event listeners for real-time updates
    document.getElementById('demoPages').addEventListener('input', calculatePhysical);
    document.getElementById('demoDays').addEventListener('input', calculatePhysical);
    document.getElementById('demoHours').addEventListener('input', calculateAudio);
    document.getElementById('demoAudioDays').addEventListener('input', calculateAudio);
});

/**
 * Initialize scroll animations using Intersection Observer
 * Animates elements as they enter the viewport
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.pain-card, .feature, .step, .section-header'
    );
    
    animatedElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
}

/**
 * Handle navbar scroll effects
 * Shows/hides navbar on scroll and adds shadow when scrolled
 */
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for styling
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// Smooth scroll to early access section
function scrollToEarlyAccess(e) {
    if (e) e.preventDefault();
    const earlyAccessSection = document.getElementById('early-access');

    if (earlyAccessSection) {
        earlyAccessSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Focus on email input after scroll
        setTimeout(() => {
            const emailInput = earlyAccessSection.querySelector('input[type="email"]');
            if (emailInput) {
                emailInput.focus();
            }
        }, 800);
    }
}

// Smooth scrolling for all CTA buttons
function setupSmoothScroll() {
    const ctaButtons = document.querySelectorAll(
        '.nav-cta, .cta-primary, .final-cta-button, .mobile-cta'
    );

    ctaButtons.forEach(button => {
        button.addEventListener('click', scrollToEarlyAccess);
    });
}


// Form submission handling
function handleFormSubmission() {
    const form = document.getElementById('early-accessForm');
    const successMessage = document.getElementById('formSuccess');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const email = formData.get('email');
        
        // Add loading state
        const submitButton = form.querySelector('.form-submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Saving...';
        submitButton.disabled = true;
        form.classList.add('loading');
        
        try {
            // Submit to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                // Show success message
                form.style.display = 'none';
                successMessage.classList.add('show');
                
                // Track conversion
                trackConversion(email);
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    successMessage.classList.remove('show');
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    form.classList.remove('loading');
                }, 5000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error submitting the form. Please try again.');
            
            // Reset loading state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            form.classList.remove('loading');
        }
    });
}

// Track conversion (placeholder for analytics)
function trackConversion(email) {
    // Add your analytics tracking code here
    // e.g., gtag('event', 'sign_up', { method: 'early-access' });
}


// Animate elements on page load
function animateOnLoad() {
    // Add loaded class to body after a brief delay
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Animate screenshot on load
    const screenshot = document.querySelector('.app-screenshot');
    if (screenshot) {
        setTimeout(() => {
            screenshot.style.transform = 'perspective(1000px) rotateY(0deg)';
        }, 1000);
    }
    
}

// Add CSS for navbar scrolled state
const style = document.createElement('style');
style.textContent = `
    .navbar.scrolled {
        padding: 12px 0;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    body.loaded * {
        animation-play-state: running !important;
    }
    
    .form-input:invalid {
        border-color: #7251b5;
    }
`;
document.head.appendChild(style);

// Email validation with visual feedback
const emailInput = document.querySelector('input[type="email"]');
if (emailInput) {
    emailInput.addEventListener('input', (e) => {
        const email = e.target.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (email.length > 0) {
            e.target.style.borderColor = isValid ? '#4CAF50' : '#f44336';
        } else {
            e.target.style.borderColor = '';
        }
    });

    // Validate on blur
    emailInput.addEventListener('blur', (e) => {
        const email = e.target.value.trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            e.target.setCustomValidity('Please enter a valid email address');
        } else {
            e.target.setCustomValidity('');
        }
    });
}

// Add hover effects for pain cards
const painCards = document.querySelectorAll('.pain-card');
painCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});


// Lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');
if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Performance monitoring
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.renderTime || entry.loadTime);
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
}

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Skip to main content
    if (e.key === 'Tab' && e.shiftKey === false && document.activeElement === document.body) {
        const mainContent = document.querySelector('.hero');
        if (mainContent) {
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
        }
    }
});

// Mobile menu toggle (for future enhancement)
function initMobileMenu() {
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.innerHTML = '<span></span><span></span><span></span>';
    menuButton.setAttribute('aria-label', 'Toggle navigation menu');
    
    const navbar = document.querySelector('.navbar');
    if (navbar && window.innerWidth <= 768) {
        // Add mobile menu functionality here if needed
    }
}

// Initialize mobile menu
initMobileMenu();


// Window resize handler
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reinitialize mobile-specific features
        if (window.innerWidth <= 768) {
            initMobileMenu();
        }
    }, 250);
});

// Page visibility API for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page becomes visible
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Date Calculation Helper
function calculateDaysUntil(dateString) {
    if (!dateString) return 1; // Default to 1 day if no date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // If date is in the past, return 0 to indicate overdue
    if (diffDays < 0) return 0;
    return Math.max(1, diffDays); // Minimum 1 day for future dates
}

// Format Date for Display (e.g., "Nov 19, 2025")
function formatDateForDisplay(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Calculator Demo function
function calculateDemo() {
    const pages = parseInt(document.getElementById('demo-pages').value);
    const deadlineDate = new Date(document.getElementById('demo-deadline').value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    if (pages && daysUntil > 0) {
        const pagesPerDay = Math.ceil(pages / daysUntil);
        const resultElement = document.querySelector('.demo-result');
        const numberElement = document.querySelector('.demo-number');
        const colorIndicator = document.querySelector('.demo-color-indicator');

        numberElement.textContent = pagesPerDay;

        if (pagesPerDay <= 50) {
            colorIndicator.className = 'demo-color-indicator comfortable';
            colorIndicator.querySelector('span:last-child').textContent =
                'Comfortable pace at your reading speed';
        } else if (pagesPerDay <= 75) {
            colorIndicator.className = 'demo-color-indicator tight';
            colorIndicator.querySelector('span:last-child').textContent =
                'Tight but doable - extra effort needed';
        } else {
            colorIndicator.className = 'demo-color-indicator unrealistic';
            colorIndicator.querySelector('span:last-child').textContent =
                'Not possible at your current reading speed';
        }

        resultElement.classList.remove('hidden');
    }
}

/**
 * Toggle between physical/ebook and audiobook calculator formats
 * @param {string} format - Either 'physical' or 'audio'
 * @param {Event} evt - Click event object
 */
function switchFormat(format, evt) {
    const buttons = document.querySelectorAll('.format-toggle button');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (evt && evt.target) {
        evt.target.classList.add('active');
    }

    if (format === 'physical') {
        document.getElementById('physicalCalc').style.display = 'block';
        document.getElementById('audioCalc').style.display = 'none';
        // Show physical book card
        document.getElementById('physicalBookCard').style.display = 'block';
        document.getElementById('audioBookCard').style.display = 'none';
    } else {
        document.getElementById('physicalCalc').style.display = 'none';
        document.getElementById('audioCalc').style.display = 'block';
        // Show audiobook card
        document.getElementById('physicalBookCard').style.display = 'none';
        document.getElementById('audioBookCard').style.display = 'block';
    }
}

/**
 * Determine pace indicator styling based on value and thresholds
 * @param {number} value - Pages per day or minutes per day
 * @param {Object} thresholds - Configuration object with comfortable/tight thresholds and text
 * @returns {Object} Object with background color and text for pace indicator
 */
function getPaceIndicator(value, thresholds) {
    if (value <= thresholds.comfortable) {
        return { background: '#B8A9D9', text: thresholds.comfortableText };
    } else if (value <= thresholds.tight) {
        return { background: '#E8B4A0', text: thresholds.tightText };
    } else {
        return { background: '#E8B4B8', text: 'reach out to publisher' };
    }
}

/**
 * Calculate pages per day for physical books/ebooks
 * Updates both the calculator result display and book card preview
 */
function calculatePhysical() {
    const pages = parseInt(document.getElementById('demoPages').value) || 384;
    const dateString = document.getElementById('demoDays').value;
    const days = calculateDaysUntil(dateString);
    const pagesPerDay = Math.ceil(pages / days);

    // Update calculator result
    document.getElementById('resultNumber').textContent = pagesPerDay;

    // Update book card
    document.getElementById('physicalMetric').textContent = pagesPerDay;
    document.getElementById('physicalDaysNumber').textContent = days;
    if (dateString) {
        document.getElementById('physicalDueDate').textContent = formatDateForDisplay(dateString);
    }

    // Update pace indicator
    const paceIndicator = document.querySelector('#physicalCalc .pace-indicator');
    const paceText = document.getElementById('paceText');
    const pace = getPaceIndicator(pagesPerDay, {
        comfortable: 50,
        tight: 80,
        comfortableText: 'comfortable pace',
        tightText: 'tight but doable'
    });

    paceIndicator.style.background = pace.background;
    paceText.textContent = pace.text;
}

/**
 * Calculate minutes per day for audiobooks
 * Updates both the calculator result display and book card preview
 */
function calculateAudio() {
    const hours = parseFloat(document.getElementById('demoHours').value) || 11.5;
    const dateString = document.getElementById('demoAudioDays').value;
    const days = calculateDaysUntil(dateString);
    const minutesPerDay = Math.ceil((hours * 60) / days);

    // Update calculator result
    document.getElementById('resultAudioNumber').textContent = minutesPerDay;

    // Update book card
    document.getElementById('audioMetric').textContent = minutesPerDay;
    document.getElementById('audioDaysNumber').textContent = days;
    if (dateString) {
        document.getElementById('audioDueDate').textContent = formatDateForDisplay(dateString);
    }

    // Update pace indicator
    const paceIndicator = document.querySelector('#audioCalc .pace-indicator');
    const paceText = document.getElementById('paceAudioText');
    const pace = getPaceIndicator(minutesPerDay, {
        comfortable: 60,
        tight: 120,
        comfortableText: 'comfortable pace',
        tightText: 'need dedicated time'
    });

    paceIndicator.style.background = pace.background;
    paceText.textContent = pace.text;
}