const CACHE_NAME = "clairvoyance-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/favicon_optimized.png",
  "https://clairvoyancemedium.github.io/Images/Logo-ClairvoyanceMedium.webp",
  "https://fonts.googleapis.com/css2?family=Cinzel&family=Playfair+Display&display=swap"
];

// Installation du Service Worker et mise en cache des ressources essentielles
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation et suppression des anciens caches si nécessaire
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interception des requêtes et retour des fichiers en cache si hors ligne
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => caches.match("/index.html")) // Redirige vers la page principale si offline
  );
});
