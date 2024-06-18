import { Router } from 'express';
import * as PaymentHandler from './payment.handler';
import { validateAuthentication } from '../../middlewares';

const router = Router();

router.post(
  '/subscriptions',
  validateAuthentication,
  PaymentHandler.createSubscription
);

router.post(
  '/discount',
  validateAuthentication,
  PaymentHandler.applyDiscountCode
);

router.post(
  '/razorpay-webhook',
  PaymentHandler.razorpayWebhook
);

export default router;
