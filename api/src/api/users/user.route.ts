import { Router } from 'express'
import { validateApiKey, validateAuthentication, validateRequest } from '../../middlewares'
import * as UserHandler from './user.handlers'
import { User } from '../../models/user'
import { z } from 'zod'

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
    }).extend({
      name: z.string().optional(),
    }),
  }),
  UserHandler.updateOne
)

// Todo: Need to fix the typings...
router.post(
  '/:id/subscribe',
  validateApiKey,
  validateRequest({
    body: z.object({
      subscriptionStatus: z.any(),
      subscriptionStartDate: z.any(),
      subscriptionEndDate: z.any(),
      razorpaySubscriptionId: z.string(),
      razorpayPlanId: z.string(),
    }),
  }),
  UserHandler.subscribeUser
)


// router.post(
//   '/delete',
//   validateRequest({
//     body: z.object({
//       email: z.string()
//     })
//   }),
//   UserHandler.deleteUserByEmail
// )

export default router
