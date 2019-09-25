import TodoHandler from './todos.handler'
import { NextFunction, Request, Response } from 'express'
import { sendSuccess } from '../../lib/utils'

class TodosController {
  constructor() { }

  async createTodo(req: Request, res: Response, next: NextFunction) {
    const { title, goal, description } = req.body

    const todo = await TodoHandler.createTodo(title, goal, description).catch(e => next(e))

    if (todo) {
      sendSuccess(res, todo)
    }
    return
  }

  async getTodos(_req: Request, res: Response, next: NextFunction) {
    const todos = await TodoHandler.getAllTodos().catch(e => next(e))

    if (todos) {
      sendSuccess(res, todos)
    }
    return
  }

  async getTodosForGoal(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const todos = await TodoHandler.getAllTodosForGoal(id).catch(e => next(e))

    if (todos) {
      sendSuccess(res, todos)
    }
    return
  }

  async updateTodo(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const updateTodo = await TodoHandler.updateTodo(id, req.body).catch(e => next(e))

    if (updateTodo) {
      sendSuccess(res, updateTodo)
    }
    return
  }

  async deleteTodo(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params // id of the todo
    await TodoHandler.deleteTodo(id).catch(e => next(e))

    sendSuccess(res)
    return
  }
}

export default new TodosController()
