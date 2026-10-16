import express from 'express';
import {
    getUserProfile,
    getUserBlogs,
    getCommentHistory,
    getSavedBlogs,
    getLikedBlogs,
    getUserDashboard
} from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// ── Public Routes (anyone can access) ────────────────────
// Get public profile of any user
router.get('/profile/:username', getUserProfile);

// Get all published blogs by a user
router.get('/profile/:username/blogs', getUserBlogs);

// ── Private Routes (logged in users only) ────────────────
// Get own comment history
router.get(
    '/comments/history',
    authMiddleware,
    getCommentHistory
);

// Get own saved/bookmarked blogs
router.get(
    '/saved-blogs',
    authMiddleware,
    getSavedBlogs
);

// Get own liked blogs
router.get(
    '/liked-blogs',
    authMiddleware,
    getLikedBlogs
);

// Get user dashboard data (all stats)
router.get(
    '/dashboard',
    authMiddleware,
    getUserDashboard
);

export default router;