import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'

import { db } from '../../db'

export const Tracking = z.object({
  userId: z.custom<ObjectId>(),
  page: z.string().min(1, 'Page is required'),
  duration: z.number().positive('Duration must be a positive number'),
  trackedAt: z.string().datetime().default(new Date().toISOString()),
})

export type Tracking = z.infer<typeof Tracking>
export type TrackingWithId = WithId<Tracking>
export const Trackings = db.collection<Tracking>('tracking')
