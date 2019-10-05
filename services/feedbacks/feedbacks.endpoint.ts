import { AuthHandler, ValidationHandler } from '../../handlers'
import FeedbacksController from './feedbacks.controller'
import { Route, HttpMethod } from '../../lib/utils'

const FEEDBACK_URL = '/api/feedbacks'

const feedbackEndpoints: Route[] = [
  {
    path: `${FEEDBACK_URL}/`,
    method: HttpMethod.GET,
    handler: [FeedbacksController.getFeedbacks]
  },
{
    path: `${FEEDBACK_URL}/email/:email`,
    method: HttpMethod.GET,
    handler: [FeedbacksController.getFeedbacksByEmail]
  },
  {
    path: `${FEEDBACK_URL}/`,
    method: HttpMethod.POST,
    handler: [AuthHandler.checkToken, FeedbacksController.createFeedback]
  },
  {
    path: `${FEEDBACK_URL}/:id`,
    method: HttpMethod.PUT,
    handler: [AuthHandler.checkToken, FeedbacksController.updateFeedback]
  },
  {
    path: `${FEEDBACK_URL}/:id`,
    method: HttpMethod.DELETE,
    handler: [AuthHandler.checkToken, FeedbacksController.deleteFeedback]
  }
]

export default feedbackEndpoints
