export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
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
  };
}