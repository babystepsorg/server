import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'

import { db } from '../db'

export const Content = z.object({
  title: z.string(),
  layout: z.enum(['video', 'post']),
  type: z.enum(['link']),
  video_url: z.string(),
  weeks: z.array(z.string()),
  roles: z.array(z.enum(['Father', 'Mother'])),
  body: z.any(),
  tags: z.array(z.custom<ObjectId>()),
  createdAt: z.string().datetime().default(new Date().toISOString()),
  updatedAt: z.string().datetime().default(new Date().toISOString()),
})

export type Content = z.infer<typeof Content>
export type ContentWithId = WithId<Content>
export const Contents = db.collection<Content>('contents')
