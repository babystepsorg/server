import Fastify from 'fastify'
import db from './plugins/db'

import { config } from './config'

// Configure App
const server = Fastify({
  logger: true,
})

// Register Plugins
server.register(db)

server.get('/', async (request, reply) => {
  return { hello: 'world' }
})

const start = async (): Promise<void> => {
  try {
    await server.listen(config.app.port)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()

export default server
