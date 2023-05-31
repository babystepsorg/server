import express from 'express'

import MessageResponse from '../interfaces/MessageResponse'
import emojis from './emojis'
import auth from './auth/auth.route'
import todos from './todos/todo.route'

const router = express.Router()

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  })
})

router.use('/emojis', emojis)
router.use('/auth', auth)
router.use('/todos', todos)

export default router
