import { Router } from 'express'

import usersRouter from './users/user.route'

const router = Router()

router.use('/users', usersRouter)

export default router