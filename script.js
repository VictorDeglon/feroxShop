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

    // Cart and Modal logic
    const cartBtn = document.createElement('button');
    // Try to hook into nav to add cart action element if not present
    const navContainer = document.querySelector('.nav-container');
    if (navContainer && !document.querySelector('.nav-actions')) {
        const actions = document.createElement('div');
        actions.className = 'nav-actions';
        actions.innerHTML = '<button class="cart-btn">Cart <span class="cart-count">0</span></button>';
        navContainer.appendChild(actions);
    }

    const cartOpenBtn = document.querySelector('.cart-btn');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartClose = document.querySelector('.cart-close');
    const cartItemsEl = document.querySelector('.cart-items');
    const cartEmptyEl = document.querySelector('.cart-empty');
    const cartCountEl = document.querySelector('.cart-count');
    const cartTotalEl = document.querySelector('.cart-total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');

    let cart = [];

    function formatCurrency(n) {
        return '$' + Number(n).toFixed(2);
    }

    function getProductDataFromCard(btn) {
        const card = btn.closest('.product-card');
        if (!card) return null;
        const title = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : 'Product';
        const priceText = card.querySelector('.product-price') ? card.querySelector('.product-price').textContent.trim() : '$0.00';
        const price = parseFloat(priceText.replace(/[^0-9\.]/g, '')) || 0;
        const desc = card.querySelector('.product-desc') ? card.querySelector('.product-desc').textContent.trim() : '';
        return { title, price, desc };
    }

    function addToCart(item) {
        const existing = cart.find(i => i.title === item.title);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        renderCart();
        // quick visual feedback on add buttons
        const matchingButtons = Array.from(document.querySelectorAll('.product-card')).filter(card => {
            const t = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '';
            return t === item.title;
        });
        matchingButtons.forEach(card => {
            const btn = card.querySelector('.btn-small');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = '✓ Added';
                btn.style.backgroundColor = 'rgba(255,68,68,0.85)';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                }, 1400);
            }
        });
    }

    function renderCart() {
        cartItemsEl.innerHTML = '';
        if (cart.length === 0) {
            cartEmptyEl.style.display = 'block';
            cartCountEl.textContent = '0';
            cartTotalEl.textContent = formatCurrency(0);
            return;
        }
        cartEmptyEl.style.display = 'none';
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.qty;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div style="flex:1">
                    <div class="item-title">${item.title}</div>
                    <div class="item-qty">${item.qty} × ${formatCurrency(item.price)}</div>
                </div>
                <div style="text-align:right">
                    <div class="item-sub">${formatCurrency(item.price * item.qty)}</div>
                    <button class="btn btn-small cart-remove" data-title="${encodeURIComponent(item.title)}">Remove</button>
                </div>
            `;
            cartItemsEl.appendChild(itemEl);
        });
        cartCountEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
        cartTotalEl.textContent = formatCurrency(total);

        // attach remove handlers
        cartItemsEl.querySelectorAll('.cart-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const t = decodeURIComponent(btn.getAttribute('data-title'));
                cart = cart.filter(i => i.title !== t);
                renderCart();
            });
        });
    }

    function openCart() {
        if (!cartDrawer) return;
        cartDrawer.setAttribute('aria-hidden', 'false');
        cartDrawer.classList.add('open');
    }

    function closeCart() {
        if (!cartDrawer) return;
        cartDrawer.setAttribute('aria-hidden', 'true');
        cartDrawer.classList.remove('open');
    }

    if (cartOpenBtn) {
        cartOpenBtn.addEventListener('click', () => {
            renderCart();
            openCart();
        });
    }

    if (cartClose) cartClose.addEventListener('click', closeCart);

    // Checkout flow (simple simulated)
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty. Add some gear first.');
                return;
            }
            // Simulate checkout
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'Processing...';
            setTimeout(() => {
                alert('Checkout complete — thank you for your order!');
                cart = [];
                renderCart();
                closeCart();
                checkoutBtn.disabled = false;
                checkoutBtn.textContent = 'Checkout';
            }, 1100);
        });
    }

    // Product modal: open when title or image clicked
    const productModal = document.querySelector('.product-modal');
    const modalTitle = document.querySelector('.modal-title');
    const modalPrice = document.querySelector('.modal-price');
    const modalDesc = document.querySelector('.modal-desc');
    const modalImage = document.querySelector('.modal-image');
    const modalAddBtn = document.querySelector('.modal-add-to-cart');
    const modalClose = document.querySelector('.modal-close');

    function openModal(data) {
        if (!productModal) return;
        modalTitle.textContent = data.title;
        modalPrice.textContent = formatCurrency(data.price);
        modalDesc.textContent = data.desc;
        // use placeholder styling for image
        productModal.classList.add('open');
        productModal.setAttribute('aria-hidden', 'false');
        // attach add handler
        modalAddBtn.onclick = () => { addToCart(data); };
    }

    function closeModal() {
        if (!productModal) return;
        productModal.classList.remove('open');
        productModal.setAttribute('aria-hidden', 'true');
    }

    modalClose && modalClose.addEventListener('click', closeModal);
    document.querySelectorAll('.modal-backdrop').forEach(b => b.addEventListener('click', closeModal));

    // Wire add-to-cart buttons to cart logic and open modal on image/title
    document.querySelectorAll('.btn-small').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const data = getProductDataFromCard(this);
            if (data) addToCart(data);
        });
    });

    document.querySelectorAll('.product-card .product-image, .product-card .product-info h3').forEach(el => {
        el.addEventListener('click', function (e) {
            const card = this.closest('.product-card');
            if (!card) return;
            const data = getProductDataFromCard(card);
            if (data) openModal(data);
        });
    });

    // Initial render
    renderCart();

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
