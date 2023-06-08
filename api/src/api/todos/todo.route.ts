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
      completionData: z.string().datetime().optional(),
    }),
  }),
  TodoHandler.createOne
)
router.patch(
  '/:id',
  validateAuthentication,
  validateRequest({
    body: UserTodo.omit({
      title: true,
      description: true,
      completed: true,
      adminTodo: true,
      completedOn: true,
      userId: true,
      priority: true,
      week: true,
    }).extend({
      admin: z.boolean(),
    }),
  }),
  TodoHandler.updateOne
)

export default router
