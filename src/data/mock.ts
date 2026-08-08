import type { Course, User, Homework, Badge, EnrolledCourse, LeaderboardEntry, TeacherDirectory, ActivityLog } from '../types';

// ───── COURSES (Multi-Level & Skill Task Subdivisions) ─────
export const mockCourses: Course[] = [
  {
    id: 'c2',
    title: 'General & Business English (A1 - C1)',
    description: 'Полная многоуровневая программа английского языка от Beginner до Advanced с разделением на Грамматику, Чтение, Слушание, Говорение, Письмо, Словарь и ДЗ.',
    category: 'Языки',
    level: 'Intermediate',
    levelsSupported: ['Beginner', 'Elementary', 'Pre-Intermediate', 'Intermediate', 'Upper-Intermediate', 'Advanced'],
    rating: 4.9,
    reviewCount: 2890,
    teacherName: 'Малика Рашидова',
    teacherAvatar: '/images/avatar_teacher1.jpg',
    price: 49,
    priceType: 'paid',
    thumbnail: '/images/course_english.jpg',
    duration: '120 часов',
    studentsCount: 7850,
    tags: ['English', 'Grammar', 'Speaking', 'IELTS'],
    approved: true,
    prerequisites: ['Желание свободно говорить по-английски'],
    curriculum: [
      // 🟢 BEGINNER
      {
        id: 'm_beg_gram',
        title: 'Уровень 1: Beginner — Grammar & Verb To Be',
        level: 'Beginner',
        skillType: 'Grammar',
        lessons: [
          { id: 'l_beg_1', title: 'Verb "To Be" (Am/Is/Are)', duration: '15 мин', completed: true, type: 'video', skillType: 'Grammar' },
          { id: 'l_beg_2', title: 'Present Simple: Базовые правила', duration: '20 мин', completed: true, type: 'video', skillType: 'Grammar' },
        ]
      },
      {
        id: 'm_beg_voc',
        title: 'Уровень 1: Beginner — Vocabulary & Phrases',
        level: 'Beginner',
        skillType: 'Vocabulary',
        lessons: [
          { id: 'l_beg_3', title: '100 Самых нужных слов и приветствий', duration: '18 мин', completed: true, type: 'text', skillType: 'Vocabulary' },
        ]
      },
      {
        id: 'm_beg_hw',
        title: 'Уровень 1: Beginner — Test & Homework',
        level: 'Beginner',
        skillType: 'Homework',
        lessons: [
          {
            id: 'l_beg_quiz',
            title: 'Тест: Проверка уровня Beginner',
            duration: '15 мин',
            completed: true,
            type: 'quiz',
            skillType: 'Homework',
            quiz: [
              { id: 'q_e1', question: 'Choose correct option: She ___ a software engineer.', options: ['am', 'is', 'are', 'be'], correctIndex: 1 },
              { id: 'q_e2', question: 'Which word means "Привет"?', options: ['Goodbye', 'Hello', 'Thank you', 'Please'], correctIndex: 1 }
            ]
          }
        ]
      },

      // 🔵 ELEMENTARY
      {
        id: 'm_elem_spk',
        title: 'Уровень 2: Elementary — Speaking & Listening',
        level: 'Elementary',
        skillType: 'Speaking',
        lessons: [
          { id: 'l_elem_1', title: 'Daily Routines & Conversations', duration: '22 мин', completed: false, type: 'video', skillType: 'Speaking' },
          { id: 'l_elem_2', title: 'Listening: Dialogues in a Café', duration: '18 мин', completed: false, type: 'audio', skillType: 'Listening' },
        ]
      },
      {
        id: 'm_elem_rdg',
        title: 'Уровень 2: Elementary — Reading & Writing',
        level: 'Elementary',
        skillType: 'Reading',
        lessons: [
          { id: 'l_elem_3', title: 'Short Stories Reading Practice', duration: '25 мин', completed: false, type: 'text', skillType: 'Reading' },
          { id: 'l_elem_4', title: 'Writing Your First Self-Introduction', duration: '30 мин', completed: false, type: 'writing', skillType: 'Writing' },
        ]
      },

      // 🟣 PRE-INTERMEDIATE
      {
        id: 'm_pre_gram',
        title: 'Уровень 3: Pre-Intermediate — Grammar (Past & Future)',
        level: 'Pre-Intermediate',
        skillType: 'Grammar',
        lessons: [
          { id: 'l_pre_1', title: 'Past Simple vs Past Continuous', duration: '24 мин', completed: false, type: 'video', skillType: 'Grammar' },
          { id: 'l_pre_2', title: 'Future Forms: Will vs Going To', duration: '20 мин', completed: false, type: 'video', skillType: 'Grammar' },
        ]
      },

      // 🟠 INTERMEDIATE
      {
        id: 'm_int_biz',
        title: 'Уровень 4: Intermediate — Business Communication & Emails',
        level: 'Intermediate',
        skillType: 'Writing',
        lessons: [
          { id: 'l_int_1', title: 'Professional Email Writing Etiquette', duration: '25 мин', completed: false, type: 'writing', skillType: 'Writing' },
          { id: 'l_int_2', title: 'Tech Industry Vocabulary & Terms', duration: '30 мин', completed: false, type: 'text', skillType: 'Vocabulary' },
        ]
      },

      // 🔴 UPPER-INTERMEDIATE
      {
        id: 'm_upp_spk',
        title: 'Уровень 5: Upper-Intermediate — Advanced Speaking & Debates',
        level: 'Upper-Intermediate',
        skillType: 'Speaking',
        lessons: [
          { id: 'l_upp_1', title: 'Expressing Complex Arguments & Opinions', duration: '35 мин', completed: false, type: 'video', skillType: 'Speaking' },
        ]
      },

      // 👑 ADVANCED
      {
        id: 'm_adv_ielts',
        title: 'Уровень 6: Advanced — C1 Masterclass & Essay Writing',
        level: 'Advanced',
        skillType: 'Writing',
        lessons: [
          { id: 'l_adv_1', title: 'Academic Essay Structure (IELTS 8.0+)', duration: '40 мин', completed: false, type: 'writing', skillType: 'Writing' },
        ]
      }
    ],
  },
  {
    id: 'c1',
    title: 'Python & AI: Полный курс (Beginner to Advanced)',
    description: 'Изучи Python с нуля до уровня AI-разработчика. Многоуровневые модули по теории, практике, алгоритмам и нейросетям.',
    category: 'IT & AI',
    level: 'Beginner',
    levelsSupported: ['Beginner', 'Intermediate', 'Advanced'],
    rating: 4.9,
    reviewCount: 2340,
    teacherName: 'Акмал Юсупов',
    teacherAvatar: '/images/avatar_teacher2.jpg',
    price: 0,
    priceType: 'free',
    thumbnail: '/images/course_python.jpg',
    duration: '42 часа',
    studentsCount: 8420,
    tags: ['Python', 'AI', 'Data Science'],
    approved: true,
    prerequisites: ['Базовые знания математики'],
    curriculum: [
      {
        id: 'm1', title: 'Уровень 1: Beginner — Основы Синтаксиса',
        level: 'Beginner',
        skillType: 'Theory',
        lessons: [
          { id: 'l1', title: 'Установка и настройка IDE', duration: '12 мин', completed: true, type: 'video', skillType: 'Theory' },
          { id: 'l2', title: 'Переменные и типы данных', duration: '18 мин', completed: true, type: 'video', skillType: 'Theory' },
          { id: 'l3', title: 'Управляющие конструкции (if/else)', duration: '22 мин', completed: false, type: 'video', skillType: 'Practice' },
        ]
      },
      {
        id: 'm4', title: 'Уровень 1: Beginner — Тест & Практика',
        level: 'Beginner',
        skillType: 'Homework',
        lessons: [
          {
            id: 'l4_quiz',
            title: 'Тест: Проверка знаний Python',
            duration: '15 мин',
            completed: false,
            type: 'quiz',
            skillType: 'Quiz',
            quiz: [
              { id: 'q1', question: 'Какое ключевое слово используется для объявления функции в Python?', options: ['func', 'def', 'function', 'define'], correctIndex: 1 },
              { id: 'q2', question: 'Какой тип данных возвращает len([1, 2, 3])?', options: ['str', 'float', 'int', 'list'], correctIndex: 2 },
            ]
          }
        ]
      },
      {
        id: 'm2', title: 'Уровень 2: Intermediate — ООП и Алгоритмы',
        level: 'Intermediate',
        skillType: 'Practice',
        lessons: [
          { id: 'l4', title: 'Функции и рекурсия', duration: '25 мин', completed: false, type: 'video', skillType: 'Theory' },
          { id: 'l5', title: 'Классы и ООП структуры', duration: '30 мин', completed: false, type: 'text', skillType: 'Practice' },
        ]
      },
    ],
  },
  {
    id: 'c3',
    title: 'Шахматы: Стратегия Чемпионов (Level 1 - 5)',
    description: 'От дебютных ловушек для новичков до эндшпиля гроссмейстеров. Разделение на Дебют, Тактику, Эндшпиль и ДЗ.',
    category: 'Шахматы',
    level: 'Pro',
    levelsSupported: ['Beginner', 'Intermediate', 'Advanced', 'Pro'],
    rating: 4.7,
    reviewCount: 876,
    teacherName: 'Дилшод Мирзаев',
    teacherAvatar: '/images/avatar_teacher3.jpg',
    price: 29,
    priceType: 'paid',
    thumbnail: '/images/course_chess.jpg',
    duration: '18 часов',
    studentsCount: 1850,
    tags: ['Chess', 'Strategy', 'Opening'],
    approved: true,
    prerequisites: ['Правила игры в шахматы'],
    curriculum: [
      {
        id: 'm5', title: 'Уровень 1: Beginner — Дебютные системы',
        level: 'Beginner',
        skillType: 'Theory',
        lessons: [
          { id: 'l11', title: 'Испанская партия', duration: '25 мин', completed: false, type: 'video', skillType: 'Theory' },
          { id: 'l12', title: 'Сицилианская защита', duration: '30 мин', completed: false, type: 'video', skillType: 'Practice' },
        ]
      }
    ],
  },
  {
    id: 'c4',
    title: 'Web Development: React + Node (Beginner to Pro)',
    description: 'Создавай веб-приложения с нуля. Модули: HTML/CSS, React, Node.js, Базы данных и Проект.',
    category: 'IT & AI',
    level: 'Intermediate',
    levelsSupported: ['Beginner', 'Intermediate', 'Advanced'],
    rating: 4.9,
    reviewCount: 3120,
    teacherName: 'Бобур Каримов',
    teacherAvatar: '/images/avatar_teacher2.jpg',
    price: 0,
    priceType: 'free',
    thumbnail: '/images/course_webdev.jpg',
    duration: '55 часов',
    studentsCount: 12400,
    tags: ['React', 'Node.js', 'TypeScript'],
    approved: true,
    prerequisites: ['HTML/CSS знания'],
    curriculum: [
      {
        id: 'm6', title: 'Уровень 1: Beginner — Основы React',
        level: 'Beginner',
        skillType: 'Theory',
        lessons: [
          { id: 'l13', title: 'JSX и компоненты', duration: '20 мин', completed: false, type: 'video', skillType: 'Theory' },
          { id: 'l14', title: 'State и Props', duration: '25 мин', completed: false, type: 'video', skillType: 'Practice' },
        ]
      }
    ],
  },
  {
    id: 'c5',
    title: 'Arabic for Beginners (A1 - B2)',
    description: 'Арабский язык по уровням: Алфавит, Чтение Корана, Разговорный арабский, Грамматика и Письмо.',
    category: 'Языки',
    level: 'Beginner',
    levelsSupported: ['Beginner', 'Elementary', 'Intermediate'],
    rating: 4.6,
    reviewCount: 540,
    teacherName: 'Умар Хасанов',
    teacherAvatar: '/images/avatar_teacher3.jpg',
    price: 35,
    priceType: 'paid',
    thumbnail: '/images/course_arabic.jpg',
    duration: '22 часа',
    studentsCount: 980,
    tags: ['Arabic', 'Language', 'Grammar'],
    approved: true,
    prerequisites: ['Желание изучать арабский'],
    curriculum: [
      {
        id: 'm7', title: 'Уровень 1: Beginner — Алфавит & Произношение',
        level: 'Beginner',
        skillType: 'Vocabulary',
        lessons: [
          { id: 'l15', title: 'Буквы алфавита и огласовки', duration: '18 мин', completed: false, type: 'video', skillType: 'Vocabulary' },
          { id: 'l16', title: 'Правила чтения и письма', duration: '15 мин', completed: false, type: 'text', skillType: 'Reading' },
        ]
      }
    ],
  },
  {
    id: 'c6',
    title: 'Go: Стратегическое мышление (Beginner)',
    description: 'Древняя игра Го по уровням: Правила, Формы, Игра на 19x19 доске.',
    category: 'Шахматы',
    level: 'Beginner',
    levelsSupported: ['Beginner', 'Intermediate'],
    rating: 4.5,
    reviewCount: 234,
    teacherName: 'Санжар Тошматов',
    teacherAvatar: '/images/avatar_teacher3.jpg',
    price: 19,
    priceType: 'paid',
    thumbnail: '/images/course_go.jpg',
    duration: '15 часов',
    studentsCount: 420,
    tags: ['Go', 'Board Games', 'Strategy'],
    approved: false,
    prerequisites: ['Нет требований'],
    curriculum: [
      {
        id: 'm8', title: 'Уровень 1: Beginner — Основы Го',
        level: 'Beginner',
        skillType: 'Theory',
        lessons: [
          { id: 'l17', title: 'Правила захвата камней', duration: '20 мин', completed: false, type: 'video', skillType: 'Theory' },
        ]
      }
    ],
  },
];

