import { Router } from 'express'

import usersRouter from './users/user.route'
import symptomsRouter from './symptoms/symptoms.route'
import checklistsRouter from './checklists/checklists.router'

const router = Router()

router.use('/users', usersRouter)
router.use('/symptoms', symptomsRouter)
router.use('/checklists', checklistsRouter)

export default router