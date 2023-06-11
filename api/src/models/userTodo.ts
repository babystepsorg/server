import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'

import { db } from '../db'

export const UserTodo = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  week: z.string().optional(),
  userPriority: z.enum(['normal', 'high', 'crucial']).default('normal').optional(),
  completed: z.boolean().default(false),
  completedOn: z.string().datetime().optional(),
  completionDate: z.string().datetime().optional(),
  adminTodo: z.custom<ObjectId>().optional(),
  userId: z.custom<ObjectId>(),
  assignPartner: z.boolean().default(false).optional(),
})

export type UserTodo = z.infer<typeof UserTodo>
export type UserTodoWithId = WithId<UserTodo>
export const UserTodos = db.collection<UserTodo>('userTodos')
