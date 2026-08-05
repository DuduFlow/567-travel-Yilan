/* 567 神秘小旅行 — 自動強制更新
   註冊 service worker，並在「開啟 / 切回前景 / 每 3 分鐘 / 重新連線」比對 sw.js 的 VERSION。
   一旦版本不同，就清光所有快取並重載，加到桌面的使用者不需要手動清資料。

   ★ 改版時：這裡的 BUILD 要跟 sw.js 的 VERSION 改成同一個字串。 */
(() => {
  const BUILD = "567mystery-v27-20260806";
  const DISPLAY_VERSION = "V2";

  const src = (document.currentScript && document.currentScript.src) || "";
  const root = src.replace(/autoupdate\.js.*$/, "") || "./";

  document.addEventListener("DOMContentLoaded", () => {
    const tag = document.getElementById("build-tag");
    if (tag) tag.textContent = DISPLAY_VERSION;
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(root + "sw.js").catch(() => {});
    });
  }

  let checking = false;

  const check = async () => {
    if (checking || navigator.onLine === false) return;
    checking = true;
    try {
      const response = await fetch(root + "sw.js?chk=" + Date.now(), { cache: "no-store" });
      if (!response.ok) return;
      const text = await response.text();
      const found = text.match(/VERSION\s*=\s*"([^"]+)"/);
      if (!found || found[1] === BUILD) return;

      const key = "567-auto-reloaded";
      if (sessionStorage.getItem(key) === found[1]) return;
      sessionStorage.setItem(key, found[1]);

      if (window.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map(name => caches.delete(name)));
      }
      if (navigator.serviceWorker) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(item => item.update().catch(() => {})));
      }
      location.reload();
    } catch (e) {
      /* 離線或網路不穩時安靜略過 */
    } finally {
      checking = false;
    }
  };

  check();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) check(); });
  window.addEventListener("online", check);
  setInterval(check, 3 * 60 * 1000);
})();
