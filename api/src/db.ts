import { MongoClient } from 'mongodb'

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

const MONGO_URI = 'mongodb+srv://syed:syedmuzamil@cluster0.dk5c830.mongodb.net/babysteps'

export const client = new MongoClient(MONGO_URI!, {
  retryWrites: true,
  authSource: 'admin',
})
export const db = client.db()
