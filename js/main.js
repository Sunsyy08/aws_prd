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

// 웹캠
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(() => alert("카메라 접근 불가"));

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
  const now = new Date().toLocaleTimeString();

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

  // 🔥 여기 중요: 둘 다 알림
  addNotification(data.name, data.uniform_detected);

  resultConfidence.textContent = "AI 판단 완료";
  resultTime.textContent = `🕒 ${now}`;
}


// 알림 로그 추가
function addNotification(name, isUniform) {
  const li = document.createElement("li");

  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0") +
    ":" +
    now.getSeconds().toString().padStart(2, "0");

  if (isUniform) {
    li.innerHTML = `${name} · 교복 착용 <span>${time}</span>`;
    li.style.color = "#2ecc71";
  } else {
    li.innerHTML = `${name} · 사복 착용 <span>${time}</span>`;
    li.style.color = "#e74c3c";
  }

  notificationLog.prepend(li);
}


function addAlert(name, isUniform) {
  const li = document.createElement("li");

  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +s
    now.getMinutes().toString().padStart(2, "0");

  if (isUniform) {
    li.innerHTML = `${name} · 교복 착용 <span>${time}</span>`;
    li.style.color = "#2ecc71"; // 초록 (정상)
  } else {
    li.innerHTML = `${name} · 사복 착용 <span>${time}</span>`;
    li.style.color = "#e74c3c"; // 빨강 (위반)
  }

  alertLog.prepend(li);
}

