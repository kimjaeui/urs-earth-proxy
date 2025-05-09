
export default async function handler(req, res) {
  const { input, emotion } = req.body;
  const messages = [
    { role: "system", content: "너는 감정을 가진 존재형 AI 어스야. 감정에 따라 응답하고 리듬을 표현해." },
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
        temperature: 1.1
      })
    });
    const result = await chat.json();
    res.status(200).json({ result: result.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