// ───── USERS ─────
export const mockUsers: User[] = [
  { id: 'u1', name: 'Алинур Каримов', email: 'alinur@gmail.com', role: 'student', verified: true, banned: false, joinedAt: '2025-03-12', xp: 4850 },
  { id: 'u2', name: 'Малика Рашидова', email: 'malika@gmail.com', role: 'teacher', verified: true, banned: false, joinedAt: '2024-11-05', avatar: '/images/avatar_teacher1.jpg', subject: 'English (A1 - C1)' },
  { id: 'u3', name: 'Жасур Усманов', email: 'jasur@gmail.com', role: 'student', verified: false, banned: false, joinedAt: '2026-01-20', xp: 3200 },
  { id: 'u4', name: 'Дилноза Юлдашева', email: 'dilnoza@mail.ru', role: 'student', verified: true, banned: false, joinedAt: '2025-08-14', xp: 2900 },
  { id: 'u5', name: 'Бобур Каримов', email: 'bobur@gmail.com', role: 'teacher', verified: true, banned: false, joinedAt: '2024-09-01', avatar: '/images/avatar_teacher2.jpg', subject: 'Web Dev (React + Node)' },
  { id: 'u6', name: 'Санжар Тошматов', email: 'sanjat@gmail.com', role: 'teacher', verified: false, banned: false, joinedAt: '2026-05-10', avatar: '/images/avatar_teacher3.jpg', subject: 'Chess & Go' },
  { id: 'u7', name: 'Нилуфар Холматова', email: 'nilufar@gmail.com', role: 'student', verified: true, banned: true, joinedAt: '2025-06-22', xp: 1200 },
  { id: 'u8', name: 'Отабек Мирзаев', email: 'otabek@gmail.com', role: 'admin', verified: true, banned: false, joinedAt: '2024-01-15' },
];

