import FeedbackHandler from './feedbacks.handler'
import { NextFunction, Request, Response } from 'express'
import { sendSuccess } from '../../lib/utils'

class FeedbacksController {
  constructor() { }

  async createFeedback(req: Request, res: Response, next: NextFunction) {
    const { name, email, subject, message } = req.body

    const feedback = await FeedbackHandler.createFeedback(name, email, subject, message ).catch(e => next(e))

    if (feedback) {
      sendSuccess(res, feedback)
    }
    return
  }

  async getFeedbacks(_req: Request, res: Response, next: NextFunction) {
    const feedbacks = await FeedbackHandler.getAllFeedbacks().catch(e => next(e))

    if (feedbacks) {
      sendSuccess(res, feedbacks)
    }
    return
  }

  async getFeedbacksByEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.params; 
    const feedbacks = await FeedbackHandler.getFeedbacksByEmail(email).catch(e => next(e))


    if (feedbacks) {
      sendSuccess(res, feedbacks)
    }
    return
  }
 
  async updateFeedback(req: Request, res: Response, next: NextFunction) {
    const { email } = req.params; 
    const updateFeedback = await FeedbackHandler.updateFeedback(id, req.body).catch(e => next(e))

    if (updateFeedback) {
      sendSuccess(res, updateFeedback)
    }
    return
  }

  async deleteFeedback(req: Request, res: Response, next: NextFunction) {
    const { email } = req.params;  
    await FeedbackHandler.deleteFeedback(id).catch(e => next(e))

    sendSuccess(res)
    return
  }
}

export default new FeedbacksController()
