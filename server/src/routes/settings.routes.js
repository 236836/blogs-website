import express from 'express';
import {
    getSettings,
    updateSettings,
    updateLogo,
    updateFavicon,
    deleteLogo,
    deleteFavicon
} from '../controllers/settings.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import { uploadSingle } from '../middleware/upload.middleware.js';

const router = express.Router();

// ── Public Route ──────────────────────────────────────────
// Frontend needs this for navbar logo and site name
router.get('/', getSettings);

// ── Admin Routes ──────────────────────────────────────────

// Update text settings (site name, email, social links)
router.put(
    '/',
    authMiddleware,
    adminMiddleware,
    updateSettings
);

// Upload or change logo
router.put(
    '/logo',
    authMiddleware,
    adminMiddleware,
    uploadSingle,
    updateLogo
);

// Upload or change favicon
router.put(
    '/favicon',
    authMiddleware,
    adminMiddleware,
    uploadSingle,
    updateFavicon
);

// Delete logo
router.delete(
    '/logo',
    authMiddleware,
    adminMiddleware,
    deleteLogo
);

// Delete favicon
router.delete(
    '/favicon',
    authMiddleware,
    adminMiddleware,
    deleteFavicon
);

export default router;