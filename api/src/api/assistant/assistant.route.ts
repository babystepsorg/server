import { Router } from 'express'
import * as assistantController from './assistant.controller'

const router = Router()

router.post(
    '/',
    assistantController.initialMessage
)

router.post(
    '/chat',
    assistantController.chat
)

export default router;