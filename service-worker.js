// After you change any file later, change v1 to v2 (v3...) so phones fetch the update.
const C = 'html-viewer-v1';
const FILES = ['./', 'index.html', 'manifest.json', 'icon.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== C).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Open instantly from cache, refresh the cache quietly in the background.
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then(hit => {
      const net = fetch(r)
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(C).then(c => c.put(r, copy)); }
          return res;
        })
        .catch(() => hit || caches.match('index.html'));
      e.waitUntil(net.catch(() => {}));
      return hit || net;
    })
  );
});
