var staticCacheName = 'wittr-static-v7';
var contentImgsCache = 'wittr-content-imgs';
var allCaches = [
  staticCacheName,
  contentImgsCache
];

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
          !allCaches.includes(cacheName))
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

  // Return cached photos
  if (requestUrl.pathname.startsWith('/photos/')) {
    event.respondWith(servePhoto(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => (
      response || fetch(event.request)
    )
  ));
});

function servePhoto() {
  // Photo urls look like:
  // /photos/9-8028-7527734776-e1d2bda28e-800px.jpg
  // But storageUrl has the -800px.jpg bit missing.
  // Use this url to store & match the image in the cache.
  // This means you only store one copy of each photo.
  var storageUrl = request.url.replace(/-\d+px\.jpg$/, '');

  // TODO: return images from the "wittr-content-imgs" cache
  // if they're in there. Otherwise, fetch the images from
  // the network, put them into the cache, and send it back
  // to the browser.
  //
  // HINT: cache.put supports a plain url as the first parameter
  return caches.open(contentImgsCache).then(cache=> (
    cache.match(storageUrl).then(response => {
      if (response) return response;

      return fetch(request).then(networkResponse => {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    })
  ))
};

// TODO: listen for the "message" event, and call
// skipWaiting if you get the appropriate message
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
