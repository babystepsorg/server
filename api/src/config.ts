require('dotenv').config()

const config = {
  MONGODB_URI: process.env.MONGODB_URI!,
  CLIENT_URL: process.env.CLIENT_URL!,
  EMAIL_API_KEY: process.env.EMAIL_API_KEY!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  FRONTEND_URL: process.env.NODE_ENV === "production" ? 'https://www.babysteps.world' : process.env.FRONTEND_URL!,
  SERVER_URL: process.env.NODE_ENV === "production" ? 'https://api.babysteps.world' : process.env.SERVER_URL!
}
export default config
