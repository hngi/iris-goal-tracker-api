import UserHandler from "../services/users/users.handler";
import mongoose from "mongoose"

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: { type: String, default: null },
  email: { type: String, lowercase: true, unique: true },
  password: { type: String, required: true },
  image: {
    name: {
      type: String,
      default: null
    },
    data: {
      type: String,
      default: null
    }
  },
  status: {
    type: String,
    default: 'pending',
    enum: {
      values: ['enabled', 'blocked', 'pending']
    }
  },
  isEmailVerified: { type: Boolean, default: false },
  requestedVerification: { type: Boolean, default: false },
  token: { type: String, default: null }
}, { timestamps: true })

/**
 * On every save...
 */
UserSchema.pre('save', function (next) {
  let user = this
  UserHandler.hashPassword(user, next)
})

UserSchema.post('find', function (doc: any) {
  if (Array.isArray(doc)) {
    doc.forEach(user => {
      delete user.password
    })
  } else {
    delete doc.password
  }
})

export const User = mongoose.model('User', UserSchema)