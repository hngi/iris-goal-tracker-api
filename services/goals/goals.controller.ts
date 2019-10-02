import GoalHandler from './goals.handler'
import { NextFunction, Request, Response } from 'express'
import { sendSuccess } from '../../lib/utils'

class GoalsController {
  constructor() { }

  async createGoal(req: Request, res: Response, next: NextFunction) {
    const { title, author, description, scheduleDate } = req.body

    const goal = await GoalHandler.createGoal(title, author, description, scheduleDate).catch(e => next(e))

    if (goal) {
      sendSuccess(res, goal)
    }
    return
  }

  async getGoals(_req: Request, res: Response, next: NextFunction) {
    const goals = await GoalHandler.getAllGoals().catch(e => next(e))

    if (goals) {
      sendSuccess(res, goals)
    }
    return
  }

  async getGoalsByAuthor(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const goals = await GoalHandler.getAllGoalsByAuthor(id).catch(e => next(e))

    if (goals) {
      sendSuccess(res, goals)
    }
    return
  }

  async getSingleGoal(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const goal = await GoalHandler.getSingleGoal(id).catch(e => next(e))

    if (goal) {
      sendSuccess(res, goal)
    }
    return
  }

  async updateGoal(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const updateGoal = await GoalHandler.updateGoal(id, req.body).catch(e => next(e))

    if (updateGoal) {
      sendSuccess(res, updateGoal)
    }
    return
  }

  async deleteGoal(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params // goal id
    await GoalHandler.deleteGoal(id).catch(e => next(e))

    sendSuccess(res)
    return
  }
}

export default new GoalsController()
