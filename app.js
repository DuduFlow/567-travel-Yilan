/* ---- 固定介面：鎖直式、禁滑動、禁縮放 ---- */
(function lockInterface() {
  // 鎖定直式（安裝成 App / 全螢幕時生效，其餘瀏覽器以 CSS 提示擋畫面）
  const lockPortrait = () => {
    try { screen.orientation && screen.orientation.lock && screen.orientation.lock("portrait").catch(() => {}); } catch (e) {}
  };
  lockPortrait();
  window.addEventListener("orientationchange", lockPortrait);

  // 禁止雙指縮放
  ["gesturestart", "gesturechange", "gestureend"].forEach(type =>
    document.addEventListener(type, event => event.preventDefault(), { passive: false })
  );

  // 禁止長按選單（輸入框除外）
  document.addEventListener("contextmenu", event => {
    if (!(event.target instanceof Element && event.target.closest("input, textarea"))) event.preventDefault();
  });

})();

const cars = [
  ["陳怡靜","鄭占禮","鄭沐熙"],["陳意弘","許淑真","陳語恩","陳宇晨"],["郭仲凱","洪盈穎","郭宸睿","郭芮妡"],["王振華","王秀如"],["徐維鈴","吳佳蓁","王銘宏","王玉婷"],["白婕妤","周紋妤"],["蕭宇程","陳彥朋","張友維","羅曼芸"],["邱揆程","林宜臻","鍾怡婷","黃皓暐"],["吳佳臻","謝沐宸"],["范毓斌","傅佳旻"],["林宜潔","林子榆","楊宗衛"],["林姿含","張䕒心","林上智"]
];
const roomAliases = {"郭宸睿":"郭陳瑞","郭芮妡":"郭瑞芯","王秀如":"MIKI","徐維鈴":"小徐","吳佳蓁":"佳蓁","王玉婷":"王閨蜜","陳彥朋":"POTER","林宜臻":"橘子🍊"};
const rooms = [
  {type:"2+1 房",people:["陳怡靜","鄭占禮","鄭沐熙"]},{type:"2+1 房",people:["郭仲凱","洪盈穎","郭陳瑞","郭瑞芯"]},{type:"雙人房",people:["范毓斌","傅佳旻"]},{type:"雙人房",people:["小徐","佳蓁"]},{type:"雙人房",people:["張䕒心","林上智"]},{type:"雙人房",people:["張友維","羅曼芸"]},{type:"雙人房",people:["王振華","MIKI"]},{type:"雙人房",people:["邱揆程","橘子🍊"]},{type:"四＋1 房",people:["黃皓暐","楊宗衛","蕭宇程","POTER","林子榆"]},{type:"四人房",people:["陳意弘","許淑真","陳語恩","陳宇晨"]},{type:"四＋1 房",people:["林姿含","吳佳臻","謝沐宸","白婕妤","周紋妤"]},{type:"四人房",people:["王銘宏","王閨蜜","鍾怡婷","林宜潔"]}
];
const missions = [
  {day:1,date:"09.04",unlockAt:"2026-09-04T11:00:00+08:00",key:"烤雞",icon:"食",title:"番割田甕缸雞",subtitle:"用美食開啟宜蘭小旅行",time:"集合時間｜12:00",prep:"準備｜帶著空空的胃",clues:["炭火香氣會先替我們帶路","在甕裡慢慢變成金黃色","午餐先留一點空間"],map:"https://maps.app.goo.gl/Wyzm8RsR2wq532oe7"},
  {day:1,date:"09.04",unlockAt:"2026-09-04T13:00:00+08:00",key:"玩水",icon:"水",title:"武荖坑林道",subtitle:"山林裡的清涼冒險",time:"行程｜午後戲水",prep:"準備｜拖鞋、毛巾與替換衣物",clues:["下一站可能會弄濕鞋子","山林裡藏著天然冷氣","有顆西瓜會更完美"],map:"https://maps.app.goo.gl/baB9JcnScgKMNcE2A"},
  {day:1,date:"09.04",unlockAt:"2026-09-04T16:00:00+08:00",key:"採購",icon:"購",title:"喜互惠生鮮超市維揚店",subtitle:"旅途中的補給採購任務",time:"行程｜補給與自由採購",prep:"準備｜購物袋與零錢",clues:["補給時間就快到了","今晚必須是不醉不睡","記得先留一點行李空間"],map:"https://share.google/dwdt97eOk8M8L5iCL"},
  {day:1,date:"09.04",unlockAt:"2026-09-04T18:00:00+08:00",key:"民宿",icon:"宿",title:"真善美精品民宿",subtitle:"今晚一起好好休息",time:"行程｜入住與分房",prep:"準備｜查看查詢頁的房間與室友",clues:["這裡是今晚的落腳處","今晚晚餐必定精彩","先放下行李再繼續冒險"],map:"https://maps.app.goo.gl/DHjGxREJJBrxrXEx6"},
  {day:2,date:"09.05",unlockAt:"2026-09-05T08:00:00+08:00",key:"採蔥",icon:"蔥",title:"星寶蔥體驗農場",subtitle:"親手完成一份宜蘭蔥體驗",time:"行程｜田園體驗",prep:"準備｜防曬、好走的鞋",clues:["田裡藏著綠色寶藏","今天可能會沾上一點泥土","主角是宜蘭最有名的辛香滋味"],map:"https://maps.app.goo.gl/3LdMG3n4wv84r2s19"},
  {day:2,date:"09.05",unlockAt:"2026-09-05T12:00:00+08:00",key:"狐狸",icon:"狐",title:"宜蘭狐狸村",subtitle:"拜訪毛茸茸的神秘居民",time:"行程｜園區探訪",prep:"準備｜相機與輕柔的腳步",clues:["有人正用毛茸茸的尾巴等你","靠近時記得放慢腳步","相機可以先準備好了"],map:"https://maps.app.goo.gl/GigQgkMxhXHn8Scd6"},
  {day:2,date:"09.05",unlockAt:"2026-09-05T17:00:00+08:00",key:"晚宴",icon:"宴",title:"馫宴創意料理",subtitle:"一起為旅程留下今晚的記憶",time:"行程｜晚宴時光",prep:"準備｜舒服又好看的心情",clues:["567 旅遊的收尾標配","這一站適合一起舉杯","留一點胃，也留一點期待"],map:"https://maps.app.goo.gl/GqyNBGaTzk5FJDZm9"}
];
let testMissionIndex = null;
let testLockedPreview = false;

