import { NextFunction, Request, Response } from 'express';
import { pricingPlans } from "./plans";
import Razorpay from "razorpay";
import { Subscriptions } from "razorpay/dist/types/subscriptions";
import { Specialists } from '../../models/specialist';
import { verifyWebhook } from './verifyRequest';
import { insertOrUpdatePayment } from './payment';
import { ObjectId } from 'mongodb';
import { Payments } from './payment.model';
import NotificationService from '../../services/notification';
import { Users } from '../../models/user';

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createSubscription(req: Request, res: Response, next: NextFunction) {
  try {
    const { plan_id, userId, subscriptionName } = req.body;

    const PLAN = pricingPlans.find((plan: any) => plan.planId === plan_id || plan.discountPlanId === plan_id);
    if (!PLAN) {
      res.status(400);
      throw new Error('No plan found');
    }

    const subscriptionOptions: Subscriptions.RazorpaySubscriptionCreateRequestBody = {
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
  } catch (err) {
    next(err);
  }
}

export async function applyDiscountCode(req: Request, res: Response, next: NextFunction) {
  try {
    const { discountCode, planId } = req.body;

    const PLAN = pricingPlans.find((plan) => plan.planId === planId);

    if (!PLAN) {
      res.status(400);
      throw new Error('Invalid plan');
    }

    if (discountCode === "ITHINKIMLATE") {
      res.status(200)
      res.send({ discount: true })
    }

    const doctor = await Specialists.findOne({ referralId: discountCode })
    if (!doctor) {
      res.status(400);
      throw new Error('Invalid discount code');
    }

    res.status(200);
    res.json({ discount: true }); // Return a discount of 10% if the discount code matches
  } catch (err) {
    next(err);
  }
}

export async function pauseSubscription(req: Request, res: Response, next: NextFunction) {
  try {
    const payment = await Payments.findOne({ user_id: new ObjectId(req.user!._id) })

    if (!payment) {
      res.status(400)
      throw new Error("Subscription not found")
    }

    const subscription = await instance.subscriptions.fetch(payment.subscription_id);

    if (!subscription) {
      res.status(400);
      throw new Error('Subscription not found');
    }

    const pausedSubscription = await instance.subscriptions.pause(payment.subscription_id);

    res.status(200);
    res.json(pausedSubscription);
  } catch (err) {
    next(err);
  }
}

export async function cancelSubscription(req: Request, res: Response, next: NextFunction) {
  try {
    const payment = await Payments.findOne({ user_id: new ObjectId(req.user!._id) })

    if (!payment) {
      res.status(400)
      throw new Error("Subscription not found")
    }

    const subscription = await instance.subscriptions.fetch(payment.subscription_id);

    if (!subscription) {
      res.status(400);
      throw new Error('Subscription not found');
    }

    const canceledSubscription = await instance.subscriptions.cancel(payment.subscription_id);

    res.status(200);
    res.json(canceledSubscription);
  } catch (err) {
    next(err);
  }
}

export async function razorpayWebhook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const razorpaySignature = req.headers['x-razorpay-signature']?.toString()

  if (!razorpaySignature) {
    res.status(400)
    throw new Error("Request is invalid")
  }

  const body = req.body

  const verified = verifyWebhook(JSON.stringify(body), razorpaySignature)

  if (!verified) {
    res.status(400)
    throw new Error("Request is invalid")
  }

  const { event, payload } = body
  const subscription: Subscriptions.RazorpaySubscription = payload.subscription.entity

  switch (event) {
    case "subscription.authenticated": {
      const user = await Users.findOne({ _id: new ObjectId(subscription.notes!.userId as string) })

      if (user) {
        const notificationService = new NotificationService()
        notificationService.sendTemplateEmail({
          email: user.email,
          loginLink: "",
          template: "subscription.purchase",
          params: {
            NAME: user.name
          },
          username: user.name,
        })
      }

      const payment = insertOrUpdatePayment(subscription)
      return res.status(200).send(payment)
    }
    case "subscription.activated": {
      // Handle subscription activation
      const payment = insertOrUpdatePayment(subscription)
      return res.status(200).send(payment)
    }
    case "subscription.charged": {
      // Handle subscription charge
      const payment = insertOrUpdatePayment(subscription)
      return res.status(200).send(payment)
    }
    case "subscription.completed": {
      // Handle subscription completion
      const payment = insertOrUpdatePayment(subscription)
      return res.status(200).send(payment)
    }
    case "subscription.updated": {
      // Handle subscription update
      const payment = insertOrUpdatePayment(subscription)
      return res.status(200).send(payment)
    }
    case "subscription.pending": {
      // Handle subscription pending
      const payment = insertOrUpdatePayment(subscription)
      return res.status(200).send(payment)
    }
    case "subscription.halted": {
      // Handle subscription halted
      const payment = insertOrUpdatePayment(subscription)
      return res.status(200).send(payment)
    }
    case "subscription.cancelled": {
      // Handle subscription cancellation
      const payment = insertOrUpdatePayment(subscription)
      return res.status(200).send(payment)
    }
    case "subscription.paused": {
      // Handle subscription pause
      const payment = insertOrUpdatePayment(subscription)
      return res.status(200).send(payment)
    }
    case "subscription.resumed": {
      // Handle subscription resume
      const payment = insertOrUpdatePayment(subscription)
      return res.status(200).send(payment)
    }
    default: {
      throw new Error("Nothing matches")
    }
  }
}
