const CACHE = 'mrw-v2';
const SHELL = ['./index.html','./offline.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('r-a-d.io') || url.includes('listen.moe') || url.includes('fonts.g')) return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('./offline.html')));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(c => c || fetch(e.request).catch(() => caches.match('./offline.html')))
  );
});
