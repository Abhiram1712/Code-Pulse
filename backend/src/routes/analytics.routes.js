import express from 'express';
import {
  getDashboardStats, getHeatmapData, getProgressChart,
  getDifficultyDistribution, getContestHistory,
  getRatingProgression, getSmartInsights
} from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', getDashboardStats);
router.get('/heatmap', getHeatmapData);
router.get('/progress', getProgressChart);
router.get('/difficulty', getDifficultyDistribution);
router.get('/contests', getContestHistory);
router.get('/ratings', getRatingProgression);
router.get('/insights', getSmartInsights);

export default router;
