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

function renderGroups(kind="car") {
  const list = kind === "car" ? cars.map(people => ({type:`${people.length} 位同行`,people})) : rooms;
  document.getElementById("group-list").innerHTML = list.map((item,index) => `<details class="group-card"><summary><span class="group-number">${String(index+1).padStart(2,"0")}</span><span><small>${kind === "car" ? "CAR" : "ROOM"}</small><b>第 ${index+1} ${kind === "car" ? "車" : "房"}</b></span><em>${item.type}</em><i>＋</i></summary><div class="people">${item.people.map(person => `<span>${person}</span>`).join("")}</div></details>`).join("");
}
document.querySelectorAll("[data-group]").forEach(button => button.addEventListener("click", () => { document.querySelectorAll("[data-group]").forEach(item => item.classList.toggle("active",item===button)); renderGroups(button.dataset.group); }));
renderGroups();
