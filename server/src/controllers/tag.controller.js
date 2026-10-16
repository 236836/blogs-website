import Tag from '../models/Tag.model.js';
import Blog from '../models/Blog.model.js';
import generateSlug from '../utils/generateSlug.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// @route   POST /api/tags
// @desc    Create new tag
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const createTag = async (req, res) => {
    try {
        const { name } = req.body;

        // Check name is provided
        if (!name || name.trim() === '') {
            return errorResponse(res, 400, 'Tag name is required');
        }

        // Check if tag already exists
        const exists = await Tag.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (exists) {
            return errorResponse(res, 400, 'Tag already exists');
        }

        // Generate slug from name
        const slug = generateSlug(name);

        // Create tag in database
        const tag = await Tag.create({ name, slug });

        return successResponse(
            res,
            201,
            'Tag created successfully',
            { tag }
        );

    } catch (error) {
        console.error('CreateTag Error:', error.message);
        return errorResponse(res, 500, 'Failed to create tag');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/tags
// @desc    Get all tags with blog count
// @access  Public
// ─────────────────────────────────────────────────────────
export const getAllTags = async (req, res) => {
    try {
        // Get all tags sorted A to Z
        const tags = await Tag.find().sort({ name: 1 });

        // For each tag count how many published blogs use it
        const tagsWithCount = await Promise.all(
            tags.map(async (tag) => {
                const blogCount = await Blog.countDocuments({
                    tags: tag._id,
                    status: 'published'
                });

                return {
                    ...tag.toObject(),
                    blogCount
                };
            })
        );

        return successResponse(
            res,
            200,
            'Tags fetched successfully',
            { tags: tagsWithCount }
        );

    } catch (error) {
        console.error('GetAllTags Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch tags');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/tags/:slug
// @desc    Get single tag with its blogs
// @access  Public
// ─────────────────────────────────────────────────────────
export const getTagBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Find tag by slug
        const tag = await Tag.findOne({ slug });

        if (!tag) {
            return errorResponse(res, 404, 'Tag not found');
        }

        // Pagination setup
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get published blogs with this tag
        const blogs = await Blog.find({
            tags: tag._id,
            status: 'published'
        })
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .populate('tags', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Total count for pagination
        const totalBlogs = await Blog.countDocuments({
            tags: tag._id,
            status: 'published'
        });

        const totalPages = Math.ceil(totalBlogs / limit);

        return successResponse(
            res,
            200,
            'Tag fetched successfully',
            { tag, blogs },
            {
                currentPage: page,
                totalPages,
                totalItems: totalBlogs,
                limit
            }
        );

    } catch (error) {
        console.error('GetTagBySlug Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch tag');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/tags/:id
// @desc    Update tag
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Find tag
        const tag = await Tag.findById(id);

        if (!tag) {
            return errorResponse(res, 404, 'Tag not found');
        }

        // If name is changing check if
        // new name already exists in another tag
        if (name && name !== tag.name) {
            const exists = await Tag.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: id }
            });

            if (exists) {
                return errorResponse(
                    res,
                    400,
                    'Tag name already exists'
                );
            }

            // Update name and generate new slug
            tag.name = name;
            tag.slug = generateSlug(name);
        }

        // Save to database
        await tag.save();

        return successResponse(
            res,
            200,
            'Tag updated successfully',
            { tag }
        );

    } catch (error) {
        console.error('UpdateTag Error:', error.message);
        return errorResponse(res, 500, 'Failed to update tag');
    }
};


// ─────────────────────────────────────────────────────────
// @route   DELETE /api/tags/:id
// @desc    Delete tag
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;

        // Find tag
        const tag = await Tag.findById(id);

        if (!tag) {
            return errorResponse(res, 404, 'Tag not found');
        }

        // Check if any blogs are using this tag
        const blogsCount = await Blog.countDocuments({ tags: id });

        if (blogsCount > 0) {
            return errorResponse(
                res,
                400,
                `Cannot delete. ${blogsCount} blog(s) are using this tag. Please remove it from blogs first`
            );
        }

        // Delete tag
        await Tag.findByIdAndDelete(id);

        return successResponse(
            res,
            200,
            'Tag deleted successfully'
        );

    } catch (error) {
        console.error('DeleteTag Error:', error.message);
        return errorResponse(res, 500, 'Failed to delete tag');
    }
};