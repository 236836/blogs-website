import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
    HiX,
    HiOutlineSearch,
    HiOutlineHome,
    HiOutlineBookOpen,
    HiOutlineUser,
    HiOutlineLogin,
    HiOutlineLogout,
    HiOutlineCog
} from 'react-icons/hi'
import { useAuth } from '../../../context/AuthContext.jsx'
import { APP_NAME } from '../../../utils/constants.js'

export default function MobileMenu({ isOpen, onClose }) {
    const { user, isAuthenticated, isAdmin, logout } = useAuth()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`)
            setSearchQuery('')
            onClose()
        }
    }

    const handleLogout = () => {
        logout()
        onClose()
        navigate('/login')
    }

    const handleLinkClick = () => {
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Menu Panel */}
            <div className="fixed top-0 right-0 h-full w-72
                            bg-white dark:bg-gray-900 shadow-2xl
                            overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between
                                p-4 border-b border-gray-200
                                dark:border-gray-800">
                    <span className="text-lg font-bold
                                     text-gray-900 dark:text-white">
                        {APP_NAME}
                    </span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-500
                                   hover:bg-gray-100
                                   dark:hover:bg-gray-800"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="p-4">
                    <div className="relative">
                        <HiOutlineSearch
                            className="absolute left-3 top-1/2
                                       -translate-y-1/2 text-gray-400
                                       w-4 h-4"
                        />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm
                                       rounded-lg border border-gray-300
                                       dark:border-gray-600
                                       bg-gray-50 dark:bg-gray-800
                                       text-gray-900 dark:text-gray-100
                                       focus:outline-none focus:ring-2
                                       focus:ring-indigo-500
                                       placeholder-gray-400"
                        />
                    </div>
                </form>

                {/* Links */}
                <div className="px-2">
                    <Link
                        to="/"
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 px-4 py-3
                                   text-gray-700 dark:text-gray-300
                                   hover:bg-gray-50
                                   dark:hover:bg-gray-800 rounded-lg"
                    >
                        <HiOutlineHome className="w-5 h-5" />
                        Home
                    </Link>

                    <Link
                        to="/blogs"
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 px-4 py-3
                                   text-gray-700 dark:text-gray-300
                                   hover:bg-gray-50
                                   dark:hover:bg-gray-800 rounded-lg"
                    >
                        <HiOutlineBookOpen className="w-5 h-5" />
                        Blogs
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                to={`/profile/${user?.username}`}
                                onClick={handleLinkClick}
                                className="flex items-center gap-3
                                           px-4 py-3 text-gray-700
                                           dark:text-gray-300
                                           hover:bg-gray-50
                                           dark:hover:bg-gray-800
                                           rounded-lg"
                            >
                                <HiOutlineUser className="w-5 h-5" />
                                Profile
                            </Link>

                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-3
                                               px-4 py-3 text-indigo-600
                                               dark:text-indigo-400
                                               hover:bg-gray-50
                                               dark:hover:bg-gray-800
                                               rounded-lg"
                                >
                                    <HiOutlineCog className="w-5 h-5" />
                                    Admin Panel
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3
                                           px-4 py-3 text-red-600
                                           hover:bg-red-50
                                           dark:hover:bg-red-900/20
                                           rounded-lg w-full"
                            >
                                <HiOutlineLogout className="w-5 h-5" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={handleLinkClick}
                                className="flex items-center gap-3
                                           px-4 py-3 text-gray-700
                                           dark:text-gray-300
                                           hover:bg-gray-50
                                           dark:hover:bg-gray-800
                                           rounded-lg"
                            >
                                <HiOutlineLogin className="w-5 h-5" />
                                Login
                            </Link>

                            <div className="px-4 pt-2">
                                <Link
                                    to="/register"
                                    onClick={handleLinkClick}
                                    className="flex items-center
                                               justify-center py-2.5
                                               bg-indigo-600 text-white
                                               rounded-lg font-medium
                                               hover:bg-indigo-700
                                               transition-colors w-full"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}