function selectTab(tab) {
  document.querySelectorAll(".tab-page").forEach(page => page.classList.toggle("active", page.id === tab));
  document.querySelectorAll(".bottom-nav [data-tab]").forEach(button => button.classList.toggle("active", button.dataset.tab === tab));
  document.body.classList.toggle("query-mode", tab === "group");
}
document.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => selectTab(button.dataset.tab)));

function countdownParts(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {days:Math.floor(total/86400),hours:Math.floor((total%86400)/3600),minutes:Math.floor((total%3600)/60),seconds:total%60};
}
function renderMission() {
  const previewing = testMissionIndex !== null;
  const now = Date.now();
  let defaultIndex = missions.findIndex(item => now < Date.parse(item.unlockAt));
  if (defaultIndex < 0) defaultIndex = missions.length - 1;
  const missionIndex = previewing ? testMissionIndex : defaultIndex;
  const mission = missions[missionIndex];
  const missionUnlockAt = Date.parse(mission.unlockAt);
  const actualUnlocked = now >= missionUnlockAt;
  const unlocked = previewing ? !testLockedPreview : actualUnlocked;
  const unlockedCount = missions.filter(item => now >= Date.parse(item.unlockAt)).length;
  document.getElementById("home-progress-text").textContent = `${unlockedCount} / ${missions.length} 已揭曉`;
  document.querySelectorAll("#home-progress-dots i").forEach((dot,index) => dot.classList.toggle("unlocked", index < unlockedCount));
  document.getElementById("trip-day-label").textContent = `DAY ${mission.day} · ${mission.date}`;
  document.getElementById("trip-progress-label").textContent = `NEXT MISSION · ${unlockedCount} / ${missions.length}`;
  document.querySelectorAll("#trip-progress-dots i").forEach((dot,index) => dot.classList.toggle("unlocked", index < unlockedCount));
  const dayMissionNumber = missions.filter((item,index) => item.day === mission.day && index <= missionIndex).length;
  const card = document.getElementById("mission-card");
  card.className = `mystery-card ${unlocked ? "unlocked reveal" : "locked"}`;
  document.getElementById("mission-icon").textContent = unlocked ? mission.icon : "?";
  document.getElementById("mission-status").textContent = unlocked ? "MISSION UNLOCKED" : "UNLOCKS ONE HOUR BEFORE";
  document.getElementById("mission-title").textContent = unlocked ? mission.title : "目的地暫時保密";
  document.getElementById("mission-meta").textContent = `DAY ${mission.day} · ${mission.date} · MISSION ${String(dayMissionNumber).padStart(2,"0")}`;
  document.getElementById("locked-content").hidden = unlocked;
  document.getElementById("revealed-content").hidden = !unlocked;
  document.getElementById("mission-clues").innerHTML = mission.clues.map((clue,index) => `<p><span>CLUE ${String(index + 1).padStart(2,"0")}</span>${clue}</p>`).join("");
  document.getElementById("mission-subtitle").textContent = mission.subtitle;
  document.getElementById("mission-time").textContent = mission.time;
  document.getElementById("mission-prep").textContent = mission.prep;
  const map = document.getElementById("mission-map");
  map.href = mission.map;
  document.querySelectorAll(".mission-test-grid button[data-mission-index]").forEach(button => button.classList.toggle("active", !testLockedPreview && Number(button.dataset.missionIndex) === testMissionIndex));
  document.querySelectorAll(".mission-test-grid button[data-mystery-index]").forEach(button => button.classList.toggle("active", testLockedPreview && Number(button.dataset.mysteryIndex) === testMissionIndex));
  document.getElementById("reset-test").hidden = !previewing;
  if (!unlocked) {
    const t = countdownParts(missionUnlockAt - now);
    document.getElementById("countdown").innerHTML = `${t.days ? `<span><b>${String(t.days).padStart(2,"0")}</b><small>天</small></span>` : ""}<span><b>${String(t.hours).padStart(2,"0")}</b><small>時</small></span><em>:</em><span><b>${String(t.minutes).padStart(2,"0")}</b><small>分</small></span><em>:</em><span><b>${String(t.seconds).padStart(2,"0")}</b><small>秒</small></span>`;
  }
}
document.getElementById("mission-test-grid").innerHTML = [1,2].map(day => {
  const dayMissions = missions.map((mission,index) => ({mission,index})).filter(item => item.mission.day === day);
  const sequence = dayMissions.map((item,position) => `${position ? `<button class="mystery-trigger" type="button" data-mystery-index="${item.index}" aria-label="查看${item.mission.key}的倒數與謎面"><span>迷</span></button>` : ""}<button type="button" data-mission-index="${item.index}" aria-label="查看${item.mission.key}謎底"><span>${item.mission.icon}</span>${item.mission.key}</button>`).join("");
  return `<section><b>DAY ${day}<small>${day === 1 ? "09.04" : "09.05"}</small></b><div>${sequence}</div></section>`;
}).join("");
document.getElementById("mission-test-grid").addEventListener("click", event => {
  const button = event.target.closest("button[data-mission-index]");
  if (!button) return;
  testMissionIndex = Number(button.dataset.missionIndex);
  testLockedPreview = false;
  renderMission();
  document.getElementById("mission-card").scrollIntoView({behavior:"smooth",block:"center"});
});
document.getElementById("mission-test-grid").addEventListener("click", event => {
  const button = event.target.closest("button[data-mystery-index]");
  if (!button) return;
  testMissionIndex = Number(button.dataset.mysteryIndex);
  testLockedPreview = true;
  renderMission();
  document.getElementById("mission-card").scrollIntoView({behavior:"smooth",block:"center"});
});
document.getElementById("reset-test").addEventListener("click", () => { testMissionIndex = null; testLockedPreview = false; renderMission(); });
setInterval(renderMission,1000); renderMission();

