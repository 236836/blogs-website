import { Link, useLocation } from 'react-router-dom'
import {
    HiOutlineHome,
    HiOutlineDocumentText,
    HiOutlineFolder,
    HiOutlineTag,
    HiOutlineUsers,
    HiOutlineChatAlt2,
    HiOutlineMail,
    HiOutlineCog,
    HiOutlineX,
    HiOutlineArrowLeft
} from 'react-icons/hi'
import { APP_NAME } from '../../../utils/constants.js'

export default function AdminSidebar({ isOpen, onClose }) {
    const location = useLocation()

    const menuItems = [
        {
            label: 'Dashboard',
            path: '/admin',
            icon: HiOutlineHome
        },
        {
            label: 'Blogs',
            path: '/admin/blogs',
            icon: HiOutlineDocumentText
        },
        {
            label: 'Categories',
            path: '/admin/categories',
            icon: HiOutlineFolder
        },
        {
            label: 'Tags',
            path: '/admin/tags',
            icon: HiOutlineTag
        },
        {
            label: 'Users',
            path: '/admin/users',
            icon: HiOutlineUsers
        },
        {
            label: 'Comments',
            path: '/admin/comments',
            icon: HiOutlineChatAlt2
        },
        {
            label: 'Newsletter',
            path: '/admin/newsletter',
            icon: HiOutlineMail
        },
        {
            label: 'Settings',
            path: '/admin/settings',
            icon: HiOutlineCog
        }
    ]

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin'
        }
        return location.pathname.startsWith(path)
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40
                               lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64
                              bg-white dark:bg-gray-900
                              border-r border-gray-200
                              dark:border-gray-800 z-50
                              transition-transform duration-300
                              lg:translate-x-0 lg:static
                              ${isOpen
                                  ? 'translate-x-0'
                                  : '-translate-x-full'
                              }`}>

                {/* Logo */}
                <div className="flex items-center justify-between
                                h-16 px-4 border-b border-gray-200
                                dark:border-gray-800">
                    <Link
                        to="/admin"
                        className="flex items-center gap-2"
                    >
                        <div className="w-8 h-8 bg-indigo-600
                                        rounded-lg flex items-center
                                        justify-center">
                            <span className="text-white font-bold">
                                B
                            </span>
                        </div>
                        <span className="font-bold text-gray-900
                                         dark:text-white">
                            {APP_NAME}
                        </span>
                        <span className="text-xs bg-indigo-100
                                         dark:bg-indigo-900/30
                                         text-indigo-600
                                         dark:text-indigo-400
                                         px-2 py-0.5 rounded-full
                                         font-medium">
                            Admin
                        </span>
                    </Link>

                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg
                                   text-gray-500 hover:bg-gray-100
                                   dark:hover:bg-gray-800"
                    >
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>

                {/* Menu */}
                <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3
                                       py-2.5 rounded-lg text-sm
                                       font-medium transition-colors
                                       ${isActive(item.path)
                                           ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                           : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                       }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Back to Site */}
                <div className="p-3 border-t border-gray-200
                                dark:border-gray-800">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3
                                   py-2.5 rounded-lg text-sm
                                   font-medium text-gray-600
                                   dark:text-gray-400
                                   hover:bg-gray-50
                                   dark:hover:bg-gray-800
                                   transition-colors"
                    >
                        <HiOutlineArrowLeft className="w-5 h-5" />
                        Back to Site
                    </Link>
                </div>
            </aside>
        </>
    )
}