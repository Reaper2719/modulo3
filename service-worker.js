self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("modulo2-cache").then(cache => {
      return cache.addAll([
        "index.html",
        "style.css",
        "main.js",
        "indexedDB.js",
        "export.js",
        "manifest.json",
        "icon-192.png",
        "icon-512.png"
      ]);
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
