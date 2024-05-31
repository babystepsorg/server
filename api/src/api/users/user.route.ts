import { Router } from 'express'
import { validateAuthentication, validateRequest } from '../../middlewares'
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

router.post(
  '/:id/subscribe',
  validateAuthentication,
  validateRequest({
    body: z.object({
      subscriptionStatus: z.enum(['active', 'inactive', 'cancelled']),
      subscriptionStartDate: z.string().datetime(),
      subscriptionEndDate: z.string().datetime(),
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
