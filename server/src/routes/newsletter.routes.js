import express from 'express';
import {
    subscribe,
    unsubscribe,
    getAllSubscribers,
    deleteSubscriber
} from '../controllers/newsletter.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = express.Router();

// ── Public Routes (anyone can access) ────────────────────
// Subscribe to newsletter
router.post('/subscribe', subscribe);

// Unsubscribe from newsletter
router.post('/unsubscribe', unsubscribe);

// ── Admin Routes (only admin) ────────────────────────────
// Get all subscribers
router.get(
    '/',
    authMiddleware,
    adminMiddleware,
    getAllSubscribers
);

// Delete subscriber
router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    deleteSubscriber
);

export default router;