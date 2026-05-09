document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initScrollAnimations();
    initPortfolioFilter();
    initStatsCounter();
    initSmoothScroll();
    initContactForm();
    initTestimonialsSlider();
    initLightbox();
    initCopyrightYear();
});

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const handleScroll = throttle(function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 50);

    window.addEventListener('scroll', handleScroll);

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            hamburger.setAttribute('aria-label',
                document.body.classList.contains('menu-open')
                    ? 'Închide meniul'
                    : 'Deschide meniul'
            );
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            if (hamburger) {
                hamburger.setAttribute('aria-label', 'Deschide meniul');
            }

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.aosDelay || 0;

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveLink = throttle(function() {
        let current = '';
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.clientHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }, 100);

    window.addEventListener('scroll', updateActiveLink);
}

function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            portfolioItems.forEach(item => {
                const category = item.dataset.category;

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px)';

                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
        });
    });
}

function initStatsCounter() {
    const statItems = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.dataset.count);

                animateCounter(target, 0, countTo, 2000);

                obs.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });

    statItems.forEach(item => observer.observe(item));
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;

    const timer = setInterval(() => {
        current += increment * Math.ceil(range / 50);

        if (current >= end) {
            current = end;
            clearInterval(timer);
        }

        element.textContent = current;
    }, Math.max(stepTime, 30));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            if (this.getAttribute('action') && this.getAttribute('action') !== '#') {
                return;
            }
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            showNotification('Mesajul a fost trimis cu succes! Vom contacta în curând.', 'success');

            form.reset();
        });
    }
}

function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = '<div class="notification-content"><span>' + message + '</span><button class="notification-close">&times;</button></div>';

    notification.style.cssText = [
        'position: fixed',
        'top: 20px',
        'right: 20px',
        'padding: 1rem 1.5rem',
        'background: rgb(200, 168, 130)',
        'color: white',
        'border-radius: 8px',
        'box-shadow: 0 4px 20px rgba(0,0,0,0.15)',
        'z-index: 10000',
        'animation: fadeInUp 0.3s ease'
    ].join(';');

    document.body.appendChild(notification);

    setTimeout(function() {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);

    var closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
    }
}

function initTestimonialsSlider() {
    const slider = document.getElementById('testimonials-slider');
    if (!slider) return;

    const cards = slider.querySelectorAll('.testimonial-card');
    if (cards.length <= 1) return;

    const dotsContainer = document.getElementById('testimonial-dots');
    const prevBtn = document.querySelector('.testimonial-arrow-prev');
    const nextBtn = document.querySelector('.testimonial-arrow-next');
    let currentIndex = 0;
    let autoplayInterval;

    cards.forEach(function(card) {
        card.style.flex = '0 0 100%';
    });

    slider.style.display = 'flex';
    slider.style.overflow = 'hidden';
    slider.style.scrollBehavior = 'smooth';

    function goTo(index) {
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        currentIndex = index;
        slider.scrollTo({ left: slider.clientWidth * currentIndex, behavior: 'smooth' });
        updateDots();
    }

    function updateDots() {
        dotsContainer.querySelectorAll('.dot').forEach(function(dot, i) {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (var i = 0; i < cards.length; i++) {
            var dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
            dot.addEventListener('click', function(idx) {
                return function() { goTo(idx); };
            }(i));
            dotsContainer.appendChild(dot);
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { goTo(currentIndex - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goTo(currentIndex + 1); resetAutoplay(); });

    function startAutoplay() {
        autoplayInterval = setInterval(function() { goTo(currentIndex + 1); }, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    startAutoplay();

    cards.forEach(function(card) {
        card.addEventListener('mouseenter', function() { clearInterval(autoplayInterval); });
        card.addEventListener('mouseleave', function() { startAutoplay(); });
    });
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const items = document.querySelectorAll('.portfolio-item');
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        const img = items[index].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = items.length - 1;
        if (newIndex >= items.length) newIndex = 0;
        openLightbox(newIndex);
    }

    items.forEach(function(item, index) {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', function() { navigateLightbox(-1); });
    nextBtn.addEventListener('click', function() { navigateLightbox(1); });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function initCopyrightYear() {
    var yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(function() { inThrottle = false; }, limit);
        }
    };
}