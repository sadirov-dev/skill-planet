import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import coursesRoutes from './routes/courses.routes.js';
import aiRoutes from './routes/ai.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 SkillPlanet Node.js Express API Server',
    status: 'online',
    endpoints: {
      health: 'GET /api/health',
      courses: 'GET /api/courses',
      authLogin: 'POST /api/auth/login',
      authRegister: 'POST /api/auth/register',
      aiChat: 'POST /api/ai/chat',
      leaderboard: 'GET /api/leaderboard',
    }
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    message: 'SkillPlanet Node.js Backend API is running smoothly 🚀',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Маршрут ${req.originalUrl} не найден на сервере`,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 SkillPlanet Backend Server Running!`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================\n`);
});
