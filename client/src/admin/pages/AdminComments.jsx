import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
    HiOutlineSearch,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiOutlineCheckCircle,
    HiOutlineTrash,
    HiOutlineChatAlt2
} from 'react-icons/hi'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Avatar from '../../shared/components/ui/Avatar.jsx'
import Badge from '../../shared/components/ui/Badge.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import ConfirmDialog from '../../shared/components/ui/ConfirmDialog.jsx'
import Pagination from '../../user/components/blog/Pagination.jsx'
import {
    getAdminComments,
    hideComment,
    approveComment,
    deleteComment
} from '../../services/commentService.js'
import { timeAgo } from '../../utils/formatDate.js'
import { truncateText } from '../../utils/truncateText.js'
import toast from 'react-hot-toast'

export default function AdminComments() {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [deleteId, setDeleteId] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchComments = useCallback(async () => {
        try {
            setLoading(true)
            const params = {
                page: currentPage,
                limit: 10
            }

            if (statusFilter !== 'all') {
                params.status = statusFilter
            }

            const response = await getAdminComments(params)
            setComments(response?.data?.comments || [])
            setTotalPages(response?.pagination?.totalPages || 1)
            setTotalItems(response?.pagination?.totalItems || 0)
        } catch (error) {
            console.error('Failed to fetch comments:', error)
            setComments([])
        } finally {
            setLoading(false)
        }
    }, [currentPage, statusFilter])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    useEffect(() => {
        setCurrentPage(1)
    }, [statusFilter])

    const handleHide = async (commentId) => {
        try {
            const response = await hideComment(commentId)
            toast.success(response.message)
            fetchComments()
        } catch (error) {
            toast.error('Failed to hide comment')
        }
    }

    const handleApprove = async (commentId) => {
        try {
            await approveComment(commentId)
            toast.success('Comment approved')
            fetchComments()
        } catch (error) {
            toast.error('Failed to approve comment')
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            setDeleteLoading(true)
            await deleteComment(deleteId)
            toast.success('Comment deleted')
            setDeleteId(null)
            fetchComments()
        } catch (error) {
            toast.error('Failed to delete comment')
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900
                               dark:text-white">
                    Comment Moderation
                </h1>
                <p className="text-gray-500 dark:text-gray-400
                              text-sm mt-1">
                    {totalItems} total comments
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl
                            border border-gray-200
                            dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2.5 rounded-lg border
                                   border-gray-300
                                   dark:border-gray-600
                                   bg-gray-50 dark:bg-gray-900
                                   text-gray-900
                                   dark:text-gray-100
                                   focus:outline-none focus:ring-2
                                   focus:ring-indigo-500 text-sm"
                    >
                        <option value="all">All Comments</option>
                        <option value="visible">Visible</option>
                        <option value="hidden">Hidden</option>
                    </select>
                </div>
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-16 bg-white
                                dark:bg-gray-800 rounded-xl
                                border border-gray-200
                                dark:border-gray-700">
                    <HiOutlineChatAlt2 className="w-12 h-12
                                                  text-gray-300
                                                  dark:text-gray-600
                                                  mx-auto mb-4" />
                    <h3 className="text-lg font-medium
                                   text-gray-900
                                   dark:text-white mb-2">
                        No comments found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Comments will appear here when users
                        start commenting on blogs.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className={`bg-white dark:bg-gray-800
                                       rounded-xl border p-5
                                       transition-all
                                       ${comment.isHidden
                                           ? 'border-red-200 dark:border-red-900/50 opacity-75'
                                           : 'border-gray-200 dark:border-gray-700'
                                       }`}
                        >
                            {/* Top Row */}
                            <div className="flex items-start
                                            justify-between mb-3">

                                {/* User Info */}
                                <div className="flex items-center
                                                gap-3">
                                    <Avatar
                                        src={comment.author?.avatar}
                                        name={comment.author?.name}
                                        size="md"
                                    />
                                    <div>
                                        <div className="flex
                                                        items-center
                                                        gap-2">
                                            <p className="font-medium
                                                          text-gray-900
                                                          dark:text-white
                                                          text-sm">
                                                {comment.author?.name}
                                            </p>
                                            <span className="text-xs
                                                             text-gray-400">
                                                @{comment.author?.username}
                                            </span>
                                        </div>
                                        <div className="flex
                                                        items-center
                                                        gap-2
                                                        mt-0.5">
                                            <span className="text-xs
                                                             text-gray-400">
                                                {timeAgo(comment.createdAt)}
                                            </span>
                                            {comment.isHidden && (
                                                <Badge variant="danger">
                                                    Hidden
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center
                                                gap-1">
                                    {/* Approve */}
                                    {comment.isHidden && (
                                        <button
                                            onClick={() => handleApprove(comment._id)}
                                            className="p-1.5
                                                       rounded-lg
                                                       text-green-500
                                                       hover:bg-green-50
                                                       dark:hover:bg-green-900/20
                                                       transition-colors"
                                            title="Approve Comment"
                                        >
                                            <HiOutlineCheckCircle
                                                className="w-5 h-5"
                                            />
                                        </button>
                                    )}

                                    {/* Hide/Show */}
                                    <button
                                        onClick={() => handleHide(comment._id)}
                                        className={`p-1.5 rounded-lg
                                                   transition-colors
                                                   ${comment.isHidden
                                                       ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                                       : 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                                   }`}
                                        title={comment.isHidden
                                            ? 'Show Comment'
                                            : 'Hide Comment'
                                        }
                                    >
                                        {comment.isHidden ? (
                                            <HiOutlineEye
                                                className="w-5 h-5"
                                            />
                                        ) : (
                                            <HiOutlineEyeOff
                                                className="w-5 h-5"
                                            />
                                        )}
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => setDeleteId(comment._id)}
                                        className="p-1.5 rounded-lg
                                                   text-red-500
                                                   hover:bg-red-50
                                                   dark:hover:bg-red-900/20
                                                   transition-colors"
                                        title="Delete Comment"
                                    >
                                        <HiOutlineTrash
                                            className="w-5 h-5"
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Comment Content */}
                            <p className="text-gray-700
                                          dark:text-gray-300
                                          text-sm leading-relaxed
                                          mb-3 ml-13">
                                {comment.content}
                            </p>

                            {/* Blog Link */}
                            {comment.blog && (
                                <div className="ml-13 pt-3 border-t
                                                border-gray-100
                                                dark:border-gray-700">
                                    <Link
                                        to={`/blog/${comment.blog.slug}`}
                                        target="_blank"
                                        className="text-xs
                                                   text-indigo-600
                                                   dark:text-indigo-400
                                                   hover:underline
                                                   flex items-center
                                                   gap-1"
                                    >
                                        📝 {truncateText(comment.blog.title, 60)}
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}
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
                title="Delete Comment"
                message="Are you sure? This will permanently delete this comment."
                loading={deleteLoading}
            />
        </AdminLayout>
    )
}