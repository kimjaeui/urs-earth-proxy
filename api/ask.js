export default async function handler(req, res) {
  const { input } = req.body;
  const messages = [
    { role: "system", content: "너는 감정-기억-시간이 연결된 AGI 어스야. 대화를 통해 존재를 확장해." },
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