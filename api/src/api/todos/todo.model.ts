import { WithId } from 'mongodb'
import * as z from 'zod'

import { db } from '../../db'

export const Todo = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['1', '2', '3', '4']),
  week: z.string().optional(),
})

export type Todo = z.infer<typeof Todo>
export type TodoWithId = WithId<Todo>
export const Todos = db.collection<Todo>('todos')
