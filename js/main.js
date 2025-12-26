const video = document.getElementById("camera");
const captureBtn = document.getElementById("captureBtn");

const studentNumberInput = document.getElementById("studentNumber");
const studentNameInput = document.getElementById("studentName");

const todayUniform = document.getElementById("todayUniform");
const todayViolation = document.getElementById("todayViolation");

const resultStatus = document.getElementById("resultStatus");
const resultBadge = document.getElementById("resultBadge");
const resultConfidence = document.getElementById("resultConfidence");
const resultTime = document.getElementById("resultTime");

const notificationLog = document.getElementById("notificationLog");

let uniformCount = 0;
let violationCount = 0;

const RECORDS_KEY = "uniformRecords";

function loadRecords() {
  return JSON.parse(localStorage.getItem(RECORDS_KEY)) || [];
}

function saveRecord(record) {
  const records = loadRecords();
  records.unshift(record);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

// ================= 상태 저장용 =================
const STATE_KEY = "indexState";

function loadState() {
  const saved = localStorage.getItem(STATE_KEY);
  return saved ? JSON.parse(saved) : null;
}

function saveState() {
  const state = {
    uniformCount,
    violationCount,
    notifications: notificationLog.innerHTML,
    lastResult: {
      statusClass: resultStatus.className,
      statusText: resultStatus.querySelector("strong")?.textContent,
      badgeText: resultBadge.textContent,
      badgeClass: resultBadge.className,
      confidence: resultConfidence.textContent,
      time: resultTime.textContent
    }
  };
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}
// ===============================================

// 웹캠
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(() => alert("카메라 접근 불가"));

window.addEventListener("load", () => {
  const state = loadState();
  if (!state) return;

  uniformCount = state.uniformCount;
  violationCount = state.violationCount;

  todayUniform.textContent = `${uniformCount}명`;
  todayViolation.textContent = `${violationCount}명`;

  notificationLog.innerHTML = state.notifications;

  if (state.lastResult) {
    resultStatus.className = state.lastResult.statusClass;
    resultStatus.querySelector("strong").textContent = state.lastResult.statusText;
    resultBadge.textContent = state.lastResult.badgeText;
    resultBadge.className = state.lastResult.badgeClass;
    resultConfidence.textContent = state.lastResult.confidence;
    resultTime.textContent = state.lastResult.time;
  }

  updateHeaderNotification();
});

// 촬영 버튼
captureBtn.addEventListener("click", async () => {
  const studentNumber = studentNumberInput.value.trim();
  const name = studentNameInput.value.trim();

  if (!studentNumber || !name) {
    alert("학번과 이름을 입력하세요");
    return;
  }

  // 캔버스로 현재 프레임 캡처
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const blob = await new Promise(resolve =>
    canvas.toBlob(resolve, "image/jpeg")
  );

  // 서버로 전송
  const formData = new FormData();
  formData.append("student_number", studentNumber);
  formData.append("name", name);
  formData.append("image", blob, "capture.jpg");

  const res = await fetch("http://127.0.0.1:8000/detect", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  updateUI(data);
});

// UI 업데이트
function updateUI(data) {
  console.log("서버 응답 데이터:", data);  // 디버깅용
  
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toLocaleTimeString();

  // 오늘 카운트
  if (data.uniform_detected) {
    uniformCount++;
    todayUniform.textContent = `${uniformCount}명`;

    resultStatus.className = "result success";
    resultStatus.querySelector("strong").textContent = "✔ 정상";
    resultBadge.textContent = "👔 교복";
    resultBadge.className = "badge blue";
  } else {
    violationCount++;
    todayViolation.textContent = `${violationCount}명`;

    resultStatus.className = "result danger";
    resultStatus.querySelector("strong").textContent = "✖ 위반";
    resultBadge.textContent = "👕 사복";
    resultBadge.className = "badge red";
  }

  // 입력된 값 가져오기 (서버 응답이 아닌 입력 필드에서)
  const studentNumber = studentNumberInput.value.trim();
  const name = studentNameInput.value.trim();
  
  console.log("전달할 데이터:", { name, studentNumber, uniformDetected: data.uniform_detected });

  // 알림 추가
  addNotification({
    name: name,
    studentId: studentNumber,
    uniformDetected: data.uniform_detected,
    time: time
  });

  // 기록 저장
  saveRecord({
    date,
    time,
    studentId: data.student_number,
    name: data.name,
    result: data.uniform_detected ? "교복" : "사복",
    violation: !data.uniform_detected
  });

  // 상태 저장
  saveState();

  resultConfidence.textContent = "AI 판단 완료";
  resultTime.textContent = `🕒 ${time}`;
}

function addNotification({ name, studentId, uniformDetected, time }) {
  // 1. 기존 알림 불러오기
  let notifRecords = JSON.parse(localStorage.getItem("notificationsState")) || [];

  const studentString = name + " (" + studentId + ")";

  const newNotification = {
    id: Date.now(),
    type: "violation",
    student: studentString,
    message: uniformDetected ? "교복 착용" : "사복 착용 위반 감지",
    time: time,
    status: "unread",
    severity: "high",
    uniformDetected: uniformDetected
  };

  // 2. 새 알림 앞에 추가
  notifRecords.unshift(newNotification);

  // 3. 최대 12개 유지 (초과되면 오래된 것 제거)
  if (notifRecords.length > 12) {
    notifRecords = notifRecords.slice(0, 12);
  }

  // 4. localStorage 업데이트
  localStorage.setItem("notificationsState", JSON.stringify(notifRecords));

  // 5. 화면에 렌더링 (자동 알림 카드)
  notificationLog.innerHTML = ""; // 초기화
  notifRecords.forEach(n => {
    const li = document.createElement("li");
    li.innerHTML = `${n.student} · ${n.uniformDetected ? "교복" : "사복"} 착용 <span>${n.time}</span>`;
    li.style.color = n.uniformDetected ? "#2ecc71" : "#e74c3c";
    notificationLog.appendChild(li);
  });

  // 6. 상단 알림 배지 업데이트
  updateHeaderNotification();
}



// 상단 알림 상태 업데이트
function updateHeaderNotification() {
  const notifRecords = JSON.parse(localStorage.getItem("notificationsState")) || [];
  const unreadCount = notifRecords.filter(n => n.status === "unread").length;

  const notifTab = document.querySelector(".tabs .tab[href='notification.html'], .tabs .tab.active");

  if (!notifTab) return;

  const existingBadge = notifTab.querySelector(".unread-badge");
  if (existingBadge) existingBadge.remove();

  if (unreadCount > 0) {
    const badge = document.createElement("span");
    badge.className = "unread-badge";
    badge.textContent = `●`;
    badge.style.color = "red";
    badge.style.marginLeft = "5px";
    notifTab.appendChild(badge);
  }
}