import { Socket } from 'socket.io'
import axios from 'axios'
import { logger } from '../utils/logging'

type User = {
  id: string
}

class AuthMiddleware {
  public static async handle(socket: Socket, next?: (user: User) => void) {
    const token = socket.handshake.auth.token

    if (!token) {
      socket.disconnect()
      logger.debug('Unauthorized connection due to missing token')
    }

    try {
      const user = await AuthMiddleware.check(token)

      if (!user) {
        socket.disconnect()
        logger.debug('Unauthorized connection due to invalid token')
      }

      logger.debug('Authorized connection')
      
      if (next) {
        next(user!)
      }
    } catch (err) {
      socket.disconnect()
      return
    }
  }

  private static async check(token: string) {
    try {
      const res = await axios.get('http://localhost:8000/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return res.data.data as User
    } catch (err) {
      return null
    }
  }
}

export { AuthMiddleware }
