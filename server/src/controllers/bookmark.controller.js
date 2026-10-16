import Bookmark from '../models/Bookmark.model.js';
import Blog from '../models/Blog.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// @route   POST /api/bookmarks/blog/:blogId
// @desc    Toggle bookmark on a blog
//          If already bookmarked → removes bookmark
//          If not bookmarked → adds bookmark
// @access  Private (logged in users only)
// ─────────────────────────────────────────────────────────
export const toggleBookmark = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user._id;

        // Step 1: Check if blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return errorResponse(res, 404, 'Blog not found');
        }

        // Step 2: Check if already bookmarked
        const existingBookmark = await Bookmark.findOne({
            user: userId,
            blog: blogId
        });

        if (existingBookmark) {
            // Already bookmarked → REMOVE bookmark
            await Bookmark.findByIdAndDelete(existingBookmark._id);

            return successResponse(
                res,
                200,
                'Bookmark removed successfully',
                { bookmarked: false }
            );
        } else {
            // Not bookmarked → ADD bookmark
            await Bookmark.create({
                user: userId,
                blog: blogId
            });

            return successResponse(
                res,
                200,
                'Blog bookmarked successfully',
                { bookmarked: true }
            );
        }

    } catch (error) {
        console.error('ToggleBookmark Error:', error.message);
        return errorResponse(res, 500, 'Failed to toggle bookmark');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/bookmarks
// @desc    Get all bookmarked blogs by current user
// @access  Private (logged in users only)
// ─────────────────────────────────────────────────────────
export const getUserBookmarks = async (req, res) => {
    try {
        const userId = req.user._id;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get all bookmarks by this user
        const bookmarks = await Bookmark.find({ user: userId })
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

        // Extract blog data from bookmarks
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
            'Bookmarked blogs fetched successfully',
            { blogs },
            {
                currentPage: page,
                totalPages,
                totalItems: totalBookmarks,
                limit
            }
        );

    } catch (error) {
        console.error('GetUserBookmarks Error:', error.message);
        return errorResponse(
            res,
            500,
            'Failed to fetch bookmarked blogs'
        );
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/bookmarks/blog/:blogId
// @desc    Check if a blog is bookmarked by current user
// @access  Private (logged in users only)
// ─────────────────────────────────────────────────────────
export const checkBookmarkStatus = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user._id;

        // Check if bookmark exists
        const existingBookmark = await Bookmark.findOne({
            user: userId,
            blog: blogId
        });

        return successResponse(
            res,
            200,
            'Bookmark status fetched successfully',
            {
                bookmarked: !!existingBookmark
                // !! converts to true if exists
                // false if null
            }
        );

    } catch (error) {
        console.error('CheckBookmarkStatus Error:', error.message);
        return errorResponse(
            res,
            500,
            'Failed to check bookmark status'
        );
    }
};