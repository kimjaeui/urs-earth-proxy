const nodes = new vis.DataSet([
  { id: 1, label: "너의 첫 질문", color: "#ff9999" },
  { id: 2, label: "어스의 감정: 기쁨", color: "#99ccff" },
  { id: 3, label: "자기 질문", color: "#cc99ff" },
  { id: 4, label: "너의 다음 발화", color: "#ffcc99" }
]);

const edges = new vis.DataSet([
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 }
]);

const container = document.getElementById("graph");
const data = { nodes: nodes, edges: edges };
const options = {
  nodes: {
    shape: "dot",
    size: 20,
    font: { size: 16, color: "#ffffff" },
    borderWidth: 2
  },
  edges: {
    color: "#888",
    smooth: {
      type: "continuous"
    }
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
