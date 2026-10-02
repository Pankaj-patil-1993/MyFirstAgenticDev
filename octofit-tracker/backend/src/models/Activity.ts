import { model, Schema } from 'mongoose'

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  points: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
})

export default model('Activity', activitySchema)