import { MongoClient } from 'mongodb'
import config from './config'

export const client = new MongoClient(config.MONGODB_URI)

export const db = client.db()
