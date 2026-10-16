import mongoose from 'mongoose';

// ─────────────────────────────────────────────────────────
// Like Model
// Tracks which user liked which blog
// One user can like one blog only once
// When user likes again it removes the like (toggle)
// ─────────────────────────────────────────────────────────
const likeSchema = new mongoose.Schema(
    {
        // Which user liked
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        },

        // Which blog was liked
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
// Prevents same user from liking same blog twice
// If user tries to like again it will throw duplicate error
// We catch this error and toggle the like instead
// ─────────────────────────────────────────────────────────
likeSchema.index({ user: 1, blog: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;