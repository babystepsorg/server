import { Router } from 'express'
import * as ContentHandler from './content.handler'

const router = Router()

router.get(
    '/',
    ContentHandler.getChecklistsByWeek
)

export default router