import { Response, Request, NextFunction } from "express"
import { sendSuccess } from '../../lib/utils'
import UserHandler from './users.handler'

class UserController {

  /**
   * Retrieves a single registered user
   * @param req 
   * @param res 
   * @param next 
   */
  async getSingleUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { refresh } = req.query

    const user = await UserHandler.getSingleUser(id, refresh).catch(e => next(e))
    if (user) {
      sendSuccess(res, user)
      return
    }
  }

  /**
   * Registers a new user
   * @param req - Request Object
   * @param res - Response Object
   * @param next - Next Function
   * @returns User
   */
  async createUser(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body

    const user = await UserHandler.createUser(name, email, password).catch(e => next(e))

    if (user) {
      sendSuccess(res, user)
      return
    }
  }

  /**
   * Logs in a registered user
   * @param req
   * @param res
   * @param next
   * @returns User
   */
  async loginUser(req: Request, res: Response, next: NextFunction) {

    const { email, password } = req.body

    const user = await UserHandler.loginUser(email, password).catch(e => next(e))

    if (user) {
      sendSuccess(res, user)
      return
    }
  }

  /**
   * Retrieves a user password by verifying user's email and generating a reset token
   * @param req
   * @param res
   * @param next
   * @returns User
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body

    const user = await UserHandler.forgotPassword(email).catch(e => next(e))

    sendSuccess(res, user)
    return
  }

  /**
   * Confirms a new user's registration via email confirmation token
   * @param req
   * @param res
   * @param next
   * @body `token`
   * @returns User
   */
  async confirmUser(req: Request, res: Response, next: NextFunction) {
    const { token } = req.body

    const user = await UserHandler.verifyUserByToken(token).catch(e => next(e))

    if (user) {
      sendSuccess(res, user)
      return
    }
  }

  /**
   * Sends a verification email to verify a user via email or OTP to verify
   *  a user via phone number
   * @param req
   * @param res
   * @param next
   * @body `email`
   * @reqParam type
   */
  async requestVerification(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body
    const { resend } = req.query

    const user = await UserHandler.requestEmailVerification(email, resend).catch(e => next(e))
    if (user) {
      sendSuccess(res, user)
      return
    }

  }

  /**
   * Updates a user's details
   * @todo If the person updating is admin, allow some fields to be updated e.g. 'status'
   * @param req
   * @param res
   * @param next
   * @body `User`
   */
  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const user = await UserHandler.updateUserById(id, req.body).catch(e => next(e))

    if (user) {
      sendSuccess(res, user)
      return
    }
  }

  /**
   * Caters for password reset and password change. It resets the password if `token` is provided.
   * @param req
   * @param res
   * @param next
   * @body token, oldPassword, newPassword
   * @returns User
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { userName, token, oldPassword, newPassword } = req.body

    const user = await UserHandler.resetPassword(userName, token, oldPassword, newPassword).catch(e => next(e))

    if (user) {
      sendSuccess(res, user)
      return
    }
  }

  /**
   * Checks if a username or email address has already been registered
   * @param req
   * @param res
   * @param next
   * @params email or userName
   */
  async checkUser(req: Request, res: Response, next: NextFunction) {
    const { email } = req.query
    const userNotAvailable = await UserHandler.checkUserAvailability(email)
    sendSuccess(res, userNotAvailable)
    return
  }

}

export default new UserController()