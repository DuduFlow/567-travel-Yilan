"use client";

import { useEffect, useState } from "react";

type Tab = "home" | "trip" | "group";

const dayOne = [
  { time: "12:00", title: "番割田甕缸雞", note: "用美食開啟宜蘭小旅行", icon: "食", clue: "香氣會先替我們帶路", gear: "帶著空空的胃", start: "2026-09-04T12:00:00+08:00" },
  { time: "15:00", title: "武荖坑林道", note: "第二戲水區｜人多往 3–4 區", icon: "水", clue: "今天有很高的機率會弄濕", gear: "防滑鞋・毛巾・換洗衣物", start: "2026-09-04T15:00:00+08:00" },
  { time: "17:30", title: "採購時間", note: "一起準備晚餐食材", icon: "購", clue: "今晚的美味，需要大家一起完成", gear: "環保袋・分工好心情", start: "2026-09-04T17:30:00+08:00" },
  { time: "19:00", title: "真善美民宿", note: "入住、晚餐、自在相聚", icon: "宿", clue: "奔波一天後，會有一盞燈等著我們", gear: "盥洗用品・個人藥品", start: "2026-09-04T19:00:00+08:00" },
];

type TripItem = (typeof dayOne)[number];

function unlockTime(item: TripItem) {
  return new Date(new Date(item.start).getTime() - 60 * 60 * 1000);
}

function formatCountdown(milliseconds: number) {
  const total = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds };
}

const cars = [
  ["陳怡靜", "鄭占禮", "鄭沐熙"],
  ["陳意弘", "許淑真", "陳語恩", "陳宇晨"],
  ["郭仲凱", "洪盈穎", "郭陳瑞", "郭瑞芯"],
  ["王振華", "MIKI"],
  ["小徐", "佳蓁", "王銘宏", "王閨蜜"],
  ["白婕妤", "周紋妤"],
  ["蕭宇程", "POTER", "張友維", "羅曼芸"],
  ["邱揆程", "橘子🍊", "鍾怡婷", "黃皓暐"],
  ["吳佳臻", "謝沐宸"],
  ["范毓斌", "傅佳旻"],
  ["林宜潔", "林子榆", "楊宗衛"],
  ["林姿含", "張䕒心", "林上智"],
];

