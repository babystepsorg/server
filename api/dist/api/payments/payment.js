"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertOrUpdatePayment = void 0;
const payment_model_1 = require("./payment.model");
const mongodb_1 = require("mongodb");
const insertOrUpdatePayment = async (subscription) => {
    const payment = await payment_model_1.Payments.findOne({ user_id: new mongodb_1.ObjectId(subscription.notes.userId) });
    if (!payment) {
        return await payment_model_1.Payments.insertOne({
            razorpay_plan_id: subscription.plan_id,
            razorpay_customer_id: subscription.customer_id,
            user_id: new mongodb_1.ObjectId(subscription.notes.userId),
            payment_status: subscription.status,
            payment_capture: true,
            discount_code: subscription.notes?.discountCode ?? null,
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
        });
    }
    else {
        return await payment_model_1.Payments.updateOne({
            user_id: new mongodb_1.ObjectId(subscription.notes.userId)
        }, { $set: {
                razorpay_plan_id: subscription.plan_id,
                razorpay_customer_id: subscription.customer_id,
                user_id: new mongodb_1.ObjectId(subscription.notes.userId),
                payment_status: subscription.status,
                payment_capture: true,
                discount_code: subscription.notes?.discountCode ?? null,
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
        });
    }
};
exports.insertOrUpdatePayment = insertOrUpdatePayment;
//# sourceMappingURL=payment.js.map