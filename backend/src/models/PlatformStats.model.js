import mongoose from 'mongoose';

const platformStatsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  platform: {
    type: String,
    enum: ['leetcode', 'interviewbit', 'codechef', 'codeforces'],
    required: true
  },
  username: { type: String, required: true },
  lastSynced: { type: Date, default: Date.now },
  syncStatus: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },

  // LeetCode specific
  leetcode: {
    totalSolved: Number,
    easySolved: Number,
    mediumSolved: Number,
    hardSolved: Number,
    totalEasy: Number,
    totalMedium: Number,
    totalHard: Number,
    acceptanceRate: Number,
    ranking: Number,
    contributionPoints: Number,
    reputation: Number,
    streak: Number,
    contestRating: Number,
    contestRanking: Number,
    contestsParticipated: Number,
    recentSubmissions: [{
      title: String,
      titleSlug: String,
      timestamp: Date,
      statusDisplay: String,
      lang: String,
      difficulty: String
    }],
    topicWiseStats: mongoose.Schema.Types.Mixed
  },

  // InterviewBit specific
  interviewbit: {
    totalSolved: Number,
    rank: Number,
    score: Number,
    tracks: [{
      name: String,
      totalProblems: Number,
      solvedProblems: Number,
      percentage: Number
    }],
    recentActivity: [{ title: String, topic: String, timestamp: Date }]
  },

  // CodeChef specific
  codechef: {
    rating: Number,
    highestRating: Number,
    stars: Number,
    globalRank: Number,
    countryRank: Number,
    totalSolved: Number,
    totalAttempted: Number,
    contestsParticipated: Number,
    contestHistory: [{
      code: String,
      name: String,
      rating: Number,
      rank: Number,
      date: Date
    }],
    recentSubmissions: [{ code: String, name: String, result: String, timestamp: Date }]
  },

  // Codeforces specific
  codeforces: {
    rating: Number,
    maxRating: Number,
    rank: String,
    maxRank: String,
    contribution: Number,
    friendOfCount: Number,
    totalSolved: Number,
    contestsParticipated: Number,
    contestHistory: [{
      contestId: Number,
      contestName: String,
      rank: Number,
      oldRating: Number,
      newRating: Number,
      ratingChange: Number,
      date: Date
    }],
    recentSubmissions: [{
      id: Number,
      problemName: String,
      problemRating: Number,
      verdict: String,
      language: String,
      timestamp: Date
    }],
    problemRatingDistribution: mongoose.Schema.Types.Mixed,
    tagDistribution: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

platformStatsSchema.index({ user: 1, platform: 1 }, { unique: true });

const PlatformStats = mongoose.model('PlatformStats', platformStatsSchema);
export default PlatformStats;
