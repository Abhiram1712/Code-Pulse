import express from 'express';
import {
  register, login, logout, refreshToken, getMe,
  registerValidators, loginValidators
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
