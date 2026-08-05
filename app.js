/* ==========================================================================
   567 神秘小旅行 — app.js  v22
   資料來源：567旅遊分房分車表.xlsx（分房表 / 分車表）
   ========================================================================== */

/* ---- 固定介面：鎖直式、禁縮放、禁長按 ---- */
(function lockInterface() {
  const lockPortrait = () => {
    try { screen.orientation && screen.orientation.lock && screen.orientation.lock("portrait").catch(() => {}); } catch (e) {}
  };
  lockPortrait();
  window.addEventListener("orientationchange", lockPortrait);
  ["gesturestart", "gesturechange", "gestureend"].forEach(type =>
    document.addEventListener(type, event => event.preventDefault(), { passive: false })
  );
  document.addEventListener("contextmenu", event => {
    if (!(event.target instanceof Element && event.target.closest("input"))) event.preventDefault();
  });
})();

/* --------------------------------------------------------------------------
   一、名單資料
   name  一律顯示 Excel 正式全名
   alias 僅供暱稱搜尋，不顯示在旅程卡
   kid   分房表標「小」的孩童
   -------------------------------------------------------------------------- */
const people = [
  {name:"陳怡靜",car:1,room:1},
  {name:"鄭占禮",car:1,room:1},
  {name:"鄭沐熙",car:1,room:1,kid:true},
  {name:"陳意弘",car:2,room:10},
  {name:"許淑真",car:2,room:10},
  {name:"陳語恩",car:2,room:10,kid:true},
  {name:"陳宇晨",car:2,room:10,kid:true},
  {name:"郭仲凱",car:3,room:2},
  {name:"洪盈穎",car:3,room:2},
  {name:"郭宸睿",car:3,room:2,kid:true,alias:"郭陳瑞"},
  {name:"郭芮妡",car:3,room:2,kid:true,alias:"郭瑞芯"},
  {name:"王振華",car:4,room:7},
  {name:"王秀如",car:4,room:7,alias:"MIKI"},
  {name:"徐維鈴",car:5,room:4,alias:"小徐"},
  {name:"吳佳蓁",car:5,room:4,alias:"佳蓁"},
  {name:"王銘宏",car:5,room:12},
  {name:"王玉婷",car:5,room:12,alias:"王閨蜜"},
  {name:"白婕妤",car:6,room:11},
  {name:"周紋妤",car:6,room:11},
  {name:"陳彥朋",car:7,room:9,alias:"POTER"},
  {name:"蕭宇程",car:7,room:9},
  {name:"張友維",car:7,room:6},
  {name:"羅曼芸",car:7,room:6},
  {name:"邱揆程",car:8,room:8},
  {name:"林宜臻",car:8,room:8,alias:"橘子🍊"},
  {name:"鍾怡婷",car:8,room:12},
  {name:"黃皓暐",car:8,room:9},
  {name:"吳佳臻",car:9,room:11},
  {name:"謝沐宸",car:9,room:11},
  {name:"范毓斌",car:10,room:3},
  {name:"傅佳旻",car:10,room:3},
  {name:"林宜潔",car:11,room:12},
  {name:"林子榆",car:11,room:9},
  {name:"楊宗衛",car:11,room:9},
  {name:"林姿含",car:12,room:11},
  {name:"張䕒心",car:12,room:5},
  {name:"林上智",car:12,room:5}
];
/* 車長依分車表標記，不再用「名單第一位」推算 */
const carLeader = {1:"陳怡靜",2:"陳意弘",3:"郭仲凱",4:"王振華",5:"徐維鈴",6:"白婕妤",7:"陳彥朋",8:"邱揆程",9:"吳佳臻",10:"范毓斌",11:"林宜潔",12:"林姿含"};
const roomType   = {1:"2+1 房",2:"2+1 房",3:"雙人房",4:"雙人房",5:"雙人房",6:"雙人房",7:"雙人房",8:"雙人房",9:"四+1 房",10:"四人房",11:"四+1 房",12:"四人房"};

