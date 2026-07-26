// AI Service Integration for SkillPlanet
// Powered by Groq Cloud (Llama-3 70B Ultra-Fast) & Google Gemini AI

function getGroqApiKey(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GROQ_API_KEY) {
    return import.meta.env.VITE_GROQ_API_KEY;
  }
  return "";
}

function getGeminiApiKey(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  return "";
}

export interface AiMessage {
  role: 'user' | 'ai';
  text: string;
}

export async function askAiAssistant(userQuery: string, courseTitle = 'Python & AI / General English'): Promise<string> {
  const query = userQuery.trim();
  const qLower = query.toLowerCase();

  // ⚡ 1. REAL-TIME GROQ CLOUD API INVOCATION (Llama-3.3 70B Ultra-Fast AI)
  const groqKey = getGroqApiKey();
  if (groqKey) {
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
              content: `Ты — высокоинтеллектуальный ИИ-Тьютор образовательной платформы SkillPlanet по курсу "${courseTitle}". Отвечай вежливо, точно, доступно и интересно на русском языке с использованием форматирования Markdown, приведением примера кода или грамматики.`
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.7,
          max_tokens: 600,
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text;
      } else {
        // Fallback Llama 3 70B model
        const resFb = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama3-70b-8192',
            messages: [{ role: 'user', content: query }],
            max_tokens: 500,
          })
        });
        if (resFb.ok) {
          const dataFb = await resFb.json();
          const textFb = dataFb?.choices?.[0]?.message?.content;
          if (textFb) return textFb;
        }
      }
    } catch (err) {
      console.warn('Groq API error:', err);
    }
  }

  // 🤖 2. REAL-TIME GOOGLE GEMINI API INVOCATION
  const geminiKey = getGeminiApiKey();
  if (geminiKey) {
    try {
      const promptText = `Ты — персональный ИИ-Тьютор образовательной платформы SkillPlanet по курсу "${courseTitle}". Ответь максимально точно, вежливо и понятно на русском языке: ${query}`;

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
      }
    } catch (err) {
      console.warn('Gemini API fetch error:', err);
    }
  }

  // 🤖 3. DYNAMIC NATURAL LANGUAGE ENGINE (Fallback)

  // Greetings
  if (/^(привет|здравствуй|хай|hello|hi|good morning|добрый день)/i.test(qLower)) {
    const greetings = [
      `Привет! Я твой ИИ-Наставник по курсу "${courseTitle}". О чём именно хочешь спросить? Разберём грамматику, синтаксис кода или решение задачи!`,
      `Здравствуйте! Готов помочь разобраться с любой сложной темой. Напиши свой вопрос по уроку или коду!`,
      `Приветствую! Отличный день для обучения. Задавай вопрос — разберём его по шагам.`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Python / Coding
  if (qLower.includes('python') || qLower.includes('код') || qLower.includes('переменн') || qLower.includes('функци') || qLower.includes('цикл') || qLower.includes('список') || qLower.includes('def') || qLower.includes('if')) {
    if (qLower.includes('переменн')) {
      return `В Python переменные создаются простым присваиванием: \`x = 10\` или \`name = "Алинур"\`. Python автоматически определяет тип данных (int, str, float).`;
    }
    if (qLower.includes('функци') || qLower.includes('def')) {
      return `Функции в Python объявляются ключевым словом \`def\`:\n\`\`\`python\ndef greet(name):\n    return f"Привет, {name}!"\n\`\`\`\nОни позволяют повторно использовать один и тот же код.`;
    }
    if (qLower.includes('цикл') || qLower.includes('for') || qLower.includes('while')) {
      return `Циклы в Python повторяют инструкции. \`for i in range(5):\` выполнит код 5 раз. Цикл \`while\` работает до тех пор, пока условие истинно.`;
    }
    if (qLower.includes('если') || qLower.includes('if') || qLower.includes('else')) {
      return `Конструкция \`if/elif/else\` управляет ветвлением программы. Помните: в Python обязательны отступы в 4 пробела!`;
    }
    return `По поводу разработки в Python: в этом уроке мы разбираем ключевые конструкции синтаксиса. Проверь свой код в консоли и отправь на проверку!`;
  }

  // English / Grammar
  if (qLower.includes('english') || qLower.includes('грамматик') || qLower.includes('глагол') || qLower.includes('tense') || qLower.includes('present') || qLower.includes('past') || qLower.includes('to be') || qLower.includes('слово') || qLower.includes('перевод')) {
    if (qLower.includes('to be')) {
      return `Глагол "To Be" (быть/являться) изменяется так:\n• I → am\n• He / She / It → is\n• You / We / They → are\nПример: *She is a developer. They are ready.*`;
    }
    if (qLower.includes('present simple') || qLower.includes('настоящ')) {
      return `Present Simple выражает регулярные действия. Для He/She/It глагол получает окончание -s: *He works every day.* В отрицаниях используем *don't / doesn't*.`;
    }
    if (qLower.includes('past') || qLower.includes('прошедш')) {
      return `В Past Simple правильные глаголы получают окончание -ed (worked, visited), а неправильные меняют форму (go → went, see → saw).`;
    }
    return `В английском языке строго соблюдается порядок слов: **Субъект (Кто?) + Глагол (Что делает?) + Объект**. Например: *I (Кто?) learn (Что делаю?) English (Что?)*.`;
  }

  // Tests / XP
  if (qLower.includes('тест') || qLower.includes('бал') || qLower.includes('xp') || qLower.includes('дз') || qLower.includes('оценк')) {
    return `За каждый успешно сданный интерактивный тест вы получаете **+150 XP**. Набранные баллы продвигают вас на верхние строчки в Лидерборде платформы!`;
  }

  const words = query.split(' ').filter(w => w.length > 3);
  const keyTopic = words.slice(0, 3).join(' ');

  return `Относительно вопроса **"${keyTopic || query}"**: это важная тема в рамках курса "${courseTitle}". Рекомендую повторить материалы урока выше и проверить знания в интерактивном тесте. Задавай любой дополнительный вопрос по теме!`;
}
