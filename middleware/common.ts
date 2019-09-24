import bodyParser from "body-parser"
import { Router } from "express"
import { constants } from "../constants/constants"
import cors from "cors"
import compression from "compression"
import helmet from "helmet"
import { rateLimitHandler } from "../lib/utils"
import RateLimit from 'express-rate-limit'
import { CustomError } from "../lib/custom-error";
import { responseCodes } from "../constants/response-codes";

export const handleRequestParsing = (router: Router) => {
  router.use(bodyParser.urlencoded({ limit: constants.BODY_PARSER_LIMIT, extended: true }))
  router.use(bodyParser.text({ limit: constants.BODY_PARSER_LIMIT }))
  router.use(bodyParser.json({ limit: constants.BODY_PARSER_LIMIT }))
}

export const handleCors = (router: Router) => {
  const whitelist = 'http://localhost:4200 https://hobeei.herokuapp.com http://hobeei.herokuapp.com http://localhost:3000 https://www.hobeei.com http://www.hobeei.com http://hobeei.com'
  router.use(cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin))
        return callback(null, true)

      return callback(new CustomError(responseCodes.ERROR_TECHNICAL, `HoBeei Server CORS Error: Not allowed by CORS from origin ${origin}`, 429));
    }
  }))
}

export const handleHelmet = (router: Router) => {
  router.use(helmet())
}

export const handleRateLimiter = (router: Router) => {
  const limiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 0, // limit each IP to 100 requests per windowMs
    handler: function (req, res) { return rateLimitHandler(req, res, 15 * 60 * 1000) }
  })
  router.use(limiter)
}

/**
 * @todo npm i compression
 * @param router 
 */
export const handleCompression = (router: Router) => {
  router.use(compression())
}