import { Link } from 'react-router-dom'
import {
    HiOutlineDocumentText,
    HiOutlineUser,
    HiOutlineChatAlt2,
    HiOutlineMail
} from 'react-icons/hi'
import { timeAgo } from '../../../utils/formatDate.js'
import Avatar from '../../../shared/components/ui/Avatar.jsx'
import Badge from '../../../shared/components/ui/Badge.jsx'

export default function RecentActivity({ activity }) {
    if (!activity) return null

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Recent Blogs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl
                            border border-gray-200
                            dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <HiOutlineDocumentText className="w-5 h-5
                                                      text-indigo-600
                                                      dark:text-indigo-400" />
                    <h3 className="font-semibold text-gray-900
                                   dark:text-white">
                        Recent Blogs
                    </h3>
                </div>

                <div className="space-y-3">
                    {activity.recentBlogs?.slice(0, 5).map((blog) => (
                        <Link
                            key={blog._id}
                            to={`/admin/blogs/edit/${blog._id}`}
                            className="flex items-center gap-3 p-2
                                       rounded-lg hover:bg-gray-50
                                       dark:hover:bg-gray-700/50
                                       transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium
                                              text-gray-900
                                              dark:text-white
                                              truncate">
                                    {blog.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {timeAgo(blog.createdAt)}
                                </p>
                            </div>
                            <Badge
                                variant={blog.status === 'published'
                                    ? 'success'
                                    : 'warning'
                                }
                            >
                                {blog.status}
                            </Badge>
                        </Link>
                    ))}

                    {(!activity.recentBlogs ||
                        activity.recentBlogs.length === 0) && (
                        <p className="text-sm text-gray-500
                                      text-center py-4">
                            No recent blogs
                        </p>
                    )}
                </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white dark:bg-gray-800 rounded-xl
                            border border-gray-200
                            dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <HiOutlineUser className="w-5 h-5 text-green-600
                                              dark:text-green-400" />
                    <h3 className="font-semibold text-gray-900
                                   dark:text-white">
                        New Users
                    </h3>
                </div>

                <div className="space-y-3">
                    {activity.recentUsers?.slice(0, 5).map((user) => (
                        <Link
                            key={user._id}
                            to={`/admin/users/${user._id}`}
                            className="flex items-center gap-3 p-2
                                       rounded-lg hover:bg-gray-50
                                       dark:hover:bg-gray-700/50
                                       transition-colors"
                        >
                            <Avatar
                                src={user.avatar}
                                name={user.name}
                                size="sm"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium
                                              text-gray-900
                                              dark:text-white
                                              truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    @{user.username} • {timeAgo(user.createdAt)}
                                </p>
                            </div>
                            <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                                {user.role}
                            </Badge>
                        </Link>
                    ))}

                    {(!activity.recentUsers ||
                        activity.recentUsers.length === 0) && (
                        <p className="text-sm text-gray-500
                                      text-center py-4">
                            No recent users
                        </p>
                    )}
                </div>
            </div>

            {/* Recent Comments */}
            <div className="bg-white dark:bg-gray-800 rounded-xl
                            border border-gray-200
                            dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <HiOutlineChatAlt2 className="w-5 h-5
                                                  text-orange-600
                                                  dark:text-orange-400" />
                    <h3 className="font-semibold text-gray-900
                                   dark:text-white">
                        Recent Comments
                    </h3>
                </div>

                <div className="space-y-3">
                    {activity.recentComments?.slice(0, 5).map((comment) => (
                        <div
                            key={comment._id}
                            className="p-2 rounded-lg
                                       hover:bg-gray-50
                                       dark:hover:bg-gray-700/50
                                       transition-colors"
                        >
                            <div className="flex items-center gap-2
                                            mb-1">
                                <Avatar
                                    src={comment.author?.avatar}
                                    name={comment.author?.name}
                                    size="sm"
                                />
                                <span className="text-sm font-medium
                                                 text-gray-900
                                                 dark:text-white">
                                    {comment.author?.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {timeAgo(comment.createdAt)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500
                                          dark:text-gray-400
                                          line-clamp-2 ml-10">
                                {comment.content}
                            </p>
                            {comment.blog && (
                                <p className="text-xs text-indigo-600
                                              dark:text-indigo-400
                                              ml-10 mt-1">
                                    on: {comment.blog.title}
                                </p>
                            )}
                        </div>
                    ))}

                    {(!activity.recentComments ||
                        activity.recentComments.length === 0) && (
                        <p className="text-sm text-gray-500
                                      text-center py-4">
                            No recent comments
                        </p>
                    )}
                </div>
            </div>

            {/* Recent Subscribers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl
                            border border-gray-200
                            dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <HiOutlineMail className="w-5 h-5 text-pink-600
                                              dark:text-pink-400" />
                    <h3 className="font-semibold text-gray-900
                                   dark:text-white">
                        Recent Subscribers
                    </h3>
                </div>

                <div className="space-y-3">
                    {activity.recentSubscribers?.slice(0, 5).map((sub) => (
                        <div
                            key={sub._id}
                            className="flex items-center
                                       justify-between p-2
                                       rounded-lg"
                        >
                            <p className="text-sm text-gray-700
                                          dark:text-gray-300">
                                {sub.email}
                            </p>
                            <Badge
                                variant={sub.isSubscribed
                                    ? 'success'
                                    : 'danger'
                                }
                            >
                                {sub.isSubscribed
                                    ? 'Active'
                                    : 'Inactive'
                                }
                            </Badge>
                        </div>
                    ))}

                    {(!activity.recentSubscribers ||
                        activity.recentSubscribers.length === 0) && (
                        <p className="text-sm text-gray-500
                                      text-center py-4">
                            No subscribers yet
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}