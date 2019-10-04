import { AuthHandler, ValidationHandler, UploadHandler } from '../../handlers'
import UsersController from './users.controller'
import { Route, HttpMethod } from '../../lib/utils'

const USER_URL = '/api/users'

const userEndpoints: Route[] = [
  {
    path: `${USER_URL}/:id`,
    method: HttpMethod.GET,
    handler: [UsersController.getSingleUser]
  },
  {
    path: `${USER_URL}/`,
    method: HttpMethod.POST,
    handler: [ValidationHandler.createUser, ValidationHandler.checkError, UsersController.createUser]
  },
  {
    path: `${USER_URL}/login`,
    method: HttpMethod.POST,
    handler: [ValidationHandler.loginUser, ValidationHandler.checkError, UsersController.loginUser]
  },
  {
    path: `${USER_URL}/request-verification`,
    method: HttpMethod.POST,
    handler: [ValidationHandler.requestVerification, ValidationHandler.checkError, UsersController.requestVerification]
  },
  {
    path: `${USER_URL}/verify`,
    method: HttpMethod.POST,
    handler: [ValidationHandler.confirmUser, ValidationHandler.checkError, UsersController.confirmUser]
  },
  {
    path: `${USER_URL}/forgot-password`,
    method: HttpMethod.POST,
    handler: [ValidationHandler.forgotPassword, ValidationHandler.checkError, UsersController.forgotPassword]
  },
  {
    path: `${USER_URL}/reset-password`,
    method: HttpMethod.POST,
    handler: UsersController.resetPassword
  },
  {
    path: `${USER_URL}/change-password`,
    method: HttpMethod.POST,
    handler: [AuthHandler.checkToken, UsersController.resetPassword]
  },
  {
    path: `${USER_URL}/:id`,
    method: HttpMethod.PUT,
    handler: [AuthHandler.checkToken, UsersController.updateUser]
  },
  {
    path: `${USER_URL}/uploads/image/:id`,
    method: HttpMethod.POST,
    handler: [AuthHandler.checkToken, UploadHandler.upload().single('data'), UsersController.uploadImage]
  },
]

export default userEndpoints