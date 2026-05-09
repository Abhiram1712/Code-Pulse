import express from 'express';
import DailyProgress from '../models/DailyProgress.model.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticate);

router.get('/today', async (req, res) => {
  try {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    const today = localDate.toISOString().split('T')[0];
    const progress = await DailyProgress.findOne({ user: req.user._id, dateString: today });
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch today progress' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const progress = await DailyProgress.find({
      user: req.user._id,
      date: { $gte: startDate }
    }).sort({ date: -1 });
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch progress history' });
  }
});

router.patch('/log-time', async (req, res) => {
  try {
    const { minutes } = req.body;
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    const today = localDate.toISOString().split('T')[0];
    const progress = await DailyProgress.findOneAndUpdate(
      { user: req.user._id, dateString: today },
      { $inc: { codingMinutes: minutes || 0 }, $set: { date: new Date() } },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to log time' });
  }
});

export default router;
