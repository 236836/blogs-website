import { Link } from 'react-router-dom'
import { HiOutlineClock, HiOutlineEye, HiOutlineHeart } from 'react-icons/hi'
import { HiArrowRight } from 'react-icons/hi2'
import { formatDate } from '../../../utils/formatDate.js'
import { getReadingTime } from '../../../utils/readingTime.js'
import { truncateText } from '../../../utils/truncateText.js'
import Avatar from '../../../shared/components/ui/Avatar.jsx'
import Badge from '../../../shared/components/ui/Badge.jsx'
import { BlogCardSkeleton } from '../../../shared/components/ui/Skeleton.jsx'

export default function LatestBlogs({ blogs, loading }) {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6
                            lg:px-8 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-green-500
                                    rounded-full" />
                    <h2 className="text-2xl sm:text-3xl font-bold
                                   text-gray-900 dark:text-white">
                        Latest Articles
                    </h2>
                </div>
                <Link
                    to="/blogs"
                    className="flex items-center gap-1 text-indigo-600
                               dark:text-indigo-400 font-medium
                               hover:gap-2 transition-all text-sm"
                >
                    View All
                    <HiArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Blog Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2
                                lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <BlogCardSkeleton key={i} />
                    ))}
                </div>
            ) : blogs && blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2
                                lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <Link
                            key={blog._id}
                            to={`/blog/${blog.slug}`}
                            className="group bg-white dark:bg-gray-800
                                       rounded-xl overflow-hidden
                                       shadow-sm hover:shadow-lg
                                       transition-all duration-300
                                       border border-gray-100
                                       dark:border-gray-700"
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden
                                            h-48">
                                <img
                                    src={blog.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400'}
                                    alt={blog.title}
                                    className="w-full h-full object-cover
                                               group-hover:scale-105
                                               transition-transform
                                               duration-500"
                                />
                                <div className="absolute top-3 left-3">
                                    <Badge variant="info">
                                        {blog.category?.name || 'General'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900
                                               dark:text-white mb-2
                                               line-clamp-2
                                               group-hover:text-indigo-600
                                               dark:group-hover:text-indigo-400
                                               transition-colors">
                                    {blog.title}
                                </h3>

                                <p className="text-sm text-gray-500
                                              dark:text-gray-400
                                              line-clamp-2 mb-4">
                                    {truncateText(blog.excerpt, 100)}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center gap-3
                                                text-xs text-gray-400
                                                mb-4">
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

                                {/* Author + Date */}
                                <div className="flex items-center
                                                justify-between">
                                    <div className="flex items-center
                                                    gap-2">
                                        <Avatar
                                            src={blog.author?.avatar}
                                            name={blog.author?.name}
                                            size="sm"
                                        />
                                        <span className="text-sm
                                                         font-medium
                                                         text-gray-700
                                                         dark:text-gray-300">
                                            {blog.author?.name}
                                        </span>
                                    </div>
                                    <span className="text-xs
                                                     text-gray-400">
                                        {formatDate(blog.publishedAt || blog.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500
                                dark:text-gray-400">
                    <p className="text-lg">No articles found yet.</p>
                    <p className="text-sm mt-2">
                        Check back soon for new content!
                    </p>
                </div>
            )}
        </section>
    )
}