// Minimal service worker — just enough to make the prototype installable
// as a PWA. No offline caching strategy here; this is a UI/UX demo, not a
// production app, and the task explicitly says not to wire up real data.
const CACHE = 'cdbm-prototype-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network-first passthrough; falls back to cache only if the network fails.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
