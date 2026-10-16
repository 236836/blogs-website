import express from 'express';
import {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
} from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { uploadSingle } from '../middleware/upload.middleware.js';
import {
    validateRegister,
    validateLogin
} from '../middleware/validate.middleware.js';

const router = express.Router();

// ── Public Routes (No token needed) ──────────────────────
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// ── Private Routes (Token required) ──────────────────────
router.get('/me', authMiddleware, getMe);
router.put('/update-profile', authMiddleware, uploadSingle, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

export default router;