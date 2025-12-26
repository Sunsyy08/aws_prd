const RECORDS_KEY = "uniformRecords"; // index.html과 동일 key
const tbody = document.getElementById("historyBody");
const searchInput = document.getElementById("searchInput");

// 요약 카드 요소
const totalCountEl = document.getElementById("totalCount");
const violationCountEl = document.getElementById("violationCount");

// 저장된 기록 불러오기
function loadRecords() {
  return JSON.parse(localStorage.getItem(RECORDS_KEY)) || [];
}

// 테이블 렌더링 + 요약 업데이트
function renderRecords(records) {
  tbody.innerHTML = "";

  let total = records.length;
  let violations = records.filter(r => r.violation).length;

  totalCountEl.textContent = `총 인식: ${total}건`;
  violationCountEl.textContent = `위반: ${violations}건`;

  records.forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r.date}</td>
        <td>${r.time}</td>
        <td>${r.studentId}</td>
        <td>${r.name}</td>
        <td>
          <span class="badge ${r.result === "교복" ? "blue" : "red"}">
            ${r.result === "교복" ? "👔 교복" : "👕 사복"}
          </span>
        </td>
        <td>
          <span class="badge ${r.violation ? "red" : "green"}">
            ${r.violation ? "위반" : "정상"}
          </span>
        </td>
      </tr>
    `;
  });
}

// 초기 로드~
let records = loadRecords();
renderRecords(records);

// 검색 기능
if (searchInput) {
  searchInput.addEventListener("input", e => {
    const q = e.target.value.trim();
    renderRecords(
      records.filter(r => r.name.includes(q) || r.studentId.includes(q))
    );
  });
}

// 상단 알림 상태 업데이트
function updateHeaderNotification() {
  const notifRecords = JSON.parse(localStorage.getItem("notificationsState")) || [];
  const unreadCount = notifRecords.filter(n => n.status === "unread").length;

  // 상단 헤더 '알림 시스템' 버튼
  const notifTab = document.querySelector(".tabs .tab[href='notification.html'], .tabs .tab.active");

  if (!notifTab) return;

  // 기존 span 제거
  const existingBadge = notifTab.querySelector(".unread-badge");
  if (existingBadge) existingBadge.remove();

  if (unreadCount > 0) {
    const badge = document.createElement("span");
    badge.className = "unread-badge";
    badge.textContent = `●`; // 또는 'NEW' 표시
    badge.style.color = "red";
    badge.style.marginLeft = "5px";
    notifTab.appendChild(badge);
  }
}


// 실시간 기록 업데이트 (index.html에서 기록 추가 시)
window.addEventListener("storage", e => {
  if (e.key === RECORDS_KEY) {
    records = loadRecords();
    renderRecords(records);
  }
  updateHeaderNotification();
});
