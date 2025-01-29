// Nom du cache
const CACHE_NAME = 'clairvoyance-cache-v1';
const OFFLINE_PAGE = '/offline.html';

// Liste des fichiers à mettre en cache dès l'installation
const STATIC_ASSETS = [
    '/',
    '/index.html',
    OFFLINE_PAGE,
    '/favicon_optimized.png',
    'https://fonts.googleapis.com/css2?family=Cinzel&family=Playfair+Display&display=swap',
    'https://fonts.gstatic.com/s/cinzel/v13/8vIJ7ww63mVu7gtR-kwKpU5a.woff2',
    'https://fonts.gstatic.com/s/playfairdisplay/v19/nuFvD-vYSZviVYUb_rj3ij__anPXDTxk.woff2',
    '/manifest.json'
];

// Installation du Service Worker et mise en cache des fichiers statiques
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activation du Service Worker et suppression des anciens caches
self.addEventListener('activate', (event) => {
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
    self.clients.claim();
});

// Gestion des requêtes
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Si la requête réussit, on met à jour le cache
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => {
                // Si la requête échoue, on retourne une version en cache ou une page hors ligne
                return caches.match(event.request).then((response) => {
                    return response || caches.match(OFFLINE_PAGE);
                });
            })
    );
});
self.addEventListener('install', (event) => {
    console.log('Service Worker installé.');
    event.waitUntil(
        caches.open('voyance-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/styles.css',
                '/script.js',
                '/images/icon-192.png',
                '/images/icon-512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
