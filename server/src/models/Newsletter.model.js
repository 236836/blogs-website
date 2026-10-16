import mongoose from 'mongoose';

// ─────────────────────────────────────────────────────────
// Newsletter Model
// Stores email subscribers
// Tracks subscription and unsubscription
// ─────────────────────────────────────────────────────────
const newsletterSchema = new mongoose.Schema(
    {
        // Subscriber email
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true
        },

        // Is currently subscribed or not
        isSubscribed: {
            type: Boolean,
            default: true
        },

        // When they subscribed
        subscribedAt: {
            type: Date,
            default: Date.now
        },

        // When they unsubscribed (null if still subscribed)
        unsubscribedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;