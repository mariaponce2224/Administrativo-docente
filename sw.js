const CACHE_NAME = 'terminal-docente-v3';
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

// Activación: Limpiar caches antiguos e informar inmediatamente a los clientes
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

// Fetch: Estrategia Network First con fallback a Cache
self.addEventListener('fetch', (event) => {
  // Solo manejar peticiones GET a recursos internos o URLs conocidas
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si obtenemos una respuesta válida de la red, la guardamos en caché
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red (offline), intentamos servir desde la caché
        return caches.match(event.request);
      })
  );
});
