var staticCacheName = 'wittr-static-v2';

self.addEventListener('install', function(event) {
  event.waitUntil(
    // TODO: open a cache named 'wittr-static-v2'
    // Add cache the urls from urlsToCache
    caches.open(staticCacheName).then((cache) => (
      cache.addAll([
        '/',
        'js/main.js',
        'css/main.css',
        'imgs/icon.png',
        'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
        'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
      ])
    ))
  );
});

// Remove unnecessary caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => (
      Promise.all(
        cacheNames.filter((cacheName) => (cacheName.startsWith('wittr-') &&
          cacheName !== staticCacheName))
          .map((cacheName) => (caches.delete(cacheName)))
      ))
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => (
      response ? response : fetch(event.request)
    )
  ));
});

