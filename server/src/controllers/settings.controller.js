import Settings from '../models/Settings.model.js';
import { uploadImage, deleteImage } from '../utils/uploadToCloudinary.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// HELPER FUNCTION
// Settings is a SINGLE document in database
// If it does not exist we create it with default values
// This function is used by other functions below
// ─────────────────────────────────────────────────────────
const getOrCreateSettings = async () => {
    // Try to find existing settings
    let settings = await Settings.findOne();

    // If no settings exist create default one
    if (!settings) {
        settings = await Settings.create({
            siteName: 'BlogFlow',
            logo: '',
            logoPublicId: '',
            favicon: '',
            faviconPublicId: '',
            contactEmail: '',
            socialLinks: {
                twitter: '',
                facebook: '',
                instagram: '',
                linkedin: ''
            }
        });
    }

    return settings;
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/settings
// @desc    Get site settings
//          Public because frontend needs
//          logo, site name in navbar and footer
// @access  Public
// ─────────────────────────────────────────────────────────
export const getSettings = async (req, res) => {
    try {
        // Get settings or create if not exist
        const settings = await getOrCreateSettings();

        return successResponse(
            res,
            200,
            'Settings fetched successfully',
            { settings }
        );

    } catch (error) {
        console.error('GetSettings Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch settings');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/settings
// @desc    Update site settings text fields
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const updateSettings = async (req, res) => {
    try {
        const {
            siteName,
            contactEmail,
            socialLinks
        } = req.body;

        // Get existing settings
        const settings = await getOrCreateSettings();

        // Update site name
        if (siteName !== undefined) {
            if (siteName.trim() === '') {
                return errorResponse(
                    res,
                    400,
                    'Site name cannot be empty'
                );
            }
            settings.siteName = siteName;
        }

        // Update contact email
        if (contactEmail !== undefined) {
            // Validate email format if not empty
            if (contactEmail !== '') {
                const emailRegex = /^\S+@\S+\.\S+$/;
                if (!emailRegex.test(contactEmail)) {
                    return errorResponse(
                        res,
                        400,
                        'Please enter a valid contact email'
                    );
                }
            }
            settings.contactEmail = contactEmail;
        }

        // Update social links
        if (socialLinks) {
            if (socialLinks.twitter !== undefined) {
                settings.socialLinks.twitter = socialLinks.twitter;
            }
            if (socialLinks.facebook !== undefined) {
                settings.socialLinks.facebook = socialLinks.facebook;
            }
            if (socialLinks.instagram !== undefined) {
                settings.socialLinks.instagram = socialLinks.instagram;
            }
            if (socialLinks.linkedin !== undefined) {
                settings.socialLinks.linkedin = socialLinks.linkedin;
            }
        }

        // Save to database
        await settings.save();

        return successResponse(
            res,
            200,
            'Settings updated successfully',
            { settings }
        );

    } catch (error) {
        console.error('UpdateSettings Error:', error.message);
        return errorResponse(res, 500, 'Failed to update settings');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/settings/logo
// @desc    Upload or change site logo
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const updateLogo = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return errorResponse(
                res,
                400,
                'Please select a logo image to upload'
            );
        }

        // Get existing settings
        const settings = await getOrCreateSettings();

        // Delete old logo from Cloudinary if exists
        if (settings.logoPublicId) {
            await deleteImage(settings.logoPublicId);
        }

        // Upload new logo to Cloudinary
        const uploaded = await uploadImage(
            req.file.buffer,
            'site-settings'
        );

        // Save new logo url and publicId
        settings.logo = uploaded.url;
        settings.logoPublicId = uploaded.publicId;
        await settings.save();

        return successResponse(
            res,
            200,
            'Logo updated successfully',
            {
                logo: settings.logo,
                settings
            }
        );

    } catch (error) {
        console.error('UpdateLogo Error:', error.message);
        return errorResponse(res, 500, 'Failed to update logo');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/settings/favicon
// @desc    Upload or change site favicon
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const updateFavicon = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return errorResponse(
                res,
                400,
                'Please select a favicon image to upload'
            );
        }

        // Get existing settings
        const settings = await getOrCreateSettings();

        // Delete old favicon from Cloudinary if exists
        if (settings.faviconPublicId) {
            await deleteImage(settings.faviconPublicId);
        }

        // Upload new favicon to Cloudinary
        const uploaded = await uploadImage(
            req.file.buffer,
            'site-settings'
        );

        // Save new favicon url and publicId
        settings.favicon = uploaded.url;
        settings.faviconPublicId = uploaded.publicId;
        await settings.save();

        return successResponse(
            res,
            200,
            'Favicon updated successfully',
            {
                favicon: settings.favicon,
                settings
            }
        );

    } catch (error) {
        console.error('UpdateFavicon Error:', error.message);
        return errorResponse(res, 500, 'Failed to update favicon');
    }
};


// ─────────────────────────────────────────────────────────
// @route   DELETE /api/settings/logo
// @desc    Remove site logo
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const deleteLogo = async (req, res) => {
    try {
        const settings = await getOrCreateSettings();

        // Check if logo exists
        if (!settings.logo) {
            return errorResponse(res, 400, 'No logo to delete');
        }

        // Delete from Cloudinary
        if (settings.logoPublicId) {
            await deleteImage(settings.logoPublicId);
        }

        // Clear logo fields
        settings.logo = '';
        settings.logoPublicId = '';
        await settings.save();

        return successResponse(
            res,
            200,
            'Logo deleted successfully',
            { settings }
        );

    } catch (error) {
        console.error('DeleteLogo Error:', error.message);
        return errorResponse(res, 500, 'Failed to delete logo');
    }
};


// ─────────────────────────────────────────────────────────
// @route   DELETE /api/settings/favicon
// @desc    Remove site favicon
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const deleteFavicon = async (req, res) => {
    try {
        const settings = await getOrCreateSettings();

        // Check if favicon exists
        if (!settings.favicon) {
            return errorResponse(res, 400, 'No favicon to delete');
        }

        // Delete from Cloudinary
        if (settings.faviconPublicId) {
            await deleteImage(settings.faviconPublicId);
        }

        // Clear favicon fields
        settings.favicon = '';
        settings.faviconPublicId = '';
        await settings.save();

        return successResponse(
            res,
            200,
            'Favicon deleted successfully',
            { settings }
        );

    } catch (error) {
        console.error('DeleteFavicon Error:', error.message);
        return errorResponse(res, 500, 'Failed to delete favicon');
    }
};