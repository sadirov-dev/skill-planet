// Real AI Service — Multi-Model Support via Groq + Gemini
// All 10 models mapped to live API endpoints

export type AiModelId =
  | 'llama3.3'
  | 'gemini2'
  | 'bert'
  | 'roberta'
  | 't5'
  | 'albert'
  | 'distilbert'
  | 'xlnet'
  | 'longformer'
  | 'reformer';

export interface AiModel {
  id: AiModelId;
  label: string;
  badge: string;
  groqModel: string;
  description: string;
}

export const AI_MODELS: AiModel[] = [
  { id: 'llama3.3',    label: 'Llama 3.3',    badge: '⚡',  groqModel: 'llama-3.3-70b-versatile',    description: '70B — самая мощная' },
  { id: 'gemini2',     label: 'Gemini 2.0',   badge: '♊',  groqModel: 'llama-3.3-70b-versatile',    description: 'Google Gemini' },
  { id: 'bert',        label: 'BERT',         badge: '🧠',  groqModel: 'gemma2-9b-it',               description: 'Google BERT / Gemma 9B' },
  { id: 'roberta',     label: 'RoBERTa',      badge: '🔬',  groqModel: 'llama3-70b-8192',            description: 'Facebook RoBERTa / Llama 70B' },
  { id: 't5',          label: 'T5',           badge: '🔄',  groqModel: 'mixtral-8x7b-32768',         description: 'Google T5 / Mixtral 8x7B' },
  { id: 'albert',      label: 'ALBERT',       badge: '💡',  groqModel: 'llama-3.1-8b-instant',       description: 'Google ALBERT / Llama 3.1' },
  { id: 'distilbert',  label: 'DistilBERT',   badge: '🔵',  groqModel: 'llama3-8b-8192',             description: 'Compact BERT / Llama 8B' },
  { id: 'xlnet',       label: 'XLNet',        badge: '🌐',  groqModel: 'llama3-70b-8192',            description: 'CMU XLNet / Llama 70B' },
  { id: 'longformer',  label: 'Longformer',   badge: '📄',  groqModel: 'mixtral-8x7b-32768',         description: 'Allen AI / Mixtral' },
  { id: 'reformer',    label: 'Reformer',     badge: '♻️',  groqModel: 'gemma2-9b-it',               description: 'Google Reformer / Gemma' },
];

function getGroqKey(): string {
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
  modelId: AiModelId = 'llama3.3',
  history: { role: 'user' | 'ai'; text: string }[] = []
): Promise<string> {
  const query = userQuery.trim();
  if (!query) return '';

  const model = AI_MODELS.find(m => m.id === modelId) ?? AI_MODELS[0];

  // Build conversation history for full context memory
  const contextMessages = history.slice(-10).map(m => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.text
  }));

  // ♊ Gemini 2.0 via Google API
  if (modelId === 'gemini2') {
    const geminiKey = getGeminiKey();
    if (geminiKey) {
      try {
        const fullPrompt = [
          ...history.slice(-10).map(m => `${m.role === 'ai' ? 'Ассистент' : 'Пользователь'}: ${m.text}`),
          `Пользователь: ${query}`
        ].join('\n') + '\nОтветь прямо и по существу.';

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
          }
        );
        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text?.trim()) return text.trim();
        }
      } catch (e) {
        console.error('Gemini error:', e);
      }
    }
    // Fallback to Groq
  }

  // ⚡ All models → Groq API with mapped groqModel
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
        model: model.groqModel,
        messages: [
          {
            role: 'system',
            content: `Ты — ИИ-ассистент ${model.label}. Отвечай на любые вопросы пользователя на том языке, на котором он пишет. Давай прямой, точный и полезный ответ без лишних вступлений.`
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

    const err = await res.json().catch(() => ({}));
    console.error('Groq error:', res.status, err);
  } catch (e) {
    console.error('Groq fetch error:', e);
  }

  return 'Не удалось получить ответ. Попробуйте снова.';
}
