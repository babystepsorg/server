import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'
import { db } from '../db'

export const UserSymptom = z.object({
  symptomId: z.custom<ObjectId>(),
  userId: z.custom<ObjectId>(),
  createdAt: z.string().datetime().default(new Date().toISOString()).optional(),
})

export type UserSymptom = z.infer<typeof UserSymptom>
export type UserSymptomWithId = WithId<UserSymptom>
export const UserSymptoms = db.collection<UserSymptom>('usersymptoms')
