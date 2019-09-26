import { MongoHandler, EmailHandler, ValidationHandler } from '../../handlers'
import { User } from '../../models/user'
import { CustomError } from '../../lib/custom-error'
import { responseCodes } from '../../constants/response-codes'
import { responseMessages } from '../../constants/response-messages'
import { constants } from '../../constants/constants'
import { NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { logger } from '../../lib/logger'
import { randomNumber } from '../../lib/utils'
import { Document } from 'mongoose'

const { JWT_SECRET }: any = process.env

class UserHandler {

  private SALT_WORK_FACTOR: number
  constructor() {
    this.SALT_WORK_FACTOR = 10
  }

  async getSingleUser(id: string, refresh?: string): Promise<Document> {
    try {
      const user = await User.findById(id)
      return this.sendUserData(user, false)
    } catch (e) {
      throw new CustomError(responseCodes.ERROR_NOT_FOUND, responseMessages.resourceNotFound('user'), responseCodes.DEFAULT_ERROR_STATUS_CODE, e)
    }
  }

  async createUser(name: string, email: string, password: string): Promise<Document> {
    try {
      //Check if a user with that email already exists
      const existingUser = await this.getUserByEmail(email, false)

      if (existingUser) {
        throw new CustomError(responseCodes.ERROR_USER_EXISTS, responseMessages.resourceAlreadyExists('user'), 400)
      }

      const user: any = new User({ name, password, email })
      user.token = randomNumber()
      user.requestedVerification = true

      const saved: any = await user.save()
      await this.sendUserVerificationEmail(user)

      return this.sendUserData(saved)
    } catch (err) {
      throw new CustomError(responseCodes.ERROR_USER_NOT_CREATED, responseMessages.ERROR_USER_NOT_CREATED, 500, err)
    }

  }

  sendUserData(user: any, skipToken = true) {
    try {
      if (!skipToken) {
        user.token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
        delete user['password']
      }
      return user
    } catch (error) {
      throw error
    }
  }

  async loginUser(email: string, password: string): Promise<Document> {

    const user: any = await this.getUserByEmail(email).catch(e => { throw e })

    if (!user) {
      throw new CustomError(responseCodes.ERROR_USER_NOT_FOUND, responseMessages.resourceNotFound('user'), 422, user)
    }

    const isMatch = await this.comparePassword(user, password).catch(e => { throw e })

    if (!isMatch) {
      throw new CustomError(responseCodes.ERROR_FAILED_AUTH, responseMessages.ERROR_FAILED_AUTH, 400)
    }

    try {
      const plainUserObj = user.toObject()
      user.token = jwt.sign(plainUserObj, JWT_SECRET, { expiresIn: '7d' })
      delete user['password']
      return user
    } catch (e) {
      logger.log('error', 'Could not generate token: ', e)
      throw new CustomError(responseCodes.DEFAULT_ERROR_CODE, responseMessages.resourceNotCreated('token'), responseCodes.DEFAULT_ERROR_STATUS_CODE)
    }
  }

  async forgotPassword(email: string) {
    const user: any = await this.getUserByEmail(email).catch(e => { throw e })

    if (!user) {
      throw new CustomError(responseCodes.ERROR_NOT_FOUND, responseMessages.ERROR_NOT_FOUND, 400)
    }

    try {
      user.token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' })
      // user.token = randomNumber()
      await MongoHandler.save(user)
      const data = { name: user.name, token: user.token }
      await EmailHandler.sendEmail(email, constants.FORGOT_PASSWORD_SUBJECT, data, constants.FORGOT_PASSWORD_TEMPLATE)
      return user
    } catch (e) {
      throw e
    }
  }

  async verifyUserByToken(token: number): Promise<Document> {

    const user: any = await this.getUserByToken(token).catch(e => { throw e })

    if (!user) {
      throw new CustomError(responseCodes.ERROR_USER_NOT_FOUND, responseMessages.resourceNotFound('user'), 400)
    }

    if (user.isEmailVerified) {
      throw new CustomError(responseCodes.ERROR_ALREADY_VERIFIED, responseMessages.ERROR_ALREADY_VERIFIED, 400)
    }

    const tokenMatched = this.compareToken(user, token)

    if (!tokenMatched) {
      throw new CustomError(responseCodes.ERROR_INVALID_TOKEN, responseMessages.ERROR_INVALID_TOKEN, 422)
    }

    user.status = constants.ENABLED
    user.isEmailVerified = true
    const plainUserObj = user.toObject()
    user.token = jwt.sign(plainUserObj, JWT_SECRET, { expiresIn: '7d' }) /* Generate new token for auth */
    // user.token = null /* Reset Token */

    const newUser: any = await MongoHandler.save(user)
      .catch(e => {
        throw new CustomError(responseCodes.ERROR_TECHNICAL, responseMessages.errorSaving('user'), responseCodes.DEFAULT_ERROR_STATUS_CODE, e)
      })

    delete newUser['password']
    return newUser
  }

  async requestEmailVerification(email: string, resend = false) {
    const user: any = await this.getUserByEmail(email).catch(e => { throw e })

    if (user.isEmailVerified) {
      throw new CustomError(responseCodes.ERROR_ALREADY_VERIFIED, responseMessages.ERROR_ALREADY_VERIFIED, 400)
    }

    if (resend || !user.requestedVerification) {
      const savedUser = await this.generateAndSendEmailToken(user, email).catch(e => {
        throw new CustomError(responseCodes.ERROR_USER_NOT_CREATED, responseMessages.ERROR_USER_NOT_CREATED, 500, e)
      })
      return savedUser
    } else {
      throw new CustomError(responseCodes.ERROR_DUPLICATE_VERIFY, responseMessages.ERROR_DUPLICATE_VERIFY, 422)
    }
  }

  async updateUserById(id: string, payload: any): Promise<Document> {
    let skipUpdate = new Set(['createdAt', 'updatedAt', 'token', 'password'])

    let user: any = await MongoHandler.findOne(User, id).catch(_e => {
      throw new CustomError(responseCodes.ERROR_USER_NOT_FOUND, responseMessages.resourceNotFound('user'), 422)
    })

    if (payload.email && (payload.email !== user.email)) {
      const existingUser = await this.getUserByEmail(payload.email).catch(e => { throw e })

      if (existingUser) {
        throw new CustomError(responseCodes.ERROR_USER_EXISTS, responseMessages.resourceAlreadyExists('user with that email'), 400)
      }
    }

    const updatedUser: any = await MongoHandler.update(user, payload, Array.from(skipUpdate))
      .catch(async e => {
        throw new CustomError(responseCodes.ERROR_FAILED_UPDATE, responseMessages.ERROR_FAILED_UPDATE, 500, e)
      })

    const plainUserObj = updatedUser.toObject()
    updatedUser.token = jwt.sign(plainUserObj, JWT_SECRET, { expiresIn: '7d' })
    return updatedUser
  }

  async resetPassword(userName: string, token: string, oldPassword: string, newPassword: string): Promise<Document> {

    // Reset Password
    const user: any = await this.getUserByToken(token).catch(e => { throw e })

    if (userName) {
      const isMatch = await this.comparePassword(user, oldPassword).catch(e => { throw e })

      if (!isMatch) {
        throw new CustomError(responseCodes.ERROR_FAILED_AUTH, responseMessages.ERROR_FAILED_AUTH, 400)
      }
    }

    user.password = newPassword

    const newUser: any = await MongoHandler.save(user).catch(e => {
      throw new CustomError(responseCodes.ERROR_TECHNICAL, responseMessages.errorSaving('user'), responseCodes.DEFAULT_ERROR_STATUS_CODE, e)
    })

    delete newUser.password
    return newUser
  }

  async checkUserAvailability(email: string): Promise<Boolean> {
    const user = await this.getUserByEmail(email).catch(e => { throw e })
    return Boolean(user)
  }

  /**
   * @param email - User's email address
   */
  getUserByEmail(email: string, lean?: boolean): Promise<Document> {
    return new Promise((resolve, reject) => {
      User.findOne({ email })
        .lean(lean || false)
        .exec((err, user: any) => {
          if (err) reject(err)
          resolve(user)
        })
    })
  }

  /**
   * @param token - User's email address
   */
  getUserByToken(token: number | string, lean?: boolean) {
    return new Promise((resolve, reject) => {
      User.findOne({ token })
        .lean(lean || false)
        .exec((err, user: any) => {
          if (err) reject(err)
          resolve(user)
        })
    })
  }

  /**
   * Generates campaign email with auth token and sends to user
   * @param user 
   * @param email 
   * @param isAdmin 
   * @param inviteUser 
   */
  generateAndSendEmailToken(user: any, email: string, isAdmin?: boolean, inviteUser?: boolean): Promise<Document> {
    return new Promise((resolve, reject) => {
      try {
        let emailData: any = {}
        let template: string
        let subject: string

        emailData.name = user.name
        emailData.email = user.email
        emailData.password = user.password
        template = constants.CREATE_ACCOUNT_TEMPLATE
        subject = constants.CREATE_ACCOUNT_SUBJECT

        // user.token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '24h' })
        user.token = randomNumber()
        emailData.token = user.token
        user.requestedVerification = true

        MongoHandler.save(user)
          .then(async (savedUser: any) => {
            delete savedUser['password']
            await EmailHandler.sendEmail(email, subject, emailData, template).catch(e => reject(e))
            resolve(savedUser)
          })
          .catch(err => reject(err))
      } catch (error) {
        reject(error)
      }
    })
  }

  async sendUserVerificationEmail(user: any) {
    let emailData = {
      name: user.name,
      email: user.email,
      password: user.password,
      token: user.token
    }
    await EmailHandler.sendEmail(user.email, constants.CREATE_ACCOUNT_SUBJECT, emailData, constants.CREATE_ACCOUNT_TEMPLATE).catch(e => { throw e })
  }

  /**
   * Hash password sent in body params
   */
  async hashPassword(user: any, next: NextFunction) {
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next()

    // generate a salt
    const salt: any = await bcrypt.genSalt(this.SALT_WORK_FACTOR).catch(e => { throw e })

    // hash the password along with our new salt
    const hash = await bcrypt.hash(user.password, salt).catch(e => { throw e })

    // override the cleartext password with the hashed one
    user.password = hash

    next()
  }

  /**
   * Compare hashed password with pass sent in body params
   */
  async comparePassword(user: any, passToTest: string) {
    return await bcrypt.compare(passToTest, user.password)
      .catch(e => { throw new CustomError(e) })
  }

  /**
   * Compare token
   */
  compareToken(user: any, tokenToTest: string | number) {
    return (user.token === tokenToTest)
  }

  /**
   * Decode Token
   */
  decodeToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) reject(err)
        resolve(decoded)
      })
    })
  }

}

export default new UserHandler()