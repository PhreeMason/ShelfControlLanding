document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    handleNavbarScroll();
    setupSmoothScroll();
    handleFormSubmission();
    animateOnLoad();
    initFAQ();
    setupAndroidHint();

    const today = new Date();

    const physicalDueDate = new Date(today);
    physicalDueDate.setDate(today.getDate() + 14);
    const physicalDateInput = document.getElementById('demoDays');
    physicalDateInput.value = physicalDueDate.toISOString().split('T')[0];
    physicalDateInput.min = today.toISOString().split('T')[0];

    const audioDueDate = new Date(today);
    audioDueDate.setDate(today.getDate() + 25);
    const audioDateInput = document.getElementById('demoAudioDays');
    audioDateInput.value = audioDueDate.toISOString().split('T')[0];
    audioDateInput.min = today.toISOString().split('T')[0];

    calculatePhysical();
    calculateAudio();

    document.getElementById('demoPages').addEventListener('input', calculatePhysical);
    document.getElementById('demoDays').addEventListener('input', calculatePhysical);
    document.getElementById('demoHours').addEventListener('input', calculateAudio);
    document.getElementById('demoAudioDays').addEventListener('input', calculateAudio);
});

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

    const animatedElements = document.querySelectorAll(
        '.pain-card, .feature, .step, .section-header'
    );

    animatedElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

function scrollToEarlyAccess(e) {
    if (e) e.preventDefault();
    const earlyAccessSection = document.getElementById('early-access');

    if (earlyAccessSection) {
        earlyAccessSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        setTimeout(() => {
            const emailInput = earlyAccessSection.querySelector('input[type="email"]');
            if (emailInput) {
                emailInput.focus();
            }
        }, 800);
    }
}

function setupSmoothScroll() {
    const ctaButtons = document.querySelectorAll(
        '.nav-cta, .cta-primary, .final-cta-button, .mobile-cta'
    );

    ctaButtons.forEach(button => {
        button.addEventListener('click', scrollToEarlyAccess);
    });
}

function handleFormSubmission() {
    const form = document.getElementById('early-accessForm');
    const successMessage = document.getElementById('formSuccess');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const submitButton = form.querySelector('.form-submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Saving...';
        submitButton.disabled = true;
        form.classList.add('loading');

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                form.style.display = 'none';
                successMessage.classList.add('show');

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

            submitButton.textContent = originalText;
            submitButton.disabled = false;
            form.classList.remove('loading');
        }
    });
}

function animateOnLoad() {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    const screenshot = document.querySelector('.app-screenshot');
    if (screenshot) {
        setTimeout(() => {
            screenshot.style.transform = 'perspective(1000px) rotateY(0deg)';
        }, 1000);
    }
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            item.classList.toggle('active');
        });
    });
}

function setupAndroidHint() {
    const phoneTypeSelect = document.getElementById('phone_type');
    const androidHint = document.getElementById('android-email-hint');

    if (phoneTypeSelect && androidHint) {
        phoneTypeSelect.addEventListener('change', (e) => {
            androidHint.style.display = e.target.value === 'android' ? 'block' : 'none';
        });
    }
}

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

    emailInput.addEventListener('blur', (e) => {
        const email = e.target.value.trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            e.target.setCustomValidity('Please enter a valid email address');
        } else {
            e.target.setCustomValidity('');
        }
    });
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

function calculateDaysUntil(dateString) {
    if (!dateString) return 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 0;
    return Math.max(1, diffDays);
}

function formatDateForDisplay(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function switchFormat(format, evt) {
    const buttons = document.querySelectorAll('.format-toggle button');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (evt && evt.target) {
        evt.target.classList.add('active');
    }

    if (format === 'physical') {
        document.getElementById('physicalCalc').style.display = 'block';
        document.getElementById('audioCalc').style.display = 'none';
        document.getElementById('physicalBookCard').style.display = 'block';
        document.getElementById('audioBookCard').style.display = 'none';
    } else {
        document.getElementById('physicalCalc').style.display = 'none';
        document.getElementById('audioCalc').style.display = 'block';
        document.getElementById('physicalBookCard').style.display = 'none';
        document.getElementById('audioBookCard').style.display = 'block';
    }
}

function getPaceIndicator(value, thresholds) {
    if (value <= thresholds.comfortable) {
        return { background: '#B8A9D9', text: thresholds.comfortableText };
    } else if (value <= thresholds.tight) {
        return { background: '#E8B4A0', text: thresholds.tightText };
    } else {
        return { background: '#E8B4B8', text: 'reach out to publisher' };
    }
}

function calculatePhysical() {
    const pages = parseInt(document.getElementById('demoPages').value) || 384;
    const dateString = document.getElementById('demoDays').value;
    const days = calculateDaysUntil(dateString);
    const pagesPerDay = Math.ceil(pages / days);

    document.getElementById('resultNumber').textContent = pagesPerDay;
    document.getElementById('physicalMetric').textContent = pagesPerDay;
    document.getElementById('physicalDaysNumber').textContent = days;
    if (dateString) {
        document.getElementById('physicalDueDate').textContent = formatDateForDisplay(dateString);
    }

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

function calculateAudio() {
    const hours = parseFloat(document.getElementById('demoHours').value) || 11.5;
    const dateString = document.getElementById('demoAudioDays').value;
    const days = calculateDaysUntil(dateString);
    const minutesPerDay = Math.ceil((hours * 60) / days);

    document.getElementById('resultAudioNumber').textContent = minutesPerDay;
    document.getElementById('audioMetric').textContent = minutesPerDay;
    document.getElementById('audioDaysNumber').textContent = days;
    if (dateString) {
        document.getElementById('audioDueDate').textContent = formatDateForDisplay(dateString);
    }

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
