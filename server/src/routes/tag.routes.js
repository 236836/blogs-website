import express from 'express';
import {
    createTag,
    getAllTags,
    getTagBySlug,
    updateTag,
    deleteTag
} from '../controllers/tag.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = express.Router();

// ── Public Routes (anyone can access) ────────────────────
router.get('/', getAllTags);
router.get('/:slug', getTagBySlug);

// ── Admin Routes (only admin can access) ─────────────────
router.post('/', authMiddleware, adminMiddleware, createTag);
router.put('/:id', authMiddleware, adminMiddleware, updateTag);
router.delete('/:id', authMiddleware, adminMiddleware, deleteTag);

export default router;