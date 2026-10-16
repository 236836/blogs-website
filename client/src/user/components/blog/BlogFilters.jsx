import { useState, useEffect } from 'react'
import { HiOutlineSearch, HiOutlineAdjustments } from 'react-icons/hi'
import { getAllCategories } from '../../../services/categoryService.js'
import { SORT_OPTIONS } from '../../../utils/constants.js'

export default function BlogFilters({
    search,
    onSearchChange,
    category,
    onCategoryChange,
    sort,
    onSortChange
}) {
    const [categories, setCategories] = useState([])
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories()
                setCategories(response?.data?.categories || [])
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            }
        }

        fetchCategories()
    }, [])

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl
                        shadow-sm border border-gray-100
                        dark:border-gray-700 p-4 mb-8">

            {/* Search + Toggle */}
            <div className="flex gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <HiOutlineSearch
                        className="absolute left-3 top-1/2
                                   -translate-y-1/2 text-gray-400
                                   w-5 h-5"
                    />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5
                                   rounded-lg border border-gray-300
                                   dark:border-gray-600
                                   bg-gray-50 dark:bg-gray-900
                                   text-gray-900 dark:text-gray-100
                                   placeholder-gray-400
                                   focus:outline-none focus:ring-2
                                   focus:ring-indigo-500
                                   focus:border-transparent
                                   text-sm"
                    />
                </div>

                {/* Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5
                               rounded-lg border text-sm font-medium
                               transition-colors
                               ${showFilters
                                   ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400'
                                   : 'bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-300'
                               }`}
                >
                    <HiOutlineAdjustments className="w-5 h-5" />
                    <span className="hidden sm:inline">Filters</span>
                </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2
                                gap-4 mt-4 pt-4 border-t
                                border-gray-100 dark:border-gray-700">

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium
                                          text-gray-700
                                          dark:text-gray-300 mb-1.5">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg
                                       border border-gray-300
                                       dark:border-gray-600
                                       bg-gray-50 dark:bg-gray-900
                                       text-gray-900
                                       dark:text-gray-100
                                       focus:outline-none focus:ring-2
                                       focus:ring-indigo-500 text-sm"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.slug}>
                                    {cat.icon} {cat.name} ({cat.blogCount})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-medium
                                          text-gray-700
                                          dark:text-gray-300 mb-1.5">
                            Sort By
                        </label>
                        <select
                            value={sort}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg
                                       border border-gray-300
                                       dark:border-gray-600
                                       bg-gray-50 dark:bg-gray-900
                                       text-gray-900
                                       dark:text-gray-100
                                       focus:outline-none focus:ring-2
                                       focus:ring-indigo-500 text-sm"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    )
}