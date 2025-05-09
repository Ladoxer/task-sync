export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  jobTitle?: string;
  department?: string;
  bio?: string;
  theme?: 'light' | 'dark';
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}