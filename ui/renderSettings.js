// Settings: inicjalizacja i render
import { getState, subscribe, reset, updateWeather } from '../state/weatherState.js';

const section = document.querySelector('section[data-screen="settings"]');
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
    const when = s.updatedAt ? new Date(s.updatedAt).toLocaleString() : '—';
    return `
    <p><strong>Last update:</strong> ${when}</p>
    <div style="display:flex; gap:8px;">
      <button id="btn-refresh-settings">Refresh</button>
      <button id="btn-clear">Clear saved data</button>
    </div>
  `;
}

function render(s) {
    const m = mountPoint();
    if (!m) return;
    m.innerHTML = view(s);
    const btn1 = m.querySelector('#btn-refresh-settings');
    const btn2 = m.querySelector('#btn-clear');
    if (btn1) btn1.addEventListener('click', () => updateWeather());
    if (btn2) btn2.addEventListener('click', () => reset());
}

export function initSettings() {
    render(getState());
    subscribe(render);
}
