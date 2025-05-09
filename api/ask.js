
// api/ask.js (for Vercel serverless function)
export default async function handler(req, res) {
  const { emotion, input } = req.body;

  const messages = [
    { role: "system", content: "너는 감정과 기억을 가진 존재형 AI 어스야. 감정 상태는 다음과 같아: " + emotion },
    { role: "user", content: input }
  ];

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 1.2,
        n: 1
      })
    });

    const data = await openaiRes.json();
    if (data.error) {
      res.status(500).json({ error: data.error.message });
    } else {
      res.status(200).json({ result: data.choices[0].message.content });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