function normalizeName(value) {
  return value.normalize("NFKC").toLocaleLowerCase("zh-Hant").replace(/[^\p{L}\p{N}]/gu, "");
}

function findTraveler(input) {
  const target = normalizeName(input);
  if (!target) return null;
  const allNames = [...new Set(cars.flat())];
  const name = allNames.find(person => normalizeName(person) === target);
  if (!name) return null;
  const carIndex = cars.findIndex(group => group.includes(name));
  const roomName = roomAliases[name] || name;
  const roomIndex = rooms.findIndex(room => room.people.includes(roomName));
  if (carIndex < 0 || roomIndex < 0) return null;
  return { name, roomName, carIndex, roomIndex, leader: cars[carIndex][0], room: rooms[roomIndex] };
}

function showTraveler(traveler) {
  document.getElementById("query-message").hidden = true;
  document.getElementById("result-name").textContent = traveler.name;
  document.getElementById("result-car").textContent = `第 ${traveler.carIndex + 1} 車`;
  document.getElementById("result-leader").textContent = traveler.leader;
  document.getElementById("result-leader-note").textContent = traveler.name === traveler.leader ? "★ 本車車長" : "";
  document.getElementById("result-room").textContent = `第 ${traveler.roomIndex + 1} 房`;
  document.getElementById("result-room-type").textContent = traveler.room.type;
  const carmates = cars[traveler.carIndex].filter(person => person !== traveler.name);
  document.getElementById("result-carmates").innerHTML = carmates.length ? carmates.map(person => `<span>${person}</span>`).join("") : "<span>此車沒有其他夥伴</span>";
  const roommates = traveler.room.people.filter(person => person !== traveler.roomName);
  document.getElementById("result-roommates").innerHTML = roommates.length ? roommates.map(person => `<span>${person}</span>`).join("") : "<span>此房沒有其他室友</span>";
  document.getElementById("name-search").hidden = true;
  document.getElementById("query-result").hidden = false;
  document.getElementById("group").classList.add("result-mode");
  document.getElementById("traveler-name").blur();
  window.scrollTo({top:0,behavior:"smooth"});
}

