import express from 'express';
import Achievement from '../models/Achievement.model.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.user._id }).sort({ unlockedAt: -1 });
    res.json({ success: true, data: achievements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch achievements' });
  }
});

router.patch('/mark-seen', async (req, res) => {
  try {
    await Achievement.updateMany({ user: req.user._id, isNew: true }, { isNew: false });
    res.json({ success: true, message: 'Achievements marked as seen' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update achievements' });
  }
});

export default router;