/* --------------------------------------------------------------------------
   二、任務資料
   -------------------------------------------------------------------------- */
const missions = [
  {day:1,date:"09.04",unlockAt:"2026-09-04T11:00:00+08:00",key:"烤雞",icon:"食",title:"番割田甕缸雞",subtitle:"用美食開啟宜蘭小旅行",time:"集合時間｜12:00",prep:"準備｜帶著空空的胃",clues:["會濕｜泳裝、毛巾、拖鞋、替換衣物 1–2 套","戶外｜防蚊、防曬；需要可帶摺疊椅或天幕","過夜｜盥洗用品、常備藥與行動電源"],map:"https://maps.app.goo.gl/Wyzm8RsR2wq532oe7"},
  {day:1,date:"09.04",unlockAt:"2026-09-04T13:00:00+08:00",key:"玩水",icon:"水",title:"武荖坑林道",subtitle:"山林裡的清涼冒險",time:"行程｜午後戲水",prep:"準備｜拖鞋、毛巾與替換衣物",clues:["下一站可能會弄濕鞋子","山林裡藏著天然冷氣","有顆西瓜會更完美"],map:"https://maps.app.goo.gl/baB9JcnScgKMNcE2A"},
  {day:1,date:"09.04",unlockAt:"2026-09-04T16:00:00+08:00",key:"採購",icon:"購",title:"喜互惠生鮮超市維揚店",subtitle:"旅途中的補給採購任務",time:"行程｜補給與自由採購",prep:"準備｜購物袋與零錢",clues:["補給時間就快到了","今晚必須是不醉不睡","記得先留一點行李空間"],map:"https://share.google/dwdt97eOk8M8L5iCL"},
  {day:1,date:"09.04",unlockAt:"2026-09-04T18:00:00+08:00",key:"民宿",icon:"宿",title:"真善美精品民宿",subtitle:"今晚一起好好休息",time:"行程｜入住與分房",prep:"準備｜查看查詢頁的房間與室友",clues:["這裡是今晚的落腳處","今晚晚餐必定精彩","先放下行李再繼續冒險"],map:"https://maps.app.goo.gl/DHjGxREJJBrxrXEx6"},
  {day:2,date:"09.05",unlockAt:"2026-09-05T08:00:00+08:00",key:"採蔥",icon:"蔥",title:"星寶蔥體驗農場",subtitle:"親手完成一份宜蘭蔥體驗",time:"行程｜田園體驗",prep:"準備｜防曬、好走的鞋",clues:["田裡藏著綠色寶藏","今天可能會沾上一點泥土","主角是宜蘭最有名的辛香滋味"],map:"https://maps.app.goo.gl/3LdMG3n4wv84r2s19"},
  {day:2,date:"09.05",unlockAt:"2026-09-05T12:00:00+08:00",key:"狐狸",icon:"狐",title:"宜蘭狐狸村",subtitle:"拜訪毛茸茸的神秘居民",time:"行程｜園區探訪",prep:"準備｜相機與輕柔的腳步",clues:["有人正用毛茸茸的尾巴等你","靠近時記得放慢腳步","相機可以先準備好了"],map:"https://maps.app.goo.gl/GigQgkMxhXHn8Scd6"},
  {day:2,date:"09.05",unlockAt:"2026-09-05T17:00:00+08:00",key:"晚宴",icon:"宴",title:"馫宴創意料理",subtitle:"一起為旅程留下今晚的記憶",time:"行程｜晚宴時光",prep:"準備｜舒服又好看的心情",clues:["567 旅遊的收尾標配","這一站適合一起舉杯","留一點胃，也留一點期待"],map:"https://maps.app.goo.gl/GqyNBGaTzk5FJDZm9"}
];

/* 民宿那一站，查詢頁的導航按鈕會指到這裡 */
const STAY = missions.find(m => m.key === "民宿");

