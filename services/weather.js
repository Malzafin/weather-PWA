// Konfiguracja: klucz API OWM
const OWM_API_KEY = 'fab91f1b851104105bf6f56b19676548';
const OWM_BASE = 'https://api.openweathermap.org/data/2.5/weather';

// Lokalizacja: geolokacja przeglądarki
export function getLocation(options = {}) {
    const opts = { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000, ...options };
    return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: lon } = pos.coords;
                resolve({ lat, lon });
            },
            (err) => reject(new Error(err.message || 'Geolocation error')),
            opts
        );
    });
}

export async function fetchOpenWeather({ lat, lon }) {
    if (lat == null || lon == null) throw new Error('Missing coordinates');
    const url = `${OWM_BASE}?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&lang=en&appid=${OWM_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenWeather error ${res.status}`);
    const data = await res.json();
    const w = (data.weather && data.weather[0]) || {};

    return {
        city: data.name || null,
        temp: Math.round(data.main?.temp ?? 0),
        description: w.description ?? '',
        icon: w.icon ?? null,
    };
}

// Pogoda: pobranie z OpenWeather
export async function fetchOpenWeatherByCity( city = 'Warsaw') {
    const url = `${OWM_BASE}?q=${encodeURIComponent(city)}&units=metric&lang=en&appid=${OWM_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenWeather error ${res.status}`);
    const data = await res.json();
    const w = data.weather?.[0] ?? {};

    return {
        city: data.name || city,
        temp: Math.round(data.main?.temp ?? 0),
        description: w?.description ?? '',
        icon: w?.icon ?? null
    };
}