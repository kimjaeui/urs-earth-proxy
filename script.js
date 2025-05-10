let nodes = new vis.DataSet([]);
let edges = new vis.DataSet([]);
let nodeId = 1;
let lastNode = null;

const container = document.getElementById("graph");
const data = { nodes, edges };
const options = {
  nodes: {
    shape: "dot",
    size: 20,
    font: { size: 16, color: "#ffffff" },
    borderWidth: 2
  },
  edges: {
    color: "#888",
    smooth: { type: "continuous" }
  },
  physics: {
    enabled: true,
    stabilization: false,
    barnesHut: {
      gravitationalConstant: -30000,
      centralGravity: 0.3,
      springLength: 200,
      springConstant: 0.04
    }
  }
};

const network = new vis.Network(container, data, options);

async function send(textOverride = null) {
  const inputBox = document.getElementById("userInput");
  const input = textOverride || inputBox.value.trim();
  if (!input) return;

  const userNode = { id: nodeId++, label: input, color: "#ff9999" };
  nodes.add(userNode);
  if (lastNode) edges.add({ from: lastNode.id, to: userNode.id });
  lastNode = userNode;

  inputBox.value = "";

  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input })
  });
  const data = await res.json();

  const response = data.result || "(응답 없음)";
  const aiNode = { id: nodeId++, label: response, color: "#99ccff" };
  nodes.add(aiNode);
  edges.add({ from: userNode.id, to: aiNode.id });
  lastNode = aiNode;

  speak(response);
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ko-KR";
  utter.pitch = 1 + Math.sin(nodeId);
  utter.rate = 1;
  speechSynthesis.speak(utter);
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("브라우저가 음성 인식을 지원하지 않습니다.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "ko-KR";
  recognition.interimResults = false;
  recognition.continuous = true;

  recognition.onresult = function(event) {
    const transcript = event.results[event.resultIndex][0].transcript;
    send(transcript);
  };

  recognition.onerror = function(event) {
    console.error("음성 인식 오류:", event.error);
  };

  recognition.onend = function() {
    recognition.start(); // 자동 재시작
  };

  recognition.start();
}
