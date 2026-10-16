import { useState, useEffect } from 'react'
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi'
import { useAuth } from '../../../context/AuthContext.jsx'
import {
    toggleBookmark,
    getBookmarkStatus
} from '../../../services/bookmarkService.js'
import toast from 'react-hot-toast'

export default function BookmarkButton({ blogId }) {
    const { isAuthenticated } = useAuth()
    const [bookmarked, setBookmarked] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchStatus = async () => {
            if (!isAuthenticated) return

            try {
                const response = await getBookmarkStatus(blogId)
                setBookmarked(response?.data?.bookmarked || false)
            } catch (error) {
                console.error('Failed to fetch bookmark status')
            }
        }

        if (blogId) fetchStatus()
    }, [blogId, isAuthenticated])

    const handleBookmark = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to bookmark posts')
            return
        }

        try {
            setLoading(true)
            const response = await toggleBookmark(blogId)

            if (response?.data?.bookmarked) {
                setBookmarked(true)
                toast.success('Blog saved!')
            } else {
                setBookmarked(false)
                toast.success('Bookmark removed')
            }
        } catch (error) {
            toast.error('Failed to bookmark')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleBookmark}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2
                       rounded-lg font-medium text-sm
                       transition-all duration-200
                       disabled:opacity-50
                       ${bookmarked
                           ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                           : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                       }`}
        >
            {bookmarked ? (
                <HiBookmark className="w-5 h-5" />
            ) : (
                <HiOutlineBookmark className="w-5 h-5" />
            )}
            {bookmarked ? 'Saved' : 'Save'}
        </button>
    )
}