self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const payload = event.data;
  if (!payload || payload.type !== 'SHOW_NOTIFICATION') {
    return;
  }

  const { title, body, tag, data, requireInteraction } = payload.options ?? {};
  const notificationOptions = {
    body,
    tag: tag ?? 'athlink',
    requireInteraction: requireInteraction ?? true,
    data: data ?? { url: '/requests' },
  };

  event.waitUntil(
    self.registration.showNotification(title, notificationOptions),
  );
});

self.addEventListener('push', (event) => {
  const payload = event.data?.json?.() ?? {
    title: 'Athlink',
    body: 'У вас новое уведомление',
    tag: 'athlink',
    data: { url: '/requests' },
  };

  const notificationOptions = {
    body: payload.body,
    tag: payload.tag ?? 'athlink',
    requireInteraction: true,
    data: payload.data ?? { url: '/requests' },
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url ?? '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((matchingClients) => {
        for (const client of matchingClients) {
          if ('focus' in client) {
            client.focus();
            return client.postMessage({ type: 'NAVIGATE', url: targetUrl });
          }
        }

        return clients.openWindow(targetUrl);
      }),
  );
});
