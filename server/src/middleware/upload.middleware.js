// Upload middleware - Handle file uploads (Multer)

import multer from 'multer';
import path from 'path';
import { errorResponse } from '../utils/apiResponse.js';

// Store file in memory temporarily
// Then we upload from memory buffer to Cloudinary
const storage = multer.memoryStorage();

// Only allow image files
const fileFilter = (req, file, cb) => {
    // Allowed image types
    const allowedTypes = /jpeg|jpg|png|gif|webp/;

    // Check file extension
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    // Check mime type
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        // Accept the file
        cb(null, true);
    } else {
        // Reject the file
        cb(
            new Error(
                'Only image files are allowed (jpeg, jpg, png, gif, webp)'
            )
        );
    }
};

// Create multer upload instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

// ─────────────────────────────────────────────────────────
// Single image upload
// Field name must be "image" in the form
// ─────────────────────────────────────────────────────────
export const uploadSingle = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return errorResponse(
                    res,
                    400,
                    'File too large. Maximum size is 5MB'
                );
            }
            return errorResponse(res, 400, err.message);
        } else if (err) {
            return errorResponse(res, 400, err.message);
        }
        next();
    });
};

// ─────────────────────────────────────────────────────────
// Multiple images upload (max 5)
// Field name must be "images" in the form
// ─────────────────────────────────────────────────────────
export const uploadMultiple = (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return errorResponse(
                    res,
                    400,
                    'File too large. Maximum size is 5MB'
                );
            }
            return errorResponse(res, 400, err.message);
        } else if (err) {
            return errorResponse(res, 400, err.message);
        }
        next();
    });
};

// ─────────────────────────────────────────────────────────
// Settings assets upload
// Handles logo and favicon fields
// ─────────────────────────────────────────────────────────
export const uploadSettingsAssets = (req, res, next) => {
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'favicon', maxCount: 1 }
    ])(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return errorResponse(
                    res,
                    400,
                    'File too large. Maximum size is 5MB'
                );
            }
            return errorResponse(res, 400, err.message);
        } else if (err) {
            return errorResponse(res, 400, err.message);
        }
        next();
    });
};