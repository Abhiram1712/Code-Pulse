import express from 'express';
import User from '../models/User.model.js';
import DailyProgress from '../models/DailyProgress.model.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticate);

router.get('/profile', async (req, res) => {
  res.json({ success: true, data: req.user });
});

router.put('/profile', async (req, res) => {
  try {
    const allowed = ['username', 'avatar', 'theme', 'timezone', 'notifications'];
    const updates = {};
    allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/platforms', async (req, res) => {
  try {
    const { platform, username } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      [`platforms.${platform}.username`]: username
    });
    res.json({ success: true, message: 'Platform username updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/streak', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('currentStreak longestStreak weeklyStreak lastActivityDate');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch streak' });
  }
});

export default router;
