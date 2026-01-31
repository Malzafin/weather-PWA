# Weather PWA – aplikacja pogodowa (HTML/CSS/JS)

Lekka aplikacja PWA działająca w przeglądarce i dająca się **zainstalować** jak natywna.
Pobiera bieżącą pogodę z OpenWeatherMap na podstawie **geolokalizacji** użytkownika,
obsługuje **tryb offline** (Service Worker + Cache API) i **powiadomienia**.  
Projekt przygotowany jako zaliczenie na przedmiot „Języki programowania urządzeń mobilnych”.

---

## Spis treści

- [Funkcjonalności](#funkcjonalności)
- [Architektura i struktura plików](#architektura-i-struktura-plików)
- [Technologie](#technologie)
- [Uruchomienie lokalne](#uruchomienie-lokalne)
- [Build / Deploy (Netlify)](#build--deploy-netlify)
- [Jakość](#jakość)
- [Obsługiwane przeglądarki i instalacja](#obsługiwane-przeglądarki-i-instalacja)
- [Autor](#autor)

---

## Funkcjonalności

- **Geolokalizacja** – pobieranie współrzędnych urządzenia i wywołanie API OWM.
- **Pobieranie pogody** – temperatura, opis, ikona, nazwa miejscowości.
- **Tryb offline** – cache’owanie shellu aplikacji oraz zasobów statycznych; fallback do `offline.html`.
- **Strategie cache** – _network-first_ dla zapytań do OpenWeatherMap, _cache-first_ dla assetów statycznych.
- **Instalowalność PWA** – `manifest.webmanifest`, własny przycisk „Install app”, obsługa `beforeinstallprompt`.
- **Powiadomienia** – sprawdzanie wsparcia, proszenie o zgodę, testowe wysłanie notyfikacji.
- **Baner „Offline”** – subtelny pasek informujący o pracy na danych z cache, blokowanie odświeżania offline.
- **3 widoki** – `Home`, `Details`, `Settings` (spójna nawigacja w obrębie pojedynczej strony).
- **Responsywność** – proste, czytelne UI dostosowane do różnych szerokości.
- **Czysty JS** – brak bundlera; łatwy podgląd kodu i omówienia line-by-line.

---

## Architektura i struktura plików

```bash
/weather-pwa
├── index.html              # 3 sekcje/widoki (Home, Details, Settings)
├── styles.css              # globalne style, m.in. pasek #offline-bar
├── main.js                 # router hash (#home/#details/#settings), boot, rejestracja SW
├── sw.js                   # Service Worker (precache + strategie cache)
├── offline.html            # offline fallback dla nawigacji
├── manifest.webmanifest    # metadane PWA, ikony, scope, start_url
├── /icons/                 # ikony 192x192 / 512x512
├── /services/
│ ├── weather.js            # geolokacja i integracja z OpenWeatherMap
│ ├── notifications.js      # wsparcie, permission, notify()
│ └── install.js            # beforeinstallprompt, canInstall(), requestInstall()
├── /state/
│ └── weatherState.js       # mini-store: stan, subskrypcje, updateWeather()
└── /ui/
├── renderHome.js           # widok główny + odświeżanie
├── renderDetails.js        # widok szczegółów (ikona OWM @4x)
├── renderSettings.js       # widok settings (refresh/clear/notify/install)
└── offlineBanner.js        # pasek OFFLINE + nasłuch online/offline
```

**Przepływ:** `main.js` uruchamia inicjalizacje (`initHome`, `initDetails`, `initSettings`, pasek offline, hook instalacji), ustawia router hash i rejestruje `sw.js`.  
`weatherState.js` trzyma stan (status, location, current, updatedAt), zapisuje do `localStorage`, udostępnia `subscribe()` i akcję `updateWeather()`.

---

## Technologie

- **HTML5 / CSS3 / JavaScript (ES Modules)**
- **PWA**: Web App Manifest, Service Worker, Cache API
- **Web APIs**: Geolocation, Notifications, `beforeinstallprompt`
- **OpenWeatherMap API** (REST JSON)

---
 
## Uruchomienie lokalne

> Service Worker wymaga protokołu **http(s)** – nie uruchamiaj z `file://`.

**Opcja 1 – szybki serwer:**

```bash
# w katalogu projektu
npx serve -s .
# lub
npx http-server -p 5173 -c-1 .

```

**Opcja 2 – VS Code Live Server**

Kliknij Go Live na index.html.

## Testowanie offline (Edge/Chrome)

Otwórz aplikację, przejdź przez 1–2 ekrany, by SW pobrał shell.

DevTools → Network → zaznacz Offline.

Odśwież. Strony działają, dla nawigacji fallback do offline.html.

Przycisk Refresh jest zablokowany w trybie offline, a baner „Offline” jest widoczny.

## Build / Deploy (Netlify)

Projekt jest statyczny – wystarczy wgrać pliki (index.html, sw.js, manifest.webmanifest, itd.) na hosting HTTPS.

Netlify: przeciągnij folder projektu do Netlify lub podłącz repo.

Vercel/GitHub Pages: analogicznie – pamiętaj o ścieżkach względnych (./sw.js, ./icons/...).

## Jakość

ESLint

Prettier

Komenda łączona w terminalu - ``` npm run both ```

## Obsługiwane przeglądarki i instalacja

Chromium (Chrome/Edge/Brave/Opera) – pełna instalowalność i SW.

Firefox (desktop) – SW tak, „Install” ograniczone.

iOS Safari – brak beforeinstallprompt; instalacja przez „Udostępnij → Do ekranu początkowego”.

W Settings przycisk Install app jest wyszarzany, jeśli przeglądarka nie wspiera beforeinstallprompt.

## Autor

Imię i nazwisko: Mateusz Gajewski
Numer albumu: 49591
Kierunek: Informatyka, Rok: 3
Przedmiot: Tworzenie progresywnych aplikacji mobilnych
