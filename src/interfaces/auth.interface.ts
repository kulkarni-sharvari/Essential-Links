import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: number;
  role: string; // trying for rbac
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser {
  user: User;
}


