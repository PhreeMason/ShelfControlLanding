// ShelfControl Landing Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations on scroll
    initScrollAnimations();
    
    // Handle navbar scroll effects
    handleNavbarScroll();
    
    // Setup smooth scrolling for CTA buttons
    setupSmoothScroll();
    
    // Initialize FAQ accordion
    initFAQAccordion();
    
    // Handle waitlist form submission
    handleFormSubmission();
    
    // Add parallax effect to hero
    initParallaxEffect();
    
    // Animate elements on page load
    animateOnLoad();
});

// Intersection Observer for scroll animations
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

// Navbar scroll effects
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

// Smooth scrolling for all CTA buttons
function setupSmoothScroll() {
    const ctaButtons = document.querySelectorAll(
        '.nav-cta, .cta-primary, .final-cta-button'
    );
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const waitlistSection = document.querySelector('.waitlist-section');
            
            if (waitlistSection) {
                waitlistSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Focus on email input after scroll
                setTimeout(() => {
                    const emailInput = waitlistSection.querySelector('input[type="email"]');
                    if (emailInput) {
                        emailInput.focus();
                    }
                }, 800);
            }
        });
    });
}

// FAQ Accordion functionality
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Form submission handling
function handleFormSubmission() {
    const form = document.getElementById('waitlistForm');
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

// Simulate API call
function simulateAPICall() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

// Track conversion (placeholder for analytics)
function trackConversion(email) {
    console.log('Conversion tracked:', email);
    // Add your analytics tracking code here
    // e.g., gtag('event', 'sign_up', { method: 'waitlist' });
}

// Parallax effect for hero section (disabled to fix floating issue)
function initParallaxEffect() {
    // Disabled parallax to prevent section overlap issues
    return;
    
    // const hero = document.querySelector('.hero');
    // const mockup = document.querySelector('.mockup-container');
    
    // if (!hero || !mockup) return;
    
    // let ticking = false;
    
    // function updateParallax() {
    //     const scrolled = window.pageYOffset;
    //     const speed = 0.5;
        
    //     hero.style.transform = `translateY(${scrolled * speed * 0.3}px)`;
    //     mockup.style.transform = `translateY(${scrolled * speed * -0.2}px)`;
        
    //     ticking = false;
    // }
    
    // window.addEventListener('scroll', () => {
    //     if (!ticking) {
    //         window.requestAnimationFrame(updateParallax);
    //         ticking = true;
    //     }
    // });
}

// Animate elements on page load
function animateOnLoad() {
    // Add loaded class to body after a brief delay
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Animate mockup on load
    const mockup = document.querySelector('.mockup-phone');
    if (mockup) {
        setTimeout(() => {
            mockup.style.transform = 'perspective(1000px) rotateY(0deg)';
        }, 1000);
    }
    
    // Stagger animation for book items
    const bookItems = document.querySelectorAll('.book-item');
    bookItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 1400 + (index * 150));
    });
    
    // Progress bars will animate together with the counters below
    
    // Animate sparkle
    const sparkle = document.querySelector('.sparkle');
    if (sparkle) {
        setInterval(() => {
            sparkle.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                sparkle.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }, 3000);
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
        border-color: #f44336;
    }
    
    .form-input:valid {
        border-color: #4CAF50;
    }
`;
document.head.appendChild(style);

// Email validation
const emailInput = document.querySelector('input[type="email"]');
if (emailInput) {
    emailInput.addEventListener('input', (e) => {
        const email = e.target.value;
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        if (email.length > 0) {
            e.target.style.borderColor = isValid ? '#4CAF50' : '#f44336';
        } else {
            e.target.style.borderColor = '';
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

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Observe and animate stats when visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat-number');
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (target) {
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const trustSection = document.querySelector('.trust');
if (trustSection) {
    statsObserver.observe(trustSection);
}

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
    // Add keyboard navigation for FAQ
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('faq-question')) {
            e.preventDefault();
            e.target.click();
        }
    }
    
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

// Add interactive animations to mockup
function initMockupInteractions() {
    const bookItems = document.querySelectorAll('.book-item');
    const progressFill = document.querySelector('.progress-fill');
    
    // Add click interactions to book items
    bookItems.forEach(item => {
        item.addEventListener('click', () => {
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
    });
    
    // Animate progress bar on hover
    if (progressFill) {
        progressFill.addEventListener('mouseenter', () => {
            progressFill.style.background = 'linear-gradient(90deg, #E8C2B9 0%, #D4A574 100%)';
        });
        
        progressFill.addEventListener('mouseleave', () => {
            progressFill.style.background = 'linear-gradient(90deg, #E8C2B9 0%, #B8A9D9 100%)';
        });
    }
    
    // Number counting animations with progress bars
    const statValues = document.querySelectorAll('.stat-value');
    const progressFills = document.querySelectorAll('.progress-fill');
    
    // Pages counter with progress bar
    if (statValues.length > 0) {
        let count = 0;
        const target = 22;
        const targetTotal = 91;
        const increment = target / 30;
        
        setTimeout(() => {
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    count = target;
                    clearInterval(timer);
                }
                const currentCount = Math.floor(count);
                const progressPercent = (currentCount / targetTotal) * 100;
                
                statValues[0].textContent = `${currentCount}/91`;
                if (progressFills.length > 0) {
                    progressFills[0].style.width = `${progressPercent}%`;
                }
            }, 50);
        }, 1800);
    }
    
    // Audio counter with progress bar (minutes)
    if (statValues.length > 1) {
        let minutes = 0;
        const targetMinutes = 13;
        const totalMinutes = 67; // 1h 7m = 67 minutes
        const increment = targetMinutes / 25;
        
        setTimeout(() => {
            const timer = setInterval(() => {
                minutes += increment;
                if (minutes >= targetMinutes) {
                    minutes = targetMinutes;
                    clearInterval(timer);
                }
                const currentMinutes = Math.floor(minutes);
                const progressPercent = (currentMinutes / totalMinutes) * 100;
                
                statValues[1].textContent = `${currentMinutes}m/1h 7m`;
                if (progressFills.length > 1) {
                    progressFills[1].style.width = `${progressPercent}%`;
                }
            }, 50);
        }, 1900);
    }
}

// Initialize mockup interactions after page load
setTimeout(initMockupInteractions, 2000);

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

console.log('ShelfControl Landing Page initialized successfully');