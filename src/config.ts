import dotenv from 'dotenv'
dotenv.config()

const config = {
  host: process.env.WS_SERVER_HOST,
  port: process.env.WS_SERVER_PORT,
  debug: process.env.DEBUG === 'true',
}

export default config
