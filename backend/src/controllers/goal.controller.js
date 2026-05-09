import Goal from '../models/Goal.model.js';
import DailyProgress from '../models/DailyProgress.model.js';
import { logger } from '../config/logger.js';

export const getGoals = async (req, res) => {
  try {
    // Dynamically recalculate goal progress before serving
    await updateUserGoalProgress(req.user._id);
    
    const goals = await Goal.find({ user: req.user._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: goals });
  } catch (error) {
    logger.error('Fetch goals error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch goals' });
  }
};

export const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    logger.error('Create goal error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isActive: false },
      { new: true }
    );
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete goal' });
  }
};

import { updateUserGoalProgress } from '../services/goalService.js';

export const updateGoalProgress = async (req, res) => {
  try {
    const updates = await updateUserGoalProgress(req.user._id);
    res.json({ success: true, data: updates });
  } catch (error) {
    logger.error('Update goal progress error:', error);
    res.status(500).json({ success: false, message: 'Failed to update goal progress' });
  }
};
