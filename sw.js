const CACHE_NAME = "cache-v1.0.7";

const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./data.json",
  "./manifest.json",
  "./icon-16.png",
  "./icon-32.png",
  "./apple-touch-icon.png",
  "./favicon.ico",
  "./icon-192.png",
  "./icon-512.png"
];

// Instalação
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Ativação (limpa caches antigos)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch (offline first)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});