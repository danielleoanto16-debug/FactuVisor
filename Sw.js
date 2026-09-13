const CACHE_NAME = 'facturas-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instalación del Service Worker: guarda los archivos principales en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activación: limpia versiones de caché viejas si actualizas la app
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché obsoleta:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar solicitudes para permitir el funcionamiento sin conexión
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo de la caché si existe, de lo contrario lo busca en la red
        return response || fetch(event.request);
      })
  );
});