// ───── LEADERBOARD ─────
export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, id: 'u1', name: 'Алинур Каримов', avatar: '/images/avatar_teacher2.jpg', xp: 4850, streak: 5, coursesCompleted: 4, badge: '👑 Top Student' },
  { rank: 2, id: 'l2', name: 'Камола Эшматова', avatar: '/images/avatar_teacher1.jpg', xp: 4120, streak: 12, coursesCompleted: 3, badge: '🔥 English Master' },
  { rank: 3, id: 'l3', name: 'Жасур Усманов', avatar: '/images/avatar_teacher3.jpg', xp: 3900, streak: 8, coursesCompleted: 3, badge: '⚡ Speed Learner' },
  { rank: 4, id: 'l4', name: 'Дилноза Юлдашева', avatar: '/images/avatar_teacher1.jpg', xp: 3450, streak: 4, coursesCompleted: 2, badge: '🌟 English Pro' },
  { rank: 5, id: 'l5', name: 'Фарход Нурматов', avatar: '/images/avatar_teacher3.jpg', xp: 3100, streak: 15, coursesCompleted: 2, badge: '♟️ Chess Grandmaster' },
];

// ───── TEACHER DIRECTORY ─────
export const mockTeachers: TeacherDirectory[] = [
  { id: 't1', name: 'Малика Рашидова', avatar: '/images/avatar_teacher1.jpg', subject: 'General English (A1 - C1)', category: 'Языки', rating: 4.9, studentsCount: 7850, coursesCount: 3, verified: true },
  { id: 't2', name: 'Бобур Каримов', avatar: '/images/avatar_teacher2.jpg', subject: 'Web Dev (React + Node)', category: 'IT & AI', rating: 4.9, studentsCount: 12400, coursesCount: 4, verified: true },
  { id: 't3', name: 'Акмал Юсупов', avatar: '/images/avatar_teacher2.jpg', subject: 'Python & AI / Data Science', category: 'IT & AI', rating: 4.9, studentsCount: 8420, coursesCount: 2, verified: true },
  { id: 't4', name: 'Дилшод Мирзаев', avatar: '/images/avatar_teacher3.jpg', subject: 'Шахматная стратегия FIDE', category: 'Шахматы', rating: 4.7, studentsCount: 1850, coursesCount: 2, verified: true },
  { id: 't5', name: 'Умар Хасанов', avatar: '/images/avatar_teacher3.jpg', subject: 'Арабский язык & Грамматика', category: 'Языки', rating: 4.6, studentsCount: 980, coursesCount: 1, verified: true },
];

