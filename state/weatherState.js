import { getLocation, fetchOpenWeather, fetchOpenWeatherByCity } from '../services/weather.js';
import { notify } from '../services/notifications.js';

// State: dane początkowe
const initialState = {
    status: 'idle',
    error: null,
    location: null, // { lat, lon, city, district }
    current: null,  // { temp, description, icon }
    updatedAt: null
};

// State: klucz w pamięci
const STORAGE_KEY = 'weather-state-v1';

// State: odczyt i zapis
function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}
function save(s) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {}
}

// State: wartości bieżące
let state = load() ?? { ...initialState };
if (state.current && state.location) state.status = state.status || 'ready';
const listeners = new Set();

// API: get/set/subscribe/reset
export function getState() {
    return state;
}
export function setState(patch) {
    state = { ...state, ...patch };
    save(state);
    listeners.forEach((fn) => fn(state));
}
export function subscribe(fn) {
    listeners.add(fn);
    fn(state);
    return () => listeners.delete(fn);
}
export function reset() {
    state = { ...initialState };
    save(state);
    listeners.forEach((fn) => fn(state));
}

// Akcje: błędy
export function setError(err) {
    setState({ status: 'error', error: String(err) });
}
export function clearError() {
    setState({ error: null });
}

const FALLBACK_CITY = 'Warsaw'

// Akcje: aktualizacja pogody
export async function updateWeather() {
    setState({ status: 'loading' });
    clearError();

    try {
        let w;
        try {
            const { lat, lon } = await getLocation();
            w = await fetchOpenWeather({ lat, lon });
            setState({ location: { lat, lon, city: w.city, district: null } });
        } catch (geoErr) {

            w = await fetchOpenWeatherByCity(FALLBACK_CITY);
            setState({ location: { lat: null, lon: null, city: w.city, district: null } });
        }

        // stan aplikacji
        setState({
            status: 'ready',
            current: { temp: w.temp, description: w.description, icon: w.icon },
            updatedAt: Date.now(),
            error: null
        });


        await notify('Weather updated', {
            body: `${w.city ?? ''}: ${w.temp}°C ${w.description}`.trim()
        });

    } catch (err) {
        const hasCache = !!state.current && !!state.location;
        if (hasCache) {
            setState({ status: 'ready', error: String(err) });
        } else {
            setError(err);
        }
    }
}
