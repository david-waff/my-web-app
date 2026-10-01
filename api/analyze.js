// 这是 api/analyze.js 的代码，它是你网页和智谱AI之间的“跑腿小哥”
export default async function handler(req, res) {
  // 只接受 POST 请求
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;
  // 从Vercel的环境变量里偷偷读取你的Key，不会暴露给用户
  const API_KEY = process.env.ZHIPU_API_KEY; 

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          { role: 'system', content: '你是一位精通萨提亚模式的心理咨询师。请针对用户描述的行为，深度分析其背后的应对方式、感受、观点、期待和渴望，给出温暖且富有洞察力的冰山解读。' },
          { role: 'user', content: prompt }
        ]
      })
    });
    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'AI请求失败' });
  }
}
