import { useState, useEffect } from 'react'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi'
import { useAuth } from '../../../context/AuthContext.jsx'
import { toggleLike, getLikeStatus } from '../../../services/likeService.js'
import toast from 'react-hot-toast'

export default function LikeButton({ blogId }) {
    const { isAuthenticated } = useAuth()
    const [liked, setLiked] = useState(false)
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await getLikeStatus(blogId)
                setLiked(response?.data?.userLiked || false)
                setCount(response?.data?.likesCount || 0)
            } catch (error) {
                console.error('Failed to fetch like status')
            }
        }

        if (blogId) fetchLikeStatus()
    }, [blogId])

    const handleLike = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to like posts')
            return
        }

        try {
            setLoading(true)
            const response = await toggleLike(blogId)

            if (response?.data?.liked) {
                setLiked(true)
                setCount((prev) => prev + 1)
                toast.success('Blog liked!')
            } else {
                setLiked(false)
                setCount((prev) => Math.max(0, prev - 1))
                toast.success('Like removed')
            }
        } catch (error) {
            toast.error('Failed to like blog')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2
                       rounded-lg font-medium text-sm
                       transition-all duration-200
                       disabled:opacity-50
                       ${liked
                           ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                           : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                       }`}
        >
            {liked ? (
                <HiHeart className="w-5 h-5 text-red-500" />
            ) : (
                <HiOutlineHeart className="w-5 h-5" />
            )}
            <span>{count}</span>
        </button>
    )
}