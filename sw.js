
this.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1')
      .then((cache) => {
        return cache.addAll([
          '/index.html',
          '/',
          '/css/main.css',
          '/js/main.js'
        ]);
      })
      .then(()=> self.skipWaiting())
  );
});

this.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});



//this.addEventListener('activate',  () => self.clients.claim());

this.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .catch(() => {
        return fetch(event.request);
      })
  );
});











