import Category from '../models/Category.model.js';
import Blog from '../models/Blog.model.js';
import generateSlug from '../utils/generateSlug.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// @route   POST /api/categories
// @desc    Create new category
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const createCategory = async (req, res) => {
    try {
        const { name, description, icon } = req.body;

        // Check name is provided
        if (!name || name.trim() === '') {
            return errorResponse(res, 400, 'Category name is required');
        }

        // Check if category already exists
        // $regex with i flag = case insensitive
        // So "javascript" and "JavaScript" are treated as same
        const exists = await Category.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (exists) {
            return errorResponse(res, 400, 'Category already exists');
        }

        // Generate slug from name
        // Example: "JavaScript Tips" → "javascript-tips-4521"
        const slug = generateSlug(name);

        // Create category in database
        const category = await Category.create({
            name,
            slug,
            description: description || '',
            icon: icon || '📁'
        });

        return successResponse(
            res,
            201,
            'Category created successfully',
            { category }
        );

    } catch (error) {
        console.error('CreateCategory Error:', error.message);
        return errorResponse(res, 500, 'Failed to create category');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/categories
// @desc    Get all categories with blog count
// @access  Public
// ─────────────────────────────────────────────────────────
export const getAllCategories = async (req, res) => {
    try {
        // Get all categories sorted A to Z
        const categories = await Category.find().sort({ name: 1 });

        // For each category count how many
        // published blogs it has
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const blogCount = await Blog.countDocuments({
                    category: category._id,
                    status: 'published'
                });

                // Return category data + blog count
                return {
                    ...category.toObject(),
                    blogCount
                };
            })
        );

        return successResponse(
            res,
            200,
            'Categories fetched successfully',
            { categories: categoriesWithCount }
        );

    } catch (error) {
        console.error('GetAllCategories Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch categories');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/categories/:slug
// @desc    Get single category with its blogs
// @access  Public
// ─────────────────────────────────────────────────────────
export const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Find category by slug
        const category = await Category.findOne({ slug });

        if (!category) {
            return errorResponse(res, 404, 'Category not found');
        }

        // Pagination setup
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get all published blogs in this category
        const blogs = await Blog.find({
            category: category._id,
            status: 'published'
        })
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .populate('tags', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Total blog count for pagination
        const totalBlogs = await Blog.countDocuments({
            category: category._id,
            status: 'published'
        });

        const totalPages = Math.ceil(totalBlogs / limit);

        return successResponse(
            res,
            200,
            'Category fetched successfully',
            { category, blogs },
            {
                currentPage: page,
                totalPages,
                totalItems: totalBlogs,
                limit
            }
        );

    } catch (error) {
        console.error('GetCategoryBySlug Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch category');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, icon } = req.body;

        // Find category by id
        const category = await Category.findById(id);

        if (!category) {
            return errorResponse(res, 404, 'Category not found');
        }

        // If name is changing check if
        // new name already exists in another category
        if (name && name !== category.name) {
            const exists = await Category.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                // $ne = not equal
                // Exclude current category from check
                _id: { $ne: id }
            });

            if (exists) {
                return errorResponse(
                    res,
                    400,
                    'Category name already exists'
                );
            }

            // Update name and generate new slug
            category.name = name;
            category.slug = generateSlug(name);
        }

        // Update other fields if provided
        if (description !== undefined) category.description = description;
        if (icon) category.icon = icon;

        // Save to database
        await category.save();

        return successResponse(
            res,
            200,
            'Category updated successfully',
            { category }
        );

    } catch (error) {
        console.error('UpdateCategory Error:', error.message);
        return errorResponse(res, 500, 'Failed to update category');
    }
};


// ─────────────────────────────────────────────────────────
// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Find category
        const category = await Category.findById(id);

        if (!category) {
            return errorResponse(res, 404, 'Category not found');
        }

        // Check if any blogs are using this category
        // Cannot delete if blogs exist with this category
        const blogsCount = await Blog.countDocuments({
            category: id
        });

        if (blogsCount > 0) {
            return errorResponse(
                res,
                400,
                `Cannot delete. ${blogsCount} blog(s) are using this category. Please reassign them first`
            );
        }

        // Delete category
        await Category.findByIdAndDelete(id);

        return successResponse(
            res,
            200,
            'Category deleted successfully'
        );

    } catch (error) {
        console.error('DeleteCategory Error:', error.message);
        return errorResponse(res, 500, 'Failed to delete category');
    }
};