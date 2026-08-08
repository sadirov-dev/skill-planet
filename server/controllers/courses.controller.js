const coursesDB = [
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
  },
  {
    id: 'c1',
    title: 'Python & AI / Data Science: От Нуля до Pro',
    description: 'Изучите фундаментальный Python, нейросети, Machine Learning, работа с Pandas, NumPy, Scikit-Learn и реальные кейсы с ИИ-моделями.',
    category: 'IT & AI',
    level: 'Beginner',
    levelsSupported: ['Beginner', 'Intermediate', 'Advanced'],
    rating: 4.9,
    reviewCount: 1420,
    teacherName: 'Акмал Юсупов',
    teacherAvatar: '/images/avatar_teacher2.jpg',
    price: 69,
    priceType: 'paid',
    thumbnail: '/images/course_python.jpg',
    duration: '90 часов',
    studentsCount: 8420,
  },
  {
    id: 'c3',
    title: 'Шахматная стратегия FIDE: От Новичка до КМС',
    description: 'Глубокий анализ дебютов, миттельшпиля, эндшпиля, расчёт вариантов, тактические комбинации и позиционное маневрирование от сертифицированного тренера FIDE.',
    category: 'Шахматы',
    level: 'All Levels',
    levelsSupported: ['Beginner', 'Intermediate', 'Advanced'],
    rating: 4.8,
    reviewCount: 940,
    teacherName: 'Дилшод Мирзаев',
    teacherAvatar: '/images/avatar_teacher3.jpg',
    price: 0,
    priceType: 'free',
    thumbnail: '/images/course_chess.jpg',
    duration: '45 часов',
    studentsCount: 1850,
  },
  {
    id: 'c4',
    title: 'Fullstack Web Development: React & Node.js',
    description: 'Создание современных веб-приложений с React 19, TypeScript, Node.js, Express, MongoDB и деплоем на Vercel.',
    category: 'IT & AI',
    level: 'Intermediate',
    levelsSupported: ['Beginner', 'Intermediate', 'Advanced'],
    rating: 4.9,
    reviewCount: 2100,
    teacherName: 'Бобур Каримов',
    teacherAvatar: '/images/avatar_teacher2.jpg',
    price: 59,
    priceType: 'paid',
    thumbnail: '/images/course_webdev.jpg',
    duration: '110 часов',
    studentsCount: 12400,
  },
  {
    id: 'c5',
    title: 'Арабский язык & Кораническая грамматика',
    description: 'Фундаментальный курс чтения, письма, фонетики (Таджвид) и разговорного арабского языка.',
    category: 'Языки',
    level: 'Beginner',
    levelsSupported: ['Beginner', 'Elementary', 'Intermediate'],
    rating: 4.7,
    reviewCount: 512,
    teacherName: 'Умар Хасанов',
    teacherAvatar: '/images/avatar_teacher3.jpg',
    price: 39,
    priceType: 'paid',
    thumbnail: '/images/course_arabic.jpg',
    duration: '60 часов',
    studentsCount: 980,
  },
  {
    id: 'c6',
    title: 'Go (Го): Стратегия, Философия и Баланс',
    description: 'Древнейшая восточная логическая игра. Развитие глубокого стратегического мышления и анализа территории.',
    category: 'Шахматы',
    level: 'Beginner',
    levelsSupported: ['Beginner', 'Intermediate'],
    rating: 4.8,
    reviewCount: 310,
    teacherName: 'Санжар Тошматов',
    teacherAvatar: '/images/avatar_teacher3.jpg',
    price: 0,
    priceType: 'free',
    thumbnail: '/images/course_go.jpg',
    duration: '35 часов',
    studentsCount: 640,
  }
];

const enrolledDB = [
  {
    id: 'e1',
    userId: 'u1',
    courseId: 'c2',
    courseTitle: 'General & Business English (A1 - C1)',
    progress: 45,
    completedLessons: 16,
    totalLessons: 36,
    lastLessonTitle: 'Listening: Dialogues in a Café',
    thumbnail: '/images/course_english.jpg',
  },
  {
    id: 'e2',
    userId: 'u1',
    courseId: 'c1',
    courseTitle: 'Python & AI / Data Science: От Нуля до Pro',
    progress: 60,
    completedLessons: 24,
    totalLessons: 40,
    lastLessonTitle: 'NumPy Arrays & Data Processing',
    thumbnail: '/images/course_python.jpg',
  },
  {
    id: 'e3',
    userId: 'u1',
    courseId: 'c3',
    courseTitle: 'Шахматная стратегия FIDE: От Новичка до КМС',
    progress: 15,
    completedLessons: 3,
    totalLessons: 20,
    lastLessonTitle: 'Открытые и полуоткрытые дебюты',
    thumbnail: '/images/course_chess.jpg',
  }
];

export const getCourses = (req, res) => {
  const { search, category, level } = req.query;
  let filtered = [...coursesDB];

  if (category && category !== 'Все') {
    filtered = filtered.filter(c => c.category === category);
  }

  if (level && level !== 'Все уровни') {
    filtered = filtered.filter(c => c.level === level || c.levelsSupported.includes(level));
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.teacherName.toLowerCase().includes(q)
    );
  }

  return res.json({ success: true, count: filtered.length, courses: filtered });
};

export const getCourseById = (req, res) => {
  const course = coursesDB.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Курс не найден' });
  }
  return res.json({ success: true, course });
};

export const enrollCourse = (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  const course = coursesDB.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Курс не найден' });
  }

  const existing = enrolledDB.find(e => e.userId === userId && e.courseId === courseId);
  if (existing) {
    return res.json({ success: true, message: 'Вы уже записаны на этот курс', enrolled: existing });
  }

  const newEnrollment = {
    id: `e_${Date.now()}`,
    userId,
    courseId,
    courseTitle: course.title,
    progress: 0,
    completedLessons: 0,
    totalLessons: 30,
    lastLessonTitle: 'Введение в курс',
    thumbnail: course.thumbnail,
  };

  enrolledDB.push(newEnrollment);
  return res.status(201).json({ success: true, message: 'Вы успешно записались на курс!', enrolled: newEnrollment });
};

export const getUserEnrolledCourses = (req, res) => {
  const userId = req.user.id;
  const userEnrolled = enrolledDB.filter(e => e.userId === userId);
  return res.json({ success: true, count: userEnrolled.length, enrolled: userEnrolled });
};
