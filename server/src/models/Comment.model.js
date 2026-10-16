import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required: [true, 'Blog reference is required']
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author is required']
        },

        content: {
            type: String,
            required: [true, 'Comment content is required'],
            maxlength: [1000, 'Comment cannot exceed 1000 characters']
        },

        // For threaded replies
        // null means this is a root level comment
        // ObjectId means this is a reply to another comment
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null
        },

        // Array of reply comment IDs
        replies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ],

        // Admin moderation fields
        isApproved: {
            type: Boolean,
            default: true
        },

        isHidden: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;