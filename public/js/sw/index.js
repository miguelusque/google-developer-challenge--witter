self.addEventListener('fetch', (event) => {
  if(event.request.url.endsWith('.jpg')) {
    event.respondWith(
      fetch('/imgs/dr-evil.gif')
    );
  }
});
