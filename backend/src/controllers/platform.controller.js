import PlatformStats from '../models/PlatformStats.model.js';
import User from '../models/User.model.js';
import { syncPlatformForUser, syncAllPlatformsForUser } from '../services/syncService.js';
import { logger } from '../config/logger.js';

export const connectPlatform = async (req, res) => {
  try {
    const { platform, username } = req.body;
    const validPlatforms = ['leetcode', 'interviewbit', 'codechef', 'codeforces'];

    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ success: false, message: 'Invalid platform' });
    }

    if (!username?.trim()) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }

    // Update user platform config
    await User.findByIdAndUpdate(req.user._id, {
      [`platforms.${platform}.username`]: username.trim(),
      [`platforms.${platform}.connected`]: true
    });

    // Trigger initial sync
    try {
      const stats = await syncPlatformForUser(req.user._id, platform);
      res.json({ success: true, message: `${platform} connected and synced successfully`, data: stats });
    } catch (syncError) {
      // Platform connected but sync failed - still return success with warning
      res.status(207).json({
        success: true,
        message: `Platform ${platform} connected but initial sync failed: ${syncError.message}`,
        warning: true
      });
    }
  } catch (error) {
    logger.error('Connect platform error:', error);
    res.status(500).json({ success: false, message: 'Failed to connect platform' });
  }
};

export const disconnectPlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    await User.findByIdAndUpdate(req.user._id, {
      [`platforms.${platform}.connected`]: false
    });
    res.json({ success: true, message: `${platform} disconnected` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to disconnect platform' });
  }
};

export const syncPlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    const stats = await syncPlatformForUser(req.user._id, platform);
    res.json({ success: true, message: `${platform} synced successfully`, data: stats });
  } catch (error) {
    logger.error('Sync platform error:', error);
    res.status(500).json({ success: false, message: error.message || 'Sync failed' });
  }
};

export const syncAll = async (req, res) => {
  try {
    const results = await syncAllPlatformsForUser(req.user._id);
    res.json({ success: true, message: 'Sync complete', data: results });
  } catch (error) {
    logger.error('Sync all error:', error);
    res.status(500).json({ success: false, message: 'Sync failed' });
  }
};

export const getPlatformStats = async (req, res) => {
  try {
    const { platform } = req.params;
    const stats = await PlatformStats.findOne({ user: req.user._id, platform });

    if (!stats) {
      return res.status(404).json({ success: false, message: 'Platform stats not found. Please sync first.' });
    }

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch platform stats' });
  }
};

export const getAllPlatformStats = async (req, res) => {
  try {
    const stats = await PlatformStats.find({ user: req.user._id });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch platform stats' });
  }
};
