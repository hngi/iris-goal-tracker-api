import mongoose from 'mongoose'
import { configureDB } from './../config/database'
import { logger } from '../lib/logger'
import express from 'express'
import http from 'http'

import { applyMiddleware, applyRoutes } from '../lib/utils'
import { ErrorHandler } from '../handlers'
import middleware from '../middleware'
import endpoints from '../services'

/* Declarations */
const app: express.Application = express()

/* Database Configuration */
configureDB(mongoose)

/* Express Configuration */
applyMiddleware(middleware, app)

/* API Endpoint Configuration */
applyRoutes(endpoints, app)

/* Error Handler Configuration */
app.use(ErrorHandler.missingRoute)
app.use(ErrorHandler.default)

/* Express Server Configuration */
const { PORT = 3000 } = process.env
const httpServer = new http.Server(app)

const server: any = httpServer.listen(PORT, () => {
  logger.log('info', `Iris GT server is listening on ${server.address()['address']}${server.address()['port']}`)
})