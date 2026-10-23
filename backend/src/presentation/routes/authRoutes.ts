import { Router } from 'express';
import { authController } from '../controllers/AuthController';

export const authRoutes = Router();

authRoutes.post('/register', authController.register.bind(authController));
authRoutes.post('/login', authController.login.bind(authController));
authRoutes.get('/me', authController.me.bind(authController));
