import mongoose from "mongoose"

const Schema = mongoose.Schema

const FeedbackSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: true })

export const Feedback = mongoose.model('Feedback', FeedbackSchema)