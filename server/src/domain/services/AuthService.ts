import { injectable, inject } from 'inversify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TYPES } from '../../types';
import { User } from '../models/User';
import { IUserRepository } from '../repositories/IUserRepository';
import { ApplicationError } from '../../core/errors/ApplicationError';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async register(data: RegisterData): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ApplicationError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new User({
      ...data,
      password: hashedPassword
    });

    return this.userRepository.create(user);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ApplicationError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApplicationError('Invalid credentials', 401);
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  private generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'default-secret', {
      expiresIn: '24h'
    });
  }

  verifyToken(token: string): { id: string; email: string } {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as {
        id: string;
        email: string;
      };
    } catch (error) {
      throw new ApplicationError('Invalid token', 401);
    }
  }
}