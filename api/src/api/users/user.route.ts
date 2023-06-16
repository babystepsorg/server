import { Router } from 'express'
import { validateAuthentication, validateRequest } from '../../middlewares'
import * as UserHandler from './user.handlers'
import { User } from '../../models/user'

const router = Router()

router.post('/:id/invite-partner', validateAuthentication, UserHandler.invitePartner)
router.patch(
  '/:id',
  validateAuthentication,
  validateRequest({
    body: User.omit({
      email: true,
    }),
  }),
  UserHandler.updateOne
)

export default router
