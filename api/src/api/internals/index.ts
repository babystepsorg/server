import { Router } from 'express'

import usersRouter from './users/user.route'
import symptomsRouter from './symptoms/symptoms.route'

const router = Router()

router.use('/users', usersRouter)
router.use('/symptoms', symptomsRouter)

export default router