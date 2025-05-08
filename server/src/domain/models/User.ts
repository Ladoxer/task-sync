export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements IUser {
  public id: string;
  public email: string;
  public password: string;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(user: Partial<IUser>) {
    this.id = user.id || crypto.randomUUID();
    this.email = user.email || '';
    this.password = user.password || '';
    this.name = user.name || '';
    this.createdAt = user.createdAt || new Date();
    this.updatedAt = user.updatedAt || new Date();
  }
}