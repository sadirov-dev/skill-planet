import { Router } from 'express';
import { getCourses, getCourseById, enrollCourse, getUserEnrolledCourses } from '../controllers/courses.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getCourses);
router.get('/my-enrolled', authenticateToken, getUserEnrolledCourses);
router.get('/:id', getCourseById);
router.post('/enroll', authenticateToken, enrollCourse);

export default router;
