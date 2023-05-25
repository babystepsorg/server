import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fastifyMongo from '@fastify/mongodb'
import { config } from '../config'

const dbConnector = async (fastify: FastifyInstance, options: Object) => {
  fastify.register(fastifyMongo, {
    url: `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`,
  })
}

export default fastifyPlugin(dbConnector)
