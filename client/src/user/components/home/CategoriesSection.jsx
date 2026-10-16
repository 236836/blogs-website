import { Link } from 'react-router-dom'
import { Skeleton } from '../../../shared/components/ui/Skeleton.jsx'

export default function CategoriesSection({ categories, loading }) {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6
                            lg:px-8 py-12">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-purple-500
                                rounded-full" />
                <h2 className="text-2xl sm:text-3xl font-bold
                               text-gray-900 dark:text-white">
                    Browse Categories
                </h2>
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3
                                lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-28" />
                    ))}
                </div>
            ) : categories && categories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3
                                lg:grid-cols-5 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category._id}
                            to={`/category/${category.slug}`}
                            className="group bg-white dark:bg-gray-800
                                       rounded-xl p-5 text-center
                                       shadow-sm hover:shadow-md
                                       transition-all duration-300
                                       border border-gray-100
                                       dark:border-gray-700
                                       hover:border-indigo-200
                                       dark:hover:border-indigo-800"
                        >
                            <span className="text-3xl mb-3 block">
                                {category.icon || '📁'}
                            </span>
                            <h3 className="font-semibold text-gray-900
                                           dark:text-white text-sm
                                           group-hover:text-indigo-600
                                           dark:group-hover:text-indigo-400
                                           transition-colors">
                                {category.name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">
                                {category.blogCount || 0} articles
                            </p>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500
                              dark:text-gray-400 py-8">
                    No categories found.
                </p>
            )}
        </section>
    )
}