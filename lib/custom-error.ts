import { responseMessages } from "../constants/response-messages"
import { responseCodes } from "../constants/response-codes"

export class CustomError extends Error {
  constructor(
    public code = responseCodes.DEFAULT_ERROR_CODE,
    public message = responseMessages.GENERIC, public status = responseCodes.DEFAULT_ERROR_STATUS_CODE,
    public data?: any,
    ...params: any) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }

    this.code = code
    this.status = status
    this.message = message
    this.data = data
  }
}