import express from 'express';
import {
    createCategory,
    getAllCategories,
    getCategoryBySlug,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = express.Router();

// ── Public Routes (anyone can access) ────────────────────
router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);

// ── Admin Routes (only admin can access) ─────────────────
router.post('/', authMiddleware, adminMiddleware, createCategory);
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

export default router;