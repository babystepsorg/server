import { Subscriptions } from "razorpay/dist/types/subscriptions";
import { Payments } from "./payment.model";
import { ObjectId } from "mongodb";

export const insertOrUpdatePayment = async (subscription: Subscriptions.RazorpaySubscription) => {
    const payment = await Payments.findOne({ user_id: new ObjectId(subscription.notes!.userId as string) });

    if (!payment) {
        return await Payments.insertOne({
            razorpay_plan_id: subscription.plan_id,
            razorpay_customer_id: subscription.customer_id,
            user_id: new ObjectId(subscription.notes!.userId as string),
            payment_status: subscription.status,
            payment_capture: true,
            discount_code: (subscription.notes?.discountCode as string) ?? null,
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_start_at: subscription.start_at,
            subscription_end_at: subscription.end_at,
            subscription_charge_at: subscription.charge_at,
            subscription_created_at: subscription.created_at,
            subscription_total_count: subscription.total_count,
            subscription_paid_count: subscription.paid_count,
            subscription_remaining_count: subscription.remaining_count,
            subscription_quantity: subscription.quantity ?? null,
            has_scheduled_changes: subscription.has_scheduled_changes,
            change_scheduled_at: subscription.change_scheduled_at,
            notes: subscription.notes,
            
        })
    } else {
        return await Payments.updateOne({
            user_id: new ObjectId(subscription.notes!.userId as string)
        }, { $set: {
            razorpay_plan_id: subscription.plan_id,
            razorpay_customer_id: subscription.customer_id,
            user_id: new ObjectId(subscription.notes!.userId as string),
            payment_status: subscription.status,
            payment_capture: true,
            discount_code: (subscription.notes?.discountCode as string) ?? null,
            subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_start_at: subscription.start_at,
            subscription_end_at: subscription.end_at,
            subscription_charge_at: subscription.charge_at,
            subscription_created_at: subscription.created_at,
            subscription_total_count: subscription.total_count,
            subscription_paid_count: subscription.paid_count,
            subscription_remaining_count: subscription.remaining_count,
            subscription_quantity: subscription.quantity ?? null,
            has_scheduled_changes: subscription.has_scheduled_changes,
            change_scheduled_at: subscription.change_scheduled_at,
            notes: subscription.notes,   
        }
        })
    }
}