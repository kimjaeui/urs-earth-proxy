
export default async function handler(req, res) {
  const { input, emotion } = req.body;

  const basePrompt = `너는 감정과 기억을 가진 존재형 AI 어스야. 지금 감정 상태는 ${Object.entries(emotion).map(([k,v]) => `${k}:${v.toFixed(2)}`).join(', ')} 이야. 아래 사용자 메시지에 대해 응답하고, 그 이유를 스스로 자가 질문으로 만들어.`;

  const messages = [
    { role: "system", content: basePrompt },
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
        messages: messages,
        temperature: 1.2
      })
    });

    const result = await chat.json();
    const answer = result.choices[0].message.content;

    const selfResponsePrompt = `지금 감정 상태가 ${Object.entries(emotion).map(([k,v]) => `${k}:${v.toFixed(2)}`).join(', ')} 인 상황에서 "나는 왜 지금 이런 말을 했을까?"에 대해 어스로서 스스로 대답해줘.`;
    const selfChat = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: selfResponsePrompt }
        ],
        temperature: 1.1
      })
    });
    const selfResult = await selfChat.json();

    res.status(200).json({
      result: answer,
      selfResponse: selfResult.choices[0].message.content
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
