import mongoose from 'mongoose';

// ─────────────────────────────────────────────────────────
// Settings Model
// Stores site-wide configuration
// Only ONE settings document exists at a time
// Admin can update it from the dashboard
// ─────────────────────────────────────────────────────────
const settingsSchema = new mongoose.Schema(
    {
        // Site name shown in header and browser tab
        siteName: {
            type: String,
            default: 'BlogFlow',
            trim: true
        },

        // Site logo image URL from Cloudinary
        logo: {
            type: String,
            default: ''
        },

        // Cloudinary public ID for logo
        // Needed to delete old logo when new one is uploaded
        logoPublicId: {
            type: String,
            default: ''
        },

        // Site favicon image URL from Cloudinary
        favicon: {
            type: String,
            default: ''
        },

        // Cloudinary public ID for favicon
        faviconPublicId: {
            type: String,
            default: ''
        },

        // Contact email shown on site
        contactEmail: {
            type: String,
            default: '',
            trim: true,
            lowercase: true
        },

        // Social media links
        socialLinks: {
            twitter: {
                type: String,
                default: ''
            },
            facebook: {
                type: String,
                default: ''
            },
            instagram: {
                type: String,
                default: ''
            },
            linkedin: {
                type: String,
                default: ''
            }
        }
    },
    {
        timestamps: true
    }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;