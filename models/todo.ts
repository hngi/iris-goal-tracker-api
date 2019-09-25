import TodosHandler from "../services/todos/todos.handler";
import mongoose from "mongoose"

const Schema = mongoose.Schema

const TodoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: null },
  goal: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
  isComplete: { type: Boolean, default: false }
}, { timestamps: true })

export const Todo = mongoose.model('Todo', TodoSchema)