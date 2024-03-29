import { Router } from 'express'
import { validateAuthentication, validateRequest } from '../../middlewares'
import * as CalanderHandler from './calander.handler'
import { Calander } from '../../models/calander'
import { z } from 'zod'
import { Ovulation } from '../../models/ovulation'

const router = Router()

router.get(
  '/', 
  validateAuthentication, 
  validateRequest({
    query: z.object({
      week: z.string().optional()
    }),
  }),
  CalanderHandler.getAll
)
router.post(
  '/',
  validateAuthentication,
  validateRequest({
    body: Calander.omit({
      userId: true,
    }),
  }),
  CalanderHandler.createOne
)

router.post(
  '/ovulation',
  validateAuthentication,
  validateRequest({
    body: Ovulation.omit({
      userId: true,
    }),
  }),
  CalanderHandler.createOrUpdateOvulation
)

router.post(
  '/gr',
  validateAuthentication,
  validateRequest({
    body: Calander.omit({
      userId: true
    }),
  }),
  CalanderHandler.createOrUpdateGR
)
router.get(
  '/gr/:id',
  validateAuthentication,
  CalanderHandler.getGentleReminderDoc
)
router.patch(
  '/:id',
  validateAuthentication,
  validateRequest({
    body: Calander.omit({
      userId: true,
    }).extend({
      date: z.string().datetime().optional(),
    }),
  }),
  CalanderHandler.updateOne
)
router.delete('/:id', validateAuthentication, CalanderHandler.deleteOne)

export default router
