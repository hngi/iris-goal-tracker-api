import GoalsHandler from "../services/goals/goals.handler";
import mongoose from "mongoose"

const Schema = mongoose.Schema

const GoalSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: null },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isComplete: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true })

export const Goal = mongoose.model('Goal', GoalSchema)