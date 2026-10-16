import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineChatAlt2 } from 'react-icons/hi'
import Spinner from '../../../shared/components/ui/Spinner.jsx'
import Pagination from '../blog/Pagination.jsx'
import { getCommentHistory } from '../../../services/userService.js'
import { timeAgo } from '../../../utils/formatDate.js'

export default function CommentHistory() {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchComments = async (page = 1) => {
        try {
            setLoading(true)
            const response = await getCommentHistory({
                page,
                limit: 10
            })
            setComments(response?.data?.comments || [])
            setTotalPages(response?.pagination?.totalPages || 1)
        } catch (error) {
            console.error('Failed to fetch comments:', error)
            setComments([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        fetchComments(page)
    }

    if (loading) {
        return (
            <div className="py-8">
                <Spinner size="lg" />
            </div>
        )
    }

    if (comments.length === 0) {
        return (
            <div className="text-center py-12">
                <HiOutlineChatAlt2 className="w-12 h-12
                                              text-gray-300
                                              dark:text-gray-600
                                              mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900
                               dark:text-white mb-1">
                    No comments yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400
                              text-sm">
                    Your comment history will appear here.
                </p>
            </div>
        )
    }

    return (
        <div>
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div
                        key={comment._id}
                        className="bg-white dark:bg-gray-800
                                   rounded-xl p-4 border
                                   border-gray-200
                                   dark:border-gray-700"
                    >
                        {/* Blog Link */}
                        {comment.blog && (
                            <Link
                                to={`/blog/${comment.blog.slug}`}
                                className="text-sm font-medium
                                           text-indigo-600
                                           dark:text-indigo-400
                                           hover:underline mb-2
                                           block"
                            >
                                {comment.blog.title}
                            </Link>
                        )}

                        {/* Comment Content */}
                        <p className="text-gray-700
                                      dark:text-gray-300
                                      text-sm leading-relaxed">
                            {comment.content}
                        </p>

                        {/* Time */}
                        <p className="text-xs text-gray-400 mt-2">
                            {timeAgo(comment.createdAt)}
                        </p>
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}