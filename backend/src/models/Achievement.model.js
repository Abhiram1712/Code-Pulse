import mongoose from 'mongoose';

const ACHIEVEMENT_DEFINITIONS = [
  { id: 'first_problem', title: 'First Blood', description: 'Solve your first problem', icon: '🎯', xp: 10, category: 'milestone' },
  { id: 'streak_7', title: '7-Day Warrior', description: 'Maintain a 7-day streak', icon: '🔥', xp: 50, category: 'streak' },
  { id: 'streak_30', title: 'Monthly Grinder', description: 'Maintain a 30-day streak', icon: '⚡', xp: 200, category: 'streak' },
  { id: 'streak_100', title: 'Century Streak', description: 'Maintain a 100-day streak', icon: '👑', xp: 1000, category: 'streak' },
  { id: 'problems_10', title: 'Getting Started', description: 'Solve 10 problems', icon: '🚀', xp: 25, category: 'problems' },
  { id: 'problems_50', title: 'Problem Enthusiast', description: 'Solve 50 problems', icon: '⭐', xp: 100, category: 'problems' },
  { id: 'problems_100', title: '100 Problems Solved', description: 'Solve 100 problems', icon: '💯', xp: 250, category: 'problems' },
  { id: 'problems_500', title: 'Problem Master', description: 'Solve 500 problems', icon: '🏆', xp: 1000, category: 'problems' },
  { id: 'problems_1000', title: 'Legendary Coder', description: 'Solve 1000 problems', icon: '🌟', xp: 5000, category: 'problems' },
  { id: 'contest_1', title: 'First Contest', description: 'Participate in your first contest', icon: '🥊', xp: 30, category: 'contest' },
  { id: 'contest_10', title: 'Contest Grinder', description: 'Participate in 10 contests', icon: '🎮', xp: 150, category: 'contest' },
  { id: 'contest_50', title: 'Arena Champion', description: 'Participate in 50 contests', icon: '🏅', xp: 500, category: 'contest' },
  { id: 'multi_platform', title: 'Platform Hopper', description: 'Connect all 4 platforms', icon: '🌐', xp: 75, category: 'platform' },
  { id: 'perfect_week', title: 'Perfect Week', description: 'Complete all goals for 7 days', icon: '✨', xp: 100, category: 'goals' },
  { id: 'night_owl', title: 'Night Owl', description: 'Code after midnight 5 times', icon: '🦉', xp: 40, category: 'special' },
  { id: 'early_bird', title: 'Early Bird', description: 'Code before 6am 5 times', icon: '🌅', xp: 40, category: 'special' },
  { id: 'hard_problem', title: 'Hard Mode', description: 'Solve 10 hard problems', icon: '💪', xp: 100, category: 'difficulty' },
  { id: 'rating_1500', title: 'Rising Star', description: 'Reach 1500 Codeforces rating', icon: '⭐', xp: 200, category: 'rating' },
  { id: 'rating_2000', title: 'Expert Coder', description: 'Reach 2000 Codeforces rating', icon: '💫', xp: 500, category: 'rating' }
];

const achievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  achievementId: { type: String, required: true },
  title: String,
  description: String,
  icon: String,
  xpAwarded: { type: Number, default: 0 },
  category: String,
  unlockedAt: { type: Date, default: Date.now },
  isNew: { type: Boolean, default: true } // For "new badge" notifications
}, { timestamps: true });

achievementSchema.index({ user: 1, achievementId: 1 }, { unique: true });

const Achievement = mongoose.model('Achievement', achievementSchema);
export { Achievement, ACHIEVEMENT_DEFINITIONS };
export default Achievement;
