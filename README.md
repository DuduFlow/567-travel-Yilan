# 567 神秘小旅行

這是可直接上傳 GitHub Pages 的靜態網站版本。

## 上傳方式

1. 建立 GitHub repository。
2. 將本資料夾內所有檔案上傳到 repository 根目錄，確認 `index.html` 位於最外層。
3. 到 Settings → Pages。
4. Source 選擇 Deploy from a branch，Branch 選擇 `main` 與 `/ (root)`。
5. 儲存後等待 GitHub Pages 網址產生。

網站不需要資料庫或額外套件，分車與分房資料已包含在 `app.js`。

查詢頁採姓名搜尋，只會在畫面上顯示該旅客的車次、車長、房號、房型與室友。
目前依每車名單中的第一位成員作為車長。

`icons/`、`favicon.ico`、`apple-touch-icon.png`、`site.webmanifest` 與
`browserconfig.xml` 是跨平台圖示套件，請一起上傳，不要遺漏。
