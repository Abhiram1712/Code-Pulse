import mongoose from 'mongoose';

const contestHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  platform: {
    type: String,
    enum: ['leetcode', 'codechef', 'codeforces'],
    required: true
  },
  contestId: String,
  contestName: { type: String, required: true },
  date: { type: Date, required: true, index: true },
  rank: Number,
  totalParticipants: Number,
  rating: Number,
  ratingChange: Number,
  oldRating: Number,
  newRating: Number,
  problemsSolved: Number,
  totalProblems: Number,
  score: Number,
  percentile: Number
}, { timestamps: true });

contestHistorySchema.index({ user: 1, platform: 1, date: -1 });

const ContestHistory = mongoose.model('ContestHistory', contestHistorySchema);
export default ContestHistory;
