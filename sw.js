const CACHE_NAME = 'terminal-docente-v1';
const ASSETS = [
  './',
  './index.html',
  './dashboard-supervisora.html',
  './dashboard-docente.html',
  './repositorio-digital.html',
  './inventario.html',
  './consultas.html',
  './css/styles.css',
  './js/pdf-logic.js',
  './icon-192.png',
  './icon-512.png',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
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
