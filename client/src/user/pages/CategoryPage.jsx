import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi'
import Layout from '../components/layout/Layout.jsx'
import BlogGrid from '../components/blog/BlogGrid.jsx'
import Pagination from '../components/blog/Pagination.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import { getCategoryBySlug } from '../../services/categoryService.js'
import { ITEMS_PER_PAGE } from '../../utils/constants.js'

export default function CategoryPage() {
    const { slug } = useParams()
    const [category, setCategory] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    const fetchCategoryData = async (page = 1) => {
        try {
            setLoading(true)
            const response = await getCategoryBySlug(slug, {
                page,
                limit: ITEMS_PER_PAGE
            })

            setCategory(response?.data?.category || null)
            setBlogs(response?.data?.blogs || [])
            setTotalPages(response?.pagination?.totalPages || 1)
            setTotalItems(response?.pagination?.totalItems || 0)
        } catch (error) {
            console.error('Failed to fetch category:', error)
            setCategory(null)
            setBlogs([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (slug) {
            setCurrentPage(1)
            fetchCategoryData(1)
        }
    }, [slug])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        fetchCategoryData(page)
        window.scrollTo(0, 0)
    }

    if (loading && !category) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center
                                justify-center">
                    <Spinner size="xl" />
                </div>
            </Layout>
        )
    }

    if (!category) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center
                                justify-center flex-col gap-4">
                    <div className="text-6xl">📁</div>
                    <h1 className="text-3xl font-bold text-gray-900
                                   dark:text-white">
                        Category Not Found
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        The category you are looking for does not exist.
                    </p>
                    <Link
                        to="/blogs"
                        className="text-indigo-600
                                   dark:text-indigo-400
                                   hover:underline mt-2"
                    >
                        ← Browse All Blogs
                    </Link>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            {/* Category Header */}
            <div className="bg-gradient-to-r from-indigo-600
                            to-purple-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6
                                lg:px-8 py-12">

                    {/* Back Link */}
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-1
                                   text-sm text-indigo-200
                                   hover:text-white mb-6
                                   transition-colors"
                    >
                        <HiArrowLeft className="w-4 h-4" />
                        All Blogs
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Category Icon */}
                        <span className="text-5xl">
                            {category.icon || '📁'}
                        </span>

                        <div>
                            <h1 className="text-3xl sm:text-4xl
                                           font-bold text-white mb-2">
                                {category.name}
                            </h1>

                            {category.description && (
                                <p className="text-indigo-100 text-lg">
                                    {category.description}
                                </p>
                            )}

                            <p className="text-indigo-200 text-sm mt-2">
                                {totalItems} article{totalItems !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blogs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6
                            lg:px-8 py-8">

                <BlogGrid
                    blogs={blogs}
                    loading={loading}
                    columns={3}
                />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </Layout>
    )
}