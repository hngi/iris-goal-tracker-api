import { body, ValidationChain, validationResult } from "express-validator/check";
import { sanitizeBody, SanitizationChain } from "express-validator/filter";
import { constants } from "../constants/constants";
import { NextFunction, Request, Response } from "express";
import { responseCodes } from "../constants/response-codes";
import { responseMessages } from "../constants/response-messages";
import { sendError } from "../lib/utils";

class ValidationHandler {
  constructor() { }

  checkError = (req: Request, res: Response, next: NextFunction) => {
    // validate user input
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      sendError(res, responseCodes.ERROR_INVALID_PARAMS, responseMessages.ERROR_INVALID_PARAMS, 422, errors.array())
      return
    }

    next()
  }

  private emailValidation: ValidationChain = body('email', `supplied email is not a valid email address`).isEmail().normalizeEmail()

  private passwordValidation: ValidationChain = body('password', 'Password must be string').isString()

  createUser: SanitizationChain[] = [
    sanitizeBody(['name', 'email', 'password']),
    this.emailValidation,
    this.passwordValidation
  ]

  loginUser: SanitizationChain[] = [
    this.emailValidation,
    this.passwordValidation
  ]

  forgotPassword: SanitizationChain[] = [this.emailValidation]

  requestVerification: SanitizationChain[] = [this.emailValidation]

  confirmUser: SanitizationChain[] = [
    body('token', 'Confirmation token must be defined').isString()
  ]

  isEmail = (email: string) => constants.EMAIL_REGEX.test(email.toLowerCase())

  validateMongoID(param: string, isOptional?: boolean) {
    let validationChain = body(param, `${param} must be defined and be a valid MongoID`).isString().isMongoId()

    if (isOptional) {
      validationChain.optional()
    }

    return validationChain
  }
}


export default new ValidationHandler()