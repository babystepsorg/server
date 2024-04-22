import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'
import { db } from '../db'

export const SelectedSpecialist = z.object({
  userId: z.custom<ObjectId>(),
  specialists: z.array(z.custom<ObjectId>()),
})

export type SelectedSpecialist = z.infer<typeof SelectedSpecialist>
export type SelectedSpecialistWithId = WithId<SelectedSpecialist>
export const SelectedSpecialists = db.collection<SelectedSpecialist>('selectedSpecialists')