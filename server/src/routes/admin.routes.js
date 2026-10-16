import express from 'express';
import {
    getDashboardStats,
    getRecentActivity,
    getAnalytics,
    getAllUsers,
    getUserDetail,
    toggleBlockUser,
    changeUserRole,
    deleteUser
} from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = express.Router();

// ALL routes here need admin access
// So we apply both middlewares to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// ── Dashboard Routes ──────────────────────────────────────
// Get dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// Get recent activity feed
router.get('/dashboard/activity', getRecentActivity);

// Get analytics data for charts
router.get('/dashboard/analytics', getAnalytics);

// ── User Management Routes ────────────────────────────────
// Get all users
router.get('/users', getAllUsers);

// Get single user detail
router.get('/users/:id', getUserDetail);

// Block or unblock user
router.put('/users/:id/block', toggleBlockUser);

// Change user role
router.put('/users/:id/role', changeUserRole);

// Delete user
router.delete('/users/:id', deleteUser);

export default router;