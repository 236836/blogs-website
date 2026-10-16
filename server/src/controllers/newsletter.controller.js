import Newsletter from '../models/Newsletter.model.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public (anyone can subscribe)
// ─────────────────────────────────────────────────────────
export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        // Step 1: Validate email
        if (!email || email.trim() === '') {
            return errorResponse(res, 400, 'Email is required');
        }

        // Step 2: Check if email format is valid
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return errorResponse(
                res,
                400,
                'Please enter a valid email address'
            );
        }

        // Step 3: Check if email already subscribed
        const existing = await Newsletter.findOne({ email });

        if (existing) {
            // If was unsubscribed before
            // resubscribe them
            if (!existing.isSubscribed) {
                existing.isSubscribed = true;
                existing.subscribedAt = new Date();
                existing.unsubscribedAt = null;
                await existing.save();

                return successResponse(
                    res,
                    200,
                    'Welcome back! You have been resubscribed'
                );
            }

            // Already subscribed
            return errorResponse(
                res,
                400,
                'This email is already subscribed'
            );
        }

        // Step 4: Create new subscriber
        await Newsletter.create({
            email,
            isSubscribed: true,
            subscribedAt: new Date()
        });

        return successResponse(
            res,
            201,
            'Subscribed to newsletter successfully! Thank you'
        );

    } catch (error) {
        console.error('Subscribe Error:', error.message);
        return errorResponse(res, 500, 'Failed to subscribe');
    }
};


// ─────────────────────────────────────────────────────────
// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
// ─────────────────────────────────────────────────────────
export const unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        // Step 1: Validate email
        if (!email || email.trim() === '') {
            return errorResponse(res, 400, 'Email is required');
        }

        // Step 2: Find subscriber
        const subscriber = await Newsletter.findOne({ email });

        if (!subscriber) {
            return errorResponse(
                res,
                404,
                'This email is not subscribed'
            );
        }

        // Step 3: Check if already unsubscribed
        if (!subscriber.isSubscribed) {
            return errorResponse(
                res,
                400,
                'This email is already unsubscribed'
            );
        }

        // Step 4: Unsubscribe
        subscriber.isSubscribed = false;
        subscriber.unsubscribedAt = new Date();
        await subscriber.save();

        return successResponse(
            res,
            200,
            'Unsubscribed from newsletter successfully'
        );

    } catch (error) {
        console.error('Unsubscribe Error:', error.message);
        return errorResponse(res, 500, 'Failed to unsubscribe');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/newsletter
// @desc    Get all newsletter subscribers
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const getAllSubscribers = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { status, search } = req.query;

        // Build filter
        const filter = {};

        // Filter by status
        if (status === 'subscribed') {
            filter.isSubscribed = true;
        } else if (status === 'unsubscribed') {
            filter.isSubscribed = false;
        }

        // Search by email
        if (search) {
            filter.email = { $regex: search, $options: 'i' };
        }

        // Get subscribers
        const subscribers = await Newsletter.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Total count
        const totalSubscribers = await Newsletter.countDocuments(filter);
        const totalPages = Math.ceil(totalSubscribers / limit);

        // Get counts for stats
        const totalActive = await Newsletter.countDocuments({
            isSubscribed: true
        });
        const totalInactive = await Newsletter.countDocuments({
            isSubscribed: false
        });

        return successResponse(
            res,
            200,
            'Subscribers fetched successfully',
            {
                subscribers,
                stats: {
                    totalActive,
                    totalInactive,
                    total: totalActive + totalInactive
                }
            },
            {
                currentPage: page,
                totalPages,
                totalItems: totalSubscribers,
                limit
            }
        );

    } catch (error) {
        console.error('GetAllSubscribers Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch subscribers');
    }
};


// ─────────────────────────────────────────────────────────
// @route   DELETE /api/newsletter/:id
// @desc    Delete a subscriber
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;

        // Find subscriber
        const subscriber = await Newsletter.findById(id);

        if (!subscriber) {
            return errorResponse(res, 404, 'Subscriber not found');
        }

        // Delete subscriber
        await Newsletter.findByIdAndDelete(id);

        return successResponse(
            res,
            200,
            'Subscriber deleted successfully'
        );

    } catch (error) {
        console.error('DeleteSubscriber Error:', error.message);
        return errorResponse(res, 500, 'Failed to delete subscriber');
    }
};