import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'

import { db } from '../db'

export const User = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email().nonempty('Email is required'),
  password: z.string().nullable(),
  role: z.enum(['caregiver', 'nurturer']),
  stage: z.enum(['pre-conception', 'pregnancy', 'postpartum']),
  salt: z.string().nullable(),
  partnerId: z.custom<ObjectId>().optional(),
  createdAt: z.string().datetime().default(new Date().toISOString()),
  updatedAt: z.string().datetime().default(new Date().toISOString()),
})

export type User = z.infer<typeof User>
export type UserWithId = WithId<User>
export const Users = db.collection<User>('users')
