import { Router } from 'express'
import { Message } from './models/message'
import { connectedUsers } from '.'
import { logger } from './utils/logging'
import config from './config'

const router = Router()

router.post('/chat/messages', (req, res) => {
  if (!req.headers.authorization) {
    logger.debug('Unauthorized due to missing authorization header')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!req.headers.authorization.startsWith('Api ')) {
    logger.debug('Unauthorized due to invalid authorization header')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const secret = req.headers.authorization.split(' ')[1]

  if (secret !== config.secret) {
    logger.debug('Unauthorized due to invalid secret')
    logger.debug(`Expected: ${config.secret}, Received: ${secret}`)
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const message = req.body.data as Message

  if (!message) {
    return res.status(400).json({ error: 'Invalid message' })
  }

  const userTo = connectedUsers.get(message.sender.id)
  const userFrom = connectedUsers.get(message.receiver.id)

  if (userTo) {
    userTo.emit('message', message)
  }

  if (userFrom) {
    userFrom.emit('message', message)
  }

  logger.info(
    `Message sent from ${message.sender.id} to ${message.receiver.id}`,
  )
  return res.status(200).json({ message })
})

export default router
