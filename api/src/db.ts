import { MongoClient } from 'mongodb'

require('dotenv').config()

// const {
//   MONGO_HOST,
//   MONGO_USERNAME,
//   MONGO_PASSWORD,
//   MONGO_PORT,
//   MONGO_DBNAME,
//   MONGO_LOCAL,
//   MONGO_URI,
// } = process.env

// let MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}?authSource=admin`;

// if (MONGO_LOCAL) {
//   MONGO_URI = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}`;
// }

let MONGO_URI = 'mongodb+srv://syed:syedmuzamil@cluster0.dk5c830.mongodb.net/babysteps'
if (process.env.MONGO_LOCAL) {
  MONGO_URI = process.env.MONGODB_URI!
}

export const client = new MongoClient(MONGO_URI!, {
  retryWrites: true,
  authSource: 'admin',
})
export const db = client.db()
