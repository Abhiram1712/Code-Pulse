import Goal from '../models/Goal.model.js';
import DailyProgress from '../models/DailyProgress.model.js';
import { logger } from '../config/logger.js';

export const updateUserGoalProgress = async (userId) => {
  try {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    const today = localDate.toISOString().split('T')[0];
    const todayProgress = await DailyProgress.findOne({ user: userId, dateString: today });

    const goals = await Goal.find({ user: userId, isActive: true, type: 'daily' });
    const updates = [];

    for (const goal of goals) {
      let progress = 0;

      if (todayProgress) {
        if (goal.target.unit === 'problems') {
          if (goal.target.platform === 'all') {
            progress = todayProgress.totalSolved || 0;
          } else {
            progress = todayProgress.platforms?.[goal.target.platform]?.solved || 0;
          }
        } else if (goal.target.unit === 'minutes') {
          progress = todayProgress.codingMinutes || 0;
        }
      }

      const completed = progress >= goal.target.value;
      const wasCompleted = goal.completedToday;

      if (completed && !wasCompleted) {
        goal.streak += 1;
        if (goal.streak > goal.longestStreak) goal.longestStreak = goal.streak;
        goal.history.push({ date: new Date(), achieved: progress, completed: true });
      }

      goal.currentProgress = progress;
      goal.completedToday = completed;
      goal.completionRate = Math.min(100, Math.round((progress / goal.target.value) * 100));
      await goal.save();
      updates.push(goal);
    }

    return updates;
  } catch (error) {
    logger.error('Goal service update progress error:', error);
    throw error;
  }
};
