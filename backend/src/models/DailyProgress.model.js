import mongoose from 'mongoose';

const dailyProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  dateString: { type: String, required: true }, // 'YYYY-MM-DD' for quick lookup

  // Overall stats for the day
  totalSolved: { type: Number, default: 0 },
  totalSubmissions: { type: Number, default: 0 },
  codingMinutes: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  productivityScore: { type: Number, default: 0, min: 0, max: 100 },

  // Per-platform breakdown
  platforms: {
    leetcode: {
      solved: { type: Number, default: 0 },
      submissions: { type: Number, default: 0 },
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
      problems: [{ title: String, difficulty: String, status: String, timestamp: Date }]
    },
    interviewbit: {
      solved: { type: Number, default: 0 },
      submissions: { type: Number, default: 0 },
      problems: [{ title: String, topic: String, timestamp: Date }]
    },
    codechef: {
      solved: { type: Number, default: 0 },
      submissions: { type: Number, default: 0 },
      problems: [{ code: String, name: String, result: String, timestamp: Date }]
    },
    codeforces: {
      solved: { type: Number, default: 0 },
      submissions: { type: Number, default: 0 },
      problems: [{ name: String, rating: Number, verdict: String, timestamp: Date }]
    }
  },

  // Goals achieved today
  goalsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
  allGoalsCompleted: { type: Boolean, default: false },

  // Notes
  notes: { type: String, maxlength: 500 }
}, { timestamps: true });

// Compound unique index: one record per user per day
dailyProgressSchema.index({ user: 1, dateString: 1 }, { unique: true });

const DailyProgress = mongoose.model('DailyProgress', dailyProgressSchema);
export default DailyProgress;
