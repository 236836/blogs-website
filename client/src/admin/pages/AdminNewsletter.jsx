import { useState, useEffect, useCallback } from 'react'
import {
    HiOutlineSearch,
    HiOutlineTrash,
    HiOutlineMail,
    HiOutlineCheckCircle,
    HiOutlineXCircle
} from 'react-icons/hi'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Badge from '../../shared/components/ui/Badge.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import ConfirmDialog from '../../shared/components/ui/ConfirmDialog.jsx'
import Pagination from '../../user/components/blog/Pagination.jsx'
import {
    getAllSubscribers,
    deleteSubscriber
} from '../../services/newsletterService.js'
import { formatDate } from '../../utils/formatDate.js'
import toast from 'react-hot-toast'

export default function AdminNewsletter() {
    const [subscribers, setSubscribers] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [deleteId, setDeleteId] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchSubscribers = useCallback(async () => {
        try {
            setLoading(true)
            const params = {
                page: currentPage,
                limit: 10
            }

            if (search) params.search = search
            if (statusFilter !== 'all') params.status = statusFilter

            const response = await getAllSubscribers(params)
            setSubscribers(response?.data?.subscribers || [])
            setStats(response?.data?.stats || null)
            setTotalPages(response?.pagination?.totalPages || 1)
            setTotalItems(response?.pagination?.totalItems || 0)
        } catch (error) {
            console.error('Failed to fetch subscribers:', error)
            setSubscribers([])
        } finally {
            setLoading(false)
        }
    }, [currentPage, search, statusFilter])

    useEffect(() => {
        fetchSubscribers()
    }, [fetchSubscribers])

    useEffect(() => {
        setCurrentPage(1)
    }, [search, statusFilter])

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            setDeleteLoading(true)
            await deleteSubscriber(deleteId)
            toast.success('Subscriber deleted')
            setDeleteId(null)
            fetchSubscribers()
        } catch (error) {
            toast.error('Failed to delete subscriber')
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
                    Newsletter Subscribers
                </h1>
                <p className="text-gray-500 dark:text-gray-400
                              text-sm mt-1">
                    Manage your newsletter subscribers
                </p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3
                                gap-4 mb-6">
                    {/* Total */}
                    <div className="bg-white dark:bg-gray-800
                                    rounded-xl border
                                    border-gray-200
                                    dark:border-gray-700 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50
                                            dark:bg-indigo-900/20
                                            rounded-lg flex
                                            items-center
                                            justify-center">
                                <HiOutlineMail className="w-5 h-5
                                                          text-indigo-600
                                                          dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold
                                              text-gray-900
                                              dark:text-white">
                                    {stats.total || 0}
                                </p>
                                <p className="text-sm text-gray-500
                                              dark:text-gray-400">
                                    Total Subscribers
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Active */}
                    <div className="bg-white dark:bg-gray-800
                                    rounded-xl border
                                    border-gray-200
                                    dark:border-gray-700 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50
                                            dark:bg-green-900/20
                                            rounded-lg flex
                                            items-center
                                            justify-center">
                                <HiOutlineCheckCircle
                                    className="w-5 h-5 text-green-600
                                               dark:text-green-400"
                                />
                            </div>
                            <div>
                                <p className="text-2xl font-bold
                                              text-gray-900
                                              dark:text-white">
                                    {stats.totalActive || 0}
                                </p>
                                <p className="text-sm text-gray-500
                                              dark:text-gray-400">
                                    Active
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Inactive */}
                    <div className="bg-white dark:bg-gray-800
                                    rounded-xl border
                                    border-gray-200
                                    dark:border-gray-700 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-50
                                            dark:bg-red-900/20
                                            rounded-lg flex
                                            items-center
                                            justify-center">
                                <HiOutlineXCircle
                                    className="w-5 h-5 text-red-600
                                               dark:text-red-400"
                                />
                            </div>
                            <div>
                                <p className="text-2xl font-bold
                                              text-gray-900
                                              dark:text-white">
                                    {stats.totalInactive || 0}
                                </p>
                                <p className="text-sm text-gray-500
                                              dark:text-gray-400">
                                    Unsubscribed
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                            placeholder="Search by email..."
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
                        <option value="subscribed">Active</option>
                        <option value="unsubscribed">Unsubscribed</option>
                    </select>
                </div>
            </div>

            {/* Subscribers Table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                </div>
            ) : subscribers.length === 0 ? (
                <div className="text-center py-16 bg-white
                                dark:bg-gray-800 rounded-xl
                                border border-gray-200
                                dark:border-gray-700">
                    <HiOutlineMail className="w-12 h-12
                                              text-gray-300
                                              dark:text-gray-600
                                              mx-auto mb-4" />
                    <h3 className="text-lg font-medium
                                   text-gray-900
                                   dark:text-white mb-2">
                        No subscribers found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Subscribers will appear here when users
                        subscribe to your newsletter.
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
                                        Email
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
                                                   hidden sm:table-cell">
                                        Subscribed
                                    </th>
                                    <th className="text-left px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase
                                                   hidden md:table-cell">
                                        Unsubscribed
                                    </th>
                                    <th className="text-right px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y
                                              divide-gray-200
                                              dark:divide-gray-700">
                                {subscribers.map((sub) => (
                                    <tr
                                        key={sub._id}
                                        className="hover:bg-gray-50
                                                   dark:hover:bg-gray-700/30
                                                   transition-colors"
                                    >
                                        {/* Email */}
                                        <td className="px-5 py-4">
                                            <div className="flex
                                                            items-center
                                                            gap-2">
                                                <HiOutlineMail
                                                    className="w-4 h-4
                                                               text-gray-400
                                                               flex-shrink-0"
                                                />
                                                <span className="text-sm
                                                                 font-medium
                                                                 text-gray-900
                                                                 dark:text-white
                                                                 truncate">
                                                    {sub.email}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <Badge
                                                variant={sub.isSubscribed
                                                    ? 'success'
                                                    : 'danger'
                                                }
                                            >
                                                {sub.isSubscribed
                                                    ? 'Active'
                                                    : 'Unsubscribed'
                                                }
                                            </Badge>
                                        </td>

                                        {/* Subscribed Date */}
                                        <td className="px-5 py-4
                                                       hidden
                                                       sm:table-cell">
                                            <span className="text-sm
                                                             text-gray-500">
                                                {sub.subscribedAt
                                                    ? formatDate(sub.subscribedAt)
                                                    : '-'
                                                }
                                            </span>
                                        </td>

                                        {/* Unsubscribed Date */}
                                        <td className="px-5 py-4
                                                       hidden
                                                       md:table-cell">
                                            <span className="text-sm
                                                             text-gray-500">
                                                {sub.unsubscribedAt
                                                    ? formatDate(sub.unsubscribedAt)
                                                    : '-'
                                                }
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex
                                                            items-center
                                                            justify-end">
                                                <button
                                                    onClick={() => setDeleteId(sub._id)}
                                                    className="p-1.5
                                                               rounded-lg
                                                               text-gray-400
                                                               hover:text-red-600
                                                               hover:bg-red-50
                                                               dark:hover:bg-red-900/20
                                                               transition-colors"
                                                    title="Delete Subscriber"
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
                title="Delete Subscriber"
                message="Are you sure you want to delete this subscriber?"
                loading={deleteLoading}
            />
        </AdminLayout>
    )
}