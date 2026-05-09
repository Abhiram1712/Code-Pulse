import express from 'express';
import {
  connectPlatform, disconnectPlatform, syncPlatform,
  syncAll, getPlatformStats, getAllPlatformStats
} from '../controllers/platform.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/connect', connectPlatform);
router.delete('/disconnect/:platform', disconnectPlatform);
router.post('/sync/:platform', syncPlatform);
router.post('/sync', syncAll);
router.get('/stats', getAllPlatformStats);
router.get('/stats/:platform', getPlatformStats);

export default router;
