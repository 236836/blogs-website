import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { HiOutlineMail, HiArrowLeft } from 'react-icons/hi'
import { forgotPassword } from '../../services/authService.js'
import { APP_NAME } from '../../utils/constants.js'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const response = await forgotPassword(data)
            toast.success(response.message)
            setSent(true)
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to send email'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center
                        bg-gray-50 dark:bg-gray-950 px-4">
            <div className="w-full max-w-md">

                {/* Back Link */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-1
                               text-sm text-gray-500
                               dark:text-gray-400
                               hover:text-indigo-600
                               dark:hover:text-indigo-400
                               mb-8 transition-colors"
                >
                    <HiArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>

                {/* Card */}
                <div className="bg-white dark:bg-gray-800
                                rounded-2xl shadow-sm p-8
                                border border-gray-200
                                dark:border-gray-700">

                    {/* Logo */}
                    <div className="w-12 h-12 bg-indigo-600
                                    rounded-xl flex items-center
                                    justify-center mb-6">
                        <span className="text-white font-bold
                                         text-xl">
                            B
                        </span>
                    </div>

                    {sent ? (
                        /* Success State */
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100
                                            dark:bg-green-900/30
                                            rounded-full flex
                                            items-center justify-center
                                            mx-auto mb-4">
                                <HiOutlineMail className="w-8 h-8
                                                          text-green-600
                                                          dark:text-green-400" />
                            </div>
                            <h1 className="text-2xl font-bold
                                           text-gray-900
                                           dark:text-white mb-2">
                                Email Sent!
                            </h1>
                            <p className="text-gray-500
                                          dark:text-gray-400 mb-6">
                                Check your inbox for a password
                                reset link. The link expires in
                                15 minutes.
                            </p>
                            <Link
                                to="/login"
                                className="text-indigo-600
                                           dark:text-indigo-400
                                           font-medium
                                           hover:underline"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    ) : (
                        /* Form State */
                        <>
                            <h1 className="text-2xl font-bold
                                           text-gray-900
                                           dark:text-white mb-2">
                                Forgot password?
                            </h1>
                            <p className="text-gray-500
                                          dark:text-gray-400 mb-6">
                                Enter your email and we will send
                                you a reset link.
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)}
                                  className="space-y-4">
                                <div>
                                    <label className="block text-sm
                                                      font-medium
                                                      text-gray-700
                                                      dark:text-gray-300
                                                      mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <HiOutlineMail
                                            className="absolute left-3
                                                       top-1/2
                                                       -translate-y-1/2
                                                       text-gray-400
                                                       w-5 h-5"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^\S+@\S+\.\S+$/,
                                                    message: 'Invalid email'
                                                }
                                            })}
                                            className="w-full pl-10 pr-4
                                                       py-3 rounded-xl
                                                       border
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
                                    {errors.email && (
                                        <p className="mt-1 text-sm
                                                      text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3
                                               bg-indigo-600
                                               hover:bg-indigo-700
                                               text-white rounded-xl
                                               font-medium
                                               transition-colors
                                               disabled:opacity-50
                                               text-sm"
                                >
                                    {loading
                                        ? 'Sending...'
                                        : 'Send Reset Link'
                                    }
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}