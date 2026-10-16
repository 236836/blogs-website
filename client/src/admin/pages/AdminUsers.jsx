import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
    HiOutlineSearch,
    HiOutlineEye,
    HiOutlineBan,
    HiOutlineCheckCircle,
    HiOutlineTrash
} from 'react-icons/hi'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Avatar from '../../shared/components/ui/Avatar.jsx'
import Badge from '../../shared/components/ui/Badge.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import ConfirmDialog from '../../shared/components/ui/ConfirmDialog.jsx'
import Pagination from '../../user/components/blog/Pagination.jsx'
import {
    getAllUsers,
    toggleBlockUser,
    changeUserRole,
    deleteUser
} from '../../services/adminService.js'
import { formatDate } from '../../utils/formatDate.js'
import toast from 'react-hot-toast'

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [deleteId, setDeleteId] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            const params = {
                page: currentPage,
                limit: 10
            }

            if (search) params.search = search
            if (roleFilter !== 'all') params.role = roleFilter
            if (statusFilter !== 'all') params.status = statusFilter

            const response = await getAllUsers(params)
            setUsers(response?.data?.users || [])
            setTotalPages(response?.pagination?.totalPages || 1)
            setTotalItems(response?.pagination?.totalItems || 0)
        } catch (error) {
            console.error('Failed to fetch users:', error)
            setUsers([])
        } finally {
            setLoading(false)
        }
    }, [currentPage, search, roleFilter, statusFilter])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    useEffect(() => {
        setCurrentPage(1)
    }, [search, roleFilter, statusFilter])

    const handleBlock = async (userId) => {
        try {
            const response = await toggleBlockUser(userId)
            toast.success(response.message)
            fetchUsers()
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to block/unblock user'
            )
        }
    }

    const handleRoleChange = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin'

        try {
            await changeUserRole(userId, { role: newRole })
            toast.success(`Role changed to ${newRole}`)
            fetchUsers()
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to change role'
            )
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            setDeleteLoading(true)
            await deleteUser(deleteId)
            toast.success('User deleted successfully')
            setDeleteId(null)
            fetchUsers()
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to delete user'
            )
        } finally {
            setDeleteLoading(false)
        }
    }

    let searchTimer
    const handleSearch = (value) => {
        clearTimeout(searchTimer)
        searchTimer = setTimeout(() => {
            setSearch(value)
        }, 500)
    }

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900
                               dark:text-white">
                    User Management
                </h1>
                <p className="text-gray-500 dark:text-gray-400
                              text-sm mt-1">
                    {totalItems} total users
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl
                            border border-gray-200
                            dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <HiOutlineSearch
                            className="absolute left-3 top-1/2
                                       -translate-y-1/2
                                       text-gray-400 w-4 h-4"
                        />
                        <input
                            type="text"
                            placeholder="Search by name, email, username..."
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5
                                       rounded-lg border
                                       border-gray-300
                                       dark:border-gray-600
                                       bg-gray-50
                                       dark:bg-gray-900
                                       text-gray-900
                                       dark:text-gray-100
                                       placeholder-gray-400
                                       focus:outline-none
                                       focus:ring-2
                                       focus:ring-indigo-500
                                       text-sm"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2.5 rounded-lg border
                                   border-gray-300
                                   dark:border-gray-600
                                   bg-gray-50 dark:bg-gray-900
                                   text-gray-900
                                   dark:text-gray-100
                                   focus:outline-none
                                   focus:ring-2
                                   focus:ring-indigo-500 text-sm"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Users</option>
                        <option value="admin">Admins</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2.5 rounded-lg border
                                   border-gray-300
                                   dark:border-gray-600
                                   bg-gray-50 dark:bg-gray-900
                                   text-gray-900
                                   dark:text-gray-100
                                   focus:outline-none
                                   focus:ring-2
                                   focus:ring-indigo-500 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 bg-white
                                dark:bg-gray-800 rounded-xl
                                border border-gray-200
                                dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                        No users found
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800
                                rounded-xl border border-gray-200
                                dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50
                                               dark:bg-gray-900/50
                                               border-b
                                               border-gray-200
                                               dark:border-gray-700">
                                    <th className="text-left px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase">
                                        User
                                    </th>
                                    <th className="text-left px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase
                                                   hidden md:table-cell">
                                        Email
                                    </th>
                                    <th className="text-left px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase">
                                        Role
                                    </th>
                                    <th className="text-left px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase">
                                        Status
                                    </th>
                                    <th className="text-left px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase
                                                   hidden lg:table-cell">
                                        Joined
                                    </th>
                                    <th className="text-right px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y
                                              divide-gray-200
                                              dark:divide-gray-700">
                                {users.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="hover:bg-gray-50
                                                   dark:hover:bg-gray-700/30
                                                   transition-colors"
                                    >
                                        {/* User Info */}
                                        <td className="px-5 py-4">
                                            <div className="flex
                                                            items-center
                                                            gap-3">
                                                <Avatar
                                                    src={user.avatar}
                                                    name={user.name}
                                                    size="md"
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-medium
                                                                  text-gray-900
                                                                  dark:text-white
                                                                  text-sm
                                                                  truncate">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs
                                                                  text-gray-500
                                                                  truncate">
                                                        @{user.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-5 py-4
                                                       hidden
                                                       md:table-cell">
                                            <span className="text-sm
                                                             text-gray-600
                                                             dark:text-gray-400">
                                                {user.email}
                                            </span>
                                        </td>

                                        {/* Role */}
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => handleRoleChange(user._id, user.role)}
                                                className="cursor-pointer"
                                            >
                                                <Badge
                                                    variant={user.role === 'admin'
                                                        ? 'primary'
                                                        : 'default'
                                                    }
                                                >
                                                    {user.role}
                                                </Badge>
                                            </button>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <Badge
                                                variant={user.isBlocked
                                                    ? 'danger'
                                                    : 'success'
                                                }
                                            >
                                                {user.isBlocked
                                                    ? 'Blocked'
                                                    : 'Active'
                                                }
                                            </Badge>
                                        </td>

                                        {/* Joined */}
                                        <td className="px-5 py-4
                                                       hidden
                                                       lg:table-cell">
                                            <span className="text-sm
                                                             text-gray-500">
                                                {formatDate(user.createdAt)}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex
                                                            items-center
                                                            justify-end
                                                            gap-1">
                                                {/* View */}
                                                <Link
                                                    to={`/admin/users/${user._id}`}
                                                    className="p-1.5
                                                               rounded-lg
                                                               text-gray-400
                                                               hover:text-blue-600
                                                               hover:bg-blue-50
                                                               dark:hover:bg-blue-900/20
                                                               transition-colors"
                                                    title="View User"
                                                >
                                                    <HiOutlineEye
                                                        className="w-4 h-4"
                                                    />
                                                </Link>

                                                {/* Block/Unblock */}
                                                <button
                                                    onClick={() => handleBlock(user._id)}
                                                    className={`p-1.5
                                                               rounded-lg
                                                               transition-colors
                                                               ${user.isBlocked
                                                                   ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                                   : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                                               }`}
                                                    title={user.isBlocked
                                                        ? 'Unblock User'
                                                        : 'Block User'
                                                    }
                                                >
                                                    {user.isBlocked ? (
                                                        <HiOutlineCheckCircle
                                                            className="w-4 h-4"
                                                        />
                                                    ) : (
                                                        <HiOutlineBan
                                                            className="w-4 h-4"
                                                        />
                                                    )}
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => setDeleteId(user._id)}
                                                    className="p-1.5
                                                               rounded-lg
                                                               text-gray-400
                                                               hover:text-red-600
                                                               hover:bg-red-50
                                                               dark:hover:bg-red-900/20
                                                               transition-colors"
                                                    title="Delete User"
                                                >
                                                    <HiOutlineTrash
                                                        className="w-4 h-4"
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete User"
                message="Are you sure? This will delete the user and all their data. This action cannot be undone."
                loading={deleteLoading}
            />
        </AdminLayout>
    )
}