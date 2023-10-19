import express from 'express'

import MessageResponse from '../interfaces/MessageResponse'
import emojis from './emojis'
import auth from './auth/auth.route'
import todos from './todos/todo.route'
import users from './users/user.route'
import calander from './calander/calander.route'
import content from './content/content.route'
import symptom from './symptom/symptom.route'

const router = express.Router()

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  })
})

router.use('/emojis', emojis)
router.use('/auth', auth)
router.use('/todos', todos)
router.use('/users', users)
router.use('/calander', calander)
router.use('/content', content)
router.use('/symptoms', symptom)

export default router
