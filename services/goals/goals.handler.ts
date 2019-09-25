import { Goal } from "../../models/goal"
import { MongoHandler } from "../../handlers"
import { CustomError } from "../../lib/custom-error"
import { responseCodes } from "../../constants/response-codes"
import { responseMessages } from "../../constants/response-messages"
import mongoose from 'mongoose'
import { GoalsAggregations } from './goals.aggregation'

class GoalHandler {
  constructor() { }

  async createGoal(title: string, author: string, description?: string) {
    const category = new Goal({ title, author, description })

    const newGoal = await MongoHandler.save(category).catch(e => {
      throw new CustomError(responseCodes.ERROR_TECHNICAL, responseMessages.errorSaving('goal'), responseCodes.DEFAULT_ERROR_STATUS_CODE, e)
    })

    return newGoal
  }

  async getAllGoals() {
    const goals: any[] = await MongoHandler.find(Goal).catch(_ => [])

    return (Array.isArray(goals) && goals.length > 0) ? goals : []
  }

  async getAllGoalsByAuthor(author: string) {
    const goals: any[] = await MongoHandler.aggregate(Goal, [{ $match: { 'author': mongoose.Types.ObjectId(author) } }, ...GoalsAggregations]).catch(_ => [])

    return (Array.isArray(goals) && goals.length > 0) ? goals : []
  }

  async getSingleGoal(id: string) {
    const goal = await MongoHandler.findOne(Goal, id).catch(e => { throw e })

    if (goal) {
      return goal
    }
  }

  async updateGoal(id: string, body: any) {
    const skipUpdate = ['createdAt', 'updatedAt']

    const doc = await MongoHandler.findOne(Goal, id)
      .catch(e => {
        throw new CustomError(responseCodes.ERROR_NOT_FOUND, responseMessages.resourceNotFound('goal'), responseCodes.DEFAULT_ERROR_STATUS_CODE, e)
      })

    const updatedDoc = await MongoHandler.update(doc, body, skipUpdate).catch(e => {
      throw new CustomError(responseCodes.ERROR_FAILED_UPDATE, responseMessages.ERROR_FAILED_UPDATE, undefined, e)
    })

    return updatedDoc
  }

  async deleteGoal(id: string) {
    await MongoHandler.findAndDelete(Goal, { _id: id })
      .catch(e => { throw e })

    return
  }
}

export default new GoalHandler()
