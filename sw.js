/* 567 神秘小旅行 — 離線快取
   改版流程：更新下方 VERSION 字串 → push 到 GitHub → 手機下次開啟自動清舊快取重載。
   （autoupdate.js 的 BUILD 必須跟這個字串一致） */
const VERSION = "567mystery-v27-20260806";

/* og-mystery.jpg 只給社群預覽用，畫面上不會顯示，所以不預先下載 */
const CORE = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "autoupdate.js",
  "site.webmanifest",
  "browserconfig.xml",
  "favicon.ico",
  "apple-touch-icon.png",
  "assets/home-mystery-quest.jpg",
  "icons/favicon.ico",
  "icons/favicon-16x16.png",
  "icons/favicon-32x32.png",
  "icons/favicon-48x48.png",
  "icons/favicon-96x96.png",
  "icons/apple-touch-icon.png",
  "icons/mstile-150x150.png",
  "icons/android-chrome-192x192.png",
  "icons/android-chrome-512x512.png",
  "icons/maskable-icon-192x192.png",
  "icons/maskable-icon-512x512.png",
  "icons/safari-pinned-tab.svg"
];

/* 安裝：預先快取核心檔案（單檔失敗不影響整體安裝） */
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await Promise.all(CORE.map(url =>
      cache.add(new Request(url, { cache: "reload" })).catch(() => {})
    ));
    self.skipWaiting();
  })());
});

/* 啟用：刪掉所有非本版本的快取 */
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

/* 取用策略：
   - 導覽請求（HTML）：network-first，離線時回快取
   - 其他同源資源：先給快取再背景更新 */
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(VERSION);
        cache.put(request, fresh.clone());
        return fresh;
      } catch (e) {
        return (await caches.match(request)) || (await caches.match("index.html")) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const cached = await cache.match(request, { ignoreSearch: true });
    const network = fetch(request).then(response => {
      if (response && response.status === 200) cache.put(request, response.clone());
      return response;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});
