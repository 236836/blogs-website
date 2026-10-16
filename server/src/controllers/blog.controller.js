import Blog from '../models/Blog.model.js';
import Category from '../models/Category.model.js';
import Tag from '../models/Tag.model.js';
import generateSlug from '../utils/generateSlug.js';
import calculateReadingTime from '../utils/calculateReadingTime.js';
import { uploadImage, deleteImage } from '../utils/uploadToCloudinary.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─────────────────────────────────────────────────────────
// @route   POST /api/blogs
// @desc    Create new blog
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const createBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            excerpt,
            category,
            tags,
            status,
            isFeatured,
            metaTitle,
            metaDescription
        } = req.body;

        // Step 1: Validate required fields
        if (!title || title.trim() === '') {
            return errorResponse(res, 400, 'Blog title is required');
        }

        if (!content || content.trim() === '') {
            return errorResponse(res, 400, 'Blog content is required');
        }

        if (!category) {
            return errorResponse(res, 400, 'Category is required');
        }

        // Step 2: Check if category exists in database
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return errorResponse(res, 404, 'Category not found');
        }

        // Step 3: Generate unique slug from title
        // Example: "My First Blog" → "my-first-blog-4521"
        const slug = generateSlug(title);

        // Step 4: Calculate reading time
        // Based on average 200 words per minute
        const readingTime = calculateReadingTime(content);

        // Step 5: Handle featured image upload to Cloudinary
        let featuredImage = '';
        let featuredImagePublicId = '';

        if (req.file) {
            const uploaded = await uploadImage(
                req.file.buffer,
                'blog-images'
            );
            featuredImage = uploaded.url;
            featuredImagePublicId = uploaded.publicId;
        }

        // Step 6: Handle tags array
        // Tags can come as:
        // "tagId1,tagId2" (string) or ["tagId1","tagId2"] (array)
        let tagsArray = [];
        if (tags) {
            if (typeof tags === 'string') {
                tagsArray = tags.split(',').map((t) => t.trim());
            } else if (Array.isArray(tags)) {
                tagsArray = tags;
            }
        }

        // Step 7: Create blog in database
        const blog = await Blog.create({
            title,
            slug,
            content,
            excerpt: excerpt || '',
            featuredImage,
            featuredImagePublicId,
            author: req.user._id,
            category,
            tags: tagsArray,
            status: status || 'draft',
            readingTime,
            isFeatured: isFeatured || false,
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || excerpt || '',
            publishedAt: status === 'published' ? new Date() : null
        });

        // Step 8: Get populated blog for response
        const populatedBlog = await Blog.findById(blog._id)
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .populate('tags', 'name slug');

        return successResponse(
            res,
            201,
            'Blog created successfully',
            { blog: populatedBlog }
        );

    } catch (error) {
        console.error('CreateBlog Error:', error.message);
        return errorResponse(res, 500, 'Failed to create blog');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/blogs
// @desc    Get all published blogs
//          supports pagination, filter, sort, search
// @access  Public
// ─────────────────────────────────────────────────────────
export const getAllBlogs = async (req, res) => {
    try {
        // Get query params from URL
        // Example: /api/blogs?page=1&limit=10&sort=latest
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, category, tag, sort } = req.query;

        // Build filter object
        // Only show published blogs to public
        const filter = { status: 'published' };

        // Search filter
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            const categoryDoc = await Category.findOne({
                slug: category
            });
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            }
        }

        // Tag filter
        if (tag) {
            const tagDoc = await Tag.findOne({ slug: tag });
            if (tagDoc) {
                filter.tags = tagDoc._id;
            }
        }

        // Sort options
        // Default is latest first
        let sortOption = { createdAt: -1 };

        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'mostViewed') {
            sortOption = { views: -1 };
        } else if (sort === 'mostLiked') {
            sortOption = { likesCount: -1 };
        } else if (sort === 'latest') {
            sortOption = { createdAt: -1 };
        }

        // Get blogs from database
        const blogs = await Blog.find(filter)
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .populate('tags', 'name slug')
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalBlogs = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(totalBlogs / limit);

        return successResponse(
            res,
            200,
            'Blogs fetched successfully',
            { blogs },
            {
                currentPage: page,
                totalPages,
                totalItems: totalBlogs,
                limit
            }
        );

    } catch (error) {
        console.error('GetAllBlogs Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch blogs');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/blogs/featured
// @desc    Get featured blogs
// @access  Public
// ─────────────────────────────────────────────────────────
export const getFeaturedBlogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;

        const blogs = await Blog.find({
            status: 'published',
            isFeatured: true
        })
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .populate('tags', 'name slug')
            .sort({ createdAt: -1 })
            .limit(limit);

        return successResponse(
            res,
            200,
            'Featured blogs fetched successfully',
            { blogs }
        );

    } catch (error) {
        console.error('GetFeaturedBlogs Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch featured blogs');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/blogs/trending
// @desc    Get trending blogs by most views
// @access  Public
// ─────────────────────────────────────────────────────────
export const getTrendingBlogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;

        const blogs = await Blog.find({ status: 'published' })
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .populate('tags', 'name slug')
            .sort({ views: -1 })
            .limit(limit);

        return successResponse(
            res,
            200,
            'Trending blogs fetched successfully',
            { blogs }
        );

    } catch (error) {
        console.error('GetTrendingBlogs Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch trending blogs');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/blogs/latest
// @desc    Get latest published blogs
// @access  Public
// ─────────────────────────────────────────────────────────
export const getLatestBlogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;

        const blogs = await Blog.find({ status: 'published' })
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .populate('tags', 'name slug')
            .sort({ createdAt: -1 })
            .limit(limit);

        return successResponse(
            res,
            200,
            'Latest blogs fetched successfully',
            { blogs }
        );

    } catch (error) {
        console.error('GetLatestBlogs Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch latest blogs');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/blogs/search?q=query
// @desc    Search blogs by title, excerpt
// @access  Public
// ─────────────────────────────────────────────────────────
export const searchBlogs = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return errorResponse(res, 400, 'Search query is required');
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search in title and excerpt
        const filter = {
            status: 'published',
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { excerpt: { $regex: q, $options: 'i' } },
                { metaDescription: { $regex: q, $options: 'i' } }
            ]
        };

        const blogs = await Blog.find(filter)
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .populate('tags', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(totalBlogs / limit);

        return successResponse(
            res,
            200,
            'Search results fetched successfully',
            { blogs, query: q },
            {
                currentPage: page,
                totalPages,
                totalItems: totalBlogs,
                limit
            }
        );

    } catch (error) {
        console.error('SearchBlogs Error:', error.message);
        return errorResponse(res, 500, 'Search failed');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/blogs/admin/all
// @desc    Get all blogs including drafts for admin
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const getAdminBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, status, category } = req.query;

        // Build filter
        // Admin can see all blogs (published + draft)
        const filter = {};

        // Filter by status
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Search by title
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        // Filter by category
        if (category) {
            const categoryDoc = await Category.findOne({
                slug: category
            });
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            }
        }

        const blogs = await Blog.find(filter)
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .populate('tags', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(totalBlogs / limit);

        return successResponse(
            res,
            200,
            'Admin blogs fetched successfully',
            { blogs },
            {
                currentPage: page,
                totalPages,
                totalItems: totalBlogs,
                limit
            }
        );

    } catch (error) {
        console.error('GetAdminBlogs Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch blogs');
    }
};


