require('dotenv').config()

const config = {
  MONGODB_URI: process.env.MONGODB_URI,
  CLIENT_URL: process.env.CLIENT_URL,
}
export default config
