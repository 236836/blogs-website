import { useState } from 'react'
import {
    HiOutlineTrash,
    HiOutlinePencil,
    HiOutlineReply
} from 'react-icons/hi'
import { useAuth } from '../../../context/AuthContext.jsx'
import { timeAgo } from '../../../utils/formatDate.js'
import Avatar from '../../../shared/components/ui/Avatar.jsx'
import CommentForm from './CommentForm.jsx'
import ReplyItem from './ReplyItem.jsx'
import toast from 'react-hot-toast'

export default function CommentItem({
    comment,
    onReply,
    onDelete,
    onUpdate
}) {
    const { user } = useAuth()
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)

    const isOwner = user?._id === comment.author?._id
    const isAdmin = user?.role === 'admin'

    const handleReply = async (content) => {
        await onReply(comment._id, content)
        setShowReplyForm(false)
    }

    const handleUpdate = async () => {
        if (!editContent.trim()) return

        try {
            await onUpdate(comment._id, editContent.trim())
            setIsEditing(false)
            toast.success('Comment updated')
        } catch (error) {
            toast.error('Failed to update comment')
        }
    }

    const handleDelete = async () => {
        try {
            await onDelete(comment._id)
            toast.success('Comment deleted')
        } catch (error) {
            toast.error('Failed to delete comment')
        }
    }

    return (
        <div className="mb-6">
            <div className="flex gap-3">
                <Avatar
                    src={comment.author?.avatar}
                    name={comment.author?.name}
                    size="md"
                    className="flex-shrink-0 mt-1"
                />

                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between
                                    mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900
                                             dark:text-white text-sm">
                                {comment.author?.name}
                            </span>
                            <span className="text-xs text-gray-400">
                                @{comment.author?.username}
                            </span>
                            <span className="text-xs text-gray-400">
                                • {timeAgo(comment.createdAt)}
                            </span>
                        </div>

                        {(isOwner || isAdmin) && (
                            <div className="flex items-center gap-1">
                                {isOwner && (
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="p-1.5 text-gray-400
                                                   hover:text-indigo-600
                                                   transition-colors"
                                    >
                                        <HiOutlinePencil className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={handleDelete}
                                    className="p-1.5 text-gray-400
                                               hover:text-red-600
                                               transition-colors"
                                >
                                    <HiOutlineTrash className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    {isEditing ? (
                        <div className="mb-3">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg
                                           border border-gray-300
                                           dark:border-gray-600
                                           bg-white dark:bg-gray-800
                                           text-gray-900
                                           dark:text-gray-100
                                           text-sm resize-none
                                           focus:outline-none
                                           focus:ring-2
                                           focus:ring-indigo-500"
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={handleUpdate}
                                    className="text-sm bg-indigo-600
                                               text-white px-4 py-1.5
                                               rounded-lg"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false)
                                        setEditContent(comment.content)
                                    }}
                                    className="text-sm text-gray-500
                                               hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 dark:text-gray-300
                                      text-sm mb-3 leading-relaxed">
                            {comment.content}
                        </p>
                    )}

                    {/* Reply Button */}
                    {!isEditing && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="flex items-center gap-1 text-xs
                                       text-gray-400 hover:text-indigo-600
                                       dark:hover:text-indigo-400
                                       transition-colors"
                        >
                            <HiOutlineReply className="w-4 h-4" />
                            Reply
                        </button>
                    )}

                    {/* Reply Form */}
                    {showReplyForm && (
                        <div className="mt-3">
                            <CommentForm
                                onSubmit={handleReply}
                                placeholder="Write a reply..."
                                buttonText="Reply"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    {comment.replies.map((reply) => (
                        <ReplyItem
                            key={reply._id}
                            reply={reply}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}