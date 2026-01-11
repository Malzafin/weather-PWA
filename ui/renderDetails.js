// Details: inicjalizacja i render
import { getState, subscribe } from '../state/weatherState.js';

const section = document.querySelector('section[data-screen="details"]');
function mountPoint() {
    if (!section) return null;
    let m = section.querySelector('.js-content');
    if (!m) {
        m = document.createElement('div');
        m.className = 'js-content';
        section.appendChild(m);
    }
    return m;
}

function view(s) {
    const city = s.location?.city ?? '—';
    const temp = s.current?.temp != null ? `${s.current.temp}°C` : '—';
    const desc = s.current?.description ?? '';
    const icon = s.current?.icon
        ? `https://openweathermap.org/img/wn/${s.current.icon}@4x.png`
        : null;
    return `
    <p><strong>Location:</strong> ${city}</p>
    <p><strong>Temperature:</strong> ${temp}</p>
    <p><strong>Description:</strong> ${desc}</p>
    ${icon ? `<img alt="${desc}" src="${icon}" width="128" height="128">` : ''}
  `;
}

function render(s) {
    const m = mountPoint();
    if (!m) return;
    m.innerHTML = view(s);
}

export function initDetails() {
    render(getState());
    subscribe(render);
}
