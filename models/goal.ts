import mongoose from "mongoose"

const Schema = mongoose.Schema

const GoalSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: null },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scheduleDate: { type: Date, default: null }, // added schedule goal feature
  isComplete: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true })

export const Goal = mongoose.model('Goal', GoalSchema)