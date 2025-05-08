import { Router } from 'express';
import taskRoutes from './taskRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/tasks', taskRoutes);
router.use('/auth', authRoutes);

export default router;