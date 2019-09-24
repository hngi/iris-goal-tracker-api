import { AuthHandler, ValidationHandler } from '../../handlers'
import UserController from './users.controller'
import { Route, HttpMethod } from '../../lib/utils'

const USER_URL = '/api/users'

const userEndpoints: Route[] = [
  {
    path: `${USER_URL}/:id`,
    method: HttpMethod.GET,
    handler: [UserController.getSingleUser]
  },
  {
    path: `${USER_URL}/`,
    method: HttpMethod.POST,
    handler: [ValidationHandler.createUser, ValidationHandler.checkError, UserController.createUser]
  },
  {
    path: `${USER_URL}/login`,
    method: HttpMethod.POST,
    handler: [ValidationHandler.loginUser, ValidationHandler.checkError, UserController.loginUser]
  },
  {
    path: `${USER_URL}/request-verification`,
    method: HttpMethod.POST,
    handler: [ValidationHandler.requestVerification, ValidationHandler.checkError, UserController.requestVerification]
  },
  {
    path: `${USER_URL}/verify`,
    method: HttpMethod.POST,
    handler: [ValidationHandler.confirmUser, ValidationHandler.checkError, UserController.confirmUser]
  },
  {
    path: `${USER_URL}/forgot-password`,
    method: HttpMethod.POST,
    handler: [ValidationHandler.forgotPassword, ValidationHandler.checkError, UserController.forgotPassword]
  },
  {
    path: `${USER_URL}/reset-password`,
    method: HttpMethod.POST,
    handler: UserController.resetPassword
  },
  {
    path: `${USER_URL}/change-password`,
    method: HttpMethod.POST,
    handler: [AuthHandler.checkToken, UserController.resetPassword]
  },
  {
    path: `${USER_URL}/:id`,
    method: HttpMethod.PUT,
    handler: [AuthHandler.checkToken, UserController.updateUser]
  }
]

export default userEndpoints