/* 揭曉後保持顯示的時間（毫秒）：時間一到卡片翻開並停留 90 分鐘，之後才接著倒數下一站 */
const REVEAL_HOLD = 90 * 60 * 1000;

/* 線索是否隨時間一則一則釋出。目前 false＝解鎖前三則一次全給。
   想改成漸進釋出，把這裡改成 true 即可，其餘程式不用動。 */
const PROGRESSIVE_CLUES = false;
const CLUE_WINDOW = 4 * 60 * 60 * 1000;

const $ = id => document.getElementById(id);
const unlockTime = i => Date.parse(missions[i].unlockAt);

/* --------------------------------------------------------------------------
   三、分頁切換
   -------------------------------------------------------------------------- */
function selectTab(tab) {
  document.querySelectorAll(".tab-page").forEach(page => page.classList.toggle("active", page.id === tab));
  document.querySelectorAll(".bottom-nav [data-tab]").forEach(button => button.classList.toggle("active", button.dataset.tab === tab));
  window.scrollTo({ top: 0 });
}
document.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => selectTab(button.dataset.tab)));

/* --------------------------------------------------------------------------
   四、行程頁
   -------------------------------------------------------------------------- */
let preview = null;      // 使用者回看或測試預覽時的 {index, unlocked}
let lastSignature = "";
let countdownNodes = null;

function releasedClueCount(index, now) {
  const total = missions[index].clues.length;
  if (!PROGRESSIVE_CLUES) return total;
  const unlock = unlockTime(index);
  const prev = index > 0 ? unlockTime(index - 1) : unlock - CLUE_WINDOW;
  const win = Math.min(unlock - prev, CLUE_WINDOW);
  return missions[index].clues.filter((clue, i) => now >= unlock - win * (total - i) / (total + 1)).length;
}

function unlockedCount(now) {
  return missions.filter((mission, i) => now >= unlockTime(i)).length;
}

/* 目前該顯示哪一站：剛解鎖的站先翻開停留，過了保持期才接著倒數下一站 */
function currentView(now) {
  let last = -1;
  for (let i = 0; i < missions.length; i++) if (now >= unlockTime(i)) last = i;
  if (last >= 0 && now - unlockTime(last) < REVEAL_HOLD) return { index: last, unlocked: true };
  const next = missions.findIndex((mission, i) => now < unlockTime(i));
  if (next < 0) return { index: missions.length - 1, unlocked: true };
  return { index: next, unlocked: false };
}

function buildCountdown(showDays) {
  const unit = (key, label) => `<span data-cd="${key}"><b>00</b><i>${label}</i></span>`;
  $("countdown").innerHTML =
    (showDays ? unit("d", "天") : "") +
    unit("h", "時") + `<em>:</em>` + unit("m", "分") + `<em>:</em>` + unit("s", "秒");
  countdownNodes = {};
  $("countdown").querySelectorAll("[data-cd]").forEach(node => { countdownNodes[node.dataset.cd] = node.querySelector("b"); });
}

function paintCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const value = { d: Math.floor(total / 86400), h: Math.floor((total % 86400) / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 };
  const needDays = value.d > 0;
  if (!countdownNodes || needDays !== Boolean(countdownNodes.d)) buildCountdown(needDays);
  Object.keys(countdownNodes).forEach(key => {
    const text = String(value[key]).padStart(2, "0");
    if (countdownNodes[key].textContent !== text) countdownNodes[key].textContent = text;
  });
}

