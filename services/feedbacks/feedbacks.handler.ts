import { Feedback } from "../../models/feedback"
import { MongoHandler } from "../../handlers"
import { CustomError } from "../../lib/custom-error"
import { responseCodes } from "../../constants/response-codes"
import { responseMessages } from "../../constants/response-messages"

class FeedbacksHandler {
  constructor() { }

  async createFeedback(name: string, email: string, subject: string, message: string) {
    const category = new Feedback({ name, email, subject, message  })

    const newFeedback = await MongoHandler.save(category).catch(e => {
      throw new CustomError(responseCodes.ERROR_TECHNICAL, responseMessages.errorSaving('feedback'), responseCodes.DEFAULT_ERROR_STATUS_CODE, e)
    })

    return newFeedback
  }

  async getAllFeedbacks() {
    const feedbacks: any[] = await MongoHandler.find(Feedback).catch(_ => [])

    return (Array.isArray(feedbacks) && feedbacks.length > 0) ? feedbacks : []
  }

 async getAllFeedbacksByEmail(email: string) {
    const feedbacks: any[] = await MongoHandler.find(Feedback, { email }).catch(_ => [])

    return (Array.isArray(feedbacks) && feedbacks.length > 0) ? feedbacks : []
  }

  async updateFeedback(id: string, body: any) {
    const skipUpdate = ['createdAt', 'updatedAt']

    const doc = await MongoHandler.findOne(Feedback, id)
      .catch(e => {
        throw new CustomError(responseCodes.ERROR_NOT_FOUND, responseMessages.resourceNotFound('feedback'), responseCodes.DEFAULT_ERROR_STATUS_CODE, e)
      })

    const updatedDoc = await MongoHandler.update(doc, body, skipUpdate).catch(e => {
      throw new CustomError(responseCodes.ERROR_FAILED_UPDATE, responseMessages.ERROR_FAILED_UPDATE, undefined, e)
    })

    return updatedDoc
  }

  async deleteFeedback(id: string) {
    await MongoHandler.findAndDelete(Feedback, { _id: id })
      .catch(e => { throw e })

    return
  }
}

export default new FeedbacksHandler()
