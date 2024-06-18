import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'
import { db } from '../db'

export const Specialist = z.object({
  name: z.string(),
  profession: z.string(),
  description: z.any(),
  location: z.string(),
  referralId: z.string(),
})

export type Specialist = z.infer<typeof Specialist>
export type SpecialistWithId = WithId<Specialist>
export const Specialists = db.collection<Specialist>('doctors')