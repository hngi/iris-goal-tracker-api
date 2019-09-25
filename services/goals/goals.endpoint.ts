import { AuthHandler, ValidationHandler } from '../../handlers'
import GoalsController from './goals.controller'
import { Route, HttpMethod } from '../../lib/utils'

const GOAL_URL = '/api/goals'

const goalEndpoints: Route[] = [
  {
    path: `${GOAL_URL}/`,
    method: HttpMethod.GET,
    handler: [GoalsController.getGoals]
  },
  {
    path: `${GOAL_URL}/:id`,
    method: HttpMethod.GET,
    handler: [AuthHandler.checkToken, GoalsController.getSingleGoal]
  },
  {
    path: `${GOAL_URL}/author/:id`,
    method: HttpMethod.GET,
    handler: [AuthHandler.checkToken, GoalsController.getGoalsByAuthor]
  },
  {
    path: `${GOAL_URL}/`,
    method: HttpMethod.POST,
    handler: [AuthHandler.checkToken, GoalsController.createGoal]
  },
  {
    path: `${GOAL_URL}/:id`,
    method: HttpMethod.PUT,
    handler: [AuthHandler.checkToken, GoalsController.updateGoal]
  },
  {
    path: `${GOAL_URL}/:id`,
    method: HttpMethod.DELETE,
    handler: [AuthHandler.checkToken, GoalsController.deleteGoal]
  }
]

export default goalEndpoints
