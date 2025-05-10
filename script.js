const canvas = document.getElementById("emotionCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t = 0;
let u = 0;
let history = [];

function animate() {
  t += 0.01;
  u += Math.sin(t * 0.2) * 0.005;

  const intensity = Math.abs(Math.sin(t + u));
  ctx.fillStyle = `rgba(0, 0, 0, 0.08)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 100; i++) {
    const angle = t + i * 0.1;
    const r = 80 + 40 * Math.sin(angle + u);
    const x = canvas.width / 2 + r * Math.cos(angle);
    const y = canvas.height / 2 + r * Math.sin(angle);

    const rCol = Math.floor(128 + 127 * Math.sin(angle));
    const gCol = Math.floor(128 + 127 * Math.sin(angle + 2));
    const bCol = Math.floor(128 + 127 * Math.sin(angle + 4));
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, 0.7)`;
    ctx.fill();
  }

  requestAnimationFrame(animate);
}
animate();

async function send() {
  const inputBox = document.getElementById("userInput");
  const log = document.getElementById("log");
  const input = inputBox.value.trim();
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

  history.push(input.length);
  u += input.length * 0.01;
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ko-KR";
  utter.pitch = 1 + Math.sin(t);
  utter.rate = 1;
  speechSynthesis.speak(utter);
}

window.onload = () => {
  const saved = localStorage.getItem("urs_last_log");
  if (saved) document.getElementById("log").innerHTML = saved;
};