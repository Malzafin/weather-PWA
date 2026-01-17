// ui/renderSettings.js
import { getState, subscribe, reset, updateWeather } from '../state/weatherState.js';
import { permission, request, notify } from '../services/notifications.js';
import { canInstall, requestInstall } from '../services/install.js';

// punkt montowania
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

// widok
function view(s) {
    const when = s.updatedAt ? new Date(s.updatedAt).toLocaleString() : '—';
    const perm = permission();
    const offline = !navigator.onLine;
    const installReady = canInstall();

    return `
    <div>
      <p><strong>Last update:</strong> ${when}</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button id="btn-refresh-settings" ${offline ? 'disabled' : ''}>${offline ? 'Offline' : 'Refresh'}</button>
        <button id="btn-clear">Clear saved data</button>
        <button id="btn-notif-enable" ${perm === 'granted' ? 'disabled' : ''}>Enable notifications</button>
        <button id="btn-notif-test" ${perm !== 'granted' ? 'disabled' : ''}>Send test</button>
        <button id="btn-install" ${installReady ? '' : 'disabled'}>Install app</button>
      </div>
      <p><small>Notifications: ${perm}</small></p>
      <p><small>Install: ${installReady ? 'ready' : 'unavailable (iOS Safari)'}</small></p>
    </div>
  `;
}

// render + zdarzenia
export function renderSettings() {
    const m = mountPoint();
    if (!m) return;
    m.innerHTML = view(getState());

    const btnRefresh = m.querySelector('#btn-refresh-settings');
    const btnClear   = m.querySelector('#btn-clear');
    const btnEnable  = m.querySelector('#btn-notif-enable');
    const btnTest    = m.querySelector('#btn-notif-test');
    const btnInstall = m.querySelector('#btn-install');

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

    if (btnInstall) btnInstall.addEventListener('click', async () => {
        await requestInstall();
        renderSettings();
    });
}

// init
export function initSettings() {
    renderSettings();
    subscribe(() => renderSettings());
    window.addEventListener('beforeinstallprompt', () => renderSettings());
    window.addEventListener('appinstalled', () => renderSettings());
    window.addEventListener('install-choice', () => renderSettings());
}
