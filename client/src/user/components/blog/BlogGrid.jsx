import BlogCard from './BlogCard.jsx'
import { BlogCardSkeleton } from '../../../shared/components/ui/Skeleton.jsx'

export default function BlogGrid({ blogs, loading, columns = 3 }) {
    const gridCols = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }

    if (loading) {
        return (
            <div className={`grid ${gridCols[columns]} gap-6`}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <BlogCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (!blogs || blogs.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-900
                               dark:text-white mb-2">
                    No blogs found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filters.
                </p>
            </div>
        )
    }

    return (
        <div className={`grid ${gridCols[columns]} gap-6`}>
            {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
            ))}
        </div>
    )
}