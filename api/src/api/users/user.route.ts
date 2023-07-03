import { Router } from 'express'
import { validateAuthentication, validateRequest } from '../../middlewares'
import * as UserHandler from './user.handlers'
import { User } from '../../models/user'

const router = Router()

router.post('/:id/invite-partner', validateAuthentication, UserHandler.invitePartner)
router.get(
  "/:id",
  validateAuthentication,
  UserHandler.findOne
)
router.patch(
  '/:id',
  validateAuthentication,
  validateRequest({
    body: User.omit({
      email: true,
      password: true,
      stage: true,
      salt: true,
      createdAt: true,
      role: true,
      updatedAt: true,
    }),
  }),
  UserHandler.updateOne
)

export default router
