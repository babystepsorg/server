import { Router } from 'express'
import { validateAuthentication, validateRequest } from '../../middlewares'
import * as UserHandler from './user.handlers'

const router = Router()

router.post('/:id/invite-partner', validateAuthentication, UserHandler.invitePartner)

export default router
