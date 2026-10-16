import { useState } from 'react'
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi'
import { useAuth } from '../../../context/AuthContext.jsx'
import { timeAgo } from '../../../utils/formatDate.js'
import Avatar from '../../../shared/components/ui/Avatar.jsx'
import toast from 'react-hot-toast'

export default function ReplyItem({ reply, onDelete, onUpdate }) {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(reply.content)

    const isOwner = user?._id === reply.author?._id
    const isAdmin = user?.role === 'admin'

    const handleUpdate = async () => {
        if (!editContent.trim()) return

        try {
            await onUpdate(reply._id, editContent.trim())
            setIsEditing(false)
            toast.success('Reply updated')
        } catch (error) {
            toast.error('Failed to update reply')
        }
    }

    const handleDelete = async () => {
        try {
            await onDelete(reply._id)
            toast.success('Reply deleted')
        } catch (error) {
            toast.error('Failed to delete reply')
        }
    }

    return (
        <div className="flex gap-3 ml-12 mt-3">
            <Avatar
                src={reply.author?.avatar}
                name={reply.author?.name}
                size="sm"
                className="flex-shrink-0 mt-1"
            />

            <div className="flex-1 bg-gray-50 dark:bg-gray-800/50
                            rounded-lg p-3">
                <div className="flex items-center justify-between
                                mb-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm
                                         text-gray-900
                                         dark:text-white">
                            {reply.author?.name}
                        </span>
                        <span className="text-xs text-gray-400">
                            {timeAgo(reply.createdAt)}
                        </span>
                    </div>

                    {(isOwner || isAdmin) && (
                        <div className="flex items-center gap-1">
                            {isOwner && (
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="p-1 text-gray-400
                                               hover:text-indigo-600
                                               transition-colors"
                                >
                                    <HiOutlinePencil className="w-3.5 h-3.5" />
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                className="p-1 text-gray-400
                                           hover:text-red-600
                                           transition-colors"
                            >
                                <HiOutlineTrash className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg
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
                                className="text-xs bg-indigo-600
                                           text-white px-3 py-1
                                           rounded-md"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false)
                                    setEditContent(reply.content)
                                }}
                                className="text-xs text-gray-500
                                           hover:text-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-700
                                  dark:text-gray-300">
                        {reply.content}
                    </p>
                )}
            </div>
        </div>
    )
}