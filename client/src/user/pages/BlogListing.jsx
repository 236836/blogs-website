import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/layout/Layout.jsx'
import BlogGrid from '../components/blog/BlogGrid.jsx'
import BlogFilters from '../components/blog/BlogFilters.jsx'
import Pagination from '../components/blog/Pagination.jsx'
import { getAllBlogs } from '../../services/blogService.js'
import { ITEMS_PER_PAGE } from '../../utils/constants.js'

export default function BlogListing() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('latest')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true)

            const params = {
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                sort
            }

            if (search) params.search = search
            if (category) params.category = category

            const response = await getAllBlogs(params)

            setBlogs(response?.data?.blogs || [])
            setTotalPages(response?.pagination?.totalPages || 1)
            setTotalItems(response?.pagination?.totalItems || 0)

        } catch (error) {
            console.error('Failed to fetch blogs:', error)
            setBlogs([])
        } finally {
            setLoading(false)
        }
    }, [currentPage, search, category, sort])

    useEffect(() => {
        fetchBlogs()
    }, [fetchBlogs])

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [search, category, sort])

    // Debounce search
    const [searchTimer, setSearchTimer] = useState(null)

    const handleSearchChange = (value) => {
        if (searchTimer) clearTimeout(searchTimer)

        const timer = setTimeout(() => {
            setSearch(value)
        }, 500)

        setSearchTimer(timer)
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6
                            lg:px-8 py-8">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold
                                   text-gray-900 dark:text-white
                                   mb-2">
                        All Blogs
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {totalItems > 0
                            ? `Showing ${blogs.length} of ${totalItems} articles`
                            : 'Discover amazing articles'
                        }
                    </p>
                </div>

                {/* Filters */}
                <BlogFilters
                    search={search}
                    onSearchChange={handleSearchChange}
                    category={category}
                    onCategoryChange={setCategory}
                    sort={sort}
                    onSortChange={setSort}
                />

                {/* Blog Grid */}
                <BlogGrid
                    blogs={blogs}
                    loading={loading}
                    columns={3}
                />

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </Layout>
    )
}