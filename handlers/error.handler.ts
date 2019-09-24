import { responseMessages } from '../constants/response-messages'
import { responseCodes } from '../constants/response-codes'
import { logger } from '../lib/logger'
import { CustomError } from '../lib/custom-error'
import { Request, Response, NextFunction } from "express"
import { sendError } from '../lib/utils';

class ErrorHandler {

  default(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof CustomError) {
      return sendError(res, err.code, err.message, err.status, err.data)
    } else {
      logger.log('error', 'uncaught exception', err) // For debugging reasons
      return sendError(res)
    }
  }

  missingRoute(req: Request, res: Response, next: NextFunction) {
    if (!req.route) {
      next(new CustomError(responseCodes.ERROR_NOT_FOUND, responseMessages.ERROR_NOT_FOUND, 404))
      logger.log('error', `route: ${req.path} does not exist`)
    } else {
      next()
    }
  }

}

export default new ErrorHandler()