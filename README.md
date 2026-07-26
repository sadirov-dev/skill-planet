<div align="center">

  <img src="public/logo.png" alt="SkillPlanet Logo" width="120" style="border-radius: 24px; box-shadow: 0 0 50px rgba(59,130,246,0.4);" />

  # 🪐 SkillPlanet — Образовательная Платформа Нового Поколения

  [![React](https://img.shields.io/badge/Framework-React_19-61DAFB?logo=react&style=flat-square)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/Language-TypeScript_5-3178C6?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Build_Tool-Vite_8-646CFF?logo=vite&style=flat-square)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_v4-38BDF8?logo=tailwindcss&style=flat-square)](https://tailwindcss.com/)
  [![Bun](https://img.shields.io/badge/Runtime-Bun-fbf0df?logo=bun&style=flat-square)](https://bun.sh/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

  **Современная интерактивная образовательная экосистема с разграниченными ролевыми порталами, живым курсом валют (Кыргызский сом KGS / USD) и AI-ассистентом.**

  [🚀 Демо на GitHub](https://github.com/sadirov-dev/skill-planet) · [🐛 Зарегистрировать Баг](https://github.com/sadirov-dev/skill-planet/issues)

</div>

---

## 📑 Оглавление
- [✨ Особенности проекта](#-особенности-проекта)
- [🎭 Ролевые Порталы (3 Изолированных Кабинета)](#-ролевые-порталы-3-изолированных-кабинета)
- [💵 Живой курс валют (USD / KGS)](#-живой-курс-валют-usd--kgs)
- [🛠 Технологический стек](#-технологический-стек)
- [🚀 Быстрый запуск](#-быстрый-запуск)
- [📁 Структура проекта](#-структура-проекта)
- [🎨 Дизайн-система](#-дизайн-система)

---

## ✨ Особенности проекта

- 🎨 **Linear & Vercel Aesthetics**: Минималистичный премиальный дизайн в тёмных и светлых тонах с эффектами стекломорфизма (`backdrop-blur`).
- 🤖 **Встроенный AI-Ассистент**: Умный помощник в режиме реального времени консультирует по теории и программированию прямо во время прохождения уроков.
- ⚡ **Живой курс валют (KGS / USD)**: Автоматический пересчёт стоимости всех курсов по динамическому курсу Кыргызского сома в реальном времени.
- 🏆 **Геймификация и Лидерборд**: Серии дней (Streaks 🔥), начисление XP за пройденные тесты и уроки, рейтинговая система студентов и бейджи.
- 📱 **Полная Адаптивность**: Идеальное отображение на смартфонах, планшетах и десктопах.

---

## 🎭 Ролевые Порталы (3 Изолированных Кабинета)

Переключение ролей осуществляется в правом верхнем углу кликом на профиль (**Настройки аккаунта / Режим роли**):

| Портал | Имя Демо-аккаунта | Основной функционал |
| :--- | :--- | :--- |
| 🎓 **Студент** | **Алинур Каримов** | Каталог курсов, просмотр видеоуроков, прохождение интерактивных тестов с баллами XP, таблица лидеров, личный прогресс и получение сертификатов. |
| 👨‍🏫 **Преподаватель** | **Малика Рашидова** | Кабинет учителя, конструктор создания курсов, загрузка видеоуроков, создание тестовых вопросов, проверка домашних заданий учеников, статистика дохода. |
| 🛡️ **Администратор** | **Отабек Мирзаев** | Глобальная аналитика платформы, графики активности, списки учеников и учителей по направлениям, модерация новых курсов, связь с разработчиком. |

---

## 💵 Живой курс валют (USD / KGS)

Все цены курсов и финансовые показатели автоматически конвертируются с помощью модуля **Real-Time Live USD/KGS API**:

- 🟢 **Авто-обновление**: Курс конвертации `1 USD = 89.50 сом` регулярно подтягивается из внешнего API.
- 🛒 **Форматирование цен**:
  - `4,386 сом ($49)` — *English: Business & Tech*
  - `3,133 сом ($35)` — *Arabic for Beginners*
  - `2,596 сом ($29)` — *Шахматы: Стратегия Чемпионов*
  - `Бесплатно ($0)` — *Python & AI / Web Development*

---

## 🛠 Технологический стек

- **Core Framework**: React 19 + TypeScript 5
- **Build Tool & Bundler**: Vite 8 (Сборка за `~150ms`)
- **Package Manager & Runtime**: Bun
- **Styling & Design**: Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Icons**: Lucide Icons (`lucide-react`)
- **Typography**: Google Fonts (Inter / Geist Style)

---

## 🚀 Быстрый запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/sadirov-dev/skill-planet.git
cd skill-planet
```

### 2. Установка зависимостей (Bun)
```bash
bun install
```

### 3. Запуск сервера разработки
```bash
bun run dev
```
Откройте в браузере: **http://localhost:5173**

### 4. Продакшн сборка и проверка типов
```bash
bunx tsc --noEmit     # Проверка отсутствия ошибок TypeScript
bun run build         # Сборка оптимизированного бандла
```

---

## 📁 Структура проекта

```
skill-planet/
├── public/
│   ├── logo.png               # Логотип платформы
│   └── images/                # Обложки курсов и аватары
├── src/
│   ├── assets/                # Графические ресурсы
│   ├── components/
│   │   ├── layout/
│   │   │   └── HeaderNav.tsx  # Верхняя навигация и переключатель ролей
│   │   └── shared/            # Общие компоненты (ProgressBar, StarRating)
│   ├── data/
│   │   └── mock.ts            # Тестовые данные курсов, пользователей и тестов
│   ├── pages/
│   │   ├── AuthPage.tsx       # Авторизация и регистрация
│   │   ├── LandingPage.tsx    # Главная промо-страница
│   │   ├── CatalogPage.tsx    # Каталог курсов с поиском и живым курсом KGS
│   │   ├── StudentDashboard.tsx # Кабинет ученика + Лидерборд
│   │   ├── TeacherDashboard.tsx # Кабинет учителя + Конструктор курсов
│   │   ├── AdminDashboard.tsx   # Кабинет админа + Аналитика и списки
│   │   └── LessonPage.tsx     # Интерактивный урок с тестом и AI
│   ├── styles/
│   │   └── theme.ts           # Токены дизайн-системы и хелперы
│   ├── types/
│   │   └── index.ts           # TypeScript типы платформы
│   ├── utils/
│   │   └── currency.ts        # Модуль живого курса USD/KGS
│   ├── App.tsx                # Изоляция ролей и управление состоянием
│   ├── index.css              # Глобальные CSS стили и адаптивная верстка
│   └── main.tsx               # Точка входа React
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 Дизайн-система

- **Dark Mode Palette**: Deep Space `#09090b`, Surface `#111116`, Card `#16161e`
- **Accent Colors**: Electric Blue `#3b82f6` & Glowing Violet `#8b5cf6`
- **Success & Warning**: Emerald `#10b981` & Amber `#f59e0b`

---

<div align="center">

  **Разработано с любовью для SkillPlanet 🪐**

</div>
