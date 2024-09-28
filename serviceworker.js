const CACHE_NAME = "watch-store-cache-v1";
const urlsToCache = [
  "/",
  "index.html",
  "style.css",
  "images/bow_clip.png",
  "images/scrunchies.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Fetch request:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("Response from cache:", event.request.url);
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        console.log("Response from network:", event.request.url);
        return response;
      });
    })
  );
});

self.addEventListener("push", (event) => {
  console.log("Push event received:", event);
  const title = "Hair Accesories Store";
  const options = {
    body: event.data.text(),
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("sync", (event) => {
  console.log("Sync event triggered");
  if (event.tag === "sync-products") {
    event.waitUntil(syncProducts());
  }
});

function syncProducts() {
  // Implement syncing logic here
  console.log("Syncing products...");
}
