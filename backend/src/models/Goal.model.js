import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    default: 'daily'
  },
  category: {
    type: String,
    enum: ['problems', 'time', 'contest', 'platform_specific', 'streak'],
    required: true
  },

  // Target values
  target: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['problems', 'minutes', 'hours', 'contests', 'days'], required: true },
    platform: {
      type: String,
      enum: ['all', 'leetcode', 'interviewbit', 'codechef', 'codeforces'],
      default: 'all'
    },
    difficulty: {
      type: String,
      enum: ['all', 'easy', 'medium', 'hard'],
      default: 'all'
    }
  },

  // Progress tracking
  currentProgress: { type: Number, default: 0 },
  completedToday: { type: Boolean, default: false },
  completionRate: { type: Number, default: 0 }, // percentage 0-100
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },

  // Scheduling
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0=Sunday, 6=Saturday

  // History
  history: [{
    date: Date,
    achieved: Number,
    completed: Boolean
  }],

  // Notifications
  reminderTime: { type: String }, // 'HH:MM'
  reminderEnabled: { type: Boolean, default: false }
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
