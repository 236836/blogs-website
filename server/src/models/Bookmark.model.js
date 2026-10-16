import mongoose from 'mongoose';

// ─────────────────────────────────────────────────────────
// Bookmark Model
// Tracks which user saved which blog
// One user can bookmark one blog only once
// When user bookmarks again it removes (toggle)
// ─────────────────────────────────────────────────────────
const bookmarkSchema = new mongoose.Schema(
    {
        // Which user bookmarked
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        },

        // Which blog was bookmarked
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required: [true, 'Blog is required']
        }
    },
    {
        timestamps: true
    }
);

// ─────────────────────────────────────────────────────────
// Compound Index
// Prevents same user from bookmarking same blog twice
// ─────────────────────────────────────────────────────────
bookmarkSchema.index({ user: 1, blog: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;