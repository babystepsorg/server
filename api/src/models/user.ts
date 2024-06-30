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
  dob: z.string().datetime().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  partnerId: z.custom<ObjectId>().optional(),
  referralId: z.string().optional(),
  subscriptionCode: z.string().optional(),
  referredBy: z.string().optional(),
  consiveDate: z.string().datetime().optional(),
  googleId: z.string().optional(),
  googleAccessToken: z.string().optional(),
  googleRefreshToken: z.string().optional(),
  avatarUrl: z.string().optional(),
  subscriptionStatus: z.enum(['active', 'inactive', 'cancelled', 'trail']).optional(),
  subscriptionStartDate: z.string().datetime().optional(),
  subscriptionEndDate: z.string().datetime().optional(),
  // subscriptionPlan: z.string().optional(),
  // razorpayCustomerId: z.string().optional(),
  razorpaySubscriptionId: z.string().optional(),
  razorpayPlanId: z.string().optional(),
  // verification
  verified: z.boolean().default(false),
  createdAt: z.string().datetime().default(new Date().toISOString()),
  updatedAt: z.string().datetime().default(new Date().toISOString()),
})

export type User = z.infer<typeof User>
export type UserWithId = WithId<User>
export const Users = db.collection<User>('users')
