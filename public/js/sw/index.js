self.addEventListener('fetch', (event) => {
  event.respondWith(
    new Response('<div class="a-winner-is-me">Hello world!</div>',
      { headers: {'Content-Type': 'text/html; charset=utf-8'}})
  );
});

