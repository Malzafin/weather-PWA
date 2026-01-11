// Home: inicjalizacja i render
import { getState, subscribe, updateWeather } from '../state/weatherState.js';

const root = document.querySelector('#home');

function view(s) {
    const city = s.location?.city ?? '—';
    const temp = s.current?.temp != null ? `${s.current.temp}°C` : '—';
    const desc = s.current?.description ?? '';
    const when = s.updatedAt ? new Date(s.updatedAt).toLocaleTimeString() : '';
    const loading = s.status === 'loading';

    return `
    <div>
      <p><strong>Location:</strong> ${city}</p>
      <p><strong>Temperature:</strong> ${temp}</p>
      <p><strong>Description:</strong> ${desc}</p>
      ${when ? `<p><small>Updated: ${when}</small></p>` : ''}
      ${s.error ? `<p style="color:#b00020"><small>${s.error}</small></p>` : ''}
      <button id="btn-refresh" ${loading ? 'disabled' : ''}>
        ${loading ? 'Refreshing…' : 'Refresh'}
      </button>
    </div>
  `;
}

function render(s) {
    if (!root) return;
    root.innerHTML = view(s);
    const btn = root.querySelector('#btn-refresh');
    if (btn) btn.addEventListener('click', () => updateWeather());
}

export function initHome() {
    render(getState());
    subscribe(render);
}
