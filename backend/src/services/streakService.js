import User from '../models/User.model.js';
import DailyProgress from '../models/DailyProgress.model.js';
import { logger } from '../config/logger.js';

export const updateStreaks = async () => {
  const users = await User.find({ isActive: true });
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  for (const user of users) {
    try {
      const yesterdayProgress = await DailyProgress.findOne({
        user: user._id,
        dateString: yesterdayStr,
        totalSolved: { $gt: 0 }
      });

      if (yesterdayProgress) {
        user.currentStreak += 1;
        if (user.currentStreak > user.longestStreak) {
          user.longestStreak = user.currentStreak;
        }
      } else {
        // Check if they coded today before resetting
        const todayProgress = await DailyProgress.findOne({
          user: user._id,
          dateString: todayStr,
          totalSolved: { $gt: 0 }
        });

        if (!todayProgress) {
          user.currentStreak = 0;
        }
      }

      user.lastActivityDate = user.lastActivityDate || new Date();
      await user.save();
    } catch (error) {
      logger.error(`Streak update failed for user ${user._id}:`, error.message);
    }
  }
};

export const updateUserStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - (offset * 60 * 1000));
  const todayStr = localDate.toISOString().split('T')[0];

  const todayProgress = await DailyProgress.findOne({
    user: userId,
    dateString: todayStr,
    totalSolved: { $gt: 0 }
  });

  if (todayProgress) {
    const lastDate = user.lastActivityDate;
    let lastDateStr = null;
    if (lastDate) {
      const lastOffset = lastDate.getTimezoneOffset();
      const localLastDate = new Date(lastDate.getTime() - (lastOffset * 60 * 1000));
      lastDateStr = localLastDate.toISOString().split('T')[0];
    }

    if (lastDateStr !== todayStr) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayOffset = yesterday.getTimezoneOffset();
      const localYesterday = new Date(yesterday.getTime() - (yesterdayOffset * 60 * 1000));
      const yesterdayStr = localYesterday.toISOString().split('T')[0];

      if (lastDateStr === yesterdayStr) {
        user.currentStreak += 1;
      } else {
        user.currentStreak = 1;
      }

      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }

      user.lastActivityDate = today;
      await user.save();
    }
  }

  return user;
};
