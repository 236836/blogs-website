import User from '../models/User.model.js';
import Blog from '../models/Blog.model.js';
import Comment from '../models/Comment.model.js';
import Like from '../models/Like.model.js';
import Bookmark from '../models/Bookmark.model.js';
import Newsletter from '../models/Newsletter.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// @route   GET /api/admin/dashboard/stats
// @desc    Get all dashboard statistics
//          Total blogs, users, comments, views etc
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
    try {
        // Count total blogs
        const totalBlogs = await Blog.countDocuments();

        // Count published blogs
        const publishedBlogs = await Blog.countDocuments({
            status: 'published'
        });

        // Count draft blogs
        const draftBlogs = await Blog.countDocuments({
            status: 'draft'
        });

        // Count total users
        const totalUsers = await User.countDocuments();

        // Count admin users
        const totalAdmins = await User.countDocuments({
            role: 'admin'
        });

        // Count total comments
        const totalComments = await Comment.countDocuments();

        // Count total likes
        const totalLikes = await Like.countDocuments();

        // Count total bookmarks
        const totalBookmarks = await Bookmark.countDocuments();

        // Count newsletter subscribers
        const totalSubscribers = await Newsletter.countDocuments({
            isSubscribed: true
        });

        // Calculate total views across all blogs
        const viewsResult = await Blog.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$views' }
                }
            }
        ]);

        const totalViews = viewsResult.length > 0
            ? viewsResult[0].totalViews
            : 0;

        // Get top 5 most viewed blogs
        const topViewedBlogs = await Blog.find({
            status: 'published'
        })
            .select('title slug views likesCount')
            .sort({ views: -1 })
            .limit(5);

        // Get top 5 most liked blogs
        const topLikedBlogs = await Blog.find({
            status: 'published'
        })
            .select('title slug views likesCount')
            .sort({ likesCount: -1 })
            .limit(5);

        return successResponse(
            res,
            200,
            'Dashboard stats fetched successfully',
            {
                stats: {
                    totalBlogs,
                    publishedBlogs,
                    draftBlogs,
                    totalUsers,
                    totalAdmins,
                    totalComments,
                    totalLikes,
                    totalBookmarks,
                    totalSubscribers,
                    totalViews
                },
                topViewedBlogs,
                topLikedBlogs
            }
        );

    } catch (error) {
        console.error('GetDashboardStats Error:', error.message);
        return errorResponse(
            res,
            500,
            'Failed to fetch dashboard stats'
        );
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/admin/dashboard/activity
// @desc    Get recent activity feed
//          Recent blogs, users, comments
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const getRecentActivity = async (req, res) => {
    try {
        // Get 5 most recent blogs
        const recentBlogs = await Blog.find()
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .select('title slug status createdAt author category')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get 5 most recent users
        const recentUsers = await User.find()
            .select('name username email avatar role createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get 5 most recent comments
        const recentComments = await Comment.find()
            .populate('author', 'name username avatar')
            .populate('blog', 'title slug')
            .select('content author blog isHidden createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get 5 most recent newsletter subscribers
        const recentSubscribers = await Newsletter.find()
            .select('email isSubscribed subscribedAt')
            .sort({ createdAt: -1 })
            .limit(5);

        return successResponse(
            res,
            200,
            'Recent activity fetched successfully',
            {
                recentBlogs,
                recentUsers,
                recentComments,
                recentSubscribers
            }
        );

    } catch (error) {
        console.error('GetRecentActivity Error:', error.message);
        return errorResponse(
            res,
            500,
            'Failed to fetch recent activity'
        );
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/admin/dashboard/analytics
// @desc    Get analytics data for charts
//          Blogs per month, users per month etc
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const getAnalytics = async (req, res) => {
    try {
        // Get blogs created per month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const blogsPerMonth = await Blog.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        // Get users registered per month (last 6 months)
        const usersPerMonth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        // Get blogs count per category
        const blogsPerCategory = await Blog.aggregate([
            {
                $match: { status: 'published' }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $project: {
                    categoryName: '$category.name',
                    categoryIcon: '$category.icon',
                    count: 1
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Get comments per month (last 6 months)
        const commentsPerMonth = await Comment.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        return successResponse(
            res,
            200,
            'Analytics data fetched successfully',
            {
                blogsPerMonth,
                usersPerMonth,
                blogsPerCategory,
                commentsPerMonth
            }
        );

    } catch (error) {
        console.error('GetAnalytics Error:', error.message);
        return errorResponse(
            res,
            500,
            'Failed to fetch analytics data'
        );
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/admin/users
// @desc    Get all users with search and pagination
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, role, status } = req.query;

        // Build filter
        const filter = {};

        // Search by name email or username
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by role
        if (role && role !== 'all') {
            filter.role = role;
        }

        // Filter by blocked status
        if (status === 'blocked') {
            filter.isBlocked = true;
        } else if (status === 'active') {
            filter.isBlocked = false;
        }

        // Get users
        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Total count
        const totalUsers = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalUsers / limit);

        return successResponse(
            res,
            200,
            'Users fetched successfully',
            { users },
            {
                currentPage: page,
                totalPages,
                totalItems: totalUsers,
                limit
            }
        );

    } catch (error) {
        console.error('GetAllUsers Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch users');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/admin/users/:id
// @desc    Get single user detail
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const getUserDetail = async (req, res) => {
    try {
        const { id } = req.params;

        // Find user
        const user = await User.findById(id).select('-password');

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        // Get user stats
        const totalBlogs = await Blog.countDocuments({
            author: id
        });

        const totalComments = await Comment.countDocuments({
            author: id
        });

        const totalLikes = await Like.countDocuments({
            user: id
        });

        const totalBookmarks = await Bookmark.countDocuments({
            user: id
        });

        // Get recent blogs by this user
        const recentBlogs = await Blog.find({ author: id })
            .select('title slug status createdAt views')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent comments by this user
        const recentComments = await Comment.find({ author: id })
            .populate('blog', 'title slug')
            .select('content blog createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        return successResponse(
            res,
            200,
            'User detail fetched successfully',
            {
                user,
                stats: {
                    totalBlogs,
                    totalComments,
                    totalLikes,
                    totalBookmarks
                },
                recentBlogs,
                recentComments
            }
        );

    } catch (error) {
        console.error('GetUserDetail Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch user detail');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/admin/users/:id/block
// @desc    Block or Unblock a user
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const toggleBlockUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find user
        const user = await User.findById(id);

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        // Cannot block yourself
        if (user._id.toString() === req.user._id.toString()) {
            return errorResponse(
                res,
                400,
                'You cannot block yourself'
            );
        }

        // Cannot block another admin
        if (user.role === 'admin') {
            return errorResponse(
                res,
                400,
                'You cannot block another admin'
            );
        }

        // Toggle block status
        user.isBlocked = !user.isBlocked;
        await user.save();

        const message = user.isBlocked
            ? 'User blocked successfully'
            : 'User unblocked successfully';

        return successResponse(
            res,
            200,
            message,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isBlocked: user.isBlocked
                }
            }
        );

    } catch (error) {
        console.error('ToggleBlockUser Error:', error.message);
        return errorResponse(res, 500, 'Failed to block/unblock user');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/admin/users/:id/role
// @desc    Change user role (user ↔ admin)
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const changeUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validate role
        if (!role || !['user', 'admin'].includes(role)) {
            return errorResponse(
                res,
                400,
                'Role must be either user or admin'
            );
        }

        // Find user
        const user = await User.findById(id);

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        // Cannot change your own role
        if (user._id.toString() === req.user._id.toString()) {
            return errorResponse(
                res,
                400,
                'You cannot change your own role'
            );
        }

        // Check if role is already same
        if (user.role === role) {
            return errorResponse(
                res,
                400,
                `User is already a ${role}`
            );
        }

        // Update role
        user.role = role;
        await user.save();

        return successResponse(
            res,
            200,
            `User role changed to ${role} successfully`,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        );

    } catch (error) {
        console.error('ChangeUserRole Error:', error.message);
        return errorResponse(res, 500, 'Failed to change user role');
    }
};


// ─────────────────────────────────────────────────────────
// @route   DELETE /api/admin/users/:id
// @desc    Delete a user and all their data
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find user
        const user = await User.findById(id);

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        // Cannot delete yourself
        if (user._id.toString() === req.user._id.toString()) {
            return errorResponse(
                res,
                400,
                'You cannot delete your own account'
            );
        }

        // Cannot delete another admin
        if (user.role === 'admin') {
            return errorResponse(
                res,
                400,
                'You cannot delete another admin'
            );
        }

        // Delete all user data

        // Delete user comments
        await Comment.deleteMany({ author: id });

        // Delete user likes
        await Like.deleteMany({ user: id });

        // Delete user bookmarks
        await Bookmark.deleteMany({ user: id });

        // Delete user account
        await User.findByIdAndDelete(id);

        return successResponse(
            res,
            200,
            'User and all their data deleted successfully'
        );

    } catch (error) {
        console.error('DeleteUser Error:', error.message);
        return errorResponse(res, 500, 'Failed to delete user');
    }
};