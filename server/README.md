# 🚀 SkillPlanet Backend API (Node.js + Express)

Бэкенд для образовательной платформы **SkillPlanet**, написанный на Node.js и Express.

## 🛠️ Технологии:
- **Node.js** & **Express**
- **JWT** (JSON Web Tokens) для безопасной аутентификации
- **bcryptjs** для хеширования паролей
- **CORS** & **dotenv**
- **Groq API & AI Proxy** для безопасной работы ИИ-ассистента на сервере

---

## 🚀 Запуск бэкенда:

### 1. Запуск напрямую из папки `server`:
```bash
cd server
npm install
npm run dev
```

### 2. Или из корня проекта:
```bash
node server/server.js
```

Сервер будет доступен по адресу: **`http://localhost:5000`**

---

## 📡 Полный список API Эндпоинтов:

### 1. 🏥 Проверка работы сервера
- `GET /api/health` — Состояние сервера

### 2. 🔐 Аутентификация (`/api/auth`)
- `POST /api/auth/register` — Регистрация нового пользователя
- `POST /api/auth/login` — Вход в систему (возвращает JWT токен)
- `GET /api/auth/me` — Получить текущий профиль пользователя (`Authorization: Bearer <token>`)
- `PUT /api/auth/profile` — Обновить данные профиля

### 3. 📚 Курсы (`/api/courses`)
- `GET /api/courses` — Список всех курсов (поддерживает query: `?search=...`, `?category=...`, `?level=...`)
- `GET /api/courses/:id` — Детальная информация о курсе
- `GET /api/courses/my-enrolled` — Мои активные курсы (`Authorization: Bearer <token>`)
- `POST /api/courses/enroll` — Записаться на курс (`Authorization: Bearer <token>`)

### 4. 🤖 ИИ-Ассистент (`/api/ai`)
- `POST /api/ai/chat` — Прокси запросов к 10 ИИ-моделям (Llama 3.3, Gemini 2.0, BERT, RoBERTa и др.) или кастомным API ключам

### 5. 🏆 Лидерборд и Статистика (`/api/leaderboard`)
- `GET /api/leaderboard` — Топ студентов платформы (XP, Streak, Награды)
- `GET /api/leaderboard/stats` — Общая статистика платформы (студенты, курсы, учителя)
