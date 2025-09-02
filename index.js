// ShelfControl Landing Page JavaScript

// Smooth scroll to waitlist section
function scrollToWaitlist() {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
        waitlistSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// FAQ Toggle Functionality
function toggleFaq(questionElement) {
    const faqItem = questionElement.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Waitlist Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waitlistForm');
    const successMessage = document.getElementById('formSuccess');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const email = formData.get('email');
            const challenge = formData.get('challenge');
            const books = formData.get('books');
            
            // Basic email validation
            if (!isValidEmail(email)) {
                showFormError('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            form.classList.add('loading');
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Saving...';
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                // Hide form and show success message
                form.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Track conversion (replace with actual analytics)
                trackWaitlistSignup(email, challenge, books);
                
                // Remove loading state
                form.classList.remove('loading');
                submitButton.textContent = originalText;
            }, 1500);
        });
    }
    
    // Add intersection observer for animations
    setupScrollAnimations();
    
    // Handle mobile menu and touch interactions
    setupMobileOptimizations();
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form error
function showFormError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 12px;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        font-size: 14px;
    `;
    errorDiv.textContent = message;
    
    const form = document.getElementById('waitlistForm');
    form.appendChild(errorDiv);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Analytics tracking (replace with your actual analytics service)
function trackWaitlistSignup(email, challenge, books) {
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'waitlist_signup', {
            'event_category': 'engagement',
            'event_label': 'landing_page',
            'value': 1
        });
    }
    
    // Example: Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'ShelfControl Waitlist',
            content_category: 'waitlist'
        });
    }
    
    // Log to console for development
    console.log('Waitlist signup:', {
        email: email,
        challenge: challenge,
        books: books,
        timestamp: new Date().toISOString()
    });
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.pain-card, .feature, .step, .trust-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Mobile optimizations
function setupMobileOptimizations() {
    // Prevent zoom on input focus for iOS
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (window.innerWidth < 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 
                        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                    );
                }
            }
        });
        
        input.addEventListener('blur', function() {
            if (window.innerWidth < 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 
                        'width=device-width, initial-scale=1.0'
                    );
                }
            }
        });
    });
    
    // Handle touch interactions for cards
    const cards = document.querySelectorAll('.pain-card, .trust-item');
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Handle resize events
window.addEventListener('resize', function() {
    // Adjust mobile mockup on orientation change
    const mockup = document.querySelector('.mobile-mockup');
    if (mockup && window.innerWidth < 768) {
        mockup.style.transform = 'scale(0.9)';
    } else if (mockup) {
        mockup.style.transform = 'scale(1)';
    }
});

// Keyboard navigation for FAQ
document.addEventListener('keydown', function(e) {
    if (e.target.classList.contains('faq-question')) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFaq(e.target);
        }
    }
});

// Form field enhancements
function setupFormEnhancements() {
    const emailInput = document.getElementById('email');
    const challengeInput = document.getElementById('challenge');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '';
            }
        });
    }
    
    if (challengeInput) {
        challengeInput.addEventListener('input', function() {
            const remaining = 100 - this.value.length;
            let counter = document.querySelector('.char-counter');
            
            if (!counter) {
                counter = document.createElement('div');
                counter.className = 'char-counter';
                counter.style.cssText = `
                    font-size: 12px;
                    color: #6c757d;
                    text-align: right;
                    margin-top: 4px;
                `;
                this.parentNode.appendChild(counter);
            }
            
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 0) {
                counter.style.color = '#dc3545';
                this.style.borderColor = '#dc3545';
            } else {
                counter.style.color = '#6c757d';
                this.style.borderColor = '';
            }
        });
    }
}

// Initialize form enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', setupFormEnhancements);

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
});

// Preload critical resources
function preloadResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();

// Add loading states and error handling for any external integrations
window.addEventListener('load', function() {
    // Remove any loading states
    document.body.classList.remove('loading');
    
    // Initialize any third-party widgets if needed
    // Example: Newsletter service, analytics, etc.
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}