import dotenv from 'dotenv'
dotenv.config()

const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  debug: !process.env.DEBUG || process.env.DEBUG === 'true',
  secret: process.env.CHAT_SERVER_SECRET || 'CHAT_SERVER_SECRET',
}

export default config
