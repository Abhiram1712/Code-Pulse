import cron from 'node-cron';
import User from '../models/User.model.js';
import { syncAllPlatformsForUser } from './syncService.js';
import { updateStreaks } from './streakService.js';
import { logger } from '../config/logger.js';

export const initCronJobs = () => {
  // Sync all active users every 6 hours
  const syncInterval = process.env.SYNC_INTERVAL || '0 */6 * * *';
  cron.schedule(syncInterval, async () => {
    logger.info('🔄 Starting scheduled platform sync...');
    try {
      const users = await User.find({ isActive: true }).select('_id platforms');
      let synced = 0;

      for (const user of users) {
        const hasConnectedPlatform = Object.values(user.platforms || {}).some(p => p.connected);
        if (hasConnectedPlatform) {
          try {
            await syncAllPlatformsForUser(user._id);
            synced++;
            // Stagger requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (err) {
            logger.error(`Cron sync failed for user ${user._id}:`, err.message);
          }
        }
      }

      logger.info(`✅ Cron sync complete: ${synced}/${users.length} users synced`);
    } catch (error) {
      logger.error('Cron sync error:', error);
    }
  }, { timezone: 'UTC' });

  // Update streaks at midnight UTC every day
  cron.schedule('0 0 * * *', async () => {
    logger.info('🔥 Updating streaks...');
    try {
      await updateStreaks();
      logger.info('✅ Streak update complete');
    } catch (error) {
      logger.error('Streak update error:', error);
    }
  }, { timezone: 'UTC' });

  // Reset daily goal progress at midnight UTC
  cron.schedule('1 0 * * *', async () => {
    logger.info('🎯 Resetting daily goal progress...');
    try {
      const Goal = (await import('../models/Goal.model.js')).default;
      await Goal.updateMany(
        { type: 'daily', isActive: true },
        { $set: { currentProgress: 0, completedToday: false } }
      );
      logger.info('✅ Daily goals reset');
    } catch (error) {
      logger.error('Goal reset error:', error);
    }
  }, { timezone: 'UTC' });

  logger.info('⏰ Cron jobs initialized');
};
