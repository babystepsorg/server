import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'

import { db } from '../../db'

export const Mentalhealth = z.object({
  emotion: z.string(),
  description: z.string(),
  useId: z.custom<ObjectId>(),
  createdAt: z.string().datetime().default(new Date().toISOString())
})

export type Mentalhealth = z.infer<typeof Mentalhealth>
export type MentalhealthWithId = WithId<Mentalhealth>
export const Mentalhealths = db.collection<Mentalhealth>('mentalhealths')
