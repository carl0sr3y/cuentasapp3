// Service worker: solo maneja notificaciones push (no cache offline, para mantenerlo simple).
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (event) => { event.waitUntil(self.clients.claim()); });

self.addEventListener('push', (event) => {
  let data = { title: 'Cuentas-App', body: '' };
  try { if (event.data) data = event.data.json(); } catch (e) { data.body = event.data ? event.data.text() : ''; }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Cuentas-App', {
      body: data.body || '',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientsArr) => {
      if (clientsArr.length > 0) return clientsArr[0].focus();
      return self.clients.openWindow('/');
    })
  );
});
