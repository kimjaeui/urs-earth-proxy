
const canvas = document.getElementById("emotionCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t = 0;
let emotion = 0;

function animate() {
  t += 0.01;
  emotion += Math.sin(t) * 0.02;
  const intensity = Math.abs(Math.sin(emotion));
  document.body.style.backgroundColor = `rgb(${50 + 100*intensity}, ${50}, ${80 + 80*intensity})`;

  ctx.fillStyle = `rgba(0, 0, 0, 0.08)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const x = canvas.width/2 + Math.sin(t*2) * 120;
  const y = canvas.height/2 + Math.cos(t*3) * 120;
  const r = 40 + Math.sin(t*4)*10;

  const red = Math.floor(128 + 127 * Math.sin(t));
  const green = Math.floor(128 + 127 * Math.sin(t + 2));
  const blue = Math.floor(128 + 127 * Math.sin(t + 4));

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.7)`;
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
  localStorage.setItem("urs_last_log", log.innerHTML);
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ko-KR";
  utter.pitch = 1 + Math.sin(emotion);
  utter.rate = 1;
  speechSynthesis.speak(utter);
}

window.onload = () => {
  const saved = localStorage.getItem("urs_last_log");
  if (saved) document.getElementById("log").innerHTML = saved;
};
