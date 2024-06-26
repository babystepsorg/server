import { Router } from 'express'
import { validateAuthentication } from '../../middlewares'
import * as NotificationHandler from './notification.handler'

const router = Router()

router.get(
    "/",
    validateAuthentication,
    NotificationHandler.getAllNotifications
)

export default Router