// ─────────────────────────────────────────────────────────
// @route   GET /api/blogs/:slug
// @desc    Get single blog by slug
// @access  Public
// ─────────────────────────────────────────────────────────
export const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Find published blog by slug
        const blog = await Blog.findOne({
            slug,
            status: 'published'
        })
            .populate('author', 'name username avatar bio socialLinks')
            .populate('category', 'name slug icon')
            .populate('tags', 'name slug');

        if (!blog) {
            return errorResponse(res, 404, 'Blog not found');
        }

        // Get related blogs
        // Same category excluding current blog
        // Maximum 3 related blogs
        const relatedBlogs = await Blog.find({
            category: blog.category._id,
            status: 'published',
            _id: { $ne: blog._id }
        })
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .sort({ createdAt: -1 })
            .limit(3);

        return successResponse(
            res,
            200,
            'Blog fetched successfully',
            { blog, relatedBlogs }
        );

    } catch (error) {
        console.error('GetBlogBySlug Error:', error.message);
        return errorResponse(res, 500, 'Failed to fetch blog');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/blogs/:id/view
// @desc    Increment blog view count by 1
// @access  Public
// ─────────────────────────────────────────────────────────
export const incrementView = async (req, res) => {
    try {
        const { id } = req.params;

        // $inc increments the views field by 1
        await Blog.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } }
        );

        return successResponse(res, 200, 'View counted');

    } catch (error) {
        console.error('IncrementView Error:', error.message);
        return errorResponse(res, 500, 'Failed to count view');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/blogs/:id
// @desc    Update blog
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            content,
            excerpt,
            category,
            tags,
            status,
            isFeatured,
            metaTitle,
            metaDescription
        } = req.body;

        // Find blog by id
        const blog = await Blog.findById(id);

        if (!blog) {
            return errorResponse(res, 404, 'Blog not found');
        }

        // Update title and regenerate slug if title changed
        if (title) {
            blog.title = title;
            blog.slug = generateSlug(title);
        }

        // Update content and recalculate reading time
        if (content) {
            blog.content = content;
            blog.readingTime = calculateReadingTime(content);
        }

        // Update other fields
        if (excerpt !== undefined) blog.excerpt = excerpt;
        if (category) blog.category = category;
        if (metaTitle) blog.metaTitle = metaTitle;
        if (metaDescription) blog.metaDescription = metaDescription;
        if (isFeatured !== undefined) blog.isFeatured = isFeatured;

        // Update tags
        if (tags) {
            if (typeof tags === 'string') {
                blog.tags = tags.split(',').map((t) => t.trim());
            } else if (Array.isArray(tags)) {
                blog.tags = tags;
            }
        }

        // Handle status change
        if (status) {
            blog.status = status;
            // Set publishedAt date when first published
            if (status === 'published' && !blog.publishedAt) {
                blog.publishedAt = new Date();
            }
        }

        // Handle new featured image upload
        if (req.file) {
            // Delete old image from Cloudinary first
            if (blog.featuredImagePublicId) {
                await deleteImage(blog.featuredImagePublicId);
            }

            // Upload new image
            const uploaded = await uploadImage(
                req.file.buffer,
                'blog-images'
            );
            blog.featuredImage = uploaded.url;
            blog.featuredImagePublicId = uploaded.publicId;
        }

        // Save updated blog
        await blog.save();

        // Return populated blog
        const updatedBlog = await Blog.findById(blog._id)
            .populate('author', 'name username avatar')
            .populate('category', 'name slug icon')
            .populate('tags', 'name slug');

        return successResponse(
            res,
            200,
            'Blog updated successfully',
            { blog: updatedBlog }
        );

    } catch (error) {
        console.error('UpdateBlog Error:', error.message);
        return errorResponse(res, 500, 'Failed to update blog');
    }
};