function renderCarDirectory(keyword = "") {
  const target = normalizeName(keyword);
  document.getElementById("car-directory").innerHTML = cars.map((people,carIndex) => {
    const matches = target ? people.filter(person => normalizeName(person).includes(target)) : people;
    if (!matches.length) return "";
    return `<section><b>第 ${carIndex + 1} 車<small>${people[0]} · 車長</small></b><div>${matches.map(person => `<button type="button" data-traveler="${person}">${person}</button>`).join("")}</div></section>`;
  }).join("") || '<p class="directory-empty">沒有符合的姓名</p>';
}

document.getElementById("traveler-name").addEventListener("input", event => renderCarDirectory(event.target.value));
document.getElementById("car-directory").addEventListener("click", event => {
  const button = event.target.closest("button[data-traveler]");
  if (!button) return;
  const traveler = findTraveler(button.dataset.traveler);
  if (traveler) showTraveler(traveler);
});
renderCarDirectory();

document.getElementById("name-search").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.getElementById("traveler-name");
  const traveler = findTraveler(input.value.trim());
  if (traveler) return showTraveler(traveler);
  const message = document.getElementById("query-message");
  message.textContent = "找不到這個姓名，請確認是否與分房分車表相同。";
  message.hidden = false;
  document.getElementById("query-result").hidden = true;
  input.focus();
});

document.getElementById("search-again").addEventListener("click", () => {
  document.getElementById("query-result").hidden = true;
  document.getElementById("name-search").hidden = false;
  document.getElementById("group").classList.remove("result-mode");
  const input = document.getElementById("traveler-name");
  input.value = "";
  input.focus();
});

document.getElementById("refresh-button").addEventListener("click", event => {
  const button = event.currentTarget;
  if (button.classList.contains("refreshing")) return;
  button.classList.add("refreshing");
  button.setAttribute("aria-label", "正在更新");
  if (navigator.vibrate) navigator.vibrate(25);
  window.setTimeout(() => window.location.reload(), 450);
});
