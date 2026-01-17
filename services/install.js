// Install — trzymanie eventu i prosty interfejs
let deferred = null;

export function hookInstallEvents() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferred = e;
        window.dispatchEvent(new CustomEvent('install-available'));
    });

    window.addEventListener('appinstalled', () => {
        deferred = null;
        window.dispatchEvent(new CustomEvent('installed'));
    });
}

export function canInstall() {
    return !!deferred;
}

export async function requestInstall() {
    if (!deferred) return { outcome: 'unavailable' };
    const ev = deferred;
    deferred = null;
    await ev.prompt();
    const choice = await ev.userChoice;

    window.dispatchEvent(new CustomEvent('install-choice', { detail: choice }));
    return choice;
}