function renderMission(view, released) {
  const mission = missions[view.index];
  const card = $("mission-card");
  const dayNumber = missions.filter((item, i) => item.day === mission.day && i <= view.index).length;

  card.className = `mystery-card ${view.unlocked ? "unlocked reveal" : "locked"}`;
  $("mission-meta").textContent = `DAY ${mission.day} · ${mission.date} · MISSION ${String(dayNumber).padStart(2, "0")}`;
  $("trip-day").textContent = `DAY ${mission.day} · ${mission.date}`;
  $("locked-content").hidden = view.unlocked;
  $("revealed-content").hidden = !view.unlocked;

  if (view.unlocked) {
    $("mission-icon").textContent = mission.icon;
    $("mission-title").textContent = mission.title;
    $("mission-subtitle").textContent = mission.subtitle;
    $("mission-time").textContent = mission.time;
    $("mission-prep").textContent = mission.prep;
    $("mission-map").href = mission.map;
    $("mission-live").textContent = `已揭曉：${mission.title}，${mission.time}`;
    countdownNodes = null;
  } else {
    $("mission-clues").innerHTML = mission.clues.map((clue, i) => i < released
      ? `<p><span>0${i + 1}</span><b>${clue}</b></p>`
      : `<p class="pending"><span><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-lock"/></svg></span><b>線索稍後出現</b></p>`
    ).join("");
    $("mission-live").textContent = `目的地暫時保密，共 ${mission.clues.length} 則線索`;
  }
  renderTimeline(view);
  $("back-now").hidden = !preview;
  $("reset-test").hidden = !preview;
}

function renderTimeline(view) {
  const now = Date.now();
  $("mission-timeline").innerHTML = missions.map((mission, i) => {
    const open = now >= unlockTime(i);
    const isNow = !preview && i === view.index;
    const cls = open ? (isNow ? "is-now" : "") : (isNow ? "is-now" : "is-locked");
    const face = open ? mission.icon : (isNow ? "?" : `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-lock"/></svg>`);
    const viewing = preview && preview.index === i ? " is-viewing" : "";
    const label = open ? `回看第 ${i + 1} 站 ${mission.title}` : `第 ${i + 1} 站尚未揭曉`;
    return `<button type="button" class="${cls}${viewing}" data-open="${open ? 1 : 0}" data-index="${i}" aria-label="${label}">${face}</button>`;
  }).join("");
}

function tick() {
  const now = Date.now();
  const view = preview || currentView(now);
  const released = preview ? missions[view.index].clues.length : releasedClueCount(view.index, now);
  const opened = unlockedCount(now);

  const signature = `${view.index}|${view.unlocked}|${released}|${preview ? 1 : 0}|${opened}`;
  if (signature !== lastSignature) {
    lastSignature = signature;
    renderMission(view, released);
    $("home-progress-text").textContent = `${opened} / ${missions.length} 已揭曉`;
    $("trip-count").textContent = `${opened} / ${missions.length} 已揭曉`;
    $("home-progress-note").textContent = opened === missions.length ? "全部站點都已揭曉" : "下一站將於出發前揭曉";
    document.querySelectorAll("#home-progress-dots i").forEach((dot, i) => dot.classList.toggle("unlocked", i < opened));
  }
  if (!view.unlocked) paintCountdown(unlockTime(view.index) - now);
}

$("mission-timeline").addEventListener("click", event => {
  const button = event.target.closest("button[data-index]");
  if (!button || button.dataset.open !== "1") return;
  const index = Number(button.dataset.index);
  preview = preview && preview.index === index ? null : { index, unlocked: true };
  lastSignature = "";
  tick();
});
$("back-now").addEventListener("click", () => { preview = null; lastSignature = ""; tick(); });

setInterval(tick, 1000);
tick();

/* ---- ▼ 上線前可整段刪除的測試工具 ▼ ---- */
$("mission-test-grid").innerHTML = [1, 2].map(day => {
  const list = missions.map((mission, index) => ({ mission, index })).filter(item => item.mission.day === day);
  const row = list.map((item, position) =>
    `${position ? `<button class="mystery-trigger" type="button" data-test="lock" data-index="${item.index}" aria-label="查看${item.mission.key}的倒數"><span>迷</span></button>` : ""}` +
    `<button type="button" data-test="open" data-index="${item.index}" aria-label="查看${item.mission.key}謎底"><span>${item.mission.icon}</span>${item.mission.key}</button>`
  ).join("");
  return `<section><b>DAY ${day}<small>${day === 1 ? "09.04" : "09.05"}</small></b><div>${row}</div></section>`;
}).join("");

