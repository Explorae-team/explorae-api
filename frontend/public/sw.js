/**
 * Basic Service Worker for Exploraê PWA
 * Task [S1-P2-T4]
 */

const CACHE_NAME = 'explorae-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.webmanifest',
  '/assets/icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
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
