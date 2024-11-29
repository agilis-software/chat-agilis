import dotenv from 'dotenv'
dotenv.config()

const config = {
  host: process.env.WS_SERVER_HOST,
  port: process.env.WS_SERVER_PORT,
  debug: process.env.DEBUG === 'true',
  secret: process.env.CHAT_SERVER_SECRET,
}

export default config
