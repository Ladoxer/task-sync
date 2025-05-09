export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;  // URL to profile image
  jobTitle?: string;
  department?: string;
  bio?: string;
  theme?: 'light' | 'dark';
  createdAt: Date;
  updatedAt: Date;
}

export class User implements IUser {
  public id: string;
  public email: string;
  public password: string;
  public name: string;
  public avatar?: string;
  public jobTitle?: string;
  public department?: string;
  public bio?: string;
  public theme?: 'light' | 'dark';
  public createdAt: Date;
  public updatedAt: Date;

  constructor(user: Partial<IUser>) {
    this.id = user.id || crypto.randomUUID();
    this.email = user.email || '';
    this.password = user.password || '';
    this.name = user.name || '';
    this.avatar = user.avatar;
    this.jobTitle = user.jobTitle;
    this.department = user.department;
    this.bio = user.bio;
    this.theme = user.theme;
    this.createdAt = user.createdAt || new Date();
    this.updatedAt = user.updatedAt || new Date();
  }
}