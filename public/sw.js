// ESTIN Average Calculator Service Worker
// Offline-first PWA caching strategy:
//   - Navigations: Network-first → Cache → /offline.html
//   - Images: Cache-first (with max 100 cache trim)
//   - CSS, JS, Fonts: Stale-while-revalidate

const VERSION = "estin-calc-v1";
const PRECACHE = `${VERSION}-precache`;
const RUNTIME = `${VERSION}-runtime`;
const IMAGES = `${VERSION}-images`;
const MAX_IMAGES = 100;

const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/offline.html",
  "/icon.svg",
  "/favicon.ico",
  "/favicon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/og.png",
];

const CDN_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  // Never intercept analytics, Vercel system requests, or non-http protocols
  if (
    !url.protocol.startsWith("http") ||
    (sameOrigin && (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_vercel/")))
  ) {
    return;
  }

  // 1. Page Navigations: Network first -> cached page -> offline page fallback
  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(event));
    return;
  }

  // 2. Images: Cache-first with capacity management
  if (request.destination === "image" && sameOrigin) {
    event.respondWith(cacheFirstImage(request));
    return;
  }

  // 3. Static scripts, styles, Google Fonts: Stale-while-revalidate
  if (sameOrigin || CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

async function networkFirstPage(event) {
  const { request } = event;
  const cache = await caches.open(RUNTIME);
  try {
    const preloaded = await event.preloadResponse;
    const response = preloaded || (await fetch(request));
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return (
      (await caches.match(request, { ignoreSearch: true })) ||
      (await caches.match("/", { ignoreSearch: true })) ||
      (await caches.match("/offline.html"))
    );
  }
}

async function cacheFirstImage(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(IMAGES);
      await cache.put(request, response.clone());
      trimCache(IMAGES, MAX_IMAGES);
    }
    return response;
  } catch (err) {
    return new Response("", { status: 504, statusText: "Offline" });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === "opaque")) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached || Response.error());

  return cached || network;
}

async function trimCache(name, max) {
  try {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - max; i++) {
      await cache.delete(keys[i]);
    }
  } catch (err) {
    // Ignore cache trim errors
  }
}
