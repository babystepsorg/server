import { Router } from 'express'
import { validateAuthentication, validateRequest } from '../../middlewares'
import { User } from '../../models/user'
import * as AuthHandler from './auth.handlers'
import { z } from 'zod'
import passport from 'passport'

const router = Router()

router.post(
  '/signup',
  validateRequest({
    body: User.omit({ salt: true }).extend({
      token: z.string().optional()
    }),
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

router.get(
  '/verify',
  validateRequest({
    query: z.object({
      token: z.string().min(1, 'Token is required'),
      origin: z.string().min(1, 'Origin is required')
    }),
  }),
  AuthHandler.verifyAccount
)

router.get(
  '/google',
  AuthHandler.googleAuth
)

router.get(
  '/google/callback',
  AuthHandler.googleAuthCallback
)

router.get(
  '/google/calendar',
  // AuthHandler.googleCalandarAuthMiddleware,
  AuthHandler.googleCalandarAuth
)

router.get(
  '/google/calendar/callback',
  AuthHandler.googleCalanderAuthCallback
)

// router.get(
//   '/google/signup',
//   AuthHandler.googleAuthSignup
// )

// router.get(
//   '/google/signup/callback',
//   AuthHandler.googleAuthSignupCallback
// )

router.get('/me', validateAuthentication, AuthHandler.me)

export default router
