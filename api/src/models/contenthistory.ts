import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'
import { db } from '../db'

export const ContentHistory = z.object({
  contentId: z.custom<ObjectId>(),
  userId: z.custom<ObjectId>(),
  lastedWatchedAt: z.string().datetime(),
  week: z.string()
})

export type ContentHistory = z.infer<typeof ContentHistory>
export type ContentHistoryWithId = WithId<ContentHistory>
export const ContentHistories = db.collection<ContentHistory>('contenthistory')
