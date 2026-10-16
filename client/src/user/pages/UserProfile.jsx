import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    HiOutlineBookmark,
    HiOutlineHeart,
    HiOutlineChatAlt2
} from 'react-icons/hi'
import Layout from '../components/layout/Layout.jsx'
import ProfileHeader from '../components/profile/ProfileHeader.jsx'
import SavedBlogs from '../components/profile/SavedBlogs.jsx'
import LikedBlogs from '../components/profile/LikedBlogs.jsx'
import CommentHistory from '../components/profile/CommentHistory.jsx'
import BlogGrid from '../components/blog/BlogGrid.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getUserProfile, getUserBlogs } from '../../services/userService.js'

export default function UserProfile() {
    const { username } = useParams()
    const { user } = useAuth()

    const [profileUser, setProfileUser] = useState(null)
    const [stats, setStats] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('blogs')

    const isOwnProfile = user?.username === username

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true)

                const [profileRes, blogsRes] = await Promise.allSettled([
                    getUserProfile(username),
                    getUserBlogs(username, { limit: 6 })
                ])

                if (profileRes.status === 'fulfilled') {
                    setProfileUser(profileRes.value?.data?.user || null)
                    setStats(profileRes.value?.data?.stats || null)
                }

                if (blogsRes.status === 'fulfilled') {
                    setBlogs(blogsRes.value?.data?.blogs || [])
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error)
            } finally {
                setLoading(false)
            }
        }

        if (username) fetchProfile()
    }, [username])

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center
                                justify-center">
                    <Spinner size="xl" />
                </div>
            </Layout>
        )
    }

    if (!profileUser) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center
                                justify-center flex-col gap-4">
                    <h1 className="text-3xl font-bold text-gray-900
                                   dark:text-white">
                        User Not Found
                    </h1>
                    <a
                        href="/"
                        className="text-indigo-600
                                   dark:text-indigo-400
                                   hover:underline"
                    >
                        ← Go Home
                    </a>
                </div>
            </Layout>
        )
    }

    const tabs = [
        { id: 'blogs', label: 'Blogs', icon: null },
        ...(isOwnProfile
            ? [
                { id: 'saved', label: 'Saved', icon: HiOutlineBookmark },
                { id: 'liked', label: 'Liked', icon: HiOutlineHeart },
                { id: 'comments', label: 'Comments', icon: HiOutlineChatAlt2 }
              ]
            : []
        )
    ]

    return (
        <Layout>
            <div className="max-w-5xl mx-auto px-4 sm:px-6
                            lg:px-8 py-8">

                {/* Profile Header */}
                <ProfileHeader
                    profileUser={profileUser}
                    stats={stats}
                />

                {/* Tabs */}
                <div className="flex items-center gap-1 mt-8 mb-6
                                bg-white dark:bg-gray-800 rounded-xl
                                p-1 border border-gray-200
                                dark:border-gray-700 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5
                                       px-4 py-2.5 rounded-lg
                                       text-sm font-medium
                                       transition-colors
                                       whitespace-nowrap
                                       ${activeTab === tab.id
                                           ? 'bg-indigo-600 text-white'
                                           : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                       }`}
                        >
                            {tab.icon && <tab.icon className="w-4 h-4" />}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'blogs' && (
                    <BlogGrid
                        blogs={blogs}
                        loading={false}
                        columns={3}
                    />
                )}

                {activeTab === 'saved' && isOwnProfile && (
                    <SavedBlogs />
                )}

                {activeTab === 'liked' && isOwnProfile && (
                    <LikedBlogs />
                )}

                {activeTab === 'comments' && isOwnProfile && (
                    <CommentHistory />
                )}
            </div>
        </Layout>
    )
}