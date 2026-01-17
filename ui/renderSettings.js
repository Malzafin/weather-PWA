// Settings / History
import { getState, subscribe, reset, updateWeather } from '../state/weatherState.js';
import { permission, request, notify } from '../services/notifications.js';

// Punkt montowania zawartości sekcji settings
function mountPoint() {
    const section = document.querySelector('section[data-screen="settings"]');
    if (!section) return null;
    let m = section.querySelector('.js-content');
    if (!m) {
        m = document.createElement('div');
        m.className = 'js-content';
        section.appendChild(m);
    }
    return m;
}

// Widok
function view(s) {
    const when = s.updatedAt ? new Date(s.updatedAt).toLocaleString() : '—';
    const perm = permission();
    const offline = !navigator.onLine;
    return `
    <div>
      <p><strong>Last update:</strong> ${when}</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button id="btn-refresh-settings" ${offline ? 'disabled' : ''}>Refresh</button>
        </button>
        <button id="btn-clear">Clear saved data</button>
        <button id="btn-notif-enable" ${perm === 'granted' ? 'disabled' : ''}>Enable notifications</button>
        <button id="btn-notif-test" ${perm !== 'granted' ? 'disabled' : ''}>Send test</button>
      </div>
      <p><small>Notifications: ${perm}</small></p>
    </div>
  `;
}

// Render + zdarzenia
export function renderSettings() {
    const m = mountPoint();
    if (!m) return;
    m.innerHTML = view(getState());

    const btnRefresh = m.querySelector('#btn-refresh-settings');
    const btnClear   = m.querySelector('#btn-clear');
    const btnEnable  = m.querySelector('#btn-notif-enable');
    const btnTest    = m.querySelector('#btn-notif-test');

    if (btnRefresh) btnRefresh.addEventListener('click', async () => {
        await updateWeather();
        renderSettings();
    });

    if (btnClear) btnClear.addEventListener('click', () => {
        reset();
        renderSettings();
    });

    if (btnEnable) btnEnable.addEventListener('click', async () => {
        await request();
        renderSettings();
    });

    if (btnTest) btnTest.addEventListener('click', async () => {
        await notify('Weather PWA', { body: 'Test notification' });
    });
}

// Inicjalizacja i subskrypcja zmian stanu
export function initSettings() {
    renderSettings();
    subscribe(() => renderSettings());
}
