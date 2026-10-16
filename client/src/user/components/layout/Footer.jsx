import { Link } from 'react-router-dom'
import {
    HiOutlineMail
} from 'react-icons/hi'
import { APP_NAME } from '../../../utils/constants.js'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-gray-300">

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                            py-12">
                <div className="grid grid-cols-1 md:grid-cols-4
                                gap-8">

                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-indigo-600
                                            rounded-lg flex items-center
                                            justify-center">
                                <span className="text-white font-bold
                                                 text-lg">
                                    B
                                </span>
                            </div>
                            <span className="text-xl font-bold text-white">
                                {APP_NAME}
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A modern blogging platform built with
                            MERN Stack. Share your knowledge with
                            the world.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-400
                                               hover:text-indigo-400
                                               text-sm transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blogs"
                                    className="text-gray-400
                                               hover:text-indigo-400
                                               text-sm transition-colors"
                                >
                                    All Blogs
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/search"
                                    className="text-gray-400
                                               hover:text-indigo-400
                                               text-sm transition-colors"
                                >
                                    Search
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">
                            Categories
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/blogs?category=javascript"
                                    className="text-gray-400
                                               hover:text-indigo-400
                                               text-sm transition-colors"
                                >
                                    JavaScript
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blogs?category=react"
                                    className="text-gray-400
                                               hover:text-indigo-400
                                               text-sm transition-colors"
                                >
                                    React
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blogs?category=nodejs"
                                    className="text-gray-400
                                               hover:text-indigo-400
                                               text-sm transition-colors"
                                >
                                    Node.js
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blogs?category=mongodb"
                                    className="text-gray-400
                                               hover:text-indigo-400
                                               text-sm transition-colors"
                                >
                                    MongoDB
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">
                            Contact
                        </h3>
                        <div className="flex items-center gap-2
                                        text-gray-400 text-sm mb-3">
                            <HiOutlineMail className="w-4 h-4" />
                            contact@blogflow.com
                        </div>
                        <p className="text-gray-400 text-sm">
                            Have questions? Reach out to us
                            anytime.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6
                                lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row
                                    items-center justify-between
                                    gap-4">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} {APP_NAME}.
                            All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link
                                to="/login"
                                className="text-gray-500
                                           hover:text-gray-300
                                           text-sm transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="text-gray-500
                                           hover:text-gray-300
                                           text-sm transition-colors"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}