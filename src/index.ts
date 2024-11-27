import fastifyCors from '@fastify/cors'
import fastify, { FastifyInstance } from 'fastify'
import http, { Server } from 'http'
import { Server as SocketServer } from 'socket.io'
import config from './config'
import { AuthMiddleware } from './middleware/auth'
import { logger } from './utils/logging'
import chalk from 'chalk'

const connectedUsers: Map<string, string> = new Map()

class App {
  private readonly app: FastifyInstance<http.Server>
  private readonly http: Server
  private readonly io: SocketServer

  constructor() {
    this.app = fastify({ logger: true })
    this.app.register(fastifyCors, { origin: '*' })
    this.http = http.createServer(this.app.server)

    this.io = new SocketServer(this.http, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    })
  }

  async listen() {
    const host = config.host
    const port = config.port

    this.io.on('connection', async (socket) => {
      AuthMiddleware.handle(socket, (user) => {
        logger.info(`User ${user.id} connected`)
        connectedUsers.set(socket.id, user.id)
      })

      socket.on('disconnect', () => {
        if (!connectedUsers.has(socket.id)) return
        logger.info(`User ${connectedUsers.get(socket.id)} disconnected`)
        connectedUsers.delete(socket.id)
      })
    })

    this.http.listen({ host, port }, () => {
      console.clear()

      console.log(
        `\n${chalk.magenta.bold('Agilis')} ${chalk.white.bold('Chat')} 🚀`,
      )
      console.log(
        `Server started at ${chalk.blue.bold(`http://${host}:${port}`)}\n`,
      )
    })
  }
}

new App().listen()
