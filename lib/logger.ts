import winston from 'winston'
import path from 'path'

const errorFilePath = path.join(__dirname, '..', 'logs', 'error.log')
const appFilePath = path.join(__dirname, '..', 'logs', 'app.log')

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'hobeei' },
  transports: [
    new winston.transports.File({ filename: errorFilePath, level: 'error' }),
    new winston.transports.File({ filename: appFilePath })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
