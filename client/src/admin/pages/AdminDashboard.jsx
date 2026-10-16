import { useState, useEffect } from 'react'
import {
    HiOutlineDocumentText,
    HiOutlineEye,
    HiOutlineUsers,
    HiOutlineChatAlt2,
    HiOutlineHeart,
    HiOutlineBookmark,
    HiOutlineMail,
    HiOutlineClipboardCheck
} from 'react-icons/hi'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import StatsCard from '../components/dashboard/StatsCard.jsx'
import RecentActivity from '../components/dashboard/RecentActivity.jsx'
import AnalyticsChart from '../components/dashboard/AnalyticsChart.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import {
    getDashboardStats,
    getRecentActivity,
    getAnalytics
} from '../../services/adminService.js'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [activity, setActivity] = useState(null)
    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true)

                const [statsRes, activityRes, analyticsRes] =
                    await Promise.allSettled([
                        getDashboardStats(),
                        getRecentActivity(),
                        getAnalytics()
                    ])

                if (statsRes.status === 'fulfilled') {
                    setStats(statsRes.value?.data?.stats || null)
                }

                if (activityRes.status === 'fulfilled') {
                    setActivity(activityRes.value?.data || null)
                }

                if (analyticsRes.status === 'fulfilled') {
                    setAnalytics(analyticsRes.value?.data || null)
                }
            } catch (error) {
                console.error('Dashboard error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard()
    }, [])

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center
                                min-h-[60vh]">
                    <Spinner size="xl" />
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            {/* Page Title */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold
                               text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400
                              mt-1">
                    Welcome back! Here is your blog overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2
                            lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    title="Total Blogs"
                    value={stats?.totalBlogs}
                    icon={HiOutlineDocumentText}
                    color="indigo"
                />
                <StatsCard
                    title="Published"
                    value={stats?.publishedBlogs}
                    icon={HiOutlineClipboardCheck}
                    color="green"
                />
                <StatsCard
                    title="Total Views"
                    value={stats?.totalViews}
                    icon={HiOutlineEye}
                    color="blue"
                />
                <StatsCard
                    title="Total Users"
                    value={stats?.totalUsers}
                    icon={HiOutlineUsers}
                    color="purple"
                />
                <StatsCard
                    title="Comments"
                    value={stats?.totalComments}
                    icon={HiOutlineChatAlt2}
                    color="orange"
                />
                <StatsCard
                    title="Total Likes"
                    value={stats?.totalLikes}
                    icon={HiOutlineHeart}
                    color="red"
                />
                <StatsCard
                    title="Bookmarks"
                    value={stats?.totalBookmarks}
                    icon={HiOutlineBookmark}
                    color="yellow"
                />
                <StatsCard
                    title="Subscribers"
                    value={stats?.totalSubscribers}
                    icon={HiOutlineMail}
                    color="pink"
                />
            </div>

            {/* Analytics Charts */}
            <AnalyticsChart analytics={analytics} />

            {/* Recent Activity */}
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900
                               dark:text-white mb-4">
                    Recent Activity
                </h2>
            </div>
            <RecentActivity activity={activity} />
        </AdminLayout>
    )
}