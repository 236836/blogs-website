import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    HiOutlineSearch,
    HiOutlineMenu,
    HiOutlineMoon,
    HiOutlineSun,
    HiOutlineUser,
    HiOutlineLogout,
    HiOutlineCog,
    HiOutlineBookmark,
    HiOutlineHeart
} from 'react-icons/hi'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useTheme } from '../../../context/ThemeContext.jsx'
import { APP_NAME, DEFAULT_AVATAR } from '../../../utils/constants.js'
import MobileMenu from './MobileMenu.jsx'

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth()
    const { isDark, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`)
            setSearchQuery('')
        }
    }

    const handleLogout = () => {
        logout()
        setShowProfileMenu(false)
        navigate('/login')
    }

    const avatarUrl = user?.avatar || `${DEFAULT_AVATAR}${encodeURIComponent(user?.name || 'User')}`

    return (
        <>
            <nav className="bg-white dark:bg-gray-900 border-b
                            border-gray-200 dark:border-gray-800
                            sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-2"
                        >
                            <div className="w-9 h-9 bg-indigo-600
                                            rounded-lg flex items-center
                                            justify-center">
                                <span className="text-white font-bold
                                                 text-lg">
                                    B
                                </span>
                            </div>
                            <span className="text-xl font-bold
                                             text-gray-900
                                             dark:text-white
                                             hidden sm:block">
                                {APP_NAME}
                            </span>
                        </Link>

                        {/* Navigation Links - Desktop */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link
                                to="/"
                                className="text-gray-600 dark:text-gray-300
                                           hover:text-indigo-600
                                           dark:hover:text-indigo-400
                                           font-medium transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                to="/blogs"
                                className="text-gray-600 dark:text-gray-300
                                           hover:text-indigo-600
                                           dark:hover:text-indigo-400
                                           font-medium transition-colors"
                            >
                                Blogs
                            </Link>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">

                            {/* Search Bar - Desktop */}
                            <form
                                onSubmit={handleSearch}
                                className="hidden md:flex items-center"
                            >
                                <div className="relative">
                                    <HiOutlineSearch
                                        className="absolute left-3 top-1/2
                                                   -translate-y-1/2
                                                   text-gray-400 w-4 h-4"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search blogs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-48 lg:w-64 pl-9 pr-4
                                                   py-2 text-sm rounded-lg
                                                   border border-gray-300
                                                   dark:border-gray-600
                                                   bg-gray-50
                                                   dark:bg-gray-800
                                                   text-gray-900
                                                   dark:text-gray-100
                                                   focus:outline-none
                                                   focus:ring-2
                                                   focus:ring-indigo-500
                                                   focus:border-transparent
                                                   placeholder-gray-400"
                                    />
                                </div>
                            </form>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-gray-500
                                           dark:text-gray-400
                                           hover:bg-gray-100
                                           dark:hover:bg-gray-800
                                           transition-colors"
                            >
                                {isDark ? (
                                    <HiOutlineSun className="w-5 h-5" />
                                ) : (
                                    <HiOutlineMoon className="w-5 h-5" />
                                )}
                            </button>

                            {/* Auth Buttons or Profile */}
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center gap-2
                                                   p-1 rounded-lg
                                                   hover:bg-gray-100
                                                   dark:hover:bg-gray-800
                                                   transition-colors"
                                    >
                                        <img
                                            src={avatarUrl}
                                            alt={user?.name}
                                            className="w-8 h-8 rounded-full
                                                       object-cover
                                                       border-2
                                                       border-indigo-200"
                                            onError={(e) => {
                                                e.target.src = `${DEFAULT_AVATAR}${encodeURIComponent(user?.name || 'User')}`
                                            }}
                                        />
                                    </button>

                                    {/* Profile Dropdown */}
                                    {showProfileMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowProfileMenu(false)}
                                            />
                                            <div className="absolute right-0
                                                            mt-2 w-56 z-20
                                                            bg-white
                                                            dark:bg-gray-800
                                                            rounded-xl
                                                            shadow-lg
                                                            border
                                                            border-gray-200
                                                            dark:border-gray-700
                                                            py-2">
                                                {/* User Info */}
                                                <div className="px-4 py-2
                                                                border-b
                                                                border-gray-100
                                                                dark:border-gray-700">
                                                    <p className="font-medium
                                                                  text-gray-900
                                                                  dark:text-white
                                                                  text-sm">
                                                        {user?.name}
                                                    </p>
                                                    <p className="text-xs
                                                                  text-gray-500">
                                                        @{user?.username}
                                                    </p>
                                                </div>

                                                {/* Menu Items */}
                                                <Link
                                                    to={`/profile/${user?.username}`}
                                                    onClick={() => setShowProfileMenu(false)}
                                                    className="flex items-center
                                                               gap-2 px-4 py-2
                                                               text-sm
                                                               text-gray-700
                                                               dark:text-gray-300
                                                               hover:bg-gray-50
                                                               dark:hover:bg-gray-700"
                                                >
                                                    <HiOutlineUser className="w-4 h-4" />
                                                    Profile
                                                </Link>

                                                <Link
                                                    to={`/profile/${user?.username}`}
                                                    onClick={() => setShowProfileMenu(false)}
                                                    className="flex items-center
                                                               gap-2 px-4 py-2
                                                               text-sm
                                                               text-gray-700
                                                               dark:text-gray-300
                                                               hover:bg-gray-50
                                                               dark:hover:bg-gray-700"
                                                >
                                                    <HiOutlineBookmark className="w-4 h-4" />
                                                    Saved Blogs
                                                </Link>

                                                <Link
                                                    to={`/profile/${user?.username}`}
                                                    onClick={() => setShowProfileMenu(false)}
                                                    className="flex items-center
                                                               gap-2 px-4 py-2
                                                               text-sm
                                                               text-gray-700
                                                               dark:text-gray-300
                                                               hover:bg-gray-50
                                                               dark:hover:bg-gray-700"
                                                >
                                                    <HiOutlineHeart className="w-4 h-4" />
                                                    Liked Blogs
                                                </Link>

                                                {/* Admin Link */}
                                                {isAdmin && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setShowProfileMenu(false)}
                                                        className="flex items-center
                                                                   gap-2 px-4 py-2
                                                                   text-sm
                                                                   text-indigo-600
                                                                   dark:text-indigo-400
                                                                   hover:bg-gray-50
                                                                   dark:hover:bg-gray-700"
                                                    >
                                                        <HiOutlineCog className="w-4 h-4" />
                                                        Admin Panel
                                                    </Link>
                                                )}

                                                {/* Logout */}
                                                <div className="border-t
                                                                border-gray-100
                                                                dark:border-gray-700
                                                                mt-1 pt-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center
                                                                   gap-2 px-4 py-2
                                                                   text-sm w-full
                                                                   text-red-600
                                                                   hover:bg-red-50
                                                                   dark:hover:bg-red-900/20"
                                                    >
                                                        <HiOutlineLogout className="w-4 h-4" />
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm
                                                   font-medium text-gray-700
                                                   dark:text-gray-300
                                                   hover:text-indigo-600
                                                   transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 text-sm
                                                   font-medium bg-indigo-600
                                                   text-white rounded-lg
                                                   hover:bg-indigo-700
                                                   transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setShowMobileMenu(true)}
                                className="md:hidden p-2 rounded-lg
                                           text-gray-500
                                           hover:bg-gray-100
                                           dark:hover:bg-gray-800"
                            >
                                <HiOutlineMenu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={showMobileMenu}
                onClose={() => setShowMobileMenu(false)}
            />
        </>
    )
}