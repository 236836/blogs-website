// Error middleware - Handle all errors globally

import { errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// Global Error Handler
// This catches ALL errors from any controller
// Must be added LAST in app.js
// Has 4 parameters: err, req, res, next
// ─────────────────────────────────────────────────────────
const errorMiddleware = (err, req, res, next) => {
    // Log error for debugging
    console.error('❌ Error:', err.message);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose Duplicate Key Error
    // Example: Email already exists
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
        statusCode = 400;
    }

    // Mongoose Validation Error
    // Example: Required field missing
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(
            (val) => val.message
        );
        message = messages.join(', ');
        statusCode = 400;
    }

    // Mongoose Cast Error
    // Example: Invalid MongoDB ObjectId
    if (err.name === 'CastError') {
        message = `Invalid ${err.path}: ${err.value}`;
        statusCode = 400;
    }

    // JWT Invalid Error
    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token. Please login again';
        statusCode = 401;
    }

    // JWT Expired Error
    if (err.name === 'TokenExpiredError') {
        message = 'Token expired. Please login again';
        statusCode = 401;
    }

    return errorResponse(res, statusCode, message);
};

export default errorMiddleware;