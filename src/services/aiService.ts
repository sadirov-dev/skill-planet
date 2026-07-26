// Real AI Service — Groq Llama 3.3 70B + Google Gemini 2.0 Flash
// 100% live API calls. NO templates. NO hardcoded answers.

export type AiModelProvider = 'groq' | 'gemini';

function getGroqKey(): string {
  // Key is stored in .env (VITE_GROQ_API_KEY) — never committed to git
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) {
    return import.meta.env.VITE_GROQ_API_KEY;
  }
  return '';
}

function getGeminiKey(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  return '';
}

export async function askAiAssistant(
  userQuery: string,
  _courseTitle = '',
  model: AiModelProvider = 'groq',
  history: { role: 'user' | 'ai'; text: string }[] = []
): Promise<string> {
  const query = userQuery.trim();
  if (!query) return '';

  // Build full conversation history for context memory (last 10 messages)
  const contextMessages = history.slice(-10).map(m => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.text
  }));

  // ⚡ GROQ — Llama 3.3 70B (live API, ANY question, full dialogue memory)
  if (model === 'groq') {
    const groqKey = getGroqKey();
    if (!groqKey) return 'API ключ не найден. Добавьте VITE_GROQ_API_KEY в файл .env';

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'Ты — умный ИИ-ассистент. Отвечай на любые вопросы пользователя на том языке, на котором он пишет. Давай прямой, точный и полезный ответ без лишних вступлений и шаблонов.'
            },
            ...contextMessages,
            { role: 'user', content: query }
          ],
          temperature: 0.7,
          max_tokens: 800,
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text?.trim()) return text.trim();
      }

      const errData = await res.json().catch(() => ({}));
      console.error('Groq error:', res.status, errData);
    } catch (e) {
      console.error('Groq fetch error:', e);
    }

    return 'Не удалось подключиться к Llama 3.3. Проверьте интернет или попробуйте снова.';
  }

  // ♊ GEMINI — Google Gemini 2.0 Flash (live API, any question)
  if (model === 'gemini') {
    const geminiKey = getGeminiKey();
    if (geminiKey) {
      try {
        const fullPrompt = [
          ...history.slice(-10).map(m => `${m.role === 'ai' ? 'Ассистент' : 'Пользователь'}: ${m.text}`),
          `Пользователь: ${query}`
        ].join('\n') + '\nОтветь на вопрос пользователя прямо и по существу.';

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: fullPrompt }] }]
            })
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text?.trim()) return text.trim();
        }
      } catch (e) {
        console.error('Gemini fetch error:', e);
      }
    }

    // Gemini fallback → use Groq instead
    return askAiAssistant(userQuery, _courseTitle, 'groq', history);
  }

  return 'Модель не выбрана.';
}
