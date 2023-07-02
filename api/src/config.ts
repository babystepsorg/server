require('dotenv').config()

const config = {
  MONGODB_URI: process.env.MONGODB_URI!,
  CLIENT_URL: process.env.CLIENT_URL!,
  EMAIL_API_KEY: process.env.EMAIL_API_KEY!,
}
export default config
