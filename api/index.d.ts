import { Request } from 'express'
import { UserWithId } from './src/models/user'

declare global {
  namespace Express {
    export interface Request {
      user: Omit<UserWithId, 'password' | 'salt'> | null
    }
  }
}
