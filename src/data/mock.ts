import type { Course, User, Homework, Badge, EnrolledCourse, LeaderboardEntry, TeacherDirectory, ActivityLog } from '../types';

// ───── COURSES (Price in USD) ─────
export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Python & AI: Полный курс',
    description: 'Изучи Python с нуля до уровня AI-разработчика. Покрываем NumPy, Pandas, scikit-learn и нейросети.',
    category: 'IT & AI',
    level: 'Beginner',
    rating: 4.9,
    reviewCount: 2340,
    teacherName: 'Акмал Юсупов',
    teacherAvatar: '/images/avatar_teacher2.png',
    price: 0,
    priceType: 'free',
    thumbnail: '/images/course_python.png',
    duration: '42 часа',
    studentsCount: 8420,
    tags: ['Python', 'AI', 'Data Science'],
    approved: true,
    prerequisites: ['Базовые знания математики', 'Желание учиться'],
    curriculum: [
      {
        id: 'm1', title: 'Введение в Python',
        lessons: [
          { id: 'l1', title: 'Установка и настройка', duration: '12 мин', completed: true, type: 'video' },
          { id: 'l2', title: 'Переменные и типы данных', duration: '18 мин', completed: true, type: 'video' },
          { id: 'l3', title: 'Управляющие конструкции (if/else)', duration: '22 мин', completed: false, type: 'video' },
        ]
      },
      {
        id: 'm4', title: 'Интерактивный Тест',
        lessons: [
          {
            id: 'l4_quiz',
            title: 'Тест: Проверка знаний Python',
            duration: '15 мин',
            completed: false,
            type: 'quiz',
            quiz: [
              { id: 'q1', question: 'Какое ключевое слово используется для объявления функции в Python?', options: ['func', 'def', 'function', 'define'], correctIndex: 1 },
              { id: 'q2', question: 'Какой тип данных возвращает тип len([1, 2, 3])?', options: ['str', 'float', 'int', 'list'], correctIndex: 2 },
              { id: 'q3', question: 'Как сделать комментарий в Python?', options: ['// комментарий', '/* комментарий */', '# комментарий', '<!-- комментарий -->'], correctIndex: 2 },
            ]
          }
        ]
      },
      {
        id: 'm2', title: 'Функции и ООП',
        lessons: [
          { id: 'l4', title: 'Функции в Python', duration: '25 мин', completed: false, type: 'video' },
          { id: 'l5', title: 'Классы и объекты', duration: '30 мин', completed: false, type: 'text' },
          { id: 'l6', title: 'Практическое задание', duration: '45 мин', completed: false, type: 'quiz' },
        ]
      },
    ],
  },
  {
    id: 'c2',
    title: 'English: Business & Tech',
    description: 'Профессиональный английский для IT-специалистов. Переговоры, презентации, техническая документация.',
    category: 'Языки',
    level: 'Intermediate',
    rating: 4.8,
    reviewCount: 1890,
    teacherName: 'Малика Рашидова',
    teacherAvatar: '/images/avatar_teacher1.png',
    price: 49,
    priceType: 'paid',
    thumbnail: '/images/course_english.png',
    duration: '28 часов',
    studentsCount: 5210,
    tags: ['English', 'Business', 'Communication'],
    approved: true,
    prerequisites: ['A2 уровень английского'],
    curriculum: [
      {
        id: 'm4', title: 'Business Vocabulary',
        lessons: [
          { id: 'l9', title: 'Tech Industry Terms', duration: '15 мин', completed: false, type: 'video' },
          { id: 'l10', title: 'Email Etiquette', duration: '20 мин', completed: false, type: 'text' },
        ]
      }
    ],
  },
  {
    id: 'c3',
    title: 'Шахматы: Стратегия Чемпионов',
    description: 'От дебютных ловушек до эндшпиля чемпионов. Анализ партий великих мастеров.',
    category: 'Шахматы',
    level: 'Pro',
    rating: 4.7,
    reviewCount: 876,
    teacherName: 'Дилшод Мирзаев',
    teacherAvatar: '/images/avatar_teacher3.png',
    price: 29,
    priceType: 'paid',
    thumbnail: '/images/course_chess.png',
    duration: '18 часов',
    studentsCount: 1850,
    tags: ['Chess', 'Strategy', 'Opening'],
    approved: true,
    prerequisites: ['Знание базовых правил', 'Рейтинг 1200+'],
    curriculum: [
      {
        id: 'm5', title: 'Дебютные системы',
        lessons: [
          { id: 'l11', title: 'Испанская партия', duration: '25 мин', completed: false, type: 'video' },
          { id: 'l12', title: 'Сицилианская защита', duration: '30 мин', completed: false, type: 'video' },
        ]
      }
    ],
  },
  {
    id: 'c4',
    title: 'Web Development: React + Node',
    description: 'Создавай профессиональные веб-приложения с React, TypeScript и Node.js.',
    category: 'IT & AI',
    level: 'Intermediate',
    rating: 4.9,
    reviewCount: 3120,
    teacherName: 'Бобур Каримов',
    teacherAvatar: '/images/avatar_teacher2.png',
    price: 0,
    priceType: 'free',
    thumbnail: '/images/course_webdev.png',
    duration: '55 часов',
    studentsCount: 12400,
    tags: ['React', 'Node.js', 'TypeScript'],
    approved: true,
    prerequisites: ['HTML/CSS знания', 'JavaScript основы'],
    curriculum: [
      {
        id: 'm6', title: 'React Fundamentals',
        lessons: [
          { id: 'l13', title: 'JSX и компоненты', duration: '20 мин', completed: false, type: 'video' },
          { id: 'l14', title: 'State и Props', duration: '25 мин', completed: false, type: 'video' },
        ]
      }
    ],
  },
  {
    id: 'c5',
    title: 'Arabic for Beginners',
    description: 'Арабский язык с нуля. Алфавит, произношение, базовая грамматика и разговорные фразы.',
    category: 'Языки',
    level: 'Beginner',
    rating: 4.6,
    reviewCount: 540,
    teacherName: 'Умар Хасанов',
    teacherAvatar: '/images/avatar_teacher3.png',
    price: 35,
    priceType: 'paid',
    thumbnail: '/images/course_arabic.png',
    duration: '22 часа',
    studentsCount: 980,
    tags: ['Arabic', 'Language', 'Grammar'],
    approved: true,
    prerequisites: ['Нет предварительных требований'],
    curriculum: [
      {
        id: 'm7', title: 'Алфавит и произношение',
        lessons: [
          { id: 'l15', title: 'Буквы алфавита', duration: '18 мин', completed: false, type: 'video' },
          { id: 'l16', title: 'Гласные звуки', duration: '15 мин', completed: false, type: 'video' },
        ]
      }
    ],
  },
  {
    id: 'c6',
    title: 'Go: Стратегическое мышление',
    description: 'Древняя игра Го — современный взгляд на стратегию и тактику.',
    category: 'Шахматы',
    level: 'Beginner',
    rating: 4.5,
    reviewCount: 234,
    teacherName: 'Санжар Тошматов',
    teacherAvatar: '/images/avatar_teacher3.png',
    price: 19,
    priceType: 'paid',
    thumbnail: '/images/course_go.png',
    duration: '15 часов',
    studentsCount: 420,
    tags: ['Go', 'Board Games', 'Strategy'],
    approved: false,
    prerequisites: ['Нет предварительных требований'],
    curriculum: [
      {
        id: 'm8', title: 'Основы Го',
        lessons: [
          { id: 'l17', title: 'Правила игры', duration: '20 мин', completed: false, type: 'video' },
        ]
      }
    ],
  },
];