// ───── ACTIVITY LOGS ─────
export const mockActivityLogs: ActivityLog[] = [
  { id: 'a1', userName: 'Алинур Каримов', userRole: 'student', avatar: '/images/avatar_teacher2.jpg', action: 'Завершил тест', target: 'Beginner English Grammar Test (100%)', timestamp: '5 мин назад' },
  { id: 'a2', userName: 'Малика Рашидова', userRole: 'teacher', avatar: '/images/avatar_teacher1.jpg', action: 'Проверила ДЗ', target: 'Writing Self-Introduction (95/100)', timestamp: '18 мин назад' },
  { id: 'a3', userName: 'Жасур Усманов', userRole: 'student', avatar: '/images/avatar_teacher3.jpg', action: 'Записался на курс', target: 'General & Business English', timestamp: '42 мин назад' },
  { id: 'a4', userName: 'Санжар Тошматов', userRole: 'teacher', avatar: '/images/avatar_teacher3.jpg', action: 'Отправил курс на модерацию', target: 'Go: Стратегическое мышление', timestamp: '2 часа назад' },
  { id: 'a5', userName: 'Отабек Мирзаев', userRole: 'admin', avatar: '/images/avatar_teacher3.jpg', action: 'Верифицировал учителя', target: 'Малика Рашидова', timestamp: '4 часа назад' },
];

