const canvas = document.getElementById("emotionCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t = 0;
let u = 0;
let history = [];

function animate() {
  t += 0.01;
  u += Math.sin(t * 0.1) * 0.005;
  const intensity = Math.abs(Math.sin(t + u));
  ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const x = canvas.width/2 + Math.sin(t*2 + u) * 150;
  const y = canvas.height/2 + Math.cos(t*3 + u) * 150;
  const r = 40 + Math.sin(t*4)*15;

  const rCol = Math.floor(128 + 127 * Math.sin(t));
  const gCol = Math.floor(128 + 127 * Math.sin(t + 2));
  const bCol = Math.floor(128 + 127 * Math.sin(t + 4));

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, 0.7)`;
  ctx.fill();

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