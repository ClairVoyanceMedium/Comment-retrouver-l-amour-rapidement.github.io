// Nom du cache
const CACHE_NAME = 'rituels-cache-v2';
const OFFLINE_PAGE = '/offline.html';

// Liste des fichiers à mettre en cache dès l'installation
const ASSETS = [
    '/',
    '/index.html',
    OFFLINE_PAGE,
    '/favicon_optimized.png',
    'https://i.imgur.com/GmyGlKk.webp',
    'https://fonts.googleapis.com/css2?family=Cinzel&family=Playfair+Display&display=swap',
    'https://fonts.gstatic.com/s/cinzel/v13/8vIJ7ww63mVu7gtR-kwKpU5a.woff2',
    'https://fonts.gstatic.com/s/playfairdisplay/v19/nuFvD-vYSZviVYUb_rj3ij__anPXDTxk.woff2',
    '/manifest.json'
];

// Installation du Service Worker et mise en cache des fichiers statiques
self.addEventListener('install', (event) => {
    console.log('Service Worker installé.');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Mise en cache des fichiers statiques');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activation du Service Worker et suppression des anciens caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activé.');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log(`Suppression de l'ancien cache : ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Gestion des requêtes réseau avec fallback en cache ou page offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Ajout de la réponse dans le cache si la requête réussit
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => {
                // Si la requête échoue, on retourne une version en cache ou la page offline
                return caches.match(event.request).then((response) => {
                    return response || caches.match(OFFLINE_PAGE);
                });
            })
    );
});
