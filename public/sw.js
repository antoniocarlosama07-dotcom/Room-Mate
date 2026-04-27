const CACHE = 'casa-unal-v2';
const STATIC = ['/manifest.json', '/icon-192.png', '/icon-512.png'];

// Install: only cache static assets, NOT index.html
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: index.html always from network, rest from cache
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    // Always fetch fresh from network
    e.respondWith(fetch(e.request).catch(() => caches.match('/index.html')));
  } else {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    );
  }
});
