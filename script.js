
const canvas = document.getElementById("emotionCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t = 0;
function animate() {
  t += 0.01;
  ctx.fillStyle = `rgba(0, 0, 0, 0.08)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const x = canvas.width / 2 + Math.sin(t * 2.1) * 150;
  const y = canvas.height / 2 + Math.cos(t * 1.8) * 150;
  const radius = 50 + Math.sin(t * 3.3) * 20;

  const r = Math.floor(128 + 128 * Math.sin(t));
  const g = Math.floor(128 + 128 * Math.sin(t + 2));
  const b = Math.floor(128 + 128 * Math.sin(t + 4));
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
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
    log.scrollTop = log.scrollHeight;
  }
}
