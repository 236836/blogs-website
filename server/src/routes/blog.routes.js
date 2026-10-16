import express from 'express';
import {
    createBlog,
    getAllBlogs,
    getFeaturedBlogs,
    getTrendingBlogs,
    getLatestBlogs,
    searchBlogs,
    getAdminBlogs,
    getBlogBySlug,
    incrementView,
    updateBlog,
    deleteBlog,
    publishBlog,
    draftBlog,
    toggleFeatured
} from '../controllers/blog.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import { uploadSingle } from '../middleware/upload.middleware.js';

const router = express.Router();

// ── Public Routes (anyone can access) ────────────────────

// IMPORTANT: Specific routes MUST come before :slug route
// Otherwise express will treat "featured" as a slug
router.get('/featured', getFeaturedBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/latest', getLatestBlogs);
router.get('/search', searchBlogs);

// Admin route for getting all blogs with drafts
router.get(
    '/admin/all',
    authMiddleware,
    adminMiddleware,
    getAdminBlogs
);

// Get all published blogs with filter and pagination
router.get('/', getAllBlogs);

// Get single blog by slug (must be after all specific routes)
router.get('/:slug', getBlogBySlug);

// Increment view count
router.put('/:id/view', incrementView);

// ── Admin Routes (only admin can access) ─────────────────

// Create new blog
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    uploadSingle,
    createBlog
);

// Update blog
router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    uploadSingle,
    updateBlog
);

// Delete blog
router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    deleteBlog
);

// Publish blog
router.put(
    '/:id/publish',
    authMiddleware,
    adminMiddleware,
    publishBlog
);

// Move to draft
router.put(
    '/:id/draft',
    authMiddleware,
    adminMiddleware,
    draftBlog
);

// Toggle featured
router.put(
    '/:id/feature',
    authMiddleware,
    adminMiddleware,
    toggleFeatured
);

export default router;