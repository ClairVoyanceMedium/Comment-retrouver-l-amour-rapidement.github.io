// ⚡ Nom du cache
const CACHE_NAME = 'rituels-cache-v3';
const OFFLINE_PAGE = '/offline.html';

// 🗂 Liste des fichiers à mettre en cache dès l'installation
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

// 📥 Installation du Service Worker et mise en cache des fichiers statiques
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installation en cours…');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Mise en cache des fichiers statiques.');
                return cache.addAll(ASSETS);
            })
            .catch((error) => {
                console.error('[Service Worker] Échec de la mise en cache:', error);
            })
    );

    self.skipWaiting();
});

// 🔄 Activation du Service Worker et suppression des anciens caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activation en cours…');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log(`[Service Worker] Suppression de l'ancien cache: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

// 🌐 Gestion des requêtes réseau avec fallback en cache et page offline
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return; // ⚠️ Ignore les requêtes non-GET

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // 🗄️ Sauvegarde des nouvelles ressources dans le cache
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => {
                // ❌ Si la requête échoue, on tente le cache ou la page offline
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('[Service Worker] Récupération depuis le cache:', event.request.url);
                        return cachedResponse;
                    } else {
                        console.warn('[Service Worker] Requête échouée et non disponible dans le cache:', event.request.url);
                        return caches.match(OFFLINE_PAGE);
                    }
                });
            })
    );
});

// 📡 Notification de mise à jour du Service Worker aux clients
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
