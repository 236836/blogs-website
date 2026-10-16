import {
    HiOutlineMenu,
    HiOutlineMoon,
    HiOutlineSun,
    HiOutlineBell
} from 'react-icons/hi'
import { useAuth } from '../../../context/AuthContext.jsx'
import { useTheme } from '../../../context/ThemeContext.jsx'
import Avatar from '../../../shared/components/ui/Avatar.jsx'

export default function AdminHeader({ onMenuClick }) {
    const { user } = useAuth()
    const { isDark, toggleTheme } = useTheme()

    return (
        <header className="h-16 bg-white dark:bg-gray-900
                           border-b border-gray-200
                           dark:border-gray-800 flex items-center
                           justify-between px-4 sm:px-6
                           sticky top-0 z-30">

            {/* Left */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg
                           text-gray-500 hover:bg-gray-100
                           dark:hover:bg-gray-800"
            >
                <HiOutlineMenu className="w-6 h-6" />
            </button>

            {/* Right */}
            <div className="flex items-center gap-3 ml-auto">

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

                {/* Notifications */}
                <button className="p-2 rounded-lg text-gray-500
                                   dark:text-gray-400
                                   hover:bg-gray-100
                                   dark:hover:bg-gray-800
                                   transition-colors relative">
                    <HiOutlineBell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5
                                     w-2 h-2 bg-red-500
                                     rounded-full" />
                </button>

                {/* User */}
                <div className="flex items-center gap-2 pl-3
                                border-l border-gray-200
                                dark:border-gray-700">
                    <Avatar
                        src={user?.avatar}
                        name={user?.name}
                        size="sm"
                    />
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium
                                      text-gray-900
                                      dark:text-white">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            Admin
                        </p>
                    </div>
                </div>
            </div>
        </header>
    )
}