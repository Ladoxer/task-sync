import { Router } from 'express';
import { container } from '../../config/container';
import { TYPES } from '../../types';
import { UserService } from '../../domain/services/UserService';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ApplicationError } from '../../core/errors/ApplicationError';

const router = Router();
const userService = container.get<UserService>(TYPES.UserService);

// Get current user profile
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userProfile = await userService.getUserProfile(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userProfile = await userService.updateUserProfile(userId, req.body);
    res.status(200).json(userProfile);
  } catch (error) {
    next(error);
  }
});

// Update password
router.put('/password', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      throw new ApplicationError('Current password and new password are required', 400);
    }
    
    await userService.updatePassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;