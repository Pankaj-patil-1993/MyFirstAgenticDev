import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    const teamData = [
      { name: 'Octocats', points: 420 },
      { name: 'Code Crushers', points: 365 },
    ];
    const teams = new Map<string, { _id: unknown }>();
    for (const team of teamData) {
      const savedTeam = await Team.findOneAndUpdate(
        { name: team.name },
        { $set: team },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
      teams.set(team.name, savedTeam);
    }

    const userData = [
      { name: 'Mona', email: 'mona@example.com', team: 'Octocats' },
      { name: 'Ada', email: 'ada@example.com', team: 'Octocats' },
      { name: 'Linus', email: 'linus@example.com', team: 'Code Crushers' },
    ];
    const users = new Map<string, { name: string; id: unknown }>();
    for (const user of userData) {
      const savedUser = await User.findOneAndUpdate(
        { email: user.email },
        { $set: { name: user.name, team: teams.get(user.team)?._id } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
      users.set(user.email, { name: savedUser.name, id: savedUser._id });
    }

    const activityData = [
      { email: 'mona@example.com', type: 'running', durationMinutes: 32, points: 40, date: '2026-09-28' },
      { email: 'mona@example.com', type: 'cycling', durationMinutes: 45, points: 55, date: '2026-09-30' },
      { email: 'ada@example.com', type: 'strength', durationMinutes: 40, points: 50, date: '2026-09-29' },
      { email: 'ada@example.com', type: 'running', durationMinutes: 25, points: 32, date: '2026-10-01' },
      { email: 'linus@example.com', type: 'hiking', durationMinutes: 60, points: 75, date: '2026-09-28' },
      { email: 'linus@example.com', type: 'cycling', durationMinutes: 38, points: 47, date: '2026-09-30' },
    ];
    for (const activity of activityData) {
      const user = users.get(activity.email);
      const date = new Date(`${activity.date}T12:00:00.000Z`);
      await Activity.findOneAndUpdate(
        { user: user?.id, type: activity.type, date },
        { $set: { durationMinutes: activity.durationMinutes, points: activity.points } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
    }

    const leaderboardData = [
      { email: 'mona@example.com', points: 95 },
      { email: 'ada@example.com', points: 82 },
      { email: 'linus@example.com', points: 122 },
    ];
    for (const entry of leaderboardData) {
      const user = users.get(entry.email);
      await Leaderboard.findOneAndUpdate(
        { user: user?.id },
        { $set: { name: user?.name, points: entry.points } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
    }

    const workoutData = [
      { name: 'Interval Run', description: 'Alternate steady running with short faster intervals.', difficulty: 'intermediate', durationMinutes: 30 },
      { name: 'Bodyweight Strength', description: 'A full-body circuit of squats, push-ups, lunges, and planks.', difficulty: 'beginner', durationMinutes: 25 },
      { name: 'Hill Climb Ride', description: 'Build cycling endurance with sustained climbs and recovery periods.', difficulty: 'advanced', durationMinutes: 45 },
      { name: 'Recovery Flow', description: 'Gentle mobility work and stretches for post-training recovery.', difficulty: 'beginner', durationMinutes: 20 },
    ];
    for (const workout of workoutData) {
      await Workout.findOneAndUpdate(
        { name: workout.name },
        { $set: workout },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
    }

    console.log('Database seeding complete: 2 teams, 3 users, 6 activities, 3 leaderboard entries, 4 workouts');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
