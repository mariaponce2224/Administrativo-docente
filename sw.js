const CACHE_NAME = 'terminal-docente-v2';
const ASSETS = [
  './',
  './index.html',
  './dashboard-supervisora.html',
  './dashboard-docente.html',
  './repositorio-digital.html',
  './inventario.html',
  './consultas.html',
  './css/styles.css',
  './js/app.js',
  './js/pdf-logic.js',
  './icon-192.png',
  './icon-512.png',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

// Instalación: Cachear recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación: Limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Estrategia Cache First con fallback a Red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
