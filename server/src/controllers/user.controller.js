import User from '../models/User.model.js';
import Blog from '../models/Blog.model.js';
import Comment from '../models/Comment.model.js';
import Like from '../models/Like.model.js';
import Bookmark from '../models/Bookmark.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// @route   GET /api/users/profile/:username
// @desc    Get public user profile
//          Anyone can see basic profile of any user
// @access  Public
// ─────────────────────────────────────────────────────────
export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;

        // Find user by username
        // Only select public fields
        // Do NOT include email, password etc
        const user = await User.findOne({ username }).select(
            'name username avatar bio socialLinks role createdAt'
        );

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        // Get user stats
        // Count how many published blogs this user wrote
        const totalBlogs = await Blog.countDocuments({
            author: user._id,
            status: 'published'
        });

        // Count total comments by this user
        const totalComments = await Comment.countDocuments({
            author: user._id
        });

        // Count total likes received on all their blogs
        const userBlogs = await Blog.find({
            author: user._id
        }).select('_id');

        const blogIds = userBlogs.map((blog) => blog._id);

        const totalLikesReceived = await Like.countDocuments({
            blog: { $in: blogIds }
        });

        return successResponse(
            res,
            200,
            'User profile fetched successfully',
            {
                user,
                stats: {
                    totalBlogs,
                    totalComments,
                    totalLikesReceived
                }
            }
        );

    } catch (error) {
        console.error('GetUserProfile Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch user profile');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/users/profile/:username/blogs
// @desc    Get all published blogs by a specific user
// @access  Public
// ─────────────────────────────────────────────────────────
export const getUserBlogs = async (req, res) => {
    try {
        const { username } = req.params;

        // Find user
        const user = await User.findOne({ username });

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get published blogs by this user
        const blogs = await Blog.find({
            author: user._id,
            status: 'published'
        })
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .populate('tags', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Total count
        const totalBlogs = await Blog.countDocuments({
            author: user._id,
            status: 'published'
        });
        const totalPages = Math.ceil(totalBlogs / limit);

        return successResponse(
            res,
            200,
            'User blogs fetched successfully',
            { blogs },
            {
                currentPage: page,
                totalPages,
                totalItems: totalBlogs,
                limit
            }
        );

    } catch (error) {
        console.error('GetUserBlogs Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch user blogs');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/users/comments/history
// @desc    Get comment history of logged in user
// @access  Private (logged in user only)
// ─────────────────────────────────────────────────────────
export const getCommentHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get all comments by this user
        const comments = await Comment.find({ author: userId })
            .populate('blog', 'title slug featuredImage')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Total count
        const totalComments = await Comment.countDocuments({
            author: userId
        });
        const totalPages = Math.ceil(totalComments / limit);

        return successResponse(
            res,
            200,
            'Comment history fetched successfully',
            { comments },
            {
                currentPage: page,
                totalPages,
                totalItems: totalComments,
                limit
            }
        );

    } catch (error) {
        console.error('GetCommentHistory Error:', error.message);
        return errorResponse(
            res,
            500,
            'Failed to fetch comment history'
        );
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/users/saved-blogs
// @desc    Get all bookmarked/saved blogs of logged in user
// @access  Private (logged in user only)
// ─────────────────────────────────────────────────────────
export const getSavedBlogs = async (req, res) => {
    try {
        const userId = req.user._id;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get bookmarks and populate blog data
        const bookmarks = await Bookmark.find({ user: userId })
            .populate({
                path: 'blog',
                match: { status: 'published' },
                populate: [
                    {
                        path: 'author',
                        select: 'name username avatar'
                    },
                    {
                        path: 'category',
                        select: 'name slug icon'
                    },
                    {
                        path: 'tags',
                        select: 'name slug'
                    }
                ]
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Filter out null blogs (deleted blogs)
        const blogs = bookmarks
            .filter((bookmark) => bookmark.blog !== null)
            .map((bookmark) => bookmark.blog);

        // Total count
        const totalBookmarks = await Bookmark.countDocuments({
            user: userId
        });
        const totalPages = Math.ceil(totalBookmarks / limit);

        return successResponse(
            res,
            200,
            'Saved blogs fetched successfully',
            { blogs },
            {
                currentPage: page,
                totalPages,
                totalItems: totalBookmarks,
                limit
            }
        );

    } catch (error) {
        console.error('GetSavedBlogs Error:', error.message);
        return errorResponse(
            res,
            500,
            'Failed to fetch saved blogs'
        );
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/users/liked-blogs
// @desc    Get all liked blogs of logged in user
// @access  Private (logged in user only)
// ─────────────────────────────────────────────────────────
export const getLikedBlogs = async (req, res) => {
    try {
        const userId = req.user._id;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get likes and populate blog data
        const likes = await Like.find({ user: userId })
            .populate({
                path: 'blog',
                match: { status: 'published' },
                populate: [
                    {
                        path: 'author',
                        select: 'name username avatar'
                    },
                    {
                        path: 'category',
                        select: 'name slug icon'
                    },
                    {
                        path: 'tags',
                        select: 'name slug'
                    }
                ]
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Filter out null blogs (deleted blogs)
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
        console.error('GetLikedBlogs Error:', error.message);
        return errorResponse(
            res,
            500,
            'Failed to fetch liked blogs'
        );
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
//          Includes all stats in one call
// @access  Private (logged in user only)
// ─────────────────────────────────────────────────────────
export const getUserDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        // Count saved blogs
        const savedCount = await Bookmark.countDocuments({
            user: userId
        });

        // Count liked blogs
        const likedCount = await Like.countDocuments({
            user: userId
        });

        // Count comments made
        const commentsCount = await Comment.countDocuments({
            author: userId
        });

        // Get recent comments (last 5)
        const recentComments = await Comment.find({
            author: userId
        })
            .populate('blog', 'title slug')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent liked blogs (last 5)
        const recentLikes = await Like.find({ user: userId })
            .populate({
                path: 'blog',
                select: 'title slug featuredImage',
                populate: {
                    path: 'author',
                    select: 'name username avatar'
                }
            })
            .sort({ createdAt: -1 })
            .limit(5);

        const recentLikedBlogs = recentLikes
            .filter((like) => like.blog !== null)
            .map((like) => like.blog);

        return successResponse(
            res,
            200,
            'User dashboard fetched successfully',
            {
                stats: {
                    savedBlogs: savedCount,
                    likedBlogs: likedCount,
                    totalComments: commentsCount
                },
                recentComments,
                recentLikedBlogs
            }
        );

    } catch (error) {
        console.error('GetUserDashboard Error:', error.message);
        return errorResponse(
            res,
            500,
            'Failed to fetch dashboard data'
        );
    }
};