// ───── HOMEWORK (Categorized by Skills) ─────
export const mockHomework: Homework[] = [
  { id: 'h1', title: 'Grammar: Verb To Be Exercises', courseName: 'General English', skillType: 'Grammar', dueDate: '2026-07-30', status: 'pending' },
  { id: 'h2', title: 'Writing: Self Introduction Essay', courseName: 'General English', skillType: 'Writing', dueDate: '2026-08-05', status: 'submitted' },
  { id: 'h3', title: 'Speaking: Audio Recording Task', courseName: 'General English', skillType: 'Speaking', dueDate: '2026-07-28', status: 'graded', grade: 95, feedback: 'Great pronunciation and fluency!' },
  { id: 'h4', title: 'Python: Functions & Loops', courseName: 'Python & AI', skillType: 'Practice', dueDate: '2026-07-25', status: 'overdue' },
];

// ───── BADGES ─────
export const mockBadges: Badge[] = [
  { id: 'b1', icon: '🗣️', name: 'Fluent Speaker', description: 'Завершил 5 уроков по Speaking', earned: true, earnedAt: '2026-06-15' },
  { id: 'b2', icon: '📖', name: 'Grammar Guru', description: 'Сдал тест по Грамматике на 100%', earned: true, earnedAt: '2026-07-10' },
  { id: 'b3', icon: '🔥', name: 'On Fire', description: '7-дневная серия обучения', earned: true, earnedAt: '2026-07-20' },
  { id: 'b4', icon: '🎧', name: 'Master Listener', description: 'Прослушал 10 аудирований', earned: false },
  { id: 'b5', icon: '✍️', name: 'Essay Master', description: 'Написал 5 проверенных эссе', earned: false },
  { id: 'b6', icon: '👑', name: 'Advanced C1', description: 'Достиг уровня Advanced', earned: false },
];

