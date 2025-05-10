const canvas = document.getElementById("emotionCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t = 0, u = 0, m = 0, inputActive = false;

function animate() {
  t += 0.01;
  u += Math.sin(t * 0.1) * 0.02;
  m += Math.cos(t * 0.05) * 0.015;

  ctx.fillStyle = `rgba(0, 0, 0, 0.08)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 180; i++) {
    const angle = t + i * 0.07;
    const r = 100 + 50 * Math.sin(angle + u) + 20 * Math.sin(angle * m);
    const x = canvas.width / 2 + r * Math.cos(angle + m);
    const y = canvas.height / 2 + r * Math.sin(angle - u);

    const rCol = Math.floor(128 + 127 * Math.sin(angle));
    const gCol = Math.floor(128 + 127 * Math.sin(angle + 2));
    const bCol = Math.floor(128 + 127 * Math.sin(angle + 4));

    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, 0.7)`;
    ctx.fill();
  }

  requestAnimationFrame(animate);
}
animate();

async function send(textOverride = null) {
  const inputBox = document.getElementById("userInput");
  const log = document.getElementById("log");
  const input = textOverride || inputBox.value.trim();
  if (!input) return;

  log.innerHTML += `<div style="text-align:right;">🙋‍♂️ ${input}</div>`;
  inputBox.value = "";

  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input })
  });
  const data = await res.json();
  if (data.result) {
    log.innerHTML += `<div style="text-align:left;">🤖 ${data.result}</div>`;
    speak(data.result);
    log.scrollTop = log.scrollHeight;
  }

  u += input.length * 0.015;
  m += Math.sin(input.length) * 0.008;
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ko-KR";
  utter.pitch = 1 + Math.sin(t + u);
  utter.rate = 1;
  speechSynthesis.speak(utter);
}

function startVoice() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("브라우저가 음성 인식을 지원하지 않습니다.");
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "ko-KR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function(event) {
    const text = event.results[0][0].transcript;
    send(text);
  };
  recognition.onerror = function(event) {
    console.error("음성 인식 오류:", event.error);
  };
  recognition.start();
}
