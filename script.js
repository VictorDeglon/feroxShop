// ========================================
// FEROX Fitness - Interactivity
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.borderBottomColor = 'rgba(255, 68, 68, 0.4)';
        } else {
            navbar.style.borderBottomColor = 'rgba(255, 68, 68, 0.2)';
        }
    });

    // Add scroll animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe product cards and testimonial cards
    const cards = document.querySelectorAll('.product-card, .testimonial-card, .hero-banner');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.borderRadius = '50%';
            ripple.style.pointerEvents = 'none';
            ripple.style.transform = 'translate(-50%, -50%)';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            const animation = ripple.animate([
                { width: '0', height: '0', opacity: 1 },
                { width: '400px', height: '400px', opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });

            animation.onfinish = () => {
                ripple.remove();
            };
        });
    });

    // Add to cart feedback
    const cartButtons = document.querySelectorAll('.btn-small');
    cartButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const originalText = this.textContent;
            this.textContent = '✓ Added to Cart';
            this.style.backgroundColor = 'rgba(255, 68, 68, 0.8)';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 2000);
        });
    });

    // Parallax effect on hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                hero.style.backgroundPosition = '0 ' + (scrolled * 0.5) + 'px';
            }
        });
    }

    // Dynamic year in footer
    const currentYear = new Date().getFullYear();
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
        footerText.textContent = `© ${currentYear} FEROX Fitness. All rights reserved. Built for champions.`;
    }

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        }
    });

    // Performance: Lazy load images (if added in future)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Accessible focus management
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea'
    );

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            // Focus management is handled by browser defaults
            // This ensures proper tab order
        }
    });

    console.log('FEROX Fitness - Ready for action! 🔥');
});

// Utility function for smooth scroll
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
