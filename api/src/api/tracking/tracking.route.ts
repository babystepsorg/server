import { Router } from 'express'
import * as TrackingHandler from './tracking.handler'

const router = Router()

router.post(
    '/screen-time',
    TrackingHandler.storeTrackingData
)

export default router