/**
 * Service Worker for ChallengeCraft AI
 */

const CACHE_NAME = 'challengecraft-ai-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/main.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/utils/helpers.js',
  '/js/utils/storage.js',
  '/js/api/openRouter.js',
  '/js/components/challenge.js',
  '/js/components/notification.js',
  '/js/components/modal.js',
  '/js/components/progressTracker.js',
  '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip for API calls
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Only cache requests that start with /css, /js, etc.
            if (event.request.url.match(/\.(css|js|html|png|jpg|jpeg|svg|gif)$/)) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return response;
          })
          .catch(() => {
            // If the request is for a webpage, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Handle messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'challenge-submission') {
    event.waitUntil(syncChallengeSubmissions());
  }
});

// Handle background sync for challenge submissions
function syncChallengeSubmissions() {
  return self.clients.matchAll()
    .then((clients) => {
      return clients.map((client) => {
        // Tell the client to sync pending submissions
        return client.postMessage({
          type: 'SYNC_SUBMISSIONS'
        });
      });
    })
    .catch((err) => {
      console.error('Background sync failed:', err);
    });
} 