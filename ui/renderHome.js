// Home: inicjalizacja i render
import { getState, subscribe, updateWeather } from '../state/weatherState.js';

const section = document.querySelector('section[data-screen="home"]');
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
    const when = s.updatedAt ? new Date(s.updatedAt).toLocaleTimeString() : '';
    const loading = s.status === 'loading';
    return `
    <p><strong>Location:</strong> ${city}</p>
    <p><strong>Temperature:</strong> ${temp}</p>
    ${when ? `<p><small>Updated: ${when}</small></p>` : ''}
    ${s.error ? `<p style="color:#b00020"><small>${s.error}</small></p>` : ''}
    <button id="btn-refresh" ${loading ? 'disabled' : ''}>
      ${loading ? 'Refreshing…' : 'Refresh'}
    </button>
  `;
}

function render(s) {
    const m = mountPoint();
    if (!m) return;
    m.innerHTML = view(s);
    const btn = m.querySelector('#btn-refresh');
    if (btn) btn.addEventListener('click', () => updateWeather());
}

export function initHome() {
    render(getState());
    subscribe(render);
}