// ───── ENROLLED COURSES ─────
export const mockEnrolled: EnrolledCourse[] = [
  {
    courseId: 'c2',
    title: 'General & Business English',
    teacherName: 'Малика Рашидова',
    progress: 45,
    thumbnail: '/images/course_english.jpg',
    category: 'Языки',
    lastLesson: 'Verb "To Be"',
    nextLesson: 'Listening: Dialogues in a Café',
    totalLessons: 36,
    completedLessons: 16,
    level: 'Elementary',
  },
  {
    courseId: 'c1',
    title: 'Python & AI: Полный курс',
    teacherName: 'Акмал Юсупов',
    progress: 60,
    thumbnail: '/images/course_python.jpg',
    category: 'IT & AI',
    lastLesson: 'Переменные и типы данных',
    nextLesson: 'Управляющие конструкции',
    totalLessons: 42,
    completedLessons: 25,
    level: 'Beginner',
  },
  {
    courseId: 'c3',
    title: 'Шахматы: Стратегия Чемпионов',
    teacherName: 'Дилшод Мирзаев',
    progress: 15,
    thumbnail: '/images/course_chess.jpg',
    category: 'Шахматы',
    lastLesson: 'Правила и нотация',
    nextLesson: 'Испанская партия',
    totalLessons: 24,
    completedLessons: 3,
    level: 'Beginner',
  },
];

export const platformStats = {
  totalUsers: 28400,
  activeCourses: 148,
  teacherRevenueUsd: 6580,
  platformRevenueUsd: 968750,
  avgRating: 4.8,
  countries: 47,
  completionRate: '78%',
};

export const mockTestimonials = [
  { id: 't1', name: 'Камола Эшматова', role: 'Студентка (B2)', avatar: '/images/avatar_teacher1.jpg', text: 'Пройти путь от Beginner до Upper-Intermediate оказалось легко благодаря четкой структуре!', rating: 5 },
  { id: 't2', name: 'Фарход Нурматов', role: 'Шахматист', avatar: '/images/avatar_teacher3.jpg', text: 'Уроки по Грамматике и Listening великолепны.', rating: 5 }
];

export const mockSubmissions: Homework[] = [
  { id: 's1', title: 'Writing: Essay Submission', courseName: 'General English', studentName: 'Алинур Каримов', dueDate: '2026-07-30', status: 'submitted' },
  { id: 's2', title: 'Grammar: Past Tense Quiz', courseName: 'General English', studentName: 'Жасур Усманов', dueDate: '2026-07-28', status: 'submitted' },
];
