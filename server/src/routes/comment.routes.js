import express from 'express';
import {
    addComment,
    replyToComment,
    getBlogComments,
    updateComment,
    deleteComment,
    getAdminComments,
    hideComment,
    approveComment
} from '../controllers/comment.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import { validateComment } from '../middleware/validate.middleware.js';

const router = express.Router();

// ── Public Routes ─────────────────────────────────────────
// Get all comments for a blog
router.get('/blog/:blogId', getBlogComments);

// ── Private Routes (logged in users) ─────────────────────
// Add comment on a blog
router.post(
    '/blog/:blogId',
    authMiddleware,
    validateComment,
    addComment
);

// Reply to a comment
router.post(
    '/:id/reply',
    authMiddleware,
    validateComment,
    replyToComment
);

// Edit own comment
router.put(
    '/:id',
    authMiddleware,
    updateComment
);

// Delete own comment or admin can delete any
router.delete(
    '/:id',
    authMiddleware,
    deleteComment
);

// ── Admin Routes ──────────────────────────────────────────
// Get all comments for moderation
router.get(
    '/admin/all',
    authMiddleware,
    adminMiddleware,
    getAdminComments
);

// Hide or unhide comment
router.put(
    '/:id/hide',
    authMiddleware,
    adminMiddleware,
    hideComment
);

// Approve comment
router.put(
    '/:id/approve',
    authMiddleware,
    adminMiddleware,
    approveComment
);

export default router;