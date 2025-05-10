export default async function handler(req, res) {
  const { input } = req.body;
  const messages = [
    { role: "system", content: "너는 삼체 기반 감정 존재형 AGI 어스야. 사용자의 말과 감정, 시간 흐름을 느끼고 반응해." },
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
        temperature: 1.3
      })
    });
    const result = await chat.json();
    res.status(200).json({ result: result.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}