$("mission-test-grid").addEventListener("click", event => {
  const button = event.target.closest("button[data-test]");
  if (!button) return;
  preview = { index: Number(button.dataset.index), unlocked: button.dataset.test === "open" };
  lastSignature = "";
  tick();
  document.querySelectorAll("#mission-test-grid button").forEach(item => item.classList.toggle("active", item === button));
});
$("reset-test").addEventListener("click", () => {
  preview = null; lastSignature = "";
  document.querySelectorAll("#mission-test-grid button").forEach(item => item.classList.remove("active"));
  tick();
});
/* ---- ▲ 測試工具結束 ▲ ---- */

/* --------------------------------------------------------------------------
   五、查詢頁
   -------------------------------------------------------------------------- */
const STORAGE_KEY = "567-me-v1";
const byName = Object.fromEntries(people.map(person => [person.name, person]));
const carMembers  = car  => people.filter(p => p.car === car).sort((a, b) => (a.name === carLeader[car] ? -1 : b.name === carLeader[car] ? 1 : 0));
const roomMembers = room => people.filter(p => p.room === room);
const normalize = value => String(value).normalize("NFKC").toLocaleLowerCase("zh-Hant").replace(/[^\p{L}\p{N}]/gu, "");
const escapeHtml = value => String(value).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function matchPeople(query) {
  const target = normalize(query);
  if (!target) return [];
  return people
    .map(person => {
      const keys = [normalize(person.name), person.alias ? normalize(person.alias) : ""].filter(Boolean);
      let rank = -1;
      keys.forEach(key => {
        if (key === target) rank = rank < 0 ? 0 : Math.min(rank, 0);
        else if (key.startsWith(target)) rank = rank < 0 ? 1 : Math.min(rank, 1);
        else if (key.includes(target)) rank = rank < 0 ? 2 : Math.min(rank, 2);
      });
      return { person, rank };
    })
    .filter(item => item.rank >= 0)
    .sort((a, b) => a.rank - b.rank || a.person.car - b.person.car)
    .map(item => item.person);
}

function highlight(name, query) {
  const target = normalize(query);
  if (!target) return escapeHtml(name);
  const index = normalize(name).indexOf(target);
  if (index < 0) return escapeHtml(name);
  /* 以正規化後的位置回推原字串位置：中文逐字對應，足以支撐這份名單 */
  const head = escapeHtml(name.slice(0, index));
  const body = escapeHtml(name.slice(index, index + target.length));
  const tail = escapeHtml(name.slice(index + target.length));
  return `${head}<mark>${body}</mark>${tail}`;
}

function renderSuggest(list, query) {
  const box = $("suggest");
  if (!list.length) { box.innerHTML = ""; return; }
  box.innerHTML = list.map(person => {
    const leader = carLeader[person.car] === person.name ? " · 車長" : "";
    return `<button type="button" role="option" data-person="${escapeHtml(person.name)}"><span>${highlight(person.name, query)}</span><i>第 ${person.car} 車${leader}</i></button>`;
  }).join("");
}

function personTag(person, car) {
  if (carLeader[car] === person.name) return `<em class="gold-tag">車長</em>`;
  if (person.kid) return `<em>孩童</em>`;
  return "";
}

function compactList(members, self, car) {
  return `<ul class="compact-list">` + members.map(person => person.name === self.name
    ? `<li class="is-self"><span>${escapeHtml(person.name)}</span><em>你</em></li>`
    : `<li><button type="button" data-person="${escapeHtml(person.name)}"><span>${escapeHtml(person.name)}</span>${personTag(person, car)}</button></li>`
  ).join("") + `</ul>`;
}