// ───── USERS ─────
export const mockUsers: User[] = [
  { id: 'u1', name: 'Алинур Каримов', email: 'alinur@gmail.com', role: 'student', verified: true, banned: false, joinedAt: '2025-03-12', xp: 4850 },
  { id: 'u2', name: 'Малика Рашидова', email: 'malika@gmail.com', role: 'teacher', verified: true, banned: false, joinedAt: '2024-11-05', avatar: '/images/avatar_teacher1.png', subject: 'English & Business' },
  { id: 'u3', name: 'Жасур Усманов', email: 'jasur@gmail.com', role: 'student', verified: false, banned: false, joinedAt: '2026-01-20', xp: 3200 },
  { id: 'u4', name: 'Дилноза Юлдашева', email: 'dilnoza@mail.ru', role: 'student', verified: true, banned: false, joinedAt: '2025-08-14', xp: 2900 },
  { id: 'u5', name: 'Бобур Каримов', email: 'bobur@gmail.com', role: 'teacher', verified: true, banned: false, joinedAt: '2024-09-01', avatar: '/images/avatar_teacher2.png', subject: 'Web Dev & React' },
  { id: 'u6', name: 'Санжар Тошматов', email: 'sanjat@gmail.com', role: 'teacher', verified: false, banned: false, joinedAt: '2026-05-10', avatar: '/images/avatar_teacher3.png', subject: 'Chess & Go' },
  { id: 'u7', name: 'Нилуфар Холматова', email: 'nilufar@gmail.com', role: 'student', verified: true, banned: true, joinedAt: '2025-06-22', xp: 1200 },
  { id: 'u8', name: 'Отабек Мирзаев', email: 'otabek@gmail.com', role: 'admin', verified: true, banned: false, joinedAt: '2024-01-15' },
];

