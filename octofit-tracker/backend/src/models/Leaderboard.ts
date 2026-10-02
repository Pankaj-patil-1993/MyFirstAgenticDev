import { model, Schema } from 'mongoose'

const leaderboardSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  points: { type: Number, default: 0 },
})

export default model('Leaderboard', leaderboardSchema)