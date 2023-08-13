import { Router } from 'express'
import { validateAuthentication, validateRequest } from '../../middlewares'
import * as TodoHandler from './todo.handler'
import { UserTodo } from '../../models/userTodo'
import { z } from 'zod'

const router = Router()

router.get('/', validateAuthentication, TodoHandler.getAll)
router.post(
  '/',
  validateAuthentication,
  validateRequest({
    body: UserTodo.omit({
      completed: true,
      adminTodo: true,
      completedOn: true,
      userId: true,
      priority: true,
      week: true,
    }).extend({
      completionDate: z.string().datetime().optional(),
    }),
  }),
  TodoHandler.createOne
)

router.patch(
  '/:id',
  validateAuthentication,
  validateRequest({
    body: UserTodo.omit({
      completed: true,
      completedOn: true,
      priority: true,
      week: true,
      adminTodo: true,
      userId: true,
    }).extend({
      admin: z.boolean(),
      title: z.string().optional(),
      description: z.string().optional(),
      userPriority: z.enum(['normal', 'high', 'crucial']).optional(),
      completionDate: z.string().datetime().optional(),
      assignPartner: z.boolean().optional(),
    }),
  }),
  TodoHandler.updateOne
)

router.post(
  '/:id/complete',
  validateAuthentication,
  validateRequest({
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      admin: z.boolean().default(false),
    }),
  }),
  TodoHandler.completeOne
)

router.post(
  '/:id/incomplete',
  validateAuthentication,
  validateRequest({
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      admin: z.boolean().default(false),
    }),
  }),
  TodoHandler.incompleteOne
)

router.delete(
  '/:id',
  validateAuthentication,
  validateRequest({
    params: z.object({
      id: z.string()
    }),
  }),
  TodoHandler.deleteOne
)

export default router
