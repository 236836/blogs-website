import express from 'express';
import {
    toggleBookmark,
    getUserBookmarks,
    checkBookmarkStatus
} from '../controllers/bookmark.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// ── All routes require login ──────────────────────────────

// Toggle bookmark on a blog
router.post(
    '/blog/:blogId',
    authMiddleware,
    toggleBookmark
);

// Get all bookmarked blogs
router.get(
    '/',
    authMiddleware,
    getUserBookmarks
);

// Check if a specific blog is bookmarked
router.get(
    '/blog/:blogId',
    authMiddleware,
    checkBookmarkStatus
);

export default router;