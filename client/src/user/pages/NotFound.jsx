import { Link } from 'react-router-dom'
import { HiOutlineHome } from 'react-icons/hi'
import Layout from '../components/layout/Layout.jsx'

export default function NotFound() {
    return (
        <Layout>
            <div className="min-h-[70vh] flex items-center
                            justify-center px-4">
                <div className="text-center animate-fade-in">

                    {/* 404 Number */}
                    <h1 className="text-[150px] sm:text-[200px]
                                   font-bold text-indigo-600/10
                                   dark:text-indigo-400/10
                                   leading-none select-none">
                        404
                    </h1>

                    {/* Message */}
                    <div className="-mt-16 sm:-mt-20">
                        <h2 className="text-3xl sm:text-4xl
                                       font-bold text-gray-900
                                       dark:text-white mb-4">
                            Page Not Found
                        </h2>
                        <p className="text-gray-500
                                      dark:text-gray-400
                                      text-lg mb-8
                                      max-w-md mx-auto">
                            Sorry, the page you are looking for
                            does not exist or has been moved.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row
                                        gap-3 justify-center">
                            <Link
                                to="/"
                                className="inline-flex items-center
                                           justify-center gap-2
                                           px-6 py-3 bg-indigo-600
                                           hover:bg-indigo-700
                                           text-white rounded-xl
                                           font-medium
                                           transition-colors"
                            >
                                <HiOutlineHome className="w-5 h-5" />
                                Go Home
                            </Link>
                            <Link
                                to="/blogs"
                                className="inline-flex items-center
                                           justify-center gap-2
                                           px-6 py-3 border-2
                                           border-gray-300
                                           dark:border-gray-600
                                           text-gray-700
                                           dark:text-gray-300
                                           rounded-xl font-medium
                                           hover:bg-gray-50
                                           dark:hover:bg-gray-800
                                           transition-colors"
                            >
                                Browse Blogs
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}