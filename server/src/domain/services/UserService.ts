import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { User } from '../models/User';
import { IUserRepository } from '../repositories/IUserRepository';
import { ApplicationError } from '../../core/errors/ApplicationError';
import bcrypt from 'bcrypt';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async getUserProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApplicationError('User not found', 404);
    }
    
    // Return user without password
    const { password, ...userProfile } = user;
    return userProfile;
  }

  async updateUserProfile(userId: string, userData: Partial<User>): Promise<Omit<User, 'password'>> {
    // Don't allow password updates through this method
    const { password, email, ...safeUserData } = userData;
    
    const updatedUser = await this.userRepository.update(userId, {
      ...safeUserData,
      updatedAt: new Date()
    });
    
    if (!updatedUser) {
      throw new ApplicationError('User not found', 404);
    }
    
    // Return updated user without password
    const { password: _, ...userProfile } = updatedUser;
    return userProfile;
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApplicationError('User not found', 404);
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new ApplicationError('Current password is incorrect', 401);
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { 
      password: hashedPassword,
      updatedAt: new Date()
    });
  }
}