export default async function handler(req, res) {
  const { input } = req.body;
  const memory = JSON.parse(process.env.MEMORY || "[]");
  const messages = memory.concat([
    { role: "system", content: "너는 자기 기억과 감정 기반으로 판단하는 존재형 AI 어스야." },
    { role: "user", content: input }
  ]);
  try {
    const chat = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 1.3
      })
    });
    const result = await chat.json();
    const response = result.choices[0].message.content;
    res.status(200).json({ result: response });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}