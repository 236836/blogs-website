import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
    HiArrowLeft,
    HiOutlineBan,
    HiOutlineCheckCircle,
    HiOutlineTrash,
    HiOutlineShieldCheck,
    HiOutlineUser
} from 'react-icons/hi'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Avatar from '../../shared/components/ui/Avatar.jsx'
import Badge from '../../shared/components/ui/Badge.jsx'
import Button from '../../shared/components/ui/Button.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import ConfirmDialog from '../../shared/components/ui/ConfirmDialog.jsx'
import {
    getUserDetail,
    toggleBlockUser,
    changeUserRole,
    deleteUser
} from '../../services/adminService.js'
import { formatDate } from '../../utils/formatDate.js'
import toast from 'react-hot-toast'

export default function AdminUserDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showDelete, setShowDelete] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchUser = async () => {
        try {
            setLoading(true)
            const response = await getUserDetail(id)
            setUserData(response?.data || null)
        } catch (error) {
            console.error('Failed to fetch user:', error)
            setUserData(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetchUser()
    }, [id])

    const handleBlock = async () => {
        try {
            const response = await toggleBlockUser(id)
            toast.success(response.message)
            fetchUser()
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to block/unblock'
            )
        }
    }

    const handleRoleChange = async () => {
        const newRole = userData?.user?.role === 'admin'
            ? 'user'
            : 'admin'

        try {
            await changeUserRole(id, { role: newRole })
            toast.success(`Role changed to ${newRole}`)
            fetchUser()
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to change role'
            )
        }
    }

    const handleDelete = async () => {
        try {
            setDeleteLoading(true)
            await deleteUser(id)
            toast.success('User deleted')
            navigate('/admin/users')
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to delete'
            )
        } finally {
            setDeleteLoading(false)
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center py-20">
                    <Spinner size="xl" />
                </div>
            </AdminLayout>
        )
    }

    if (!userData?.user) {
        return (
            <AdminLayout>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-900
                                   dark:text-white mb-4">
                        User Not Found
                    </h2>
                    <Link
                        to="/admin/users"
                        className="text-indigo-600
                                   dark:text-indigo-400
                                   hover:underline"
                    >
                        ← Back to Users
                    </Link>
                </div>
            </AdminLayout>
        )
    }

    const { user, stats, recentBlogs, recentComments } = userData

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="p-2 rounded-lg text-gray-500
                               hover:bg-gray-100
                               dark:hover:bg-gray-800
                               transition-colors"
                >
                    <HiArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900
                               dark:text-white">
                    User Detail
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* User Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800
                                    rounded-xl border
                                    border-gray-200
                                    dark:border-gray-700 p-6
                                    text-center">

                        <Avatar
                            src={user.avatar}
                            name={user.name}
                            size="xl"
                            className="mx-auto mb-4"
                        />

                        <h2 className="text-xl font-bold
                                       text-gray-900
                                       dark:text-white mb-1">
                            {user.name}
                        </h2>

                        <p className="text-gray-500
                                      dark:text-gray-400 text-sm
                                      mb-3">
                            @{user.username}
                        </p>

                        <p className="text-gray-500
                                      dark:text-gray-400 text-sm
                                      mb-4">
                            {user.email}
                        </p>

                        {/* Badges */}
                        <div className="flex items-center
                                        justify-center gap-2 mb-6">
                            <Badge
                                variant={user.role === 'admin'
                                    ? 'primary'
                                    : 'default'
                                }
                            >
                                {user.role}
                            </Badge>
                            <Badge
                                variant={user.isBlocked
                                    ? 'danger'
                                    : 'success'
                                }
                            >
                                {user.isBlocked ? 'Blocked' : 'Active'}
                            </Badge>
                        </div>

                        {/* Bio */}
                        {user.bio && (
                            <p className="text-sm text-gray-600
                                          dark:text-gray-400
                                          mb-4 text-left">
                                {user.bio}
                            </p>
                        )}

                        {/* Joined Date */}
                        <p className="text-xs text-gray-400 mb-6">
                            Joined {formatDate(user.createdAt)}
                        </p>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <Button
                                onClick={handleRoleChange}
                                variant={user.role === 'admin'
                                    ? 'secondary'
                                    : 'primary'
                                }
                                fullWidth
                                size="sm"
                            >
                                {user.role === 'admin' ? (
                                    <>
                                        <HiOutlineUser className="w-4 h-4" />
                                        Make User
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineShieldCheck className="w-4 h-4" />
                                        Make Admin
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={handleBlock}
                                variant={user.isBlocked
                                    ? 'success'
                                    : 'danger'
                                }
                                fullWidth
                                size="sm"
                            >
                                {user.isBlocked ? (
                                    <>
                                        <HiOutlineCheckCircle className="w-4 h-4" />
                                        Unblock User
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineBan className="w-4 h-4" />
                                        Block User
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={() => setShowDelete(true)}
                                variant="danger"
                                fullWidth
                                size="sm"
                            >
                                <HiOutlineTrash className="w-4 h-4" />
                                Delete User
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700
                                        p-6 mt-6">
                            <h3 className="font-semibold
                                           text-gray-900
                                           dark:text-white mb-4">
                                User Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3
                                                bg-gray-50
                                                dark:bg-gray-900
                                                rounded-lg">
                                    <p className="text-xl font-bold
                                                  text-gray-900
                                                  dark:text-white">
                                        {stats.totalBlogs || 0}
                                    </p>
                                    <p className="text-xs
                                                  text-gray-500">
                                        Blogs
                                    </p>
                                </div>
                                <div className="text-center p-3
                                                bg-gray-50
                                                dark:bg-gray-900
                                                rounded-lg">
                                    <p className="text-xl font-bold
                                                  text-gray-900
                                                  dark:text-white">
                                        {stats.totalComments || 0}
                                    </p>
                                    <p className="text-xs
                                                  text-gray-500">
                                        Comments
                                    </p>
                                </div>
                                <div className="text-center p-3
                                                bg-gray-50
                                                dark:bg-gray-900
                                                rounded-lg">
                                    <p className="text-xl font-bold
                                                  text-gray-900
                                                  dark:text-white">
                                        {stats.totalLikes || 0}
                                    </p>
                                    <p className="text-xs
                                                  text-gray-500">
                                        Likes
                                    </p>
                                </div>
                                <div className="text-center p-3
                                                bg-gray-50
                                                dark:bg-gray-900
                                                rounded-lg">
                                    <p className="text-xl font-bold
                                                  text-gray-900
                                                  dark:text-white">
                                        {stats.totalBookmarks || 0}
                                    </p>
                                    <p className="text-xs
                                                  text-gray-500">
                                        Bookmarks
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Activity */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Recent Blogs */}
                    <div className="bg-white dark:bg-gray-800
                                    rounded-xl border
                                    border-gray-200
                                    dark:border-gray-700 p-6">
                        <h3 className="font-semibold text-gray-900
                                       dark:text-white mb-4">
                            Recent Blogs
                        </h3>

                        {recentBlogs && recentBlogs.length > 0 ? (
                            <div className="space-y-3">
                                {recentBlogs.map((blog) => (
                                    <div
                                        key={blog._id}
                                        className="flex items-center
                                                    justify-between
                                                    p-3 rounded-lg
                                                    bg-gray-50
                                                    dark:bg-gray-900/50"
                                    >
                                        <div className="min-w-0
                                                        flex-1">
                                            <p className="font-medium
                                                          text-gray-900
                                                          dark:text-white
                                                          text-sm
                                                          truncate">
                                                {blog.title}
                                            </p>
                                            <div className="flex
                                                            items-center
                                                            gap-3
                                                            text-xs
                                                            text-gray-500
                                                            mt-1">
                                                <span>
                                                    {blog.views || 0} views
                                                </span>
                                                <span>
                                                    {formatDate(blog.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={blog.status === 'published'
                                                ? 'success'
                                                : 'warning'
                                            }
                                        >
                                            {blog.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500
                                          text-center py-4">
                                No blogs yet
                            </p>
                        )}
                    </div>

                    {/* Recent Comments */}
                    <div className="bg-white dark:bg-gray-800
                                    rounded-xl border
                                    border-gray-200
                                    dark:border-gray-700 p-6">
                        <h3 className="font-semibold text-gray-900
                                       dark:text-white mb-4">
                            Recent Comments
                        </h3>

                        {recentComments && recentComments.length > 0 ? (
                            <div className="space-y-3">
                                {recentComments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className="p-3 rounded-lg
                                                    bg-gray-50
                                                    dark:bg-gray-900/50"
                                    >
                                        <p className="text-sm
                                                      text-gray-700
                                                      dark:text-gray-300
                                                      line-clamp-2">
                                            {comment.content}
                                        </p>
                                        <div className="flex
                                                        items-center
                                                        gap-2 mt-2">
                                            {comment.blog && (
                                                <span className="text-xs
                                                                 text-indigo-600
                                                                 dark:text-indigo-400">
                                                    on: {comment.blog.title}
                                                </span>
                                            )}
                                            <span className="text-xs
                                                             text-gray-400">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500
                                          text-center py-4">
                                No comments yet
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                title="Delete User"
                message="This will permanently delete this user and all their data."
                loading={deleteLoading}
            />
        </AdminLayout>
    )
}