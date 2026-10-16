import { Link } from 'react-router-dom'
import { HiOutlineClock, HiOutlineEye } from 'react-icons/hi'
import { formatDate } from '../../../utils/formatDate.js'
import { getReadingTime } from '../../../utils/readingTime.js'
import Avatar from '../../../shared/components/ui/Avatar.jsx'
import Badge from '../../../shared/components/ui/Badge.jsx'

export default function FeaturedPost({ blog }) {
    if (!blog) return null

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6
                            lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                <h2 className="text-2xl sm:text-3xl font-bold
                               text-gray-900 dark:text-white">
                    Featured Post
                </h2>
            </div>

            <Link
                to={`/blog/${blog.slug}`}
                className="group block bg-white dark:bg-gray-800
                           rounded-2xl overflow-hidden shadow-sm
                           hover:shadow-xl transition-all duration-300
                           border border-gray-100
                           dark:border-gray-700"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image */}
                    <div className="relative overflow-hidden h-64
                                    lg:h-auto">
                        <img
                            src={blog.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
                            alt={blog.title}
                            className="w-full h-full object-cover
                                       group-hover:scale-105
                                       transition-transform
                                       duration-500"
                        />
                        <div className="absolute top-4 left-4">
                            <Badge variant="primary">
                                ⭐ Featured
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 lg:p-10 flex
                                    flex-col justify-center">
                        <Badge variant="info" className="mb-4 w-fit">
                            {blog.category?.name || 'General'}
                        </Badge>

                        <h3 className="text-2xl sm:text-3xl font-bold
                                       text-gray-900 dark:text-white
                                       mb-4 group-hover:text-indigo-600
                                       dark:group-hover:text-indigo-400
                                       transition-colors leading-tight">
                            {blog.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400
                                      mb-6 line-clamp-3 leading-relaxed">
                            {blog.excerpt || 'Click to read this amazing article...'}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4
                                        text-sm text-gray-500
                                        dark:text-gray-400 mb-6">
                            <div className="flex items-center gap-1.5">
                                <HiOutlineClock className="w-4 h-4" />
                                {getReadingTime(blog.readingTime)}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <HiOutlineEye className="w-4 h-4" />
                                {blog.views || 0} views
                            </div>
                            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                        </div>

                        {/* Author */}
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={blog.author?.avatar}
                                name={blog.author?.name}
                                size="sm"
                            />
                            <div>
                                <p className="font-medium text-gray-900
                                              dark:text-white text-sm">
                                    {blog.author?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    @{blog.author?.username}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </section>
    )
}