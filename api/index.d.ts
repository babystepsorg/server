import { Request } from 'express'
import { User } from './src/models/user'

declare global {
  namespace Express {
    export interface Request {
      user: Omit<User, 'password' | 'salt'> | null
    }
  }
}
