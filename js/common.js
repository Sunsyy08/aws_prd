// ================== 공통 알림 처리 ==================
const NOTIF_KEY = "notificationsState";

// 상단 헤더 '알림 시스템' 버튼에 읽지 않은 알림 표시
function updateHeaderNotificationBadge() {
  const tabs = document.querySelectorAll(".tabs .tab");
  let notifButton = null;
  tabs.forEach(tab => {
    if (tab.textContent.includes("알림 시스템")) {
      notifButton = tab;
    }
  });
  if (!notifButton) return;

  // 기존 badge 제거
  const existingBadge = notifButton.querySelector(".unread-badge");
  if (existingBadge) existingBadge.remove();

  // 읽지 않은 알림 수 체크
  const notifications = JSON.parse(localStorage.getItem(NOTIF_KEY)) || [];
  const unreadCount = notifications.filter(n => n.status === "unread").length;

  if (unreadCount > 0) {
    const badge = document.createElement("span");
    badge.className = "unread-badge";
    badge.textContent = "●"; // 빨간 점
    badge.style.color = "red";
    badge.style.marginLeft = "5px";
    notifButton.appendChild(badge);
  }
}

// 새로운 알림 추가
function addNotification(studentName, studentNumber, message) {
  const notifications = JSON.parse(localStorage.getItem(NOTIF_KEY)) || [];
  const newNotification = {
    id: Date.now(),
    student: `${studentName} (${studentNumber})`,
    message: message,
    time: new Date().toLocaleTimeString(),
    status: "unread",
    type: "violation",
    severity: "high",
  };
  notifications.unshift(newNotification);
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));

  updateHeaderNotificationBadge();
}

// 모두 읽음 처리
function markAllNotificationsRead() {
  const notifications = JSON.parse(localStorage.getItem(NOTIF_KEY)) || [];
  notifications.forEach(n => n.status = "read");
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
  updateHeaderNotificationBadge();
}

// 페이지 로드 시 항상 헤더 표시 갱신
window.addEventListener("load", () => {
  updateHeaderNotificationBadge();
});
