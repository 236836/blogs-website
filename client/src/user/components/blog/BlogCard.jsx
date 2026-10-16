import { Link } from 'react-router-dom'
import {
    HiOutlineClock,
    HiOutlineEye,
    HiOutlineHeart
} from 'react-icons/hi'
import { formatDate } from '../../../utils/formatDate.js'
import { getReadingTime } from '../../../utils/readingTime.js'
import { truncateText } from '../../../utils/truncateText.js'
import Avatar from '../../../shared/components/ui/Avatar.jsx'
import Badge from '../../../shared/components/ui/Badge.jsx'

export default function BlogCard({ blog }) {
    if (!blog) return null

    return (
        <Link
            to={`/blog/${blog.slug}`}
            className="group bg-white dark:bg-gray-800
                       rounded-xl overflow-hidden shadow-sm
                       hover:shadow-lg transition-all duration-300
                       border border-gray-100 dark:border-gray-700
                       flex flex-col"
        >
            {/* Image */}
            <div className="relative overflow-hidden h-48">
                <img
                    src={blog.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400'}
                    alt={blog.title}
                    className="w-full h-full object-cover
                               group-hover:scale-105
                               transition-transform duration-500"
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <Badge variant="info">
                        {blog.category?.icon || '📁'}{' '}
                        {blog.category?.name || 'General'}
                    </Badge>
                </div>

                {/* Featured Badge */}
                {blog.isFeatured && (
                    <div className="absolute top-3 right-3">
                        <Badge variant="warning">
                            ⭐ Featured
                        </Badge>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">

                {/* Title */}
                <h3 className="font-bold text-gray-900 dark:text-white
                               mb-2 line-clamp-2
                               group-hover:text-indigo-600
                               dark:group-hover:text-indigo-400
                               transition-colors text-lg">
                    {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-500 dark:text-gray-400
                              line-clamp-2 mb-4 flex-grow">
                    {truncateText(blog.excerpt, 120)}
                </p>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {blog.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag._id}
                                className="text-xs bg-gray-100
                                           dark:bg-gray-700
                                           text-gray-600
                                           dark:text-gray-400
                                           px-2 py-0.5 rounded-md"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-3 text-xs
                                text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                        <HiOutlineClock className="w-3.5 h-3.5" />
                        {getReadingTime(blog.readingTime)}
                    </span>
                    <span className="flex items-center gap-1">
                        <HiOutlineEye className="w-3.5 h-3.5" />
                        {blog.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <HiOutlineHeart className="w-3.5 h-3.5" />
                        {blog.likesCount || 0}
                    </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100
                                dark:border-gray-700 pt-4">
                    {/* Author + Date */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar
                                src={blog.author?.avatar}
                                name={blog.author?.name}
                                size="sm"
                            />
                            <span className="text-sm font-medium
                                             text-gray-700
                                             dark:text-gray-300">
                                {blog.author?.name}
                            </span>
                        </div>
                        <span className="text-xs text-gray-400">
                            {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}