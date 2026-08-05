const cars = [
  ["陳怡靜","鄭占禮","鄭沐熙"],["陳意弘","許淑真","陳語恩","陳宇晨"],["郭仲凱","洪盈穎","郭陳瑞","郭瑞芯"],["王振華","MIKI"],["小徐","佳蓁","王銘宏","王閨蜜"],["白婕妤","周紋妤"],["蕭宇程","POTER","張友維","羅曼芸"],["邱揆程","橘子🍊","鍾怡婷","黃皓暐"],["吳佳臻","謝沐宸"],["范毓斌","傅佳旻"],["林宜潔","林子榆","楊宗衛"],["林姿含","張䕒心","林上智"]
];
const rooms = [
  {type:"2+1 房",people:["陳怡靜","鄭占禮","鄭沐熙"]},{type:"2+1 房",people:["郭仲凱","洪盈穎","郭陳瑞","郭瑞芯"]},{type:"雙人房",people:["范毓斌","傅佳旻"]},{type:"雙人房",people:["小徐","佳蓁"]},{type:"雙人房",people:["張䕒心","林上智"]},{type:"雙人房",people:["張友維","羅曼芸"]},{type:"雙人房",people:["王振華","MIKI"]},{type:"雙人房",people:["邱揆程","橘子🍊"]},{type:"四＋1 房",people:["黃皓暐","楊宗衛","蕭宇程","POTER","林子榆"]},{type:"四人房",people:["陳意弘","許淑真","陳語恩","陳宇晨"]},{type:"四＋1 房",people:["林姿含","吳佳臻","謝沐宸","白婕妤","周紋妤"]},{type:"四人房",people:["王銘宏","王閨蜜","鍾怡婷","林宜潔"]}
];
const unlockAt = new Date("2026-09-04T11:00:00+08:00").getTime();
let testReveal = false;

function selectTab(tab) {
  document.querySelectorAll(".tab-page").forEach(page => page.classList.toggle("active", page.id === tab));
  document.querySelectorAll(".bottom-nav [data-tab]").forEach(button => button.classList.toggle("active", button.dataset.tab === tab));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => selectTab(button.dataset.tab)));

function countdownParts(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {days:Math.floor(total/86400),hours:Math.floor((total%86400)/3600),minutes:Math.floor((total%3600)/60),seconds:total%60};
}
function renderMission() {
  const unlocked = testReveal || Date.now() >= unlockAt;
  const card = document.getElementById("mission-card");
  card.className = `mystery-card ${unlocked ? "unlocked reveal" : "locked"}`;
  document.getElementById("mission-icon").textContent = unlocked ? "食" : "?";
  document.getElementById("mission-status").textContent = unlocked ? "MISSION UNLOCKED" : "UNLOCKS ONE HOUR BEFORE";
  document.getElementById("mission-title").textContent = unlocked ? "番割田甕缸雞" : "目的地暫時保密";
  document.getElementById("locked-content").hidden = unlocked;
  document.getElementById("revealed-content").hidden = !unlocked;
  const test = document.getElementById("test-reveal");
  test.classList.toggle("active", testReveal);
  test.innerHTML = testReveal ? '<span>↺</span><p><b>恢復倒數畫面</b><small>回到尚未解鎖狀態</small></p>' : '<span>✦</span><p><b>測試：模擬時間到</b><small>按下後查看正式揭曉效果</small></p>';
  if (!unlocked) {
    const t = countdownParts(unlockAt - Date.now());
    document.getElementById("countdown").innerHTML = `${t.days ? `<span><b>${String(t.days).padStart(2,"0")}</b><small>天</small></span>` : ""}<span><b>${String(t.hours).padStart(2,"0")}</b><small>時</small></span><em>:</em><span><b>${String(t.minutes).padStart(2,"0")}</b><small>分</small></span><em>:</em><span><b>${String(t.seconds).padStart(2,"0")}</b><small>秒</small></span>`;
  }
}
document.getElementById("test-reveal").addEventListener("click", () => { testReveal = !testReveal; renderMission(); });
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
  const roomIndex = rooms.findIndex(room => room.people.includes(name));
  if (carIndex < 0 || roomIndex < 0) return null;
  return { name, carIndex, roomIndex, leader: cars[carIndex][0], room: rooms[roomIndex] };
}

function showTraveler(traveler) {
  document.getElementById("query-message").hidden = true;
  document.getElementById("result-name").textContent = traveler.name;
  document.getElementById("result-car").textContent = `第 ${traveler.carIndex + 1} 車`;
  document.getElementById("result-leader").textContent = traveler.leader;
  document.getElementById("result-leader-note").textContent = traveler.name === traveler.leader ? "你就是本車車長" : "";
  document.getElementById("result-room").textContent = `第 ${traveler.roomIndex + 1} 房`;
  document.getElementById("result-room-type").textContent = traveler.room.type;
  const roommates = traveler.room.people.filter(person => person !== traveler.name);
  document.getElementById("result-roommates").innerHTML = roommates.length ? roommates.map(person => `<span>${person}</span>`).join("") : "<span>此房沒有其他室友</span>";
  document.getElementById("name-search").hidden = true;
  document.getElementById("query-result").hidden = false;
}

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
