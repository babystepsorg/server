import { Request } from 'express'
import { UserWithId } from './src/models/user'

declare global {
  namespace Express {
    interface User extends Omit<UserWithId, 'password' | 'salt'> {
      root: boolean;
    };
    export interface Request {
      user: User | null
    }
  }
}
