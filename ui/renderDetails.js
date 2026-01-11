// Details: inicjalizacja i render
import { getState, subscribe } from '../state/weatherState.js';

const root = document.querySelector('#details');

function view(s) {
    const city = s.location?.city ?? '—';
    const temp = s.current?.temp != null ? `${s.current.temp}°C` : '—';
    const desc = s.current?.description ?? '';
    const icon = s.current?.icon
        ? `https://openweathermap.org/img/wn/${s.current.icon}@4x.png`
        : null;

    return `
    <div>
      <p><strong>Location:</strong> ${city}</p>
      <p><strong>Temperature:</strong> ${temp}</p>
      <p><strong>Description:</strong> ${desc}</p>
      ${icon ? `<img alt="${desc}" src="${icon}" width="128" height="128">` : ''}
    </div>
  `;
}

function render(s) {
    if (!root) return;
    root.innerHTML = view(s);
}

export function initDetails() {
    render(getState());
    subscribe(render);
}