// ─────────────────────────────────────────────────────────
// @route   DELETE /api/blogs/:id
// @desc    Delete blog permanently
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return errorResponse(res, 404, 'Blog not found');
        }

        // Delete featured image from Cloudinary
        if (blog.featuredImagePublicId) {
            await deleteImage(blog.featuredImagePublicId);
        }

        // Delete blog from database
        await Blog.findByIdAndDelete(id);

        return successResponse(res, 200, 'Blog deleted successfully');

    } catch (error) {
        console.error('DeleteBlog Error:', error.message);
        return errorResponse(res, 500, 'Failed to delete blog');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/blogs/:id/publish
// @desc    Publish a draft blog
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const publishBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return errorResponse(res, 404, 'Blog not found');
        }

        // Check if already published
        if (blog.status === 'published') {
            return errorResponse(res, 400, 'Blog is already published');
        }

        blog.status = 'published';
        blog.publishedAt = new Date();
        await blog.save();

        return successResponse(
            res,
            200,
            'Blog published successfully',
            { blog }
        );

    } catch (error) {
        console.error('PublishBlog Error:', error.message);
        return errorResponse(res, 500, 'Failed to publish blog');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/blogs/:id/draft
// @desc    Move published blog back to draft
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const draftBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return errorResponse(res, 404, 'Blog not found');
        }

        // Check if already draft
        if (blog.status === 'draft') {
            return errorResponse(res, 400, 'Blog is already in draft');
        }

        blog.status = 'draft';
        await blog.save();

        return successResponse(
            res,
            200,
            'Blog moved to draft',
            { blog }
        );

    } catch (error) {
        console.error('DraftBlog Error:', error.message);
        return errorResponse(res, 500, 'Failed to move blog to draft');
    }
};


// ─────────────────────────────────────────────────────────
// @route   PUT /api/blogs/:id/feature
// @desc    Toggle featured status of blog
// @access  Admin only
// ─────────────────────────────────────────────────────────
export const toggleFeatured = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return errorResponse(res, 404, 'Blog not found');
        }

        // Toggle: true becomes false, false becomes true
        blog.isFeatured = !blog.isFeatured;
        await blog.save();

        const message = blog.isFeatured
            ? 'Blog marked as featured'
            : 'Blog removed from featured';

        return successResponse(res, 200, message, { blog });

    } catch (error) {
        console.error('ToggleFeatured Error:', error.message);
        return errorResponse(res, 500, 'Failed to toggle featured');
    }
};