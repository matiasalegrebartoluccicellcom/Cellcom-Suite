// Service worker de CELLCOM Suite: hace la app instalable y guarda los archivos propios.
// Los datos de Supabase NUNCA se cachean (siempre van a la red).
// Cuando cambies archivos de la app, subí el número de VERSION para que se actualice.
const VERSION = 'v1';
const CACHE = 'cellcom-suite-' + VERSION;
const ARCHIVOS = ['./', 'index.html', 'app.js', 'config.js', 'styles.css', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Primero la red (para tener siempre lo último); si no hay conexión, lo guardado.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
      .catch(() => caches.match(e.request))
  );
});
