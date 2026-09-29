/* Shared behaviour for the subpages: honour the theme chosen on the portfolio
   home page, and wire the optional toggle button in the page header. */
(function () {
    var root = document.documentElement;
    var toggle = document.querySelector('.theme-toggle');

    function apply(theme, persist) {
        if (theme !== 'light' && theme !== 'dark') return;
        root.setAttribute('data-theme', theme);
        if (toggle) {
            toggle.setAttribute('aria-pressed', String(theme === 'light'));
            toggle.setAttribute('title', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
        }
        if (persist) {
            try { localStorage.setItem('uk-theme', theme); } catch (err) { /* private mode */ }
        }
    }

    if (toggle) {
        toggle.addEventListener('click', function () {
            apply(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
        });
        apply(root.getAttribute('data-theme') ||
            (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'), false);
    }

    /* Keep the mobile drawer's state readable for assistive tech. */
    var drawer = document.querySelector('.nav-links');
    var burger = document.querySelector('.mobile-nav-toggle');
    if (drawer && burger) {
        new MutationObserver(function () {
            burger.setAttribute('aria-expanded', String(drawer.classList.contains('active')));
            var icon = burger.querySelector('i');
            if (icon) icon.className = drawer.classList.contains('active') ? 'fas fa-xmark' : 'fas fa-bars';
        }).observe(drawer, { attributes: true, attributeFilter: ['class'] });
    }
})();
