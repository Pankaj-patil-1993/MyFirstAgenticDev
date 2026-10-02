import cors from 'cors'
import express from 'express'
import database from './config/database.js'
import Activity from './models/Activity.js'
import Leaderboard from './models/Leaderboard.js'
import Team from './models/Team.js'
import User from './models/User.js'
import Workout from './models/Workout.js'

const app = express()
const port = Number(process.env.PORT ?? 8000)
const codespaceName = process.env.CODESPACE_NAME
export const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

app.use(cors())
app.use(express.json())

app.get('/api/users/', async (_request, response) => {
  response.json(await User.find().lean())
})

app.get('/api/teams/', async (_request, response) => {
  response.json(await Team.find().lean())
})

app.get('/api/activities/', async (_request, response) => {
  response.json(await Activity.find().lean())
})

app.get('/api/leaderboard/', async (_request, response) => {
  response.json(await Leaderboard.find().lean())
})

app.get('/api/workouts/', async (_request, response) => {
  response.json(await Workout.find().lean())
})

app.get('/api/health', (_request, response) => {
  const connected = database.readyState === 1
  response.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'connecting',
    database: 'octofit_db',
  })
})

app.listen(port, () => {
  console.log(`OctoFit API listening on port ${port}`)
})