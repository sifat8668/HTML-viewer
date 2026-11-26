/* HTML Viewer service worker.
   Pages and the manifest come from the network first, so a new version is never hidden behind an old cache.
   The saved copy is used when you are offline or the network is slow. Everything else is served from the cache
   and refreshed in the background. Change CACHE whenever you publish a new version of a cached file. */
const CACHE = 'hv-v3-20261126';
const MUST = ['./', 'index.html', 'manifest.json'];
const MORE = ['icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'];
const SLOW = 4000;

self.addEventListener('install', e => e.waitUntil((async () => {
  const c = await caches.open(CACHE);
  await c.addAll(MUST.map(u => new Request(u, { cache: 'reload' })));
  await Promise.all(MORE.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})));
  await self.skipWaiting();
})()));

self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith('hv-') && k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  const page = r.mode === 'navigate' || u.pathname.endsWith('/') || /\/(index\.html|manifest\.json)$/.test(u.pathname);
  e.respondWith(page ? networkFirst(e, r) : cacheFirst(e, r));
});

async function networkFirst(e, r) {
  const c = await caches.open(CACHE);
  const net = fetch(r.url, { cache: 'no-cache' }).then(res => {
    if (res.ok && res.status === 200) c.put(r, res.clone());
    return res;
  });
  e.waitUntil(net.catch(() => {}));
  const slow = new Promise(res => setTimeout(() => res(null), SLOW));
  const first = await Promise.race([net.catch(() => null), slow]);
  if (first && first.ok) return first;
  return (await c.match(r, { ignoreSearch: true })) || (await c.match('index.html')) || (await net.catch(() => null)) || Response.error();
}

async function cacheFirst(e, r) {
  const c = await caches.open(CACHE);
  const hit = await c.match(r, { ignoreSearch: true });
  const net = fetch(r.url, { cache: 'no-cache' }).then(res => {
    if (res.ok && res.status === 200) c.put(r, res.clone());
    return res;
  }).catch(() => null);
  e.waitUntil(net);
  return hit || (await net) || Response.error();
}
