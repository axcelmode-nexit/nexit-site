const CACHE_NAME = 'nexitaime-shell-v16';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/favicon-32.png',
  './assets/favicon-48.png',
  './assets/apple-touch-icon.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/joetsu-hero-clean.png',
  './assets/joetsu-hero.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

function isDataOrPage(request) {
  const url = new URL(request.url);
  return request.mode === 'navigate'
    || url.pathname.endsWith('.json')
    || url.pathname.endsWith('/index.html')
    || url.pathname.endsWith('/NEXITAIME/')
    || url.pathname.endsWith('/NEXITAIME');
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Do not cache API calls or third-party services.
  if (url.origin !== self.location.origin || url.pathname.includes('/api/')) return;

  if (isDataOrPage(request)) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      });
    })
  );
});
