import express from 'express';
import {
    toggleLike,
    getBlogLikeStatus,
    getUserLikedBlogs
} from '../controllers/like.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// ── Optional Auth Middleware ──────────────────────────────
// This middleware checks if token exists but does NOT block
// if no token. It just sets req.user if logged in
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            const jwt = await import('jsonwebtoken');
            const User = (await import('../models/User.model.js')).default;
            const decoded = jwt.default.verify(
                token,
                process.env.JWT_SECRET
            );
            req.user = await User.findById(decoded.id);
        }

        next();
    } catch (error) {
        // If token is invalid just continue without user
        next();
    }
};

// ── Routes ────────────────────────────────────────────────

// Toggle like on a blog (must be logged in)
router.post(
    '/blog/:blogId',
    authMiddleware,
    toggleLike
);

// Get like count and user like status
// optionalAuth: shows user like status if logged in
// otherwise just shows count
router.get(
    '/blog/:blogId',
    optionalAuth,
    getBlogLikeStatus
);

// Get all blogs liked by current user
router.get(
    '/user/liked',
    authMiddleware,
    getUserLikedBlogs
);

export default router;