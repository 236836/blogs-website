import Like from '../models/Like.model.js';
import Blog from '../models/Blog.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// @route   POST /api/likes/blog/:blogId
// @desc    Toggle like on a blog
//          If already liked → removes like
//          If not liked → adds like
// @access  Private (logged in users only)
// ─────────────────────────────────────────────────────────
export const toggleLike = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user._id;

        // Step 1: Check if blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return errorResponse(res, 404, 'Blog not found');
        }

        // Step 2: Check if user already liked this blog
        const existingLike = await Like.findOne({
            user: userId,
            blog: blogId
        });

        if (existingLike) {
            // User already liked → UNLIKE (remove the like)
            await Like.findByIdAndDelete(existingLike._id);

            // Decrease like count on blog by 1
            await Blog.findByIdAndUpdate(
                blogId,
                { $inc: { likesCount: -1 } }
            );

            return successResponse(
                res,
                200,
                'Blog unliked successfully',
                { liked: false }
            );
        } else {
            // User has not liked → LIKE (add new like)
            await Like.create({
                user: userId,
                blog: blogId
            });

            // Increase like count on blog by 1
            await Blog.findByIdAndUpdate(
                blogId,
                { $inc: { likesCount: 1 } }
            );

            return successResponse(
                res,
                200,
                'Blog liked successfully',
                { liked: true }
            );
        }

    } catch (error) {
        console.error('ToggleLike Error:', error.message);
        return errorResponse(res, 500, 'Failed to toggle like');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/likes/blog/:blogId
// @desc    Get like status and count for a blog
// @access  Public (but checks user like status if logged in)
// ─────────────────────────────────────────────────────────
export const getBlogLikeStatus = async (req, res) => {
    try {
        const { blogId } = req.params;

        // Check if blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return errorResponse(res, 404, 'Blog not found');
        }

        // Get total like count
        const likesCount = await Like.countDocuments({
            blog: blogId
        });

        // Check if current user has liked
        // req.user may or may not exist
        // because this route can be accessed without login
        let userLiked = false;

        if (req.user) {
            const existingLike = await Like.findOne({
                user: req.user._id,
                blog: blogId
            });
            userLiked = !!existingLike;
            // !! converts to true/false
        }

        return successResponse(
            res,
            200,
            'Like status fetched successfully',
            {
                likesCount,
                userLiked
            }
        );

    } catch (error) {
        console.error('GetBlogLikeStatus Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch like status');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/likes/user/liked
// @desc    Get all blogs liked by current user
// @access  Private (logged in users only)
// ─────────────────────────────────────────────────────────
export const getUserLikedBlogs = async (req, res) => {
    try {
        const userId = req.user._id;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get all likes by this user
        const likes = await Like.find({ user: userId })
            .populate({
                path: 'blog',
                populate: [
                    {
                        path: 'author',
                        select: 'name username avatar'
                    },
                    {
                        path: 'category',
                        select: 'name slug icon'
                    }
                ]
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Extract blog data from likes
        // Some blogs may have been deleted so filter null
        const blogs = likes
            .filter((like) => like.blog !== null)
            .map((like) => like.blog);

        // Total count
        const totalLikes = await Like.countDocuments({
            user: userId
        });
        const totalPages = Math.ceil(totalLikes / limit);

        return successResponse(
            res,
            200,
            'Liked blogs fetched successfully',
            { blogs },
            {
                currentPage: page,
                totalPages,
                totalItems: totalLikes,
                limit
            }
        );

    } catch (error) {
        console.error('GetUserLikedBlogs Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch liked blogs');
    }
};