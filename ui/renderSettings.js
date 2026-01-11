// Settings: inicjalizacja i render
import { getState, subscribe, reset, updateWeather } from '../state/weatherState.js';

const root = document.querySelector('#settings');

function view(s) {
    const when = s.updatedAt ? new Date(s.updatedAt).toLocaleString() : '—';
    return `
    <div>
      <p><strong>Last update:</strong> ${when}</p>
      <div style="display:flex; gap:8px;">
        <button id="btn-refresh-settings">Refresh</button>
        <button id="btn-clear">Clear saved data</button>
      </div>
    </div>
  `;
}

function render(s) {
    if (!root) return;
    root.innerHTML = view(s);
    const btn1 = root.querySelector('#btn-refresh-settings');
    const btn2 = root.querySelector('#btn-clear');
    if (btn1) btn1.addEventListener('click', () => updateWeather());
    if (btn2) btn2.addEventListener('click', () => reset());
}

export function initSettings() {
    render(getState());
    subscribe(render);
}
