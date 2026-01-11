// Router: sekcje i linki
const SCREENS = new Map(
    [...document.querySelectorAll('section[data-screen]')].map((el) => [el.dataset.screen, el])
);
const NAV_LINKS = [...document.querySelectorAll('nav a[href^="#"]')];

// Router: logika (przełączanie)
function getActiveId() {
    const id = window.location.hash.replace('#', '').trim();
    return id && SCREENS.has(id) ? id : 'home';
}

function showScreen(id) {
    for (const [name, el] of SCREENS) el.hidden = name !== id;
    NAV_LINKS.forEach((a) => {
        const isActive = a.getAttribute('href').slice(1) === id;
        a.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
}

// Router: start i przy zmianie
window.addEventListener('hashchange', () => showScreen(getActiveId()));
document.addEventListener('DOMContentLoaded', () => showScreen(getActiveId()));
