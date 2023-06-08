import { Router } from 'express'
import { validateAuthentication, validateRequest } from '../../middlewares'
import { User } from '../../models/user'
import * as AuthHandler from './auth.handlers'
import { z } from 'zod'

const router = Router()

router.post(
  '/signup',
  validateRequest({
    body: User.omit({ salt: true }),
  }),
  AuthHandler.signUp
)
router.post(
  '/login',
  validateRequest({
    body: User.omit({
      role: true,
      stage: true,
      salt: true,
      name: true,
    }),
  }),
  AuthHandler.logIn
)

router.post(
  '/refresh',
  // validateAuthentication,
  validateRequest({
    body: z.object({
      refreshToken: z.string().nonempty('Refresh token is required'),
    }),
  }),
  AuthHandler.refreshToken
)

router.get('/me', validateAuthentication, AuthHandler.me)

export default router
