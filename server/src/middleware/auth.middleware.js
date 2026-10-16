// Auth middleware - Check if user is logged in (JWT verify)

import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// Check if user is logged in using JWT token
// This runs BEFORE any protected route controller
// ─────────────────────────────────────────────────────────
const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Check if Authorization header exists
        // Format: "Bearer eyJhbGci..."
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            // Extract token after "Bearer "
            token = req.headers.authorization.split(' ')[1];
        }

        // No token found
        if (!token) {
            return errorResponse(
                res,
                401,
                'Access denied. Please login to continue'
            );
        }

        // Verify the token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user from database using id inside token
        const user = await User.findById(decoded.id);

        // User not found in database
        if (!user) {
            return errorResponse(
                res,
                401,
                'User not found. Please login again'
            );
        }

        // User is blocked by admin
        if (user.isBlocked) {
            return errorResponse(
                res,
                403,
                'Your account has been blocked. Contact support'
            );
        }

        // Attach user to request object
        // Now any controller can access req.user
        req.user = user;

        // Move to next middleware or controller
        next();

    } catch (error) {
        // Token is invalid
        if (error.name === 'JsonWebTokenError') {
            return errorResponse(
                res,
                401,
                'Invalid token. Please login again'
            );
        }

        // Token has expired
        if (error.name === 'TokenExpiredError') {
            return errorResponse(
                res,
                401,
                'Token expired. Please login again'
            );
        }

        return errorResponse(res, 500, 'Authentication failed');
    }
};

export default authMiddleware;