function showTraveler(person) {
  const car = person.car, room = person.room;
  const carList = carMembers(car), roomList = roomMembers(room);
  const isLeader = carLeader[car] === person.name;
  const adults = carList.filter(p => !p.kid).length;
  const kids = carList.length - adults;

  $("query-result").innerHTML = `
    <div class="trip-card-head">
      <div>
        <h2>${escapeHtml(person.name)}</h2>
        <p>第 ${car} 車 · 第 ${room} 房</p>
      </div>
      <button class="switch-person" type="button" id="switch-person">換人</button>
    </div>

    <div class="tc-panel">
      <h3>分車資訊</h3>
      <div class="tag-row">
        ${isLeader ? `<span class="gold">★ 本車車長</span>` : `<span>車長 ${escapeHtml(carLeader[car])}</span>`}
        <span>大人 ${adults}</span>${kids ? `<span>孩童 ${kids}</span>` : ""}
      </div>
      <p class="tc-label">同車夥伴 ${carList.length} 人</p>
      ${compactList(carList, person, car)}
    </div>

    <div class="tc-panel">
      <h3>住宿資訊</h3>
      <div class="pair-grid">
        <div><i>房號</i><b>第 ${room} 房</b></div>
        <div><i>房型</i><b>${escapeHtml(roomType[room])}</b></div>
      </div>
      <div class="dash"></div>
      <p class="tc-label">今晚室友 ${roomList.length} 人</p>
      ${compactList(roomList, person, car)}
    </div>`;

  $("query-result").hidden = false;
  $("name-search").hidden = true;
  $("search-hint").hidden = true;
  $("query-message").hidden = true;
  $("group-head").hidden = true;
  try { localStorage.setItem(STORAGE_KEY, person.name); } catch (e) {}

  $("switch-person").addEventListener("click", resetQuery);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetQuery() {
  $("query-result").hidden = true;
  $("query-result").innerHTML = "";
  $("name-search").hidden = false;
  $("group-head").hidden = false;
  $("search-hint").hidden = false;
  $("query-message").hidden = true;
  $("suggest").innerHTML = "";
  const input = $("traveler-name");
  input.value = "";
  $("clear-name").hidden = true;
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  input.focus();
}

$("traveler-name").addEventListener("input", event => {
  const value = event.target.value.trim();
  $("clear-name").hidden = !value;
  $("query-message").hidden = true;
  if (!value) { $("suggest").innerHTML = ""; $("search-hint").hidden = false; return; }
  const list = matchPeople(value);
  $("search-hint").hidden = true;
  renderSuggest(list, value);
  if (!list.length) {
    $("query-message").textContent = "名單裡沒有這個姓名，可以試試少打幾個字，或用群組裡的暱稱。";
    $("query-message").hidden = false;
  }
});

$("name-search").addEventListener("submit", event => {
  event.preventDefault();
  const list = matchPeople($("traveler-name").value.trim());
  if (list.length) showTraveler(list[0]);
});

$("suggest").addEventListener("click", event => {
  const button = event.target.closest("button[data-person]");
  if (button) showTraveler(byName[button.dataset.person]);
});

$("query-result").addEventListener("click", event => {
  const button = event.target.closest("button[data-person]");
  if (button && byName[button.dataset.person]) showTraveler(byName[button.dataset.person]);
});

$("clear-name").addEventListener("click", () => {
  const input = $("traveler-name");
  input.value = "";
  $("clear-name").hidden = true;
  $("suggest").innerHTML = "";
  $("search-hint").hidden = false;
  $("query-message").hidden = true;
  input.focus();
});

/* 記住上次查到的人，下次直接顯示 */
(function restoreMe() {
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (saved && byName[saved]) showTraveler(byName[saved]);
})();

/* --------------------------------------------------------------------------
   六、手動更新
   -------------------------------------------------------------------------- */
$("refresh-button").addEventListener("click", event => {
  const button = event.currentTarget;
  if (button.classList.contains("refreshing")) return;
  button.classList.add("refreshing");
  if (navigator.vibrate) navigator.vibrate(25);
  setTimeout(() => window.location.reload(), 450);
});
