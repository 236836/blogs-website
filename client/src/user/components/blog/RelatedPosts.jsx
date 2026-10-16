import { Link } from 'react-router-dom'
import { formatDate } from '../../../utils/formatDate.js'
import Avatar from '../../../shared/components/ui/Avatar.jsx'

export default function RelatedPosts({ blogs }) {
    if (!blogs || blogs.length === 0) return null

    return (
        <section className="mt-12 pt-8 border-t border-gray-200
                            dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900
                           dark:text-white mb-6">
                Related Posts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <Link
                        key={blog._id}
                        to={`/blog/${blog.slug}`}
                        className="group bg-white dark:bg-gray-800
                                   rounded-xl overflow-hidden
                                   shadow-sm hover:shadow-md
                                   transition-all duration-300
                                   border border-gray-100
                                   dark:border-gray-700"
                    >
                        <div className="overflow-hidden h-40">
                            <img
                                src={blog.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400'}
                                alt={blog.title}
                                className="w-full h-full object-cover
                                           group-hover:scale-105
                                           transition-transform
                                           duration-500"
                            />
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900
                                           dark:text-white text-sm
                                           line-clamp-2 mb-3
                                           group-hover:text-indigo-600
                                           dark:group-hover:text-indigo-400
                                           transition-colors">
                                {blog.title}
                            </h3>

                            <div className="flex items-center gap-2">
                                <Avatar
                                    src={blog.author?.avatar}
                                    name={blog.author?.name}
                                    size="sm"
                                />
                                <div>
                                    <p className="text-xs font-medium
                                                  text-gray-700
                                                  dark:text-gray-300">
                                        {blog.author?.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {formatDate(blog.publishedAt || blog.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}