const rooms = [
  { type: "2+1 房", people: ["陳怡靜", "鄭占禮", "鄭沐熙"] },
  { type: "2+1 房", people: ["郭仲凱", "洪盈穎", "郭陳瑞", "郭瑞芯"] },
  { type: "雙人房", people: ["范毓斌", "傅佳旻"] },
  { type: "雙人房", people: ["小徐", "佳蓁"] },
  { type: "雙人房", people: ["張䕒心", "林上智"] },
  { type: "雙人房", people: ["張友維", "羅曼芸"] },
  { type: "雙人房", people: ["王振華", "MIKI"] },
  { type: "雙人房", people: ["邱揆程", "橘子🍊"] },
  { type: "四＋1 房", people: ["黃皓暐", "楊宗衛", "蕭宇程", "POTER", "林子榆"] },
  { type: "四人房", people: ["陳意弘", "許淑真", "陳語恩", "陳宇晨"] },
  { type: "四＋1 房", people: ["林姿含", "吳佳臻", "謝沐宸", "白婕妤", "周紋妤"] },
  { type: "四人房", people: ["王銘宏", "王閨蜜", "鍾怡婷", "林宜潔"] },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [group, setGroup] = useState<"car" | "room">("car");
  const [now, setNow] = useState(0);
  const [testReveal, setTestReveal] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const nextItem = dayOne[0];
  const isNextUnlocked = testReveal || now >= unlockTime(nextItem).getTime();
  const countdown = formatCountdown(unlockTime(nextItem).getTime() - now);

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <button className="brand" onClick={() => setTab("home")} aria-label="回到首頁">
          <span>567</span>
          <b>TRIP</b>
        </button>
        <div className="trip-date"><span /> 09.04 — 09.05</div>
      </header>

      <section className="content" key={tab}>
        {tab === "home" && (
          <>
            <div className="hero">
              <p className="eyebrow">567 · MYSTERY JOURNEY</p>
              <h1>下一站去哪？<br /><em>時間到了才知道。</em></h1>
              <p className="hero-lead">一場每個小時，都值得期待的宜蘭旅行</p>
              <div className="landscape" aria-hidden="true">
                <div className="sun" />
                <div className="mountain back" />
                <div className="mountain front" />
                <div className="river" />
                <span className="landscape-label">THE SECRET IS WAITING · 2026</span>
              </div>
            </div>

            <div className="home-secret-note"><span>✦</span><p><b>8 個未知目的地</b><small>每一站，都在出發前一小時揭曉。</small></p></div>
            <button className="home-cta" onClick={() => setTab("trip")}>等待第一個驚喜 <span>›</span></button>
            <p className="gentle-note">不用急著知道答案，期待本身就是旅行的一部分。</p>
          </>
        )}

        {tab === "trip" && (
          <>
            <div className="page-intro"><p className="eyebrow">NEXT MISSION</p><h1>下一站，<br /><em>時間到了才知道。</em></h1><p>示範任務｜9月4日第一站</p></div>
            <div className="reveal-stage">
              <button className={`mystery-card ${isNextUnlocked ? "unlocked reveal" : "locked"}`} aria-live="polite">
                <div className="mystery-orbit"><span>{isNextUnlocked ? nextItem.icon : "?"}</span><i /></div>
                <small>{isNextUnlocked ? "MISSION UNLOCKED" : "UNLOCKS ONE HOUR BEFORE"}</small>
                <strong>{isNextUnlocked ? nextItem.title : "目的地暫時保密"}</strong>
                {isNextUnlocked ? <div className="revealed-details"><p>{nextItem.note}</p><span>集合時間｜{nextItem.time}</span><span>準備｜{nextItem.gear}</span></div> : <>
                  <div className="countdown" aria-label={`距離解鎖還有${countdown.days}天${countdown.hours}小時${countdown.minutes}分`}>
                    {countdown.days > 0 && <span><b>{String(countdown.days).padStart(2,"0")}</b><small>天</small></span>}
                    <span><b>{String(countdown.hours).padStart(2,"0")}</b><small>時</small></span><em>:</em>
                    <span><b>{String(countdown.minutes).padStart(2,"0")}</b><small>分</small></span><em>:</em>
                    <span><b>{String(countdown.seconds).padStart(2,"0")}</b><small>秒</small></span>
                  </div>
                  <p className="clue"><span>CLUE 01</span>{nextItem.clue}</p>
                </>}
              </button>
              <button className={`test-button ${testReveal ? "active" : ""}`} onClick={() => setTestReveal((value) => !value)}>
                <span>{testReveal ? "↺" : "✦"}</span><p><b>{testReveal ? "恢復倒數畫面" : "測試：模擬時間到"}</b><small>{testReveal ? "回到尚未解鎖狀態" : "按下後查看正式揭曉效果"}</small></p>
              </button>
            </div>
            <div className="tip-card"><span>RULE</span><p>正式上線時不會顯示測試按鈕，時間一到就會自動揭曉。</p></div>
          </>
        )}

        {tab === "group" && (
          <>
            <div className="page-intro group-intro"><p className="eyebrow">LOOK UP</p><h1>快速查詢，<br /><em>我的車與房。</em></h1><p>37 位旅伴 · 12 車 · 12 房</p></div>
            <div className="segment compact" role="tablist" aria-label="選擇名單類型">
              <button className={group === "car" ? "active" : ""} onClick={() => setGroup("car")}><b>分車名單</b></button>
              <button className={group === "room" ? "active" : ""} onClick={() => setGroup("room")}><b>分房名單</b></button>
            </div>
            <div className="group-list">
              {(group === "car" ? cars.map((people) => ({ type: `${people.length} 位同行`, people })) : rooms).map((item, index) => (
                <details className="group-card" key={`${group}-${index}`}>
                  <summary>
                    <span className="group-number">{String(index + 1).padStart(2, "0")}</span>
                    <span><small>{group === "car" ? "CAR" : "ROOM"}</small><b>第 {index + 1} {group === "car" ? "車" : "房"}</b></span>
                    <em>{item.type}</em><i>＋</i>
                  </summary>
                  <div className="people">{item.people.map((person) => <span key={person}>{person}</span>)}</div>
                </details>
              ))}
            </div>
          </>
        )}
      </section>

      <nav className="bottom-nav" aria-label="主要導覽">
        <button className={tab === "home" ? "active" : ""} onClick={() => setTab("home")}><span>⌂</span><b>首頁</b></button>
        <button className={tab === "trip" ? "active" : ""} onClick={() => setTab("trip")}><span>◫</span><b>行程</b></button>
        <button className={tab === "group" ? "active" : ""} onClick={() => setTab("group")}><span>◎</span><b>查詢</b></button>
      </nav>
    </main>
  );
}
