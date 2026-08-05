/* 567 神秘小旅行 — 自動強制更新
   註冊 service worker，並在「開啟 / 切回前景 / 每 3 分鐘」比對 sw.js 的 VERSION。
   一旦版本不同，就清光所有快取並重載，讓加到桌面的使用者不用手動清資料。

   ★ 改版時：這裡的 BUILD 要跟 sw.js 的 VERSION 改成同一個字串。 */
(() => {
  const BUILD = "567mystery-v3-20260805";

  const src  = (document.currentScript && document.currentScript.src) || "";
  const root = src.replace(/autoupdate\.js.*$/, "") || "./";

  /* 把版本標記寫進畫面右上角，方便一眼確認手機載到的是哪一版 */
  document.addEventListener("DOMContentLoaded", () => {
    const tag = document.getElementById("build-tag");
    if (tag) tag.textContent = BUILD.replace(/^567mystery-/, "");
  });

  /* 註冊 service worker */
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
      const res = await fetch(root + "sw.js?chk=" + Date.now(), { cache: "no-store" });
      if (!res.ok) return;
      const txt = await res.text();
      const m = txt.match(/VERSION\s*=\s*"([^"]+)"/);
      if (!m || m[1] === BUILD) return;

      // 同一個新版本只自動重載一次，避免無限迴圈
      const key = "567-auto-reloaded";
      if (sessionStorage.getItem(key) === m[1]) return;
      sessionStorage.setItem(key, m[1]);

      if (window.caches) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if (navigator.serviceWorker) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.update().catch(() => {})));
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
