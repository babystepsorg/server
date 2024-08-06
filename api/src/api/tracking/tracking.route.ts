import { Router } from 'express'
import * as TrackingHandler from './tracking.handler'
import { validateAuthentication } from '../../middlewares'

const router = Router()

router.post(
    '/screen-time',
    validateAuthentication,
    TrackingHandler.storeTrackingData
)

export default router