// services/notifications.js

export function supported() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

//Powiadomienie stan uprawnień
export function permission() {
  return supported() ? Notification.permission : 'denied';
}

//Powiadomienie z prośbą o zgodę
export async function request() {
  if (!supported()) throw new Error('Notifications not supported');
  return await Notification.requestPermission();
}

export async function notify(title, options = {}) {
  if (!supported() || Notification.permission !== 'granted') return;
  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification(title, options);
}
