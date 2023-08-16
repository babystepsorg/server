import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'
import { db } from '../db'

export const Calander = z.object({
  gentleReminderId: z.custom<ObjectId>().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  date: z.string().datetime().nonempty(),
  createdAt: z.string().datetime().default(new Date().toISOString()).optional(),
  userId: z.custom<ObjectId>(),
  repeat: z.enum(['sunday','monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'])
})

export type Calander = z.infer<typeof Calander>
export type CalanderWithId = WithId<Calander>
export const Calanders = db.collection<Calander>('calanders')
