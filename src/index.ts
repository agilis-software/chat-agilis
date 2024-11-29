import cors from 'cors'
import express, { Application, Router } from 'express'
import { Socket, Server as SocketServer } from 'socket.io'
import { Server, createServer } from 'http'
import config from './config'
import { AuthMiddleware } from './middleware/auth'
import { logger } from './utils/logging'
import chalk from 'chalk'
import router from './router'

export const connectedUsers = new Map<string, Socket>()

class App {
  private readonly app: Application
  private readonly http: Server
  private readonly io: SocketServer

  constructor() {
    this.app = express()
    this.app.use(cors())
    this.http = createServer(this.app)
    this.app.use(express.json())
    this.app.use(router)

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
        connectedUsers.set(user.id, socket)

        socket.on('disconnect', () => {
          if (!connectedUsers.has(user.id)) return
          logger.info(`User ${user.id} disconnected`)
          connectedUsers.delete(user.id)
        })
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