// ───── LEADERBOARD ─────
export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, id: 'u1', name: 'Алинур Каримов', avatar: '/images/avatar_teacher2.png', xp: 4850, streak: 5, coursesCompleted: 4, badge: '👑 Top Student' },
  { rank: 2, id: 'l2', name: 'Камола Эшматова', avatar: '/images/avatar_teacher1.png', xp: 4120, streak: 12, coursesCompleted: 3, badge: '🔥 Python Master' },
  { rank: 3, id: 'l3', name: 'Жасур Усманов', avatar: '/images/avatar_teacher3.png', xp: 3900, streak: 8, coursesCompleted: 3, badge: '⚡ Speed Learner' },
  { rank: 4, id: 'l4', name: 'Дилноза Юлдашева', avatar: '/images/avatar_teacher1.png', xp: 3450, streak: 4, coursesCompleted: 2, badge: '🌟 English Pro' },
  { rank: 5, id: 'l5', name: 'Фарход Нурматов', avatar: '/images/avatar_teacher3.png', xp: 3100, streak: 15, coursesCompleted: 2, badge: '♟️ Chess Grandmaster' },
];

// ───── TEACHER DIRECTORY ─────
export const mockTeachers: TeacherDirectory[] = [
  { id: 't1', name: 'Малика Рашидова', avatar: '/images/avatar_teacher1.png', subject: 'English: Business & Tech', category: 'Языки', rating: 4.9, studentsCount: 5210, coursesCount: 3, verified: true },
  { id: 't2', name: 'Бобур Каримов', avatar: '/images/avatar_teacher2.png', subject: 'Web Dev (React + Node)', category: 'IT & AI', rating: 4.9, studentsCount: 12400, coursesCount: 4, verified: true },
  { id: 't3', name: 'Акмал Юсупов', avatar: '/images/avatar_teacher2.png', subject: 'Python & AI / Data Science', category: 'IT & AI', rating: 4.9, studentsCount: 8420, coursesCount: 2, verified: true },
  { id: 't4', name: 'Дилшод Мирзаев', avatar: '/images/avatar_teacher3.png', subject: 'Шахматная стратегия FIDE', category: 'Шахматы', rating: 4.7, studentsCount: 1850, coursesCount: 2, verified: true },
  { id: 't5', name: 'Умар Хасанов', avatar: '/images/avatar_teacher3.png', subject: 'Арабский язык & Грамматика', category: 'Языки', rating: 4.6, studentsCount: 980, coursesCount: 1, verified: true },
];

// ───── ACTIVITY LOGS ─────
export const mockActivityLogs: ActivityLog[] = [
  { id: 'a1', userName: 'Алинур Каримов', userRole: 'student', avatar: '/images/avatar_teacher2.png', action: 'Завершил тест', target: 'Тест: Проверка знаний Python (100%)', timestamp: '5 мин назад' },
  { id: 'a2', userName: 'Малика Рашидова', userRole: 'teacher', avatar: '/images/avatar_teacher1.png', action: 'Проверила ДЗ', target: 'Business Email Writing (95/100)', timestamp: '18 мин назад' },
  { id: 'a3', userName: 'Жасур Усманов', userRole: 'student', avatar: '/images/avatar_teacher3.png', action: 'Записался на курс', target: 'Web Development: React + Node', timestamp: '42 мин назад' },
  { id: 'a4', userName: 'Санжар Тошматов', userRole: 'teacher', avatar: '/images/avatar_teacher3.png', action: 'Отправил курс на модерацию', target: 'Go: Стратегическое мышление', timestamp: '2 часа назад' },
  { id: 'a5', userName: 'Отабек Мирзаев', userRole: 'admin', avatar: '/images/avatar_teacher3.png', action: 'Верифицировал учителя', target: 'Акмал Юсупов', timestamp: '4 часа назад' },
];

