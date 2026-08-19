// HMC Internship page interactions
(function () {
    'use strict';

    document.documentElement.classList.add('js');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', function () {
        const navbar = document.querySelector('.navbar');
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;

        /* ---------- Navbar shadow on scroll ---------- */
        const onScroll = () => {
            if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 8);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        /* ---------- Mobile menu ---------- */
        function closeMenu() {
            if (navLinks) navLinks.classList.remove('open');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Open navigation menu');
            }
            if (menuIcon) menuIcon.className = 'fas fa-bars';
        }

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', function () {
                const isOpen = navLinks.classList.toggle('open');
                menuToggle.setAttribute('aria-expanded', String(isOpen));
                menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
                if (menuIcon) menuIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            });

            navLinks.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', closeMenu);
            });

            document.addEventListener('click', function (e) {
                if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                    closeMenu();
                }
            });

            window.addEventListener('resize', function () {
                if (window.innerWidth > 768) closeMenu();
            });
        }

        /* ---------- Smooth scrolling for anchor links ---------- */
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId.length < 2) return;

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();
                const top = targetElement.getBoundingClientRect().top + window.pageYOffset - 72;
                window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
            });
        });

        /* ---------- Scrollspy ---------- */
        const sections = document.querySelectorAll('main section[id]');
        const navItems = navLinks ? navLinks.querySelectorAll('a[href^="#"]') : [];

        function highlightNav() {
            const pos = window.scrollY + 100;
            let current = '';

            sections.forEach(function (section) {
                if (pos >= section.offsetTop) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(function (item) {
                const isActive = item.getAttribute('href') === '#' + current;
                item.classList.toggle('active', isActive);
                if (isActive) item.setAttribute('aria-current', 'true');
                else item.removeAttribute('aria-current');
            });
        }

        if (navItems.length) {
            highlightNav();
            window.addEventListener('scroll', highlightNav, { passive: true });
        }

        /* ---------- Reveal on scroll ---------- */
        const revealEls = document.querySelectorAll('.reveal');

        if (reduceMotion || !('IntersectionObserver' in window)) {
            revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        } else {
            const revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            revealEls.forEach(function (el) { revealObserver.observe(el); });
        }

        /* ---------- Lightbox ---------- */
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxSource = document.getElementById('lightbox-source');

        function openLightbox(imageUrl, caption, sourceUrl, sourceLabel) {
            if (!lightbox) return;
            lightboxImage.src = imageUrl;
            lightboxCaption.textContent = caption || 'Machine / process';
if (lightboxSource && sourceUrl) {
                lightboxSource.href = sourceUrl;
                const label = lightboxSource.querySelector('span');
                if (label) label.textContent = sourceLabel || 'View machine info';
                lightboxSource.style.display = 'inline-flex';
            } else if (lightboxSource) {
                lightboxSource.style.display = 'none';
            }
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            if (!lightbox) return;
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        window.openLightbox = openLightbox;
        window.closeLightbox = closeLightbox;

        document.querySelectorAll('.lightbox-close').forEach(function (el) {
            el.addEventListener('click', closeLightbox);
        });
        if (lightbox) {
            lightbox.addEventListener('click', function (e) {
                if (e.target === lightbox) closeLightbox();
            });
        }
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeLightbox();
        });
    });
})();
