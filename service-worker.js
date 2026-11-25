/* HTML Viewer service worker.
   Opens instantly and works offline: files come from the cache first and are
   refreshed in the background whenever you are online. */
const CACHE = 'hv-v2-20261125';
const CORE = ['./', 'index.html', 'manifest.json', 'icon.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('hv-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async c => {
      const hit = await c.match(r, { ignoreSearch: true });
      const net = fetch(r)
        .then(res => { if (res && res.ok) c.put(r, res.clone()); return res; })
        .catch(() => null);
      e.waitUntil(net);
      if (hit) return hit;
      const res = await net;
      if (res) return res;
      if (r.mode === 'navigate') {
        const home = await c.match('index.html');
        if (home) return home;
      }
      return Response.error();
    })
  );
});
