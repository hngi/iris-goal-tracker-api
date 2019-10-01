import { connectStrings } from './url'
import { logger } from "../lib/logger"
import { Mongoose, ConnectionOptions } from 'mongoose'

export const configureDB = (mongoose: Mongoose) => {
  const dotenv = require('dotenv').config() //require env constiables to make file independent

  const ENV = process.env.NODE_ENV || 'development'
  const DB_URI = connectStrings[ENV].url
  const RETRY_DELAY = 5000
  const options: ConnectionOptions = { useNewUrlParser: true, reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000 }

  function connectMongoose() {
    mongoose.connect(DB_URI, options).catch(function (err: any) {
      logger.log('error', err.message)
      process.exit(1)
    })
  }

  connectMongoose()

  // connection events
  mongoose.connection.on('connected', function () {
    logger.log('info', `Mongoose connected.`)
  })

  mongoose.connection.on('error', async function (err: any) {
    logger.log('error', `Mongoose connection error: ${err}`)

    return setTimeout(connectMongoose, RETRY_DELAY)
  })

  mongoose.connection.on('disconnected', function () {
    logger.log('info', 'Mongoose disconnected.')
  })

  mongoose.connection.once('open', function (err: any, data: any) {
    logger.log('info', 'Mongo running!')
  })

  // for nodemon restarts
  process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
      process.kill(process.pid, 'SIGUSR2')
    })
  })

  // for app termination
  process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
      process.exit(0)
    })
  })

  // capture app termination / restart events
  // To be called when process is restarted or terminated
  function gracefulShutdown(msg: string, cb: any) {
    mongoose.connection.close(function () {
      logger.log('info', `Mongoose disconnected through ${msg}`)
      cb()
    })
  }
}