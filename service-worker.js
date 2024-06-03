// This is the "Offline copy of pages" service worker
const CACHE = "pwabuilder-offline";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Exclude the specific script from being cached
workbox.routing.registerRoute(
  new RegExp('https://483d8b.pythonanywhere.com/output.js'),
  new workbox.strategies.NetworkOnly()
);

// Cache other files
workbox.routing.registerRoute(
  ({ url }) => url.origin === location.origin && !url.pathname.endsWith('output.js'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);


// Clear existing caches on activation to ensure updated content
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});