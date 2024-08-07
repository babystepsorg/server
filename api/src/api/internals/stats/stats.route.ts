import { Router } from 'express'
import * as StatsHandler from './stats.handler'

const router = Router()

router.get(
    '/screen-time',
    StatsHandler.getScreenTimeData
)

router.get(
    '/active-users',
    StatsHandler.getDailyActiveUsers
)

export default router;