// Workbox CDN
//importScripts('https://cdn.jsdelivr.net/npm/workbox-sw@7.0.0/build/workbox-sw.js');

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

// 1. Delete outdated caches from previous Vite builds
cleanupOutdatedCaches();
console.log('sw.js initialization')

// 2. Pre-cache all dynamic Vite build-hashed files
precacheAndRoute(self.__WB_MANIFEST || []);

// 3. Skip waiting so new builds activate immediately
self.addEventListener('install', () => {
    self.skipWaiting();
});

// 4. Claim clients immediately on activation
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

