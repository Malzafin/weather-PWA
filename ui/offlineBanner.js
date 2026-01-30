export function initOfflineBanner() {
    let bar = document.querySelector('#offline-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'offline-bar';
        bar.textContent = 'Offline mode: showing cached data';
        document.body.prepend(bar);
    }
    function sync(){
        bar.style.display = navigator.onLine ? 'none': 'block';
    }
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    sync();
}