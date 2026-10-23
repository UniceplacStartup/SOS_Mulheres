import { userRepository } from '../../infrastructure/database/NeonRepository';
import { RegisterUserInput, LoginInput } from '../dtos';
import { ValidationError, UnauthorizedError } from '../../core/errors/AppError';
import { User } from '../../core/entities';

export class AuthService {
  async register(input: RegisterUserInput): Promise<Omit<User, 'passwordHash'>> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new ValidationError('Este e-mail já está cadastrado no sistema.');
    }

    const existingCpf = await userRepository.findByCpf(input.cpf);
    if (existingCpf) {
      throw new ValidationError('Este CPF já possui cadastro no sistema.');
    }

    const created = await userRepository.create({
      fullName: input.fullName,
      cpf: input.cpf,
      email: input.email,
      passwordHash: input.password, // Em produção com bcrypt; simplificado para sandbox
      realPinHash: input.realPin,
      duressPinHash: input.duressPin,
      protectiveMeasureNumber: input.protectiveMeasureNumber,
    });

    const { passwordHash, ...userWithoutPassword } = created;
    return userWithoutPassword;
  }

  async login(input: LoginInput): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('E-mail ou senha inválidos.');
    }

    if (user.passwordHash !== input.password) {
      throw new UnauthorizedError('E-mail ou senha inválidos.');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    const token = `sos_token_${Buffer.from(user.id).toString('base64')}`;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async getProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('Usuária não encontrada.');
    }
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
