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

  updateAdmin: SanitizationChain[] = [
    sanitizeBody(['body', 'admin']),
    body('admin', 'Admin must be string').isString(),
    body('body', 'body must be defined and must contain the fields to be updated')
  ]

  createProduct: SanitizationChain[] = [
    sanitizeBody(['title', 'images', 'description', 'isFeatured', 'category', 'subCategory', 'condition', 'expiryDuration', 'author', 'createdBy']),
    body('title', 'must be string').isString(),
    body('images', 'must be an array of strings').isArray(),
    body('description', 'must be string').isString(),
    body('isFeatured', 'must be boolean').isBoolean().optional(),
    body('collectionType', 'must be string').isString().optional(),
    body('label', 'must be string').isString().optional(),
    body('condition', 'must be string').isString(),
    body('expiryDuration', 'must be an object having properties days, minutes, hours').exists(),
    this.validateMongoID('createdBy', true),
    this.validateMongoID('category'),
    this.validateMongoID('author', true),
    this.validateMongoID('admin', true),
    this.validateMongoID('subCategory')
  ]

  createMultipleProducts: SanitizationChain[] = [
    sanitizeBody('products'),
    body('products', 'must be defined and be an array').isArray()
  ]

  inviteAdmin: SanitizationChain[] = [
    sanitizeBody(['email', 'roles']),
    this.emailValidation,
    body('roles', 'roles has to be an array of MongoIDs').isArray()
  ]

  inviteUser: SanitizationChain[] = [
    sanitizeBody(['email', 'fullName']),
    this.emailValidation,
    body('fullName', 'full name must be defined and must be a string').isString()
  ]

  addToWatchlist: SanitizationChain[] = [
    sanitizeBody(['product', 'user']),
    this.validateMongoID('product'),
    this.validateMongoID('user')
  ]

  verifyAdmin: SanitizationChain[] = [
    sanitizeBody(['fullName', 'password', 'token']),
    this.passwordValidation,
    body('token', 'token has to be defined and a string').isString()
  ]

  createUser: SanitizationChain[] = [
    sanitizeBody(['fullName', 'lastName', 'userName', 'email', 'image', 'password']),
    this.emailValidation,
    body('image', '%0 isn\'t a valid image location').optional().isString(),
    this.passwordValidation
  ]

  loginUser: SanitizationChain[] = [
    body('email', 'Email/Username must be defined and must be a string').isString(),
    this.passwordValidation
  ]

  forgotPassword: SanitizationChain[] = [this.emailValidation]

  requestVerification: SanitizationChain[] = [this.emailValidation]

  confirmUser: SanitizationChain[] = [
    body('token', 'Confirmation token must be defined').isString()
  ]

  createPackage: SanitizationChain[] = [
    sanitizeBody(['title', 'amount', 'price', 'icon', 'author']),
    body('amount', '%0 must be defined and must be a number').isNumeric(),
    body('price', '%0 must be defined and must be a number').isNumeric(),
    body('icon', '%0 must be defined and must be a string').isString(),
    body('title', '%0 must be defined and must be a string').isString(),
    this.validateMongoID('author')
  ]

  createComment: SanitizationChain[] = [
    sanitizeBody(['body', 'product', 'author']),
    body('body', '%0 must be defined and must be a string').isString(),
    this.validateMongoID('product'),
    this.validateMongoID('author')
  ]

  createEmail: SanitizationChain[] = [
    sanitizeBody(['email', 'fullName']),
    body('fullName', 'must be a string').isString().optional(),
    body('email', 'must be a string and a valid email').isEmail(),
  ]

  createReview: SanitizationChain[] = [
    sanitizeBody(['message', 'product', 'author', 'star']),
    body('message', 'must be a string').isString().optional(),
    body('star', 'must be a number').isInt(),
    this.validateMongoID('product'),
    this.validateMongoID('author')
  ]

  placeBid: SanitizationChain[] = [
    sanitizeBody(['value', 'product', 'author']),
    body('value', '%0 must be defined and must be a number').isNumeric(),
    body('product', '%0 must be defined and must be a string').isUUID(),
    this.validateMongoID('author')
  ]

  updateCategory: SanitizationChain[] = [
    sanitizeBody(['category', 'subCategory', 'body']),
    this.validateMongoID('category', true),
    this.validateMongoID('subCategory', true)
  ]

  createTransaction: SanitizationChain[] = [
    sanitizeBody(['user', 'packageId', 'amount', 'paymentRef', 'transactionRef']),
    body('amount', 'must be defined and must be an object').exists(),
    body('transactionRef', 'must be defined and must be a string').isString(),
    body('paymentRef', 'must be defined and must be a string').isString(),
    this.validateMongoID('user'),
    this.validateMongoID('packageId')
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