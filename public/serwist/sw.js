// Self-destructing service worker.
// A previous deployment registered a serwist-based SW that's still active
// in some user browsers, intercepting requests and serving stale cached
// content. Replacing that SW with this one tells the browser to:
//   1. Activate immediately (skipWaiting)
//   2. Take control of open clients (clients.claim)
//   3. Delete every cache it owns
//   4. Unregister itself
//   5. Reload all controlled pages so they fetch fresh from the network
// After one visit, the SW is gone and behavior is normal forever after.

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      await self.clients.claim();
      const registration = self.registration;
      if (registration) await registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        if ("navigate" in client) client.navigate(client.url);
      }
    })(),
  );
});
