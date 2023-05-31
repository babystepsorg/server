import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'

import { db } from '../db'

export const UserTodo = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().optional(),
  priority: z.enum(['1', '2', '3', '4']),
  week: z.string().optional(),
  userPriority: z.enum(['normal', 'high', 'crucial']),
  completed: z.boolean().default(false),
  completedOn: z.date().optional(),
  completionDate: z.date().optional(),
  adminTodo: z.custom<ObjectId>().optional(),
  userId: z.custom<ObjectId>(),
})

export type UserTodo = z.infer<typeof UserTodo>
export type UserTodoWithId = WithId<UserTodo>
export const UserTodos = db.collection<UserTodo>('userTodos')
