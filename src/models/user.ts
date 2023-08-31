import mongoose, { Document } from 'mongoose';

export interface IUser {
  _id?: string
  name: string
  email: string
  password: string
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, require: true, },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform(_, ret): void {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    }
  }
)

interface UserModel extends Omit<IUser, '_id'>, Document {}

export const User = mongoose.model<UserModel>('User', schema);