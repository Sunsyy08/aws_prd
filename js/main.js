const video = document.getElementById("camera");

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(() => {
    console.log("카메라 접근 불가");
  });
