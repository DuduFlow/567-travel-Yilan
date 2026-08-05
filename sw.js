/* 567 神秘小旅行 — 離線快取
   改版流程：更新下方 VERSION 字串 → push 到 GitHub → 手機下次開啟自動清舊快取重載。
   （autoupdate.js 會比對這個字串，兩邊必須一致） */
const VERSION = "567mystery-v5-20260805";

const CORE = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "autoupdate.js",
  "site.webmanifest",
  "favicon.ico",
  "apple-touch-icon.png",
  "assets/home-mystery-quest.png",
  "assets/og-mystery.png",
  "icons/favicon-16x16.png",
  "icons/favicon-32x32.png",
  "icons/favicon-48x48.png",
  "icons/favicon-96x96.png",
  "icons/apple-touch-icon.png",
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
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

/* 讓頁面能主動要求跳過等待 */
self.addEventListener("message", event => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

/* 取用策略：
   - 導覽請求（HTML）：network-first，離線時回快取，確保一連網就拿到新版
   - 其他同源資源：stale-while-revalidate，先給快取再背景更新 */
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(VERSION);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        return (await caches.match(req)) || (await caches.match("index.html")) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const cached = await cache.match(req, { ignoreSearch: true });
    const network = fetch(req).then(res => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});
