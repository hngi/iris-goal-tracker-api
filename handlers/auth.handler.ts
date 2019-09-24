import { CustomError } from '../lib/custom-error';
import { responseMessages } from '../constants/response-messages'
import { responseCodes } from '../constants/response-codes'
import { Response, NextFunction, Request } from "express"
import jwt from 'jsonwebtoken'
import UserHandler from '../services/users/users.handler';

const secret: any = process.env.JWT_SECRET
class AuthHandler {
  constructor() { }

  checkToken(req: any, res: Response, next: NextFunction) {
    try {
      let token: any = req.headers['x-access-token'] || req.headers['authorization'] // Express headers are auto converted to lowercase
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length)
      }

      if (token) {
        jwt.verify(token, secret, (err: any, decoded: any) => {
          if (err) {
            next(new CustomError(responseCodes.ERROR_EXPIRED_TOKEN, responseMessages.ERROR_EXPIRED_TOKEN, 400))
          } else {
            req.decoded = decoded
            next()
          }
        })
      } else {
        next(new CustomError(responseCodes.ERROR_MISSING_TOKEN, responseMessages.ERROR_MISSING_TOKEN, 400))
      }
    } catch (error) {
      next(new CustomError(responseCodes.ERROR_MISSING_TOKEN, responseMessages.ERROR_MISSING_TOKEN, 400))
    }
  }

  createToken(user: any) {
    return new Promise((resolve, reject) => {
      jwt.sign({ user }, secret, { expiresIn: '24h' },
        (err: any, token: string) => {
          if (err) reject(err)

          return resolve(token)
        })
    })
  }

  compareToken(user: any, token: string) {
    return new Promise(resolve => resolve(token === user.confirmationToken))
  }

  applyCORS(_req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }

}

export default new AuthHandler()