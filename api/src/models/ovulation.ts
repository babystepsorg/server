import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'
import { db } from '../db'

export const Ovulation = z.object({
  ovultaionDate: z.string().datetime(),
  fertileWindowStart: z.string().datetime(),
  fertileWindowEnd: z.string().datetime(),
  userId: z.custom<ObjectId>(),
  week: z.string(),
  createdAt: z.string().datetime().default(new Date().toISOString()).optional(),
})

export type Ovulation = z.infer<typeof Ovulation>
export type OvulationWithId = WithId<Ovulation>
export const Ovulations = db.collection<Ovulation>('ovulations')
