import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'
import { db } from '../db'

export const ActiveUser = z.object({
  activityTimestamp: z.string().datetime().default(new Date().toISOString()),
  userId: z.custom<ObjectId>(),
})

export type ActiveUser = z.infer<typeof ActiveUser>
export type ActiveUserWithId = WithId<ActiveUser>
export const ActiveUsers = db.collection<ActiveUser>('active_users')
