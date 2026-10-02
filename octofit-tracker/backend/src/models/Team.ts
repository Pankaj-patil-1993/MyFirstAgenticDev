import { model, Schema } from 'mongoose'

const teamSchema = new Schema({
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
})

export default model('Team', teamSchema)