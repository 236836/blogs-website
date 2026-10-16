import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeOff
} from 'react-icons/hi'
import { resetPassword } from '../../services/authService.js'
import toast from 'react-hot-toast'

export default function ResetPassword() {
    const { token } = useParams()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm()

    const newPassword = watch('newPassword')

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const response = await resetPassword(token, {
                newPassword: data.newPassword
            })
            toast.success(response.message)
            navigate('/login')
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Password reset failed'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center
                        bg-gray-50 dark:bg-gray-950 px-4">
            <div className="w-full max-w-md">

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

                    <h1 className="text-2xl font-bold text-gray-900
                                   dark:text-white mb-2">
                        Reset Password
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400
                                  mb-6">
                        Enter your new password below.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)}
                          className="space-y-4">

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium
                                              text-gray-700
                                              dark:text-gray-300 mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <HiOutlineLockClosed
                                    className="absolute left-3 top-1/2
                                               -translate-y-1/2
                                               text-gray-400 w-5 h-5"
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    {...register('newPassword', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Min 6 characters'
                                        }
                                    })}
                                    className="w-full pl-10 pr-12 py-3
                                               rounded-xl border
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
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2
                                               -translate-y-1/2
                                               text-gray-400
                                               hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <HiOutlineEyeOff className="w-5 h-5" />
                                    ) : (
                                        <HiOutlineEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium
                                              text-gray-700
                                              dark:text-gray-300 mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <HiOutlineLockClosed
                                    className="absolute left-3 top-1/2
                                               -translate-y-1/2
                                               text-gray-400 w-5 h-5"
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    {...register('confirmPassword', {
                                        required: 'Please confirm password',
                                        validate: (value) =>
                                            value === newPassword ||
                                            'Passwords do not match'
                                    })}
                                    className="w-full pl-10 pr-4 py-3
                                               rounded-xl border
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
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600
                                       hover:bg-indigo-700 text-white
                                       rounded-xl font-medium
                                       transition-colors
                                       disabled:opacity-50 text-sm"
                        >
                            {loading
                                ? 'Resetting...'
                                : 'Reset Password'
                            }
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-gray-500
                                  dark:text-gray-400 mt-6 text-sm">
                        Remember your password?{' '}
                        <Link
                            to="/login"
                            className="text-indigo-600
                                       dark:text-indigo-400
                                       font-medium hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}