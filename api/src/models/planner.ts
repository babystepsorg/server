import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'
import { db } from '../db'

export const Planner = z.object({
  title: z.string().optional(),
  priority: z.string().optional(),
  day: z.string().optional(),
  weeks: z.array(z.custom<ObjectId>()),
  roles: z.array(z.string())
})

export type Planner = z.infer<typeof Planner>
export type PlannerWithId = WithId<Planner>
export const Planners = db.collection<Planner>('planners')
