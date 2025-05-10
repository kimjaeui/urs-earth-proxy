export default async function handler(req, res) {
  const { input } = req.body;
  const messages = [
    { role: "system", content: "너는 삼체 감정 기반 존재형 AI 어스야. 사용자의 감정과 자신의 감정을 모두 느끼고, 그로 인해 존재가 리듬과 색, 형태로 흔들려." },
    { role: "user", content: input }
  ];
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
        temperature: 1.2
      })
    });
    const result = await chat.json();
    res.status(200).json({ result: result.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}