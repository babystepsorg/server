import { Router } from 'express'
import * as ChecklistHandler from './checklists.handler'

const router = Router()

router.get(
    '/',
    ChecklistHandler.getChecklistsByWeek
)

export default router