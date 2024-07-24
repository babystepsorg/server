"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayWebhook = exports.cancelSubscription = exports.pauseSubscription = exports.applyDiscountCode = exports.createSubscription = void 0;
const plans_1 = require("./plans");
const razorpay_1 = __importDefault(require("razorpay"));
const specialist_1 = require("../../models/specialist");
const verifyRequest_1 = require("./verifyRequest");
const payment_1 = require("./payment");
const mongodb_1 = require("mongodb");
const payment_model_1 = require("./payment.model");
const notification_1 = __importDefault(require("../../services/notification"));
const user_1 = require("../../models/user");
const instance = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
async function createSubscription(req, res, next) {
    try {
        const { plan_id, userId, subscriptionName } = req.body;
        const PLAN = plans_1.pricingPlans.find((plan) => plan.planId === plan_id || plan.discountPlanId === plan_id);
        if (!PLAN) {
            res.status(400);
            throw new Error('No plan found');
        }
        const subscriptionOptions = {
            plan_id,
            total_count: PLAN.total_count,
            quantity: 1,
            customer_notify: 1,
            start_at: Math.floor(Date.now() / 1000) + PLAN.free_trial,
            notes: {
                userId,
                subscriptionName,
            },
        };
        const subscription = await instance.subscriptions.create(subscriptionOptions);
        res.status(200);
        res.json(subscription);
    }
    catch (err) {
        next(err);
    }
}
exports.createSubscription = createSubscription;
async function applyDiscountCode(req, res, next) {
    try {
        const { discountCode, planId } = req.body;
        const PLAN = plans_1.pricingPlans.find((plan) => plan.planId === planId);
        if (!PLAN) {
            res.status(400);
            throw new Error('Invalid plan');
        }
        if (discountCode === "ITHINKIMLATE") {
            res.status(200);
            res.send({ discount: true });
        }
        const doctor = await specialist_1.Specialists.findOne({ referralId: discountCode });
        if (!doctor) {
            res.status(400);
            throw new Error('Invalid discount code');
        }
        res.status(200);
        res.json({ discount: true }); // Return a discount of 10% if the discount code matches
    }
    catch (err) {
        next(err);
    }
}
exports.applyDiscountCode = applyDiscountCode;
async function pauseSubscription(req, res, next) {
    try {
        const payment = await payment_model_1.Payments.findOne({ user_id: new mongodb_1.ObjectId(req.user._id) });
        if (!payment) {
            res.status(400);
            throw new Error("Subscription not found");
        }
        const subscription = await instance.subscriptions.fetch(payment.subscription_id);
        if (!subscription) {
            res.status(400);
            throw new Error('Subscription not found');
        }
        const pausedSubscription = await instance.subscriptions.pause(payment.subscription_id);
        res.status(200);
        res.json(pausedSubscription);
    }
    catch (err) {
        next(err);
    }
}
exports.pauseSubscription = pauseSubscription;
async function cancelSubscription(req, res, next) {
    try {
        const payment = await payment_model_1.Payments.findOne({ user_id: new mongodb_1.ObjectId(req.user._id) });
        if (!payment) {
            res.status(400);
            throw new Error("Subscription not found");
        }
        const subscription = await instance.subscriptions.fetch(payment.subscription_id);
        if (!subscription) {
            res.status(400);
            throw new Error('Subscription not found');
        }
        const canceledSubscription = await instance.subscriptions.cancel(payment.subscription_id);
        res.status(200);
        res.json(canceledSubscription);
    }
    catch (err) {
        next(err);
    }
}
exports.cancelSubscription = cancelSubscription;
async function razorpayWebhook(req, res, next) {
    const razorpaySignature = req.headers['x-razorpay-signature']?.toString();
    if (!razorpaySignature) {
        res.status(400);
        throw new Error("Request is invalid");
    }
    const body = req.body;
    const verified = (0, verifyRequest_1.verifyWebhook)(JSON.stringify(body), razorpaySignature);
    if (!verified) {
        res.status(400);
        throw new Error("Request is invalid");
    }
    const { event, payload } = body;
    const subscription = payload.subscription.entity;
    switch (event) {
        case "subscription.authenticated": {
            const user = await user_1.Users.findOne({ _id: new mongodb_1.ObjectId(subscription.notes.userId) });
            if (user) {
                const notificationService = new notification_1.default();
                notificationService.sendTemplateEmail({
                    email: user.email,
                    loginLink: "",
                    template: "subscription.purchase",
                    params: {
                        NAME: user.name
                    },
                    username: user.name,
                });
            }
            const payment = (0, payment_1.insertOrUpdatePayment)(subscription);
            return res.status(200).send(payment);
        }
        case "subscription.activated": {
            // Handle subscription activation
            const payment = (0, payment_1.insertOrUpdatePayment)(subscription);
            return res.status(200).send(payment);
        }
        case "subscription.charged": {
            // Handle subscription charge
            const payment = (0, payment_1.insertOrUpdatePayment)(subscription);
            return res.status(200).send(payment);
        }
        case "subscription.completed": {
            // Handle subscription completion
            const payment = (0, payment_1.insertOrUpdatePayment)(subscription);
            return res.status(200).send(payment);
        }
        case "subscription.updated": {
            // Handle subscription update
            const payment = (0, payment_1.insertOrUpdatePayment)(subscription);
            return res.status(200).send(payment);
        }
        case "subscription.pending": {
            // Handle subscription pending
            const payment = (0, payment_1.insertOrUpdatePayment)(subscription);
            return res.status(200).send(payment);
        }
        case "subscription.halted": {
            // Handle subscription halted
            const payment = (0, payment_1.insertOrUpdatePayment)(subscription);
            return res.status(200).send(payment);
        }
        case "subscription.cancelled": {
            // Handle subscription cancellation
            const payment = (0, payment_1.insertOrUpdatePayment)(subscription);
            return res.status(200).send(payment);
        }
        case "subscription.paused": {
            // Handle subscription pause
            const payment = (0, payment_1.insertOrUpdatePayment)(subscription);
            return res.status(200).send(payment);
        }
        case "subscription.resumed": {
            // Handle subscription resume
            const payment = (0, payment_1.insertOrUpdatePayment)(subscription);
            return res.status(200).send(payment);
        }
        default: {
            throw new Error("Nothing matches");
        }
    }
}
exports.razorpayWebhook = razorpayWebhook;
//# sourceMappingURL=payment.handler.js.map