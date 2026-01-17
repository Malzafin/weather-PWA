// Importy UI i stanu
import { getState, updateWeather } from './state/weatherState.js';
import { initHome } from './ui/renderHome.js';
import { initDetails } from './ui/renderDetails.js';
import { initSettings } from './ui/renderSettings.js';
import {initOfflineBanner } from './ui/offlineBanner.js';


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

// Start
function boot() {
    SCREENS = collectScreens();
    initOfflineBanner();
    initHome();
    initDetails();
    initSettings();
    showScreen(getActiveId());
    if (getState().status === 'idle') updateWeather();
}
window.addEventListener('hashchange', () => showScreen(getActiveId()));
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else if (document.readyState === 'interactive') {
    queueMicrotask(boot);
} else {
    boot();
}

// PWA: rejestracja Service Workera
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}
