import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// In-memory User DB for instant out-of-the-box running (easily swap with MongoDB/PostgreSQL)
const usersDB = [
  {
    id: 'u_admin_sadirov',
    name: 'Абдуллох Садиров (Admin)',
    email: 'sadirov@admin.dev',
    passwordHash: bcrypt.hashSync('Dev01031990!', 8),
    role: 'admin',
    verified: true,
    avatar: '/images/avatar_teacher3.jpg',
    xp: 99999,
    streak: 365,
    joinedAt: '2024-01-01',
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'skillplanet_secret_jwt_key_2026';

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Заполните все обязательные поля' });
    }

    const existingUser = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Пользователь с таким email уже существует' });
    }

    const passwordHash = await bcrypt.hash(password, 8);
    const newUser = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: ['student', 'teacher', 'admin'].includes(role) ? role : 'student',
      verified: false,
      avatar: '/images/avatar_teacher2.jpg',
      xp: 100,
      streak: 1,
      joinedAt: new Date().toISOString().split('T')[0],
    };

    usersDB.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userWithoutPass } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Регистрация прошла успешно!',
      token,
      user: userWithoutPass,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Введите email и пароль' });
    }

    const user = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Неверный Gmail (пользователь с таким email не найден)' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Неверный пароль' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userWithoutPass } = user;

    return res.json({
      success: true,
      message: 'Успешный вход в систему!',
      token,
      user: userWithoutPass,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = (req, res) => {
  const user = usersDB.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Пользователь не найден' });
  }
  const { passwordHash: _, ...userWithoutPass } = user;
  return res.json({ success: true, user: userWithoutPass });
};

export const updateProfile = (req, res) => {
  const user = usersDB.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Пользователь не найден' });
  }

  const { name, avatar } = req.body;
  if (name) user.name = name.trim();
  if (avatar) user.avatar = avatar;

  const { passwordHash: _, ...userWithoutPass } = user;
  return res.json({ success: true, message: 'Профиль обновлен', user: userWithoutPass });
};
