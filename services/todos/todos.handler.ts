import { Todo } from "../../models/todo"
import { MongoHandler } from "../../handlers"
import { CustomError } from "../../lib/custom-error"
import { responseCodes } from "../../constants/response-codes"
import { responseMessages } from "../../constants/response-messages"

class TodosHandler {
  constructor() { }

  async createTodo(title: string, goal: string, description?: string) {
    const category = new Todo({ title, goal, description })

    const newTodo = await MongoHandler.save(category).catch(e => {
      throw new CustomError(responseCodes.ERROR_TECHNICAL, responseMessages.errorSaving('todo'), responseCodes.DEFAULT_ERROR_STATUS_CODE, e)
    })

    return newTodo
  }

  async getAllTodos() {
    const todos: any[] = await MongoHandler.find(Todo).catch(_ => [])

    return (Array.isArray(todos) && todos.length > 0) ? todos : []
  }

  async getAllTodosForGoal(goal: string) {
    const todos: any[] = await MongoHandler.find(Todo, { goal }).catch(_ => [])

    return (Array.isArray(todos) && todos.length > 0) ? todos : []
  }

  async updateTodo(id: string, body: any) {
    const skipUpdate = ['createdAt', 'updatedAt']

    const doc = await MongoHandler.findOne(Todo, id)
      .catch(e => {
        throw new CustomError(responseCodes.ERROR_NOT_FOUND, responseMessages.resourceNotFound('todo'), responseCodes.DEFAULT_ERROR_STATUS_CODE, e)
      })

    const updatedDoc = await MongoHandler.update(doc, body, skipUpdate).catch(e => {
      throw new CustomError(responseCodes.ERROR_FAILED_UPDATE, responseMessages.ERROR_FAILED_UPDATE, undefined, e)
    })

    return updatedDoc
  }

  async deleteTodo(id: string) {
    await MongoHandler.findAndDelete(Todo, { _id: id })
      .catch(e => { throw e })

    return
  }
}

export default new TodosHandler()
