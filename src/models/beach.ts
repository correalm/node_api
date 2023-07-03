import mongoose, { Document } from 'mongoose';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface BeachI {
  _id?: string
  name: string
  position: BeachPosition
  lat: number
  lng: number
  user: string
}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, require: true },
    lng: { type: Number, require: true },
    name: { type: String, require: true },
    position: { type: String, require: true }
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

interface BeachModel extends Omit<BeachI, '_id'>, Document {}

export const Beach = mongoose.model<BeachModel>('Beach', schema)