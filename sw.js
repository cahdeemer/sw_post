// version our cache
var staticCacheName = "static";
var version = "v1::";
var urlsToCache = [
	"/", 
	"offline",
	"/css/main.css",
	"/js/main.js"
];


function updateStaticCache() {
	return caches.open(version + staticCacheName)
		.then(function (cache) {
			return cache.addAll(urlsToCache);
		});
}

// update cache
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys
          .filter(function (key) {
            return key.indexOf(version) !== 0;
          })
          .map(function (key) {
            return caches.delete(key);
          })
        );
      })
  );
});


// back off files that aren't GET requests
if (request.method !== 'GET') {
  event.respondWith(
      fetch(request)
  );
  return;
}

// HTML requests
if (request.headers.get('Accept').indexOf('text/html') !== -1) {
    event.respondWith(
    fetch(request, { credentials: 'include' })
      .then(function (response) {
        var copy = response.clone();
        caches.open(version + staticCacheName)
          .then(function (cache) {
            cache.put(request, copy);
          });
        return response;
      })
      .catch(function () {
        return caches.match(request)
          .then(function (response) {
            return response || caches.match('/offline');
          })
      })

    );
    return;
}





