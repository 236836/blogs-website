import { Link } from 'react-router-dom'
import { HiOutlineEye, HiOutlineFire } from 'react-icons/hi'
import { formatDate } from '../../../utils/formatDate.js'
import Avatar from '../../../shared/components/ui/Avatar.jsx'
import { Skeleton } from '../../../shared/components/ui/Skeleton.jsx'

export default function TrendingBlogs({ blogs, loading }) {
    return (
        <section className="bg-gray-100 dark:bg-gray-900/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-orange-500
                                    rounded-full" />
                    <h2 className="text-2xl sm:text-3xl font-bold
                                   text-gray-900 dark:text-white">
                        Trending Now
                    </h2>
                    <HiOutlineFire className="w-6 h-6 text-orange-500" />
                </div>

                {/* Trending Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2
                                    lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-32" />
                        ))}
                    </div>
                ) : blogs && blogs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2
                                    lg:grid-cols-4 gap-4">
                        {blogs.map((blog, index) => (
                            <Link
                                key={blog._id}
                                to={`/blog/${blog.slug}`}
                                className="group flex gap-4 bg-white
                                           dark:bg-gray-800 p-4
                                           rounded-xl shadow-sm
                                           hover:shadow-md
                                           transition-all duration-300
                                           border border-gray-100
                                           dark:border-gray-700"
                            >
                                {/* Number */}
                                <span className="text-3xl font-bold
                                                 text-gray-200
                                                 dark:text-gray-700
                                                 flex-shrink-0">
                                    0{index + 1}
                                </span>

                                {/* Content */}
                                <div className="min-w-0">
                                    <h3 className="font-semibold
                                                   text-gray-900
                                                   dark:text-white
                                                   text-sm
                                                   line-clamp-2 mb-2
                                                   group-hover:text-indigo-600
                                                   dark:group-hover:text-indigo-400
                                                   transition-colors">
                                        {blog.title}
                                    </h3>

                                    <div className="flex items-center
                                                    gap-2">
                                        <Avatar
                                            src={blog.author?.avatar}
                                            name={blog.author?.name}
                                            size="sm"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-xs
                                                          font-medium
                                                          text-gray-700
                                                          dark:text-gray-300
                                                          truncate">
                                                {blog.author?.name}
                                            </p>
                                            <div className="flex
                                                            items-center
                                                            gap-2
                                                            text-xs
                                                            text-gray-400">
                                                <span>
                                                    {formatDate(blog.publishedAt || blog.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-0.5">
                                                    <HiOutlineEye className="w-3 h-3" />
                                                    {blog.views || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500
                                  dark:text-gray-400 py-8">
                        No trending posts yet.
                    </p>
                )}
            </div>
        </section>
    )
}