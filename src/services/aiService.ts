// Advanced Real-Time AI Service for SkillPlanet
// Supports dual real-time AI models: Groq Llama 3.3 70B & Google Gemini 2.0 Flash

export type AiModelProvider = 'groq' | 'gemini';

function getGroqKey(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GROQ_API_KEY) {
    return import.meta.env.VITE_GROQ_API_KEY;
  }
  try {
    return atob("Z3NrX0c2RXR4NkptT2pyQUd3NkhqaEZxV0dkeWIzRllUQmd6NEg1RUsxTHRLbFlZRVFlUlUycw==");
  } catch {
    return "";
  }
}

function getGeminiKey(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  try {
    return atob("QVEuQWI4Uk42S1JsVktPQnMtMlJ6X0daUF9ONFJQRFl2Z2xzYzJWNDRJV3dUUS0yeDB5REE=");
  } catch {
    return "";
  }
}

export interface AiMessage {
  role: 'user' | 'ai';
  text: string;
}

export async function askAiAssistant(
  userQuery: string,
  courseTitle = 'General English / Python',
  model: AiModelProvider = 'groq'
): Promise<string> {
  const query = userQuery.trim();

  // ⚡ MODEL 1: GROQ CLOUD (Llama-3.3 70B Versatile)
  if (model === 'groq') {
    const groqKey = getGroqKey();
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
              content: `Ты — высокоинтеллектуальный ИИ-Тьютор образовательной платформы SkillPlanet по курсу "${courseTitle}". Отвечай полно, вежливо, развернуто и понятно на русском языке с использованием форматирования Markdown, приведением примера кода или грамматики. Никаких шаблонных отписок!`
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text;
      }
    } catch (err) {
      console.warn('Groq fetch error:', err);
    }
  }

  // ♊ MODEL 2: GOOGLE GEMINI (Gemini 2.0 Flash / 1.5 Flash)
  if (model === 'gemini') {
    const geminiKey = getGeminiKey();
    try {
      const promptText = `Ты — персональный ИИ-Тьютор образовательной платформы SkillPlanet по курсу "${courseTitle}". Ответь развернуто, вежливо, глубоко и интересно на русском языке с использованием Markdown: ${query}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        // Fallback to Gemini 1.5 Flash
        const res15 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        });
        if (res15.ok) {
          const data15 = await res15.json();
          const text15 = data15?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text15) return text15;
        }
      }
    } catch (err) {
      console.warn('Gemini fetch error:', err);
    }
  }

  // Fallback if network fails completely
  return `Извините, не удалось установить связь с сервером ИИ. Проверьте интернет-соединение и попробуйте отправить запрос еще раз.`;
}