// ───── HOMEWORK ─────
export const mockHomework: Homework[] = [
  { id: 'h1', title: 'ДЗ: Функции Python', courseName: 'Python & AI', dueDate: '2026-07-30', status: 'pending' },
  { id: 'h2', title: 'ДЗ: Анализ данных', courseName: 'Python & AI', dueDate: '2026-08-05', status: 'submitted' },
  { id: 'h3', title: 'Business Email Writing', courseName: 'English Business', dueDate: '2026-07-28', status: 'graded', grade: 95, feedback: 'Отлично! Хороший стиль письма.' },
  { id: 'h4', title: 'ДЗ: Испанская партия', courseName: 'Шахматы', dueDate: '2026-07-25', status: 'overdue' },
];

// ───── TEACHER HOMEWORK (submissions to review) ─────
export const mockSubmissions: Homework[] = [
  { id: 's1', title: 'ДЗ: Функции Python', courseName: 'Python & AI', studentName: 'Алинур Каримов', dueDate: '2026-07-30', status: 'submitted' },
  { id: 's2', title: 'ДЗ: NumPy Arrays', courseName: 'Python & AI', studentName: 'Жасур Усманов', dueDate: '2026-07-28', status: 'submitted' },
  { id: 's3', title: 'ДЗ: Pandas DataFrames', courseName: 'Python & AI', studentName: 'Дилноза Юлдашева', dueDate: '2026-07-27', status: 'submitted' },
];

// ───── BADGES ─────
export const mockBadges: Badge[] = [
  { id: 'b1', icon: '🤖', name: 'AI Explorer', description: 'Завершил первый AI модуль', earned: true, earnedAt: '2026-06-15' },
  { id: 'b2', icon: '🔥', name: 'On Fire', description: '7-дневная серия обучения', earned: true, earnedAt: '2026-07-10' },
  { id: 'b3', icon: '⚡', name: 'Speed Learner', description: 'Завершил 3 урока за день', earned: true, earnedAt: '2026-07-20' },
  { id: 'b4', icon: '🏆', name: 'Champion', description: 'Завершил курс с оценкой 95%+', earned: false },
  { id: 'b5', icon: '🌟', name: 'Star Student', description: 'Получил 5 оценок "Отлично"', earned: false },
  { id: 'b6', icon: '🚀', name: 'Rocket Start', description: 'Записался на 5 курсов', earned: false },
];

// ───── ENROLLED COURSES ─────
export const mockEnrolled: EnrolledCourse[] = [
  {
    courseId: 'c1',
    title: 'Python & AI: Полный курс',
    teacherName: 'Акмал Юсупов',
    progress: 60,
    thumbnail: '/images/course_python.png',
    category: 'IT & AI',
    lastLesson: 'Переменные и типы данных',
    nextLesson: 'Управляющие конструкции',
    totalLessons: 42,
    completedLessons: 25,
  },
  {
    courseId: 'c2',
    title: 'English: Business & Tech',
    teacherName: 'Малика Рашидова',
    progress: 35,
    thumbnail: '/images/course_english.png',
    category: 'Языки',
    lastLesson: 'Tech Industry Terms',
    nextLesson: 'Email Etiquette',
    totalLessons: 28,
    completedLessons: 10,
  },
  {
    courseId: 'c3',
    title: 'Шахматы: Стратегия Чемпионов',
    teacherName: 'Дилшод Мирзаев',
    progress: 15,
    thumbnail: '/images/course_chess.png',
    category: 'Шахматы',
    lastLesson: 'Правила и нотация',
    nextLesson: 'Испанская партия',
    totalLessons: 24,
    completedLessons: 3,
  },
];

// ───── TESTIMONIALS ─────
export const mockTestimonials = [
  {
    id: 't1',
    name: 'Камола Эшматова',
    role: 'Студентка, 3 курс',
    avatar: '/images/avatar_teacher1.png',
    text: 'SkillPlanet изменил мою жизнь. Python за 2 месяца, и теперь я Junior Developer в стартапе!',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Фарход Нурматов',
    role: 'Шахматист, FIDE 1850',
    avatar: '/images/avatar_teacher3.png',
    text: 'Лучшие уроки по шахматам, которые я встречал. Структура, качество видео — всё на высшем уровне.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Зарина Хамидова',
    role: 'Бизнес-аналитик',
    avatar: '/images/avatar_teacher1.png',
    text: 'English Business курс дал мне уверенность на международных переговорах. Рекомендую всем!',
    rating: 5,
  },
];

// ───── PLATFORM STATS ─────
export const platformStats = {
  totalUsers: 28400,
  activeCourses: 148,
  teacherRevenueUsd: 6580,
  platformRevenueUsd: 968750,
  avgRating: 4.8,
  countries: 47,
  completionRate: '78%',
};
