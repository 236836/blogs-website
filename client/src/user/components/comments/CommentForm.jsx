import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext.jsx'
import Button from '../../../shared/components/ui/Button.jsx'
import Avatar from '../../../shared/components/ui/Avatar.jsx'
import toast from 'react-hot-toast'

export default function CommentForm({ onSubmit, placeholder = 'Write a comment...', buttonText = 'Post Comment' }) {
    const { user, isAuthenticated } = useAuth()
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isAuthenticated) {
            toast.error('Please login to comment')
            return
        }

        if (!content.trim()) {
            toast.error('Comment cannot be empty')
            return
        }

        try {
            setLoading(true)
            await onSubmit(content.trim())
            setContent('')
        } catch (error) {
            toast.error('Failed to post comment')
        } finally {
            setLoading(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-gray-50 dark:bg-gray-800/50
                            rounded-xl p-6 text-center border
                            border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 mb-3">
                    Please login to leave a comment.
                </p>
                <a
                    href="/login"
                    className="text-indigo-600 dark:text-indigo-400
                               font-medium hover:underline"
                >
                    Login Now →
                </a>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
                <Avatar
                    src={user?.avatar}
                    name={user?.name}
                    size="md"
                    className="flex-shrink-0 mt-1"
                />

                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={placeholder}
                        rows={3}
                        maxLength={1000}
                        className="w-full px-4 py-3 rounded-xl border
                                   border-gray-300 dark:border-gray-600
                                   bg-white dark:bg-gray-800
                                   text-gray-900 dark:text-gray-100
                                   placeholder-gray-400
                                   focus:outline-none focus:ring-2
                                   focus:ring-indigo-500
                                   focus:border-transparent
                                   resize-none text-sm"
                    />

                    <div className="flex items-center justify-between
                                    mt-2">
                        <span className="text-xs text-gray-400">
                            {content.length}/1000
                        </span>
                        <Button
                            type="submit"
                            size="sm"
                            loading={loading}
                            disabled={!content.trim()}
                        >
                            {buttonText}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}