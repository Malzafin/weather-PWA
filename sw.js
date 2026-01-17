// Cache: nazwa i pliki aplikacji
const CACHE_NAME = 'weather-pwa-v3';
const APP_SHELL = [
    'index.html',
    'styles.css',
    'main.js',
    'manifest.webmanifest',
    'offline.html',
    'ui/renderHome.js',
    'ui/renderDetails.js',
    'ui/renderSettings.js',
    'state/weatherState.js',
    'services/weather.js',
    'services/notifications.js',
    'icons/icon-192.png',
    'icons/icon-512.png'
];

// Instalacja: pre-cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
    );
});

// Aktywacja: cleanup starych cache’y
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
        ).then(() => self.clients.claim())
    );
});

// Tylko GET po http/https
function isHttpGet(req) {
    return req.method === 'GET' && (req.url.startsWith('http://') || req.url.startsWith('https://'));
}

// Network-first dla stron (offline fallback)
function handleNavigate(event) {
    return fetch(event.request).catch(() => caches.match('offline.html'));
}

// Network-first z cache fallback (OpenWeather)
function handleNetworkFirst(event) {
    return fetch(event.request)
        .then((res) => {
            if (res && res.ok) {
                const copy = res.clone();
                event.waitUntil(
                    caches.open(CACHE_NAME).then((c) => c.put(event.request, copy))
                );
            }
            return res;
        })
        .catch(() => caches.match(event.request));
}

// Cache-first dla statycznych
function handleCacheFirst(event) {
    return caches.match(event.request).then((hit) => {
        if (hit) return hit;
        return fetch(event.request)
            .then((res) => {
                if (res && res.ok) {
                    const copy = res.clone();
                    event.waitUntil(
                        caches.open(CACHE_NAME).then((c) => c.put(event.request, copy))
                    );
                }
                return res;
            })
            .catch(() => caches.match('offline.html'));
    });
}

// Obsługa fetch
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (!isHttpGet(req)) return; // ignoruj chrome-extension:, data:, blob:, POST, itp.

    const url = new URL(req.url);

    if (req.mode === 'navigate') {
        event.respondWith(handleNavigate(event));
        return;
    }

    if (url.origin.includes('openweathermap.org')) {
        event.respondWith(handleNetworkFirst(event));
        return;
    }

    event.respondWith(handleCacheFirst(event));
});
