var staticCacheName = 'wittr-static-v5';

self.addEventListener('install', function(event) {
  // TODO: cache /skeleton rather than the root page


  event.waitUntil(
    caches.open(staticCacheName).then((cache) => (
      cache.addAll([
        '/skeleton',
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
  // TODO: respond to requests for the root page with
  // the page skeleton from the cache
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/skeleton'));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then((response) => (
      response || fetch(event.request)
    )
  ));
});

// TODO: listen for the "message" event, and call
// skipWaiting if you get the appropriate message
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
