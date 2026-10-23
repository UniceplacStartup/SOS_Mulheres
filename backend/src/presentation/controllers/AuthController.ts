import { Request, Response, NextFunction } from 'express';
import { authService } from '../../application/services/AuthService';
import { registerUserSchema, loginSchema } from '../../application/dtos';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerUserSchema.parse(req.body);
      const user = await authService.register(validated);
      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await authService.login(validated);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) || 'usr-default-001';
      const profile = await authService.getProfile(userId);
      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
