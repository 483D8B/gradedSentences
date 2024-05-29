// This is the "Offline copy of pages" service worker

const CACHE = "pwabuilder-offline";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  // Match only output.js file
  new RegExp('/output\\.js'),
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE,
    plugins: [
      {
        cacheKeyWillBeUsed: async ({request}) => {
          // Remove the versioning info from the URL before it's used as a cache key
          let url = new URL(request.url);
          url.searchParams.delete('v');
          return url.href;
        }
      }
    ]
  })
);
