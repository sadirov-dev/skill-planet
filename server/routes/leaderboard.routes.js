import { Router } from 'express';
import { getLeaderboard, getPlatformStats } from '../controllers/leaderboard.controller.js';

const router = Router();

router.get('/', getLeaderboard);
router.get('/stats', getPlatformStats);

export default router;
