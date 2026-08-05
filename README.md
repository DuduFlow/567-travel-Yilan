# 567 神秘小旅行

宜蘭二日神秘旅程的手機網頁手冊，可直接上傳 GitHub Pages。
分享網址給旅伴，用手機瀏覽器「加到主畫面」即可像 App 一樣使用。

## 檔案結構

```
index.html          單頁式介面（首頁 / 行程 / 查詢）
style.css           單一份樣式表，每個選擇器只出現一次
app.js              倒數、揭曉、姓名查詢邏輯 + 固定介面（不捲動、不翻轉）
sw.js               離線快取 + 版本控制
autoupdate.js       自動偵測新版本並強制更新
site.webmanifest    加到桌面時的 App 設定（直式、standalone）
browserconfig.xml   Windows 磚圖設定
assets/ icons/      主視覺與各尺寸圖示
```

`icons/`、`favicon.ico`、`apple-touch-icon.png`、`site.webmanifest` 與
`browserconfig.xml` 是跨平台圖示套件，請一起上傳，不要遺漏。

## 上傳方式

1. 建立 GitHub repository。
2. 將本資料夾內所有檔案上傳到 repository 根目錄，確認 `index.html` 位於最外層。
3. Settings → Pages。
4. Source 選擇 Deploy from a branch，Branch 選 `main` 與 `/ (root)`。
5. 儲存後等待 GitHub Pages 網址產生。

`.nojekyll` 已包含。Service worker 需要 HTTPS，GitHub Pages 預設符合。

## 改版流程（重要）

改完任何檔案後，**必須同步更新三個地方的版本字串**，旅伴的手機才會抓到新版：

1. `sw.js` 的 `const VERSION = "..."`
2. `autoupdate.js` 的 `const BUILD = "..."`
3. `index.html` 裡 `style.css?v=` / `app.js?v=` / `autoupdate.js?v=`

命名建議：`567mystery-v2-20260810`（版號 + 日期）。

三處改成同一字串後 push，旅伴的手機在「開啟 App / 切回前景 / 每 3 分鐘 / 重新連線」任一時機會偵測到版本不同，自動清掉快取並重載。
不需要請大家清 Safari 資料或重新加到桌面。

若版本字串沒改，手機會沿用舊快取 —— 這是「明明改了卻看不到」最常見的原因。

## 介面規格

- 固定直式；橫向時顯示「請直立使用」遮罩
- 三個分頁皆為單畫面版面，不捲動、不縮放、不長按選取
- 底部導覽列：56px 按鈕 + 上下各 8px padding + safe-area，齊平置底、無圓角
- 右上角更新按鈕可手動重新整理

## 資料維護

- 分車與分房：`app.js` 最上方的 `cars` 與 `rooms` 陣列
- 車長：取每車名單中的第一位成員
- 第一站解鎖時間：`app.js` 的 `unlockAt`（目前為 2026-09-04 11:00 +08:00）

查詢頁採姓名搜尋，只會顯示該旅客的車次、車長、房號、房型與室友。
