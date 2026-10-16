// Admin middleware - Check if user is admin

import { errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// Check if logged in user is an admin
// This ALWAYS runs AFTER authMiddleware
// So req.user is already available here
// ─────────────────────────────────────────────────────────
const adminMiddleware = (req, res, next) => {
    // req.user is set by authMiddleware
    if (!req.user) {
        return errorResponse(
            res,
            401,
            'Please login to continue'
        );
    }

    // Check if user role is admin
    if (req.user.role !== 'admin') {
        return errorResponse(
            res,
            403,
            'Access denied. Admin privileges required'
        );
    }

    // User is admin, allow to proceed
    next();
};

export default adminMiddleware;