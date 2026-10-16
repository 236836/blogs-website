import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
    HiOutlineUser,
    HiOutlinePencil,
    HiOutlineCamera,
    HiArrowLeft
} from 'react-icons/hi'
import Layout from '../components/layout/Layout.jsx'
import Button from '../../shared/components/ui/Button.jsx'
import Avatar from '../../shared/components/ui/Avatar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { updateProfile, changePassword } from '../../services/authService.js'
import toast from 'react-hot-toast'

export default function EditProfile() {
    const { user, updateUser } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [avatarFile, setAvatarFile] = useState(null)

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors }
    } = useForm({
        defaultValues: {
            name: user?.name || '',
            username: user?.username || '',
            bio: user?.bio || '',
            twitter: user?.socialLinks?.twitter || '',
            github: user?.socialLinks?.github || '',
            linkedin: user?.socialLinks?.linkedin || '',
            website: user?.socialLinks?.website || ''
        }
    })

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPassword
    } = useForm()

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const onProfileSubmit = async (data) => {
        try {
            setLoading(true)

            const formData = new FormData()
            formData.append('name', data.name)
            formData.append('username', data.username)
            formData.append('bio', data.bio)
            formData.append('socialLinks', JSON.stringify({
                twitter: data.twitter,
                github: data.github,
                linkedin: data.linkedin,
                website: data.website
            }))

            if (avatarFile) {
                formData.append('image', avatarFile)
            }

            const response = await updateProfile(formData)

            if (response.success) {
                updateUser(response.data.user)
                toast.success('Profile updated!')
                navigate(`/profile/${response.data.user.username}`)
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Update failed'
            )
        } finally {
            setLoading(false)
        }
    }

    const onPasswordSubmit = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        try {
            setPasswordLoading(true)
            const response = await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            })

            toast.success(response.message)
            resetPassword()
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to change password'
            )
        } finally {
            setPasswordLoading(false)
        }
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-4 sm:px-6
                            lg:px-8 py-8">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1
                               text-sm text-gray-500
                               dark:text-gray-400
                               hover:text-indigo-600
                               mb-6 transition-colors"
                >
                    <HiArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <h1 className="text-3xl font-bold text-gray-900
                               dark:text-white mb-8">
                    Edit Profile
                </h1>

                {/* Profile Form */}
                <div className="bg-white dark:bg-gray-800
                                rounded-2xl shadow-sm border
                                border-gray-200
                                dark:border-gray-700 p-6 mb-8">

                    <h2 className="text-xl font-bold text-gray-900
                                   dark:text-white mb-6 flex
                                   items-center gap-2">
                        <HiOutlineUser className="w-5 h-5
                                                  text-indigo-600" />
                        Profile Information
                    </h2>

                    <form onSubmit={handleProfileSubmit(onProfileSubmit)}
                          className="space-y-5">

                        {/* Avatar */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Avatar
                                    src={avatarPreview || user?.avatar}
                                    name={user?.name}
                                    size="xl"
                                />
                                <label className="absolute bottom-0
                                                  right-0 w-8 h-8
                                                  bg-indigo-600
                                                  rounded-full flex
                                                  items-center
                                                  justify-center
                                                  cursor-pointer
                                                  hover:bg-indigo-700
                                                  transition-colors">
                                    <HiOutlineCamera
                                        className="w-4 h-4 text-white"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900
                                              dark:text-white">
                                    Profile Picture
                                </p>
                                <p className="text-sm text-gray-500">
                                    JPG, PNG, WEBP. Max 5MB.
                                </p>
                            </div>
                        </div>

                        {/* Name + Username */}
                        <div className="grid grid-cols-1
                                        sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm
                                                  font-medium
                                                  text-gray-700
                                                  dark:text-gray-300
                                                  mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    {...registerProfile('name', {
                                        required: 'Name is required'
                                    })}
                                    className="w-full px-4 py-2.5
                                               rounded-lg border
                                               border-gray-300
                                               dark:border-gray-600
                                               bg-gray-50
                                               dark:bg-gray-900
                                               text-gray-900
                                               dark:text-gray-100
                                               focus:outline-none
                                               focus:ring-2
                                               focus:ring-indigo-500
                                               text-sm"
                                />
                                {profileErrors.name && (
                                    <p className="mt-1 text-sm
                                                  text-red-500">
                                        {profileErrors.name.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm
                                                  font-medium
                                                  text-gray-700
                                                  dark:text-gray-300
                                                  mb-1.5">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    {...registerProfile('username', {
                                        required: 'Username is required'
                                    })}
                                    className="w-full px-4 py-2.5
                                               rounded-lg border
                                               border-gray-300
                                               dark:border-gray-600
                                               bg-gray-50
                                               dark:bg-gray-900
                                               text-gray-900
                                               dark:text-gray-100
                                               focus:outline-none
                                               focus:ring-2
                                               focus:ring-indigo-500
                                               text-sm"
                                />
                                {profileErrors.username && (
                                    <p className="mt-1 text-sm
                                                  text-red-500">
                                        {profileErrors.username.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium
                                              text-gray-700
                                              dark:text-gray-300 mb-1.5">
                                Bio
                            </label>
                            <textarea
                                rows={3}
                                maxLength={200}
                                {...registerProfile('bio')}
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-2.5
                                           rounded-lg border
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
                                           resize-none text-sm"
                            />
                        </div>

                        {/* Social Links */}
                        <div className="grid grid-cols-1
                                        sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm
                                                  font-medium
                                                  text-gray-700
                                                  dark:text-gray-300
                                                  mb-1.5">
                                    Twitter URL
                                </label>
                                <input
                                    type="url"
                                    {...registerProfile('twitter')}
                                    placeholder="https://twitter.com/..."
                                    className="w-full px-4 py-2.5
                                               rounded-lg border
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

                            <div>
                                <label className="block text-sm
                                                  font-medium
                                                  text-gray-700
                                                  dark:text-gray-300
                                                  mb-1.5">
                                    GitHub URL
                                </label>
                                <input
                                    type="url"
                                    {...registerProfile('github')}
                                    placeholder="https://github.com/..."
                                    className="w-full px-4 py-2.5
                                               rounded-lg border
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

                            <div>
                                <label className="block text-sm
                                                  font-medium
                                                  text-gray-700
                                                  dark:text-gray-300
                                                  mb-1.5">
                                    LinkedIn URL
                                </label>
                                <input
                                    type="url"
                                    {...registerProfile('linkedin')}
                                    placeholder="https://linkedin.com/in/..."
                                    className="w-full px-4 py-2.5
                                               rounded-lg border
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

                            <div>
                                <label className="block text-sm
                                                  font-medium
                                                  text-gray-700
                                                  dark:text-gray-300
                                                  mb-1.5">
                                    Website URL
                                </label>
                                <input
                                    type="url"
                                    {...registerProfile('website')}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2.5
                                               rounded-lg border
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
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full sm:w-auto"
                        >
                            <HiOutlinePencil className="w-4 h-4" />
                            Save Changes
                        </Button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-white dark:bg-gray-800
                                rounded-2xl shadow-sm border
                                border-gray-200
                                dark:border-gray-700 p-6">

                    <h2 className="text-xl font-bold text-gray-900
                                   dark:text-white mb-6">
                        Change Password
                    </h2>

                    <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                          className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium
                                              text-gray-700
                                              dark:text-gray-300 mb-1.5">
                                Current Password
                            </label>
                            <input
                                type="password"
                                {...registerPassword('currentPassword', {
                                    required: 'Current password is required'
                                })}
                                className="w-full px-4 py-2.5
                                           rounded-lg border
                                           border-gray-300
                                           dark:border-gray-600
                                           bg-gray-50
                                           dark:bg-gray-900
                                           text-gray-900
                                           dark:text-gray-100
                                           focus:outline-none
                                           focus:ring-2
                                           focus:ring-indigo-500
                                           text-sm"
                            />
                            {passwordErrors.currentPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {passwordErrors.currentPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1
                                        sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm
                                                  font-medium
                                                  text-gray-700
                                                  dark:text-gray-300
                                                  mb-1.5">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    {...registerPassword('newPassword', {
                                        required: 'New password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Min 6 characters'
                                        }
                                    })}
                                    className="w-full px-4 py-2.5
                                               rounded-lg border
                                               border-gray-300
                                               dark:border-gray-600
                                               bg-gray-50
                                               dark:bg-gray-900
                                               text-gray-900
                                               dark:text-gray-100
                                               focus:outline-none
                                               focus:ring-2
                                               focus:ring-indigo-500
                                               text-sm"
                                />
                                {passwordErrors.newPassword && (
                                    <p className="mt-1 text-sm
                                                  text-red-500">
                                        {passwordErrors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm
                                                  font-medium
                                                  text-gray-700
                                                  dark:text-gray-300
                                                  mb-1.5">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    {...registerPassword('confirmPassword', {
                                        required: 'Confirm password'
                                    })}
                                    className="w-full px-4 py-2.5
                                               rounded-lg border
                                               border-gray-300
                                               dark:border-gray-600
                                               bg-gray-50
                                               dark:bg-gray-900
                                               text-gray-900
                                               dark:text-gray-100
                                               focus:outline-none
                                               focus:ring-2
                                               focus:ring-indigo-500
                                               text-sm"
                                />
                                {passwordErrors.confirmPassword && (
                                    <p className="mt-1 text-sm
                                                  text-red-500">
                                        {passwordErrors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="danger"
                            loading={passwordLoading}
                        >
                            Change Password
                        </Button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}