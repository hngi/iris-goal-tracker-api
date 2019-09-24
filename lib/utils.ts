import { responseMessages } from '../constants/response-messages'
import { ServerResponse } from './server-response'
import { constants } from '../constants/constants'
import { Response, Request, Router, NextFunction } from "express"
import { responseCodes } from '../constants/response-codes'
import { logger } from './logger'
import uuid from 'uuid/v1'
import { SanitizationChain } from 'express-validator/filter';

/**
 * Sends a response with a success status
 * @param res
 * @param message
 * @param data
 * @param pagination
 */
export const sendSuccess = (res: Response, data?: any, isPaginated = false): void => {
  res.status(responseCodes.DEFAULT_SUCCESS_STATUS_CODE)
    .send(new ServerResponse(constants.SUCCESS, constants.EMPTY_STRING, constants.EMPTY_STRING, isPaginated && data[0] ? data[0].data : data, isPaginated && data[0] ? data[0].meta : null))

  return
}

/**
 * Sends a json response with an error status
 * @param res Response object
 * @param code Server custom error code
 * @param message Error message
 * @param statusCode HTTP status code
 * @param data Arbitary data
 */
export const sendError = (res: Response,
  code = responseCodes.DEFAULT_ERROR_CODE,
  message = responseMessages.GENERIC,
  statusCode = responseCodes.DEFAULT_ERROR_STATUS_CODE,
  data?: any) => {
  res.status(statusCode)
    .send(new ServerResponse(constants.ERROR, code, message, data))

  return
}

export const randomToken = () => uuid()

export const randomID = (length?: number) => Math.random().toString(36).substr(2, length || 6)

export const randomNumber = (length?: number) => Math.ceil(Math.random() * (999999 - 100000) + 100000);

export const rateLimitHandler = function (req: Request, res: Response, windowMs: number) {
  res.setHeader('Retry-After', Math.ceil(windowMs / 1000))
  logger.log('warn', 'Rate limit exceeded for ip: ' + req.ip)
  return sendError(res, responseCodes.ERROR_LIMIT_EXCEEDED, responseMessages.rateLimitExceeded(), 429)
}

type Wrapper = ((router: Router) => void)

export const applyMiddleware = (middlewareWrappers: Wrapper[], router: Router) => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router)
  }
}

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void

type RouteHandler = Handler | SanitizationChain[]

export type Route = {
  path: string
  method: HttpMethod
  handler: RouteHandler | RouteHandler[]
}

export enum HttpMethod {
  POST = 'post',
  GET = 'get',
  DELETE = 'delete',
  PUT = 'put'
}

export const applyRoutes = (routes: Route[], router: Router) => {
  for (const route of routes) {
    const { method, path, handler } = route;
    (router as any)[method](path, handler)
  }
}

export const isObjectEmpty = (obj: any) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false
  }
  return true
}