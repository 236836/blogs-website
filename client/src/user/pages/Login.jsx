import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeOff
} from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext.jsx'
import { loginUser } from '../../services/authService.js'
import { APP_NAME } from '../../utils/constants.js'
import toast from 'react-hot-toast'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const response = await loginUser(data)

            if (response.success) {
                login(response.data.user, response.data.token)
                toast.success('Login successful!')
                navigate('/')
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Login failed'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">

            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center
                            px-4 sm:px-6 lg:px-8 bg-white
                            dark:bg-gray-950">
                <div className="w-full max-w-md">

                    {/* Logo */}
                    <Link to="/" className="flex items-center
                                           gap-2 mb-8">
                        <div className="w-10 h-10 bg-indigo-600
                                        rounded-xl flex items-center
                                        justify-center">
                            <span className="text-white font-bold
                                             text-xl">
                                B
                            </span>
                        </div>
                        <span className="text-2xl font-bold
                                         text-gray-900
                                         dark:text-white">
                            {APP_NAME}
                        </span>
                    </Link>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900
                                   dark:text-white mb-2">
                        Welcome back
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400
                                  mb-8">
                        Login to your account to continue
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)}
                          className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium
                                              text-gray-700
                                              dark:text-gray-300 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <HiOutlineMail
                                    className="absolute left-3 top-1/2
                                               -translate-y-1/2
                                               text-gray-400 w-5 h-5"
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
                                               focus:border-transparent
                                               text-sm"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium
                                              text-gray-700
                                              dark:text-gray-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <HiOutlineLockClosed
                                    className="absolute left-3 top-1/2
                                               -translate-y-1/2
                                               text-gray-400 w-5 h-5"
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    {...register('password', {
                                        required: 'Password is required'
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
                                               focus:border-transparent
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
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-indigo-600
                                           dark:text-indigo-400
                                           hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600
                                       hover:bg-indigo-700 text-white
                                       rounded-xl font-medium
                                       transition-colors
                                       disabled:opacity-50
                                       disabled:cursor-not-allowed
                                       text-sm"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center text-gray-500
                                  dark:text-gray-400 mt-8 text-sm">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-indigo-600
                                       dark:text-indigo-400
                                       font-medium hover:underline"
                        >
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br
                            from-indigo-600 via-indigo-700
                            to-purple-800 items-center
                            justify-center p-12">
                <div className="text-center text-white max-w-md">
                    <h2 className="text-4xl font-bold mb-6">
                        Start Your Journey
                    </h2>
                    <p className="text-indigo-100 text-lg
                                  leading-relaxed">
                        Join thousands of developers sharing
                        their knowledge. Read, write, and grow
                        together.
                    </p>
                </div>
            </div>
        </div>
    )
}