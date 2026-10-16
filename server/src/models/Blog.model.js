import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Blog title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters']
        },

        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            trim: true,
            lowercase: true
        },

        content: {
            type: String,
            required: [true, 'Blog content is required']
        },

        excerpt: {
            type: String,
            maxlength: [500, 'Excerpt cannot exceed 500 characters'],
            default: ''
        },

        featuredImage: {
            type: String,
            default: ''
        },

        featuredImagePublicId: {
            type: String,
            default: ''
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author is required']
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required']
        },

        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag'
            }
        ],

        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft'
        },

        views: {
            type: Number,
            default: 0
        },

        likesCount: {
            type: Number,
            default: 0
        },

        commentsCount: {
            type: Number,
            default: 0
        },

        readingTime: {
            type: Number,
            default: 0
        },

        isFeatured: {
            type: Boolean,
            default: false
        },

        metaTitle: {
            type: String,
            default: ''
        },

        metaDescription: {
            type: String,
            default: ''
        },

        publishedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;