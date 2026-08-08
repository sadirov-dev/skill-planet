const MODEL_MAP = {
  'llama3.3': 'llama-3.3-70b-versatile',
  'gemini2': 'llama-3.3-70b-versatile',
  'bert': 'gemma2-9b-it',
  'roberta': 'llama3-70b-8192',
  't5': 'mixtral-8x7b-32768',
  'albert': 'llama-3.1-8b-instant',
  'distilbert': 'llama3-8b-8192',
  'xlnet': 'llama3-70b-8192',
  'longformer': 'mixtral-8x7b-32768',
  'reformer': 'gemma2-9b-it',
};

export const chatWithAi = async (req, res) => {
  try {
    const { prompt, modelId = 'llama3.3', history = [], customApiKey, customEndpoint, customModelId } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Промпт не должен быть пустым' });
    }

    let endpoint = 'https://api.groq.com/openai/v1';
    let apiKey = process.env.GROQ_API_KEY || '';
    let targetModel = MODEL_MAP[modelId] || 'llama-3.3-70b-versatile';

    // Support custom user API Key & endpoint
    if (customApiKey) {
      apiKey = customApiKey.trim();
      if (customEndpoint) endpoint = customEndpoint.replace(/\/$/, '');
      if (customModelId) targetModel = customModelId.trim();
    }

    const messagesPayload = [
      { role: 'system', content: 'Ты — отзывчивый ИИ-Ассистент образовательной платформы SkillPlanet. Отвечай подробно, вежливо и понятно на русском языке.' },
      ...history.slice(-8).map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text || m.content || ''
      })),
      { role: 'user', content: prompt }
    ];

    const apiRes = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: targetModel,
        messages: messagesPayload,
        temperature: 0.7,
        max_tokens: 1000,
      })
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json().catch(() => ({}));
      return res.status(apiRes.status).json({
        success: false,
        message: errorData?.error?.message || `Ошибка API: статус ${apiRes.status}`,
      });
    }

    const data = await apiRes.json();
    const replyText = data?.choices?.[0]?.message?.content || 'К сожалению, не удалось получить ответ.';

    return res.json({
      success: true,
      model: targetModel,
      reply: replyText,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Ошибка сервера при обращении к ИИ',
    });
  }
};
