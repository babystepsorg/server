import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'
import { db } from '../db'

export const Symptom = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.any(),
  weeks: z.array(z.custom<ObjectId>()),
  red_flag_weeks: z.array(z.custom<ObjectId>()),
  tags: z.array(z.custom<ObjectId>()),
  createdAt: z.string().datetime().default(new Date().toISOString()).optional(),
})

export type Symptom = z.infer<typeof Symptom>
export type SymptomWithId = WithId<Symptom>
export const Symptoms = db.collection<Symptom>('symptoms')
