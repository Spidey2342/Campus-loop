const CACHE_NAME = 'campusvibe-v1'

// Files to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
]

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  // Activate immediately without waiting
  self.skipWaiting()
})

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

// Fetch — network first, fall back to cache
// This means users always get fresh content when online
// but the app still works offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and API calls
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('onrender.com') ||
    event.request.url.includes('cloudinary.com')
  ) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone)
          })
        }
        return response
      })
      .catch(() => {
        // Network failed — try cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html')
          }
        })
      })
  )
})