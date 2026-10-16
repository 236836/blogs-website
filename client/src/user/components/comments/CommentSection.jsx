import { useState, useEffect } from 'react'
import { HiOutlineChatAlt2 } from 'react-icons/hi'
import CommentForm from './CommentForm.jsx'
import CommentItem from './CommentItem.jsx'
import Spinner from '../../../shared/components/ui/Spinner.jsx'
import {
    getBlogComments,
    addComment,
    replyToComment,
    updateComment,
    deleteComment
} from '../../../services/commentService.js'
import toast from 'react-hot-toast'

export default function CommentSection({ blogId }) {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchComments = async () => {
        try {
            setLoading(true)
            const response = await getBlogComments(blogId)
            setComments(response?.data?.comments || [])
        } catch (error) {
            console.error('Failed to fetch comments')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (blogId) fetchComments()
    }, [blogId])

    const handleAddComment = async (content) => {
        try {
            await addComment(blogId, { content })
            toast.success('Comment posted!')
            fetchComments()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to comment')
            throw error
        }
    }

    const handleReply = async (commentId, content) => {
        try {
            await replyToComment(commentId, { content })
            toast.success('Reply posted!')
            fetchComments()
        } catch (error) {
            toast.error('Failed to reply')
            throw error
        }
    }

    const handleUpdate = async (commentId, content) => {
        try {
            await updateComment(commentId, { content })
            fetchComments()
        } catch (error) {
            throw error
        }
    }

    const handleDelete = async (commentId) => {
        try {
            await deleteComment(commentId)
            fetchComments()
        } catch (error) {
            throw error
        }
    }

    return (
        <section className="mt-12 pt-8 border-t border-gray-200
                            dark:border-gray-700">

            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
                <HiOutlineChatAlt2 className="w-6 h-6
                                              text-indigo-600
                                              dark:text-indigo-400" />
                <h2 className="text-2xl font-bold text-gray-900
                               dark:text-white">
                    Comments ({comments.length})
                </h2>
            </div>

            {/* Comment Form */}
            <CommentForm onSubmit={handleAddComment} />

            {/* Comments List */}
            {loading ? (
                <div className="py-8">
                    <Spinner size="lg" />
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-2">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            onReply={handleReply}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500
                                dark:text-gray-400">
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            )}
        </section>
    )
}