import { Link } from 'react-router-dom'
import {
    HiOutlinePencil,
    HiOutlineGlobe,
    HiOutlineCalendar
} from 'react-icons/hi'
import { useAuth } from '../../../context/AuthContext.jsx'
import Avatar from '../../../shared/components/ui/Avatar.jsx'
import Badge from '../../../shared/components/ui/Badge.jsx'
import { formatDate } from '../../../utils/formatDate.js'

export default function ProfileHeader({ profileUser, stats }) {
    const { user } = useAuth()

    if (!profileUser) return null

    const isOwnProfile = user?._id === profileUser._id

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl
                        shadow-sm border border-gray-200
                        dark:border-gray-700 overflow-hidden">

            {/* Cover */}
            <div className="h-32 sm:h-40 bg-gradient-to-r
                            from-indigo-600 via-indigo-700
                            to-purple-700" />

            {/* Profile Info */}
            <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="flex flex-col sm:flex-row
                                items-start sm:items-end
                                gap-4 -mt-12 sm:-mt-16 mb-4">
                    <Avatar
                        src={profileUser.avatar}
                        name={profileUser.name}
                        size="xl"
                        className="ring-4 ring-white
                                   dark:ring-gray-800
                                   w-24 h-24 sm:w-32 sm:h-32"
                    />

                    <div className="flex-1 flex flex-col
                                    sm:flex-row sm:items-center
                                    sm:justify-between w-full">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold
                                               text-gray-900
                                               dark:text-white">
                                    {profileUser.name}
                                </h1>
                                {profileUser.role === 'admin' && (
                                    <Badge variant="primary">
                                        Admin
                                    </Badge>
                                )}
                            </div>
                            <p className="text-gray-500
                                          dark:text-gray-400">
                                @{profileUser.username}
                            </p>
                        </div>

                        {isOwnProfile && (
                            <Link
                                to="/profile/edit"
                                className="mt-3 sm:mt-0 inline-flex
                                           items-center gap-1.5
                                           px-4 py-2 bg-indigo-600
                                           hover:bg-indigo-700
                                           text-white text-sm
                                           font-medium rounded-lg
                                           transition-colors"
                            >
                                <HiOutlinePencil className="w-4 h-4" />
                                Edit Profile
                            </Link>
                        )}
                    </div>
                </div>

                {/* Bio */}
                {profileUser.bio && (
                    <p className="text-gray-600 dark:text-gray-400
                                  mb-4 leading-relaxed">
                        {profileUser.bio}
                    </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4
                                text-sm text-gray-500
                                dark:text-gray-400 mb-6">
                    <span className="flex items-center gap-1.5">
                        <HiOutlineCalendar className="w-4 h-4" />
                        Joined {formatDate(profileUser.createdAt)}
                    </span>

                    {profileUser.socialLinks?.website && (
                        <a
                            href={profileUser.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5
                                       text-indigo-600
                                       dark:text-indigo-400
                                       hover:underline"
                        >
                            <HiOutlineGlobe className="w-4 h-4" />
                            Website
                        </a>
                    )}
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {profileUser.socialLinks?.twitter && (
                        <a
                            href={profileUser.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-sky-100
                                       dark:bg-sky-900/30
                                       text-sky-600
                                       dark:text-sky-400
                                       rounded-lg text-xs
                                       font-medium hover:bg-sky-200
                                       dark:hover:bg-sky-900/50
                                       transition-colors"
                        >
                            Twitter
                        </a>
                    )}

                    {profileUser.socialLinks?.github && (
                        <a
                            href={profileUser.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-gray-100
                                       dark:bg-gray-700
                                       text-gray-700
                                       dark:text-gray-300
                                       rounded-lg text-xs
                                       font-medium hover:bg-gray-200
                                       dark:hover:bg-gray-600
                                       transition-colors"
                        >
                            GitHub
                        </a>
                    )}

                    {profileUser.socialLinks?.linkedin && (
                        <a
                            href={profileUser.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-blue-100
                                       dark:bg-blue-900/30
                                       text-blue-600
                                       dark:text-blue-400
                                       rounded-lg text-xs
                                       font-medium hover:bg-blue-200
                                       dark:hover:bg-blue-900/50
                                       transition-colors"
                        >
                            LinkedIn
                        </a>
                    )}
                </div>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-3 gap-4 pt-4
                                    border-t border-gray-200
                                    dark:border-gray-700">
                        <div className="text-center">
                            <p className="text-2xl font-bold
                                          text-gray-900
                                          dark:text-white">
                                {stats.totalBlogs || 0}
                            </p>
                            <p className="text-sm text-gray-500
                                          dark:text-gray-400">
                                Blogs
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold
                                          text-gray-900
                                          dark:text-white">
                                {stats.totalComments || 0}
                            </p>
                            <p className="text-sm text-gray-500
                                          dark:text-gray-400">
                                Comments
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold
                                          text-gray-900
                                          dark:text-white">
                                {stats.totalLikesReceived || 0}
                            </p>
                            <p className="text-sm text-gray-500
                                          dark:text-gray-400">
                                Likes
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}