"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payments = exports.Payment = void 0;
const z = __importStar(require("zod"));
const db_1 = require("../../db");
exports.Payment = z.object({
    razorpay_plan_id: z.string().min(1, 'Razorpay plan ID is required'),
    razorpay_customer_id: z.string().optional().nullable(),
    user_id: z.custom(),
    payment_status: z.string().min(1, 'Payment status is required'),
    payment_capture: z.boolean().optional(),
    discount_code: z.string().nullable(),
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
});
exports.Payments = db_1.db.collection('payments');
//# sourceMappingURL=payment.model.js.map