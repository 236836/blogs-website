import Comment from '../models/Comment.model.js';
import Blog from '../models/Blog.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// @route   POST /api/comments/blog/:blogId
// @desc    Add a new comment on a blog
// @access  Private (logged in users only)
// ─────────────────────────────────────────────────────────
export const addComment = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { content } = req.body;

        // Step 1: Validate content
        if (!content || content.trim() === '') {
            return errorResponse(res, 400, 'Comment content is required');
        }

        // Step 2: Check if blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return errorResponse(res, 404, 'Blog not found');
        }

        // Step 3: Create comment
        const comment = await Comment.create({
            blog: blogId,
            author: req.user._id,
            content,
            parentComment: null  // null means this is a root comment
        });

        // Step 4: Increment blog comment count
        await Blog.findByIdAndUpdate(
            blogId,
            { $inc: { commentsCount: 1 } }
        );

        // Step 5: Populate author info for response
        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'name username avatar');

        return successResponse(
            res,
            201,
            'Comment added successfully',
            { comment: populatedComment }
        );

    } catch (error) {
        console.error('AddComment Error:', error.message);
        return errorResponse(res, 500, 'Failed to add comment');
    }
};


// ─────────────────────────────────────────────────────────
// @route   POST /api/comments/:id/reply
// @desc    Reply to an existing comment
// @access  Private (logged in users only)
// ─────────────────────────────────────────────────────────
export const replyToComment = async (req, res) => {
    try {
        const { id } = req.params; // parent comment id
        const { content } = req.body;

        // Step 1: Validate content
        if (!content || content.trim() === '') {
            return errorResponse(res, 400, 'Reply content is required');
        }

        // Step 2: Find parent comment
        const parentComment = await Comment.findById(id);
        if (!parentComment) {
            return errorResponse(res, 404, 'Comment not found');
        }

        // Step 3: Create reply comment
        // parentComment field links it to parent
        const reply = await Comment.create({
            blog: parentComment.blog,
            author: req.user._id,
            content,
            parentComment: id
        });

        // Step 4: Add reply id to parent comment's replies array
        await Comment.findByIdAndUpdate(
            id,
            { $push: { replies: reply._id } }
        );

        // Step 5: Increment blog comment count
        await Blog.findByIdAndUpdate(
            parentComment.blog,
            { $inc: { commentsCount: 1 } }
        );

        // Step 6: Populate author for response
        const populatedReply = await Comment.findById(reply._id)
            .populate('author', 'name username avatar');

        return successResponse(
            res,
            201,
            'Reply added successfully',
            { reply: populatedReply }
        );

    } catch (error) {
        console.error('ReplyToComment Error:', error.message);
        return errorResponse(res, 500, 'Failed to add reply');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/comments/blog/:blogId
// @desc    Get all comments for a blog
// @access  Public
// ─────────────────────────────────────────────────────────
export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.params;

        // Check if blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return errorResponse(res, 404, 'Blog not found');
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get root comments only
        // parentComment: null means it is a root comment
        // not a reply
        const comments = await Comment.find({
            blog: blogId,
            parentComment: null,
            isHidden: false
        })
            .populate('author', 'name username avatar')
            .populate({
                path: 'replies',
                match: { isHidden: false },
                populate: {
                    path: 'author',
                    select: 'name username avatar'
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Total root comments count
        const totalComments = await Comment.countDocuments({
            blog: blogId,
            parentComment: null,
            isHidden: false
        });

        const totalPages = Math.ceil(totalComments / limit);

        return successResponse(
            res,
            200,
            'Comments fetched successfully',
            { comments },
            {
                currentPage: page,
                totalPages,
                totalItems: totalComments,
                limit
            }
        );

    } catch (error) {
        console.error('GetBlogComments Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch comments');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/comments/:id
// @desc    Edit own comment
// @access  Private (comment owner only)
// ─────────────────────────────────────────────────────────
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        // Validate content
        if (!content || content.trim() === '') {
            return errorResponse(res, 400, 'Comment content is required');
        }

        // Find comment
        const comment = await Comment.findById(id);

        if (!comment) {
            return errorResponse(res, 404, 'Comment not found');
        }

        // Check if user owns this comment
        // Only comment author can edit it
        if (comment.author.toString() !== req.user._id.toString()) {
            return errorResponse(
                res,
                403,
                'You can only edit your own comments'
            );
        }

        // Update comment content
        comment.content = content;
        await comment.save();

        // Populate author for response
        const updatedComment = await Comment.findById(id)
            .populate('author', 'name username avatar');

        return successResponse(
            res,
            200,
            'Comment updated successfully',
            { comment: updatedComment }
        );

    } catch (error) {
        console.error('UpdateComment Error:', error.message);
        return errorResponse(res, 500, 'Failed to update comment');
    }
};


// ─────────────────────────────────────────────────────────
// @route   DELETE /api/comments/:id
// @desc    Delete comment (owner or admin)
// @access  Private (comment owner or admin)
// ─────────────────────────────────────────────────────────
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        // Find comment
        const comment = await Comment.findById(id);

        if (!comment) {
            return errorResponse(res, 404, 'Comment not found');
        }

        // Check permission
        // Only comment owner or admin can delete
        const isOwner = comment.author.toString() ===
            req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return errorResponse(
                res,
                403,
                'You can only delete your own comments'
            );
        }

        // If this is a root comment
        // also delete all its replies
        if (!comment.parentComment) {
            // Delete all replies of this comment
            await Comment.deleteMany({
                parentComment: id
            });

            // Reduce blog comment count
            // by number of replies + 1 (the comment itself)
            const repliesCount = comment.replies.length;
            await Blog.findByIdAndUpdate(
                comment.blog,
                { $inc: { commentsCount: -(repliesCount + 1) } }
            );
        } else {
            // This is a reply
            // Remove it from parent comment's replies array
            await Comment.findByIdAndUpdate(
                comment.parentComment,
                { $pull: { replies: id } }
            );

            // Reduce blog comment count by 1
            await Blog.findByIdAndUpdate(
                comment.blog,
                { $inc: { commentsCount: -1 } }
            );
        }

        // Delete the comment
        await Comment.findByIdAndDelete(id);

        return successResponse(
            res,
            200,
            'Comment deleted successfully'
        );

    } catch (error) {
        console.error('DeleteComment Error:', error.message);
        return errorResponse(res, 500, 'Failed to delete comment');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/comments/admin/all
// @desc    Get all comments for admin moderation
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const getAdminComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { status } = req.query;

        // Build filter
        const filter = {};

        // Filter by status
        if (status === 'hidden') {
            filter.isHidden = true;
        } else if (status === 'visible') {
            filter.isHidden = false;
        }

        // Get all comments (admin sees everything)
        const comments = await Comment.find(filter)
            .populate('author', 'name username avatar email')
            .populate('blog', 'title slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalComments = await Comment.countDocuments(filter);
        const totalPages = Math.ceil(totalComments / limit);

        return successResponse(
            res,
            200,
            'Comments fetched successfully',
            { comments },
            {
                currentPage: page,
                totalPages,
                totalItems: totalComments,
                limit
            }
        );

    } catch (error) {
        console.error('GetAdminComments Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch comments');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/comments/:id/hide
// @desc    Hide a comment (admin moderation)
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const hideComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return errorResponse(res, 404, 'Comment not found');
        }

        // Toggle hide status
        comment.isHidden = !comment.isHidden;
        await comment.save();

        const message = comment.isHidden
            ? 'Comment hidden successfully'
            : 'Comment visible again';

        return successResponse(
            res,
            200,
            message,
            { comment }
        );

    } catch (error) {
        console.error('HideComment Error:', error.message);
        return errorResponse(res, 500, 'Failed to hide comment');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/comments/:id/approve
// @desc    Approve a comment (admin moderation)
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const approveComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return errorResponse(res, 404, 'Comment not found');
        }

        comment.isApproved = true;
        comment.isHidden = false;
        await comment.save();

        return successResponse(
            res,
            200,
            'Comment approved successfully',
            { comment }
        );

    } catch (error) {
        console.error('ApproveComment Error:', error.message);
        return errorResponse(res, 500, 'Failed to approve comment');
    }
};