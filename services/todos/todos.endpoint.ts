import { AuthHandler, ValidationHandler } from '../../handlers'
import TodosController from './todos.controller'
import { Route, HttpMethod } from '../../lib/utils'

const TODO_URL = '/api/todos'

const todoEndpoints: Route[] = [
  {
    path: `${TODO_URL}/`,
    method: HttpMethod.GET,
    handler: [TodosController.getTodos]
  },
  {
    path: `${TODO_URL}/goal/:id`,
    method: HttpMethod.GET,
    handler: [TodosController.getTodosForGoal]
  },
  {
    path: `${TODO_URL}/`,
    method: HttpMethod.POST,
    handler: [AuthHandler.checkToken, TodosController.createTodo]
  },
  {
    path: `${TODO_URL}/:id`,
    method: HttpMethod.PUT,
    handler: [AuthHandler.checkToken, TodosController.updateTodo]
  },
  {
    path: `${TODO_URL}/:id`,
    method: HttpMethod.DELETE,
    handler: [AuthHandler.checkToken, TodosController.deleteTodo]
  }
]

export default todoEndpoints
