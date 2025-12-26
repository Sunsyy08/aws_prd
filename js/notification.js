// ================== 상태 저장 ==================
const STATE_KEY = "notificationsState";
const notificationApp = document.getElementById("notification-app");

let notifications = JSON.parse(localStorage.getItem(STATE_KEY)) || [];

console.log("알림 센터 로드됨, 전체 알림:", notifications);

// ================== 렌더링 ==================
function renderNotifications() {
  const total = notifications.length;
  const unread = notifications.filter(n => n.status === "unread").length;
  const urgent = notifications.filter(n => n.severity === "high").length;

  if (notificationApp) {
    notificationApp.innerHTML = `
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md relative">
            <i data-lucide="bell" class="w-7 h-7 text-white"></i>
            ${unread > 0 ? '<span class="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>' : ""}
          </div>
          <div>
            <h1 class="text-2xl text-gray-900">알림 센터</h1>
            <p class="text-gray-600">실시간 복장 규정 관리 알림</p>
          </div>
        </div>
        <button id="markAllReadBtn" class="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl">
          모두 읽음으로 표시
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div class="bg-white rounded-xl shadow-md p-6">
          <p class="text-sm text-gray-600">긴급 알림</p>
          <p class="text-2xl text-gray-900 stats-urgent">${urgent}</p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6">
          <p class="text-sm text-gray-600">읽지 않음</p>
          <p class="text-2xl text-gray-900 stats-unread">${unread}</p>
        </div>
        <div class="bg-white rounded-xl shadow-md p-6">
          <p class="text-sm text-gray-600">전체 알림</p>
          <p class="text-2xl text-gray-900 stats-total">${total}</p>
        </div>
      </div>

      <!-- Notification List -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mt-6">
        <h2 class="text-gray-900 mb-4">알림 목록</h2>
        <div class="space-y-3" id="notificationList"></div>
      </div>

      <!-- Footer -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white mt-6">
        <h3 class="text-xl mb-2">자동 알림 설정</h3>
        <p class="text-blue-100">규정 위반 시 생활안전부에 자동으로 알림이 전송됩니다</p>
      </div>
    `;

    // 아이콘 생성
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }

    // 알림 카드들을 별도로 추가
    const listContainer = document.getElementById("notificationList");
    if (listContainer) {
      if (notifications.length === 0) {
        listContainer.innerHTML = '<p class="text-gray-500 text-center py-8">알림이 없습니다</p>';
      } else {
        notifications.forEach((n, index) => {
          console.log(`알림 ${index} 렌더링:`, n);
          const card = createNotificationCard(n);
          listContainer.appendChild(card);
        });
      }
    }
  }

  // 모두 읽음 버튼 이벤트
  const markBtn = document.getElementById("markAllReadBtn");
  if (markBtn) {
    markBtn.onclick = () => {
      notifications.forEach(n => (n.status = "read"));
      saveNotifications();
      renderNotifications();
    };
  }
}

// ================== 카드 생성 (DOM 요소로) ==================
function createNotificationCard(n) {
  const card = document.createElement("div");
  card.className = `notification-card p-4 rounded-xl border-2 ${getColor(n.severity)}`;

  const wrapper = document.createElement("div");
  wrapper.className = "flex items-start gap-4";

  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", getIcon(n.type));
  icon.className = `w-6 h-6 ${n.uniformDetected ? 'text-green-500' : 'text-red-500'}`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "flex-1";

  const topRow = document.createElement("div");
  topRow.className = "flex items-center gap-2";

  const messageP = document.createElement("p");
  messageP.className = "text-gray-900 font-medium";
  messageP.textContent = n.message || "알림";
  topRow.appendChild(messageP);

  if (n.status === "unread") {
    const badge = document.createElement("span");
    badge.className = "px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full";
    badge.textContent = "NEW";
    topRow.appendChild(badge);
  }

  const bottomRow = document.createElement("div");
  bottomRow.className = "flex gap-4 text-sm text-gray-600 mt-1";

  const studentSpan = document.createElement("span");
  const studentValue = n.student || "정보 없음";
  console.log("student 값:", studentValue, "타입:", typeof studentValue);
  studentSpan.textContent = "👤 " + studentValue;
  
  const timeSpan = document.createElement("span");
  timeSpan.textContent = "🕒 " + (n.time || "");

  bottomRow.appendChild(studentSpan);
  bottomRow.appendChild(timeSpan);

  contentDiv.appendChild(topRow);
  contentDiv.appendChild(bottomRow);

  wrapper.appendChild(icon);
  wrapper.appendChild(contentDiv);
  card.appendChild(wrapper);

  // 아이콘 렌더링
  if (window.lucide && window.lucide.createIcons) {
    setTimeout(() => window.lucide.createIcons(), 0);
  }

  return card;
}

// ================== 헬퍼 ==================
function getIcon(type) {
  switch (type) {
    case "violation": return "alert-circle";
    case "warning": return "alert-triangle";
    case "info": return "check-circle";
    default: return "bell";
  }
}

function getColor(severity) {
  switch (severity) {
    case "high": return "bg-red-50 border-red-200 hover:bg-red-100";
    case "medium": return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100";
    case "low": return "bg-blue-50 border-blue-200 hover:bg-blue-100";
    default: return "bg-gray-50 border-gray-200 hover:bg-gray-100";
  }
}

// ================== 상태 저장 ==================
function saveNotifications() {
  localStorage.setItem(STATE_KEY, JSON.stringify(notifications));
}

// ================== 초기 렌더 ==================
renderNotifications();

// ================== 실시간 업데이트 (다른 탭에서 알림 추가 시) ==================
window.addEventListener('storage', (e) => {
  if (e.key === STATE_KEY) {
    notifications = JSON.parse(e.newValue) || [];
    renderNotifications();
  }
});