import { model, Schema } from 'mongoose'

const workoutSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  difficulty: { type: String, default: 'beginner' },
  durationMinutes: { type: Number, required: true },
})

export default model('Workout', workoutSchema)