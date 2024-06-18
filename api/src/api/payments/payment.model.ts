import { ObjectId, WithId } from 'mongodb'
import * as z from 'zod'

import { db } from '../../db'

export const Payment = z.object({
  razorpay_plan_id: z.string().min(1, 'Razorpay plan ID is required'),
  razorpay_customer_id: z.string().optional().nullable(),
  user_id: z.custom<ObjectId>(),
  payment_status: z.string().min(1, 'Payment status is required'),
  payment_capture: z.boolean().optional(),
  discount_code: z.string().nullable(), // added discount code field

  // Subscription-specific fields
  subscription_id: z.string().min(1, 'Subscription ID is required'),
  subscription_status: z.string().min(1, 'Subscription status is required'),
  subscription_start_at: z.number(),
  subscription_end_at: z.number(),
  subscription_charge_at: z.number(),
  subscription_created_at: z.number(),
  subscription_total_count: z.number().int().nonnegative(),
  subscription_paid_count: z.number().int().nonnegative(),
  subscription_remaining_count: z.string(),
  subscription_quantity: z.number().nullable(),
  has_scheduled_changes: z.any(),
  change_scheduled_at: z.any(),
  notes: z.any(),
})

export type Payment = z.infer<typeof Payment>
export type PaymentWithId = WithId<Payment>
export const Payments = db.collection<Payment>('payments')

