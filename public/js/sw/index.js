self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => (response.status === 404
        ? fetch('/imgs/dr-evil.gif')
        : response))
      .catch(()=> (new Response("Uh oh, that totally failed!")))
  );
});
