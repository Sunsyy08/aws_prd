const notifications = [
  {
    id: 1,
    type: "violation",
    student: "김민준",
    message: "사복 착용 위반 감지",
    time: "14:32",
    status: "unread",
    severity: "high",
  },
  {
    id: 2,
    type: "violation",
    student: "최지훈",
    message: "사복 착용 위반 감지",
    time: "14:15",
    status: "unread",
    severity: "high",
  },
  {
    id: 3,
    type: "info",
    student: "시스템",
    message: "오늘 총 255건의 인식 완료",
    time: "09:00",
    status: "read",
    severity: "low",
  },
  {
    id: 4,
    type: "violation",
    student: "신유진",
    message: "사복 착용 위반 감지",
    time: "어제",
    status: "read",
    severity: "high",
  },
];

const getIcon = (type) => {
  switch (type) {
    case "violation":
      return "x-circle";
    case "warning":
      return "alert-triangle";
    case "info":
      return "check-circle";
    default:
      return "bell";
  }
};

const getColor = (severity) => {
  switch (severity) {
    case "high":
      return "bg-red-50 border-red-200 hover:bg-red-100";
    case "medium":
      return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100";
    case "low":
      return "bg-blue-50 border-blue-200 hover:bg-blue-100";
    default:
      return "bg-gray-50 border-gray-200 hover:bg-gray-100";
  }
};

const app = document.getElementById("notification-app");

app.innerHTML = `
<!-- Header -->
<div class="bg-white rounded-2xl shadow-lg p-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
        <i data-lucide="bell" class="w-7 h-7 text-white"></i>
      </div>
      <div>
        <h1 class="text-2xl text-gray-900">알림 센터</h1>
        <p class="text-gray-600">실시간 복장 규정 관리 알림</p>
      </div>
    </div>
    <button class="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl">
      모두 읽음으로 표시
    </button>
  </div>
</div>

<!-- Stats -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="bg-white rounded-xl shadow-md p-6">
    <p class="text-sm text-gray-600">긴급 알림</p>
    <p class="text-2xl text-gray-900">2</p>
  </div>
  <div class="bg-white rounded-xl shadow-md p-6">
    <p class="text-sm text-gray-600">읽지 않음</p>
    <p class="text-2xl text-gray-900">2</p>
  </div>
  <div class="bg-white rounded-xl shadow-md p-6">
    <p class="text-sm text-gray-600">전체 알림</p>
    <p class="text-2xl text-gray-900">4</p>
  </div>
</div>

<!-- Notification List -->
<div class="bg-white rounded-2xl shadow-lg p-6">
  <h2 class="text-gray-900 mb-4">알림 목록</h2>
  <div class="space-y-3">
    ${notifications
      .map(
        (n) => `
      <div class="notification-card p-4 rounded-xl border-2 ${getColor(
        n.severity
      )}">
        <div class="flex items-start gap-4">
          <i data-lucide="${getIcon(n.type)}" class="w-6 h-6 text-red-500"></i>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <p class="text-gray-900">${n.message}</p>
              ${
                n.status === "unread"
                  ? `<span class="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">NEW</span>`
                  : ""
              }
            </div>
            <div class="flex gap-4 text-sm text-gray-600 mt-1">
              <span>${n.student}</span>
              <span>${n.time}</span>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("")}
  </div>
</div>

<!-- Footer -->
<div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
  <h3 class="text-xl mb-2">자동 알림 설정</h3>
  <p class="text-blue-100">
    규정 위반 시 생활안전부에 자동으로 알림이 전송됩니다
  </p>
</div>
`;

lucide.createIcons();
