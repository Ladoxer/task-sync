import { Router } from 'express';
import { container } from '../../config/container';
import { TYPES } from '../../types';
import { AuthService } from '../../domain/services/AuthService';

const router = Router();

// Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const authService = container.get<AuthService>(TYPES.AuthService);
    const { email, password, name } = req.body;
    const user = await authService.register({ email, password, name });
    
    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const authService = container.get<AuthService>(TYPES.AuthService);
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;