// Router: sekcje i linki
function collectScreens() {
    const byData = [...document.querySelectorAll('section[data-screen]')];
    if (byData.length) return new Map(byData.map((el) => [el.dataset.screen, el]));
    const ids = ['home', 'details', 'settings'];
    return new Map(ids.map((id) => [id, document.getElementById(id)]).filter(([, el]) => el));
}
let SCREENS = collectScreens();
const NAV_LINKS = [...document.querySelectorAll('nav a[href^="#"]')];

// Router: logika
function getActiveId() {
    const raw = window.location.hash.replace('#', '').trim();
    return raw && SCREENS.has(raw) ? raw : 'home';
}
function showScreen(id) {
    for (const [name, el] of SCREENS) if (el) el.hidden = name !== id;
    NAV_LINKS.forEach((a) => {
        const isActive = a.getAttribute('href').slice(1) === id;
        a.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
}

// Router: start
function boot() {
    SCREENS = collectScreens();
    showScreen(getActiveId());
}
window.addEventListener('hashchange', () => showScreen(getActiveId()));
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else if (document.readyState === 'interactive') {
    queueMicrotask(boot);
} else {
    boot();
}
