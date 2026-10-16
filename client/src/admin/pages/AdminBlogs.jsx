import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
    HiOutlinePlus,
    HiOutlineSearch,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineEye,
    HiOutlineStar
} from 'react-icons/hi'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Badge from '../../shared/components/ui/Badge.jsx'
import Button from '../../shared/components/ui/Button.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import ConfirmDialog from '../../shared/components/ui/ConfirmDialog.jsx'
import Pagination from '../../user/components/blog/Pagination.jsx'
import {
    getAdminBlogs,
    deleteBlog,
    publishBlog,
    draftBlog,
    toggleFeatured
} from '../../services/blogService.js'
import { formatDate } from '../../utils/formatDate.js'
import { truncateText } from '../../utils/truncateText.js'
import toast from 'react-hot-toast'

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [deleteId, setDeleteId] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true)
            const params = {
                page: currentPage,
                limit: 10
            }

            if (search) params.search = search
            if (status !== 'all') params.status = status

            const response = await getAdminBlogs(params)
            setBlogs(response?.data?.blogs || [])
            setTotalPages(response?.pagination?.totalPages || 1)
            setTotalItems(response?.pagination?.totalItems || 0)
        } catch (error) {
            console.error('Failed to fetch blogs:', error)
            setBlogs([])
        } finally {
            setLoading(false)
        }
    }, [currentPage, search, status])

    useEffect(() => {
        fetchBlogs()
    }, [fetchBlogs])

    useEffect(() => {
        setCurrentPage(1)
    }, [search, status])

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            setDeleteLoading(true)
            await deleteBlog(deleteId)
            toast.success('Blog deleted successfully')
            setDeleteId(null)
            fetchBlogs()
        } catch (error) {
            toast.error('Failed to delete blog')
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            if (currentStatus === 'draft') {
                await publishBlog(id)
                toast.success('Blog published')
            } else {
                await draftBlog(id)
                toast.success('Blog moved to draft')
            }
            fetchBlogs()
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const handleToggleFeatured = async (id) => {
        try {
            const response = await toggleFeatured(id)
            toast.success(response.message)
            fetchBlogs()
        } catch (error) {
            toast.error('Failed to toggle featured')
        }
    }

    let searchTimer
    const handleSearch = (value) => {
        clearTimeout(searchTimer)
        searchTimer = setTimeout(() => {
            setSearch(value)
        }, 500)
    }

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row
                            sm:items-center sm:justify-between
                            gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900
                                   dark:text-white">
                        Blog Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400
                                  text-sm mt-1">
                        {totalItems} total blogs
                    </p>
                </div>

                <Link to="/admin/blogs/create">
                    <Button>
                        <HiOutlinePlus className="w-4 h-4" />
                        Create Blog
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl
                            border border-gray-200
                            dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <HiOutlineSearch
                            className="absolute left-3 top-1/2
                                       -translate-y-1/2 text-gray-400
                                       w-4 h-4"
                        />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5
                                       rounded-lg border
                                       border-gray-300
                                       dark:border-gray-600
                                       bg-gray-50 dark:bg-gray-900
                                       text-gray-900
                                       dark:text-gray-100
                                       placeholder-gray-400
                                       focus:outline-none
                                       focus:ring-2
                                       focus:ring-indigo-500
                                       text-sm"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-2.5 rounded-lg border
                                   border-gray-300
                                   dark:border-gray-600
                                   bg-gray-50 dark:bg-gray-900
                                   text-gray-900
                                   dark:text-gray-100
                                   focus:outline-none focus:ring-2
                                   focus:ring-indigo-500 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>

            {/* Blog Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                </div>
            ) : blogs.length === 0 ? (
                <div className="text-center py-12 bg-white
                                dark:bg-gray-800 rounded-xl border
                                border-gray-200
                                dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                        No blogs found
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800
                                rounded-xl border border-gray-200
                                dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50
                                               dark:bg-gray-900/50
                                               border-b
                                               border-gray-200
                                               dark:border-gray-700">
                                    <th className="text-left px-4
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase">
                                        Blog
                                    </th>
                                    <th className="text-left px-4
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase
                                                   hidden md:table-cell">
                                        Category
                                    </th>
                                    <th className="text-left px-4
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase">
                                        Status
                                    </th>
                                    <th className="text-left px-4
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase
                                                   hidden lg:table-cell">
                                        Views
                                    </th>
                                    <th className="text-left px-4
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase
                                                   hidden lg:table-cell">
                                        Date
                                    </th>
                                    <th className="text-right px-4
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200
                                              dark:divide-gray-700">
                                {blogs.map((blog) => (
                                    <tr
                                        key={blog._id}
                                        className="hover:bg-gray-50
                                                   dark:hover:bg-gray-700/30
                                                   transition-colors"
                                    >
                                        {/* Blog Info */}
                                        <td className="px-4 py-3">
                                            <div className="flex
                                                            items-center
                                                            gap-3">
                                                <img
                                                    src={blog.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100'}
                                                    alt=""
                                                    className="w-12 h-12
                                                               rounded-lg
                                                               object-cover
                                                               hidden
                                                               sm:block"
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-medium
                                                                  text-gray-900
                                                                  dark:text-white
                                                                  text-sm
                                                                  truncate
                                                                  max-w-[200px]
                                                                  lg:max-w-[300px]">
                                                        {blog.title}
                                                    </p>
                                                    <p className="text-xs
                                                                  text-gray-500
                                                                  truncate">
                                                        by {blog.author?.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-4 py-3
                                                       hidden
                                                       md:table-cell">
                                            <Badge variant="info">
                                                {blog.category?.name || 'N/A'}
                                            </Badge>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleToggleStatus(blog._id, blog.status)}
                                                className="cursor-pointer"
                                            >
                                                <Badge
                                                    variant={blog.status === 'published'
                                                        ? 'success'
                                                        : 'warning'
                                                    }
                                                >
                                                    {blog.status}
                                                </Badge>
                                            </button>
                                        </td>

                                        {/* Views */}
                                        <td className="px-4 py-3
                                                       hidden
                                                       lg:table-cell">
                                            <span className="text-sm
                                                             text-gray-600
                                                             dark:text-gray-400">
                                                {blog.views || 0}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-3
                                                       hidden
                                                       lg:table-cell">
                                            <span className="text-sm
                                                             text-gray-500">
                                                {formatDate(blog.createdAt)}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex
                                                            items-center
                                                            justify-end
                                                            gap-1">
                                                {/* Featured */}
                                                <button
                                                    onClick={() => handleToggleFeatured(blog._id)}
                                                    className={`p-1.5
                                                               rounded-lg
                                                               transition-colors
                                                               ${blog.isFeatured
                                                                   ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                                                                   : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                               }`}
                                                    title="Toggle Featured"
                                                >
                                                    <HiOutlineStar className="w-4 h-4" />
                                                </button>

                                                {/* View */}
                                                <Link
                                                    to={`/blog/${blog.slug}`}
                                                    target="_blank"
                                                    className="p-1.5
                                                               rounded-lg
                                                               text-gray-400
                                                               hover:text-blue-600
                                                               hover:bg-blue-50
                                                               dark:hover:bg-blue-900/20
                                                               transition-colors"
                                                    title="View Blog"
                                                >
                                                    <HiOutlineEye className="w-4 h-4" />
                                                </Link>

                                                {/* Edit */}
                                                <Link
                                                    to={`/admin/blogs/edit/${blog._id}`}
                                                    className="p-1.5
                                                               rounded-lg
                                                               text-gray-400
                                                               hover:text-indigo-600
                                                               hover:bg-indigo-50
                                                               dark:hover:bg-indigo-900/20
                                                               transition-colors"
                                                    title="Edit Blog"
                                                >
                                                    <HiOutlinePencil className="w-4 h-4" />
                                                </Link>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => setDeleteId(blog._id)}
                                                    className="p-1.5
                                                               rounded-lg
                                                               text-gray-400
                                                               hover:text-red-600
                                                               hover:bg-red-50
                                                               dark:hover:bg-red-900/20
                                                               transition-colors"
                                                    title="Delete Blog"
                                                >
                                                    <HiOutlineTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Blog"
                message="Are you sure you want to delete this blog? This action cannot be undone."
                loading={deleteLoading}
            />
        </AdminLayout>
    )
}