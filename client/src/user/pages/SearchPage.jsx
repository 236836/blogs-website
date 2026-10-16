import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HiOutlineSearch } from 'react-icons/hi'
import Layout from '../components/layout/Layout.jsx'
import BlogGrid from '../components/blog/BlogGrid.jsx'
import Pagination from '../components/blog/Pagination.jsx'
import { searchBlogs } from '../../services/blogService.js'
import { ITEMS_PER_PAGE } from '../../utils/constants.js'

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const initialQuery = searchParams.get('q') || ''

    const [query, setQuery] = useState(initialQuery)
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [searched, setSearched] = useState(false)

    const fetchResults = async (searchQuery, page = 1) => {
        if (!searchQuery.trim()) return

        try {
            setLoading(true)
            const response = await searchBlogs({
                q: searchQuery,
                page,
                limit: ITEMS_PER_PAGE
            })

            setBlogs(response?.data?.blogs || [])
            setTotalPages(response?.pagination?.totalPages || 1)
            setTotalItems(response?.pagination?.totalItems || 0)
            setSearched(true)
        } catch (error) {
            console.error('Search failed:', error)
            setBlogs([])
        } finally {
            setLoading(false)
        }
    }

    // Search when URL query changes
    useEffect(() => {
        if (initialQuery) {
            setQuery(initialQuery)
            fetchResults(initialQuery, 1)
        }
    }, [initialQuery])

    // Handle form submit
    const handleSearch = (e) => {
        e.preventDefault()
        if (!query.trim()) return

        setCurrentPage(1)
        setSearchParams({ q: query.trim() })
        fetchResults(query.trim(), 1)
    }

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page)
        fetchResults(query, page)
        window.scrollTo(0, 0)
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6
                            lg:px-8 py-8">

                {/* Search Header */}
                <div className="max-w-2xl mx-auto text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold
                                   text-gray-900 dark:text-white mb-4">
                        Search Articles
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Find articles by title, content, or topic
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <HiOutlineSearch
                                className="absolute left-4 top-1/2
                                           -translate-y-1/2
                                           text-gray-400 w-5 h-5"
                            />
                            <input
                                type="text"
                                placeholder="Type your search query..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                                className="w-full pl-12 pr-28 py-4
                                           rounded-2xl border
                                           border-gray-300
                                           dark:border-gray-600
                                           bg-white dark:bg-gray-800
                                           text-gray-900
                                           dark:text-gray-100
                                           placeholder-gray-400
                                           focus:outline-none
                                           focus:ring-2
                                           focus:ring-indigo-500
                                           focus:border-transparent
                                           text-base shadow-sm"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2
                                           -translate-y-1/2
                                           bg-indigo-600
                                           hover:bg-indigo-700
                                           text-white px-6 py-2.5
                                           rounded-xl font-medium
                                           transition-colors text-sm"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Count */}
                {searched && (
                    <div className="mb-6">
                        {totalItems > 0 ? (
                            <p className="text-gray-600
                                          dark:text-gray-400">
                                Found{' '}
                                <span className="font-semibold
                                                 text-gray-900
                                                 dark:text-white">
                                    {totalItems}
                                </span>{' '}
                                result{totalItems !== 1 ? 's' : ''} for{' '}
                                <span className="font-semibold
                                                 text-indigo-600
                                                 dark:text-indigo-400">
                                    "{initialQuery}"
                                </span>
                            </p>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold
                                               text-gray-900
                                               dark:text-white mb-2">
                                    No results found
                                </h3>
                                <p className="text-gray-500
                                              dark:text-gray-400
                                              max-w-md mx-auto">
                                    No articles match your search for{' '}
                                    <span className="font-medium">
                                        "{initialQuery}"
                                    </span>.
                                    Try different keywords.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Results Grid */}
                {searched && totalItems > 0 && (
                    <>
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
                    </>
                )}

                {/* Initial State */}
                {!searched && !loading && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">✍️</div>
                        <h3 className="text-xl font-bold
                                       text-gray-900
                                       dark:text-white mb-2">
                            Start Searching
                        </h3>
                        <p className="text-gray-500
                                      dark:text-gray-400">
                            Enter a keyword to find articles
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    )
}