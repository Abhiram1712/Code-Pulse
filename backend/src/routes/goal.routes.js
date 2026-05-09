import express from 'express';
import {
  getGoals, createGoal, updateGoal, deleteGoal, updateGoalProgress
} from '../controllers/goal.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getGoals);
router.post('/', createGoal);
router.put('/progress', updateGoalProgress);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
