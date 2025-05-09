import { Router } from 'express';
import taskRoutes from './taskRoutes';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/tasks', taskRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;