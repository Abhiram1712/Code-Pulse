import PlatformStats from '../models/PlatformStats.model.js';
import User from '../models/User.model.js';
import DailyProgress from '../models/DailyProgress.model.js';
import { Achievement, ACHIEVEMENT_DEFINITIONS } from '../models/Achievement.model.js';
import { fetchLeetCodeStats } from './platforms/leetcode.service.js';
import { fetchCodeforcesStats } from './platforms/codeforces.service.js';
import { fetchCodeChefStats } from './platforms/codechef.service.js';
import { fetchInterviewBitStats } from './platforms/interviewbit.service.js';
import { logger } from '../config/logger.js';

const PLATFORM_SERVICES = {
  leetcode: fetchLeetCodeStats,
  codeforces: fetchCodeforcesStats,
  codechef: fetchCodeChefStats,
  interviewbit: fetchInterviewBitStats
};

export const syncPlatformForUser = async (userId, platform) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const platformConfig = user.platforms?.[platform];
  if (!platformConfig?.connected || !platformConfig?.username) {
    throw new Error(`Platform ${platform} not configured for user`);
  }

  const username = platformConfig.username;
  const fetchFn = PLATFORM_SERVICES[platform];

  if (!fetchFn) throw new Error(`Unknown platform: ${platform}`);

  try {
    logger.info(`Syncing ${platform} for user ${userId} (${username})`);
    const data = await fetchFn(username);

    // Get previous stats to calculate delta
    const previousStats = await PlatformStats.findOne({ user: userId, platform });
    const previousTotalSolved = previousStats?.[platform]?.totalSolved || 0;
    const newTotalSolved = data.totalSolved || 0;
    
    let deltaSolved = 0;
    if (previousStats && newTotalSolved > previousTotalSolved) {
      if (previousTotalSolved === 0 && newTotalSolved > 20) {
        // Recovery sync: The previous sync likely failed and saved 0. 
        // Don't credit all historical problems to today.
        deltaSolved = 0;
        logger.info(`Recovery sync detected for ${platform} user ${userId}: jumped from 0 to ${newTotalSolved}`);
      } else {
        deltaSolved = newTotalSolved - previousTotalSolved;
      }
    } else if (!previousStats) {
      // First time sync: don't credit all historical problems to today!
      // Alternatively, we could credit them to "all time" but not today. 
      // We will set delta to 0 so today's stats aren't artificially inflated.
      deltaSolved = 0;
    }

    // Upsert platform stats
    const stats = await PlatformStats.findOneAndUpdate(
      { user: userId, platform },
      {
        user: userId,
        platform,
        username,
        lastSynced: new Date(),
        syncStatus: 'success',
        [platform]: data
      },
      { upsert: true, new: true }
    );

    // Update user's last synced time
    await User.findByIdAndUpdate(userId, {
      [`platforms.${platform}.lastSynced`]: new Date()
    });

    // Update daily progress
    await updateDailyProgress(userId, platform, data, deltaSolved);

    // Update real-time streak
    const { updateUserStreak } = await import('./streakService.js');
    await updateUserStreak(userId);

    // Update goals
    const { updateUserGoalProgress } = await import('./goalService.js');
    await updateUserGoalProgress(userId);

    // Check achievements
    await checkAndAwardAchievements(userId);

    logger.info(`✅ Synced ${platform} for user ${userId} (Delta: +${deltaSolved})`);
    return stats;
  } catch (error) {
    await PlatformStats.findOneAndUpdate(
      { user: userId, platform },
      { syncStatus: 'failed', lastSynced: new Date() },
      { upsert: true }
    );
    logger.error(`❌ Failed to sync ${platform} for user ${userId}:`, error.message);
    throw error;
  }
};

export const syncAllPlatformsForUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const results = {};
  const platforms = Object.keys(user.platforms || {});

  for (const platform of platforms) {
    if (user.platforms[platform]?.connected) {
      try {
        results[platform] = { status: 'success', data: await syncPlatformForUser(userId, platform) };
      } catch (error) {
        results[platform] = { status: 'failed', error: error.message };
      }
    }
  }

  return results;
};

const updateDailyProgress = async (userId, platform, data, deltaSolved) => {
  const today = new Date();
  // Adjust for local timezone offset so dateString matches local date, not UTC date
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - (offset * 60 * 1000));
  const dateString = localDate.toISOString().split('T')[0];

  const incData = {
    totalSolved: deltaSolved,
    [`platforms.${platform}.solved`]: deltaSolved,
    [`platforms.${platform}.submissions`]: data.recentSubmissions?.length || 0,
  };

  const setData = {
    user: userId,
    date: today,
    dateString,
  };

  if (platform === 'leetcode') {
    if (data.recentSubmissions?.length > 0) {
      setData[`platforms.leetcode.problems`] = data.recentSubmissions.slice(0, 5);
    }
  }

  await DailyProgress.findOneAndUpdate(
    { user: userId, dateString },
    { 
      $set: setData,
      $inc: incData
    },
    { upsert: true, new: true }
  );
};

export const checkAndAwardAchievements = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const allStats = await PlatformStats.find({ user: userId });
  const existingAchievements = await Achievement.find({ user: userId }).select('achievementId');
  const earnedIds = new Set(existingAchievements.map(a => a.achievementId));

  const totalSolved = allStats.reduce((sum, s) => {
    const p = s[s.platform];
    return sum + (p?.totalSolved || 0);
  }, 0);

  const totalContests = allStats.reduce((sum, s) => {
    const p = s[s.platform];
    return sum + (p?.contestsParticipated || 0);
  }, 0);

  const cfRating = allStats.find(s => s.platform === 'codeforces')?.codeforces?.rating || 0;
  const connectedPlatforms = Object.values(user.platforms || {}).filter(p => p.connected).length;
  const hardSolved = allStats.find(s => s.platform === 'leetcode')?.leetcode?.hardSolved || 0;

  const conditions = {
    first_problem: totalSolved >= 1,
    streak_7: user.currentStreak >= 7,
    streak_30: user.currentStreak >= 30,
    streak_100: user.currentStreak >= 100,
    problems_10: totalSolved >= 10,
    problems_50: totalSolved >= 50,
    problems_100: totalSolved >= 100,
    problems_500: totalSolved >= 500,
    problems_1000: totalSolved >= 1000,
    contest_1: totalContests >= 1,
    contest_10: totalContests >= 10,
    contest_50: totalContests >= 50,
    multi_platform: connectedPlatforms >= 4,
    hard_problem: hardSolved >= 10,
    rating_1500: cfRating >= 1500,
    rating_2000: cfRating >= 2000
  };

  let totalXpEarned = 0;
  const newAchievements = [];

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    if (!earnedIds.has(def.id) && conditions[def.id]) {
      newAchievements.push({
        user: userId,
        achievementId: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        xpAwarded: def.xp,
        category: def.category
      });
      totalXpEarned += def.xp;
    }
  }

  if (newAchievements.length > 0) {
    await Achievement.insertMany(newAchievements, { ordered: false }).catch(() => {});
    
    // Award XP and recalculate level
    user.xp += totalXpEarned;
    user.calculateLevel();
    user.totalProblems = totalSolved;
    await user.save();
    
    logger.info(`🏆 Awarded ${newAchievements.length} achievements to user ${userId}`);
  }

  return newAchievements;
};
