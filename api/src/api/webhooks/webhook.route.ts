import { Router } from 'express'
import * as WebhookHandler from './webhook.handler'

const router = Router()

router.post('/razorpay', WebhookHandler.razorpayWebhook)

export default router