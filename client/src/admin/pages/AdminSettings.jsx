import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
    HiOutlineCog,
    HiOutlineGlobe,
    HiOutlineMail,
    HiOutlinePhotograph
} from 'react-icons/hi'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Button from '../../shared/components/ui/Button.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import {
    getSettings,
    updateSettings
} from '../../services/settingsService.js'
import toast from 'react-hot-toast'

export default function AdminSettings() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [logoPreview, setLogoPreview] = useState(null)
    const [logoFile, setLogoFile] = useState(null)
    const [faviconPreview, setFaviconPreview] = useState(null)
    const [faviconFile, setFaviconFile] = useState(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true)
                const response = await getSettings()
                const settings = response?.data?.settings

                if (settings) {
                    reset({
                        siteName: settings.siteName || '',
                        contactEmail: settings.contactEmail || '',
                        twitter: settings.socialLinks?.twitter || '',
                        facebook: settings.socialLinks?.facebook || '',
                        instagram: settings.socialLinks?.instagram || '',
                        linkedin: settings.socialLinks?.linkedin || ''
                    })

                    if (settings.logo) {
                        setLogoPreview(settings.logo)
                    }
                    if (settings.favicon) {
                        setFaviconPreview(settings.favicon)
                    }
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [reset])

    const handleLogoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setLogoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setLogoPreview(reader.result)
            reader.readAsDataURL(file)
        }
    }

    const handleFaviconChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFaviconFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setFaviconPreview(reader.result)
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = async (data) => {
        try {
            setSaving(true)

            const formData = new FormData()
            formData.append('siteName', data.siteName)
            formData.append('contactEmail', data.contactEmail || '')
            formData.append('socialLinks', JSON.stringify({
                twitter: data.twitter || '',
                facebook: data.facebook || '',
                instagram: data.instagram || '',
                linkedin: data.linkedin || ''
            }))

            if (logoFile) {
                formData.append('logo', logoFile)
            }
            if (faviconFile) {
                formData.append('favicon', faviconFile)
            }

            await updateSettings(formData)
            toast.success('Settings updated successfully!')
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to update settings'
            )
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center py-20">
                    <Spinner size="xl" />
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900
                               dark:text-white flex items-center
                               gap-2">
                    <HiOutlineCog className="w-7 h-7
                                            text-indigo-600
                                            dark:text-indigo-400" />
                    Site Settings
                </h1>
                <p className="text-gray-500 dark:text-gray-400
                              text-sm mt-1">
                    Configure your blog website settings
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3
                                gap-6">

                    {/* Main Settings */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* General Settings */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold
                                           text-gray-900
                                           dark:text-white mb-6
                                           flex items-center gap-2">
                                <HiOutlineGlobe className="w-5 h-5
                                                           text-indigo-600
                                                           dark:text-indigo-400" />
                                General Settings
                            </h2>

                            <div className="space-y-5">
                                {/* Site Name */}
                                <div>
                                    <label className="block text-sm
                                                      font-medium
                                                      text-gray-700
                                                      dark:text-gray-300
                                                      mb-1.5">
                                        Site Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter site name"
                                        {...register('siteName', {
                                            required: 'Site name is required'
                                        })}
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
                                    {errors.siteName && (
                                        <p className="mt-1 text-sm
                                                      text-red-500">
                                            {errors.siteName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Contact Email */}
                                <div>
                                    <label className="block text-sm
                                                      font-medium
                                                      text-gray-700
                                                      dark:text-gray-300
                                                      mb-1.5">
                                        Contact Email
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
                                            placeholder="contact@example.com"
                                            {...register('contactEmail')}
                                            className="w-full pl-10
                                                       pr-4 py-2.5
                                                       rounded-lg
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
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold
                                           text-gray-900
                                           dark:text-white mb-6">
                                Social Media Links
                            </h2>

                            <div className="grid grid-cols-1
                                            sm:grid-cols-2 gap-4">
                                {/* Twitter */}
                                <div>
                                    <label className="block text-sm
                                                      font-medium
                                                      text-gray-700
                                                      dark:text-gray-300
                                                      mb-1.5">
                                        Twitter
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://twitter.com/..."
                                        {...register('twitter')}
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

                                {/* Facebook */}
                                <div>
                                    <label className="block text-sm
                                                      font-medium
                                                      text-gray-700
                                                      dark:text-gray-300
                                                      mb-1.5">
                                        Facebook
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://facebook.com/..."
                                        {...register('facebook')}
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

                                {/* Instagram */}
                                <div>
                                    <label className="block text-sm
                                                      font-medium
                                                      text-gray-700
                                                      dark:text-gray-300
                                                      mb-1.5">
                                        Instagram
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://instagram.com/..."
                                        {...register('instagram')}
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

                                {/* LinkedIn */}
                                <div>
                                    <label className="block text-sm
                                                      font-medium
                                                      text-gray-700
                                                      dark:text-gray-300
                                                      mb-1.5">
                                        LinkedIn
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/..."
                                        {...register('linkedin')}
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
                        </div>

                        {/* Save Button - Bottom */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                loading={saving}
                                size="lg"
                            >
                                <HiOutlineCog className="w-5 h-5" />
                                Save Settings
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar - Images */}
                    <div className="space-y-6">

                        {/* Logo Upload */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold
                                           text-gray-900
                                           dark:text-white mb-4
                                           flex items-center gap-2">
                                <HiOutlinePhotograph
                                    className="w-5 h-5
                                               text-indigo-600
                                               dark:text-indigo-400"
                                />
                                Site Logo
                            </h2>

                            {logoPreview ? (
                                <div className="relative mb-3">
                                    <img
                                        src={logoPreview}
                                        alt="Logo"
                                        className="w-full h-32
                                                   object-contain
                                                   bg-gray-50
                                                   dark:bg-gray-900
                                                   rounded-lg p-4"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLogoPreview(null)
                                            setLogoFile(null)
                                        }}
                                        className="absolute top-2
                                                   right-2 p-1
                                                   bg-red-600
                                                   text-white
                                                   rounded-full
                                                   text-xs
                                                   hover:bg-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col
                                                  items-center
                                                  justify-center
                                                  h-32 border-2
                                                  border-dashed
                                                  border-gray-300
                                                  dark:border-gray-600
                                                  rounded-lg
                                                  cursor-pointer
                                                  hover:border-indigo-400
                                                  transition-colors
                                                  bg-gray-50
                                                  dark:bg-gray-900">
                                    <HiOutlinePhotograph
                                        className="w-8 h-8
                                                   text-gray-400
                                                   mb-2"
                                    />
                                    <span className="text-sm
                                                     text-gray-500">
                                        Upload Logo
                                    </span>
                                    <span className="text-xs
                                                     text-gray-400
                                                     mt-1">
                                        PNG, JPG, WEBP
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Favicon Upload */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold
                                           text-gray-900
                                           dark:text-white mb-4">
                                Favicon
                            </h2>

                            {faviconPreview ? (
                                <div className="relative mb-3">
                                    <div className="flex items-center
                                                    justify-center
                                                    h-24 bg-gray-50
                                                    dark:bg-gray-900
                                                    rounded-lg">
                                        <img
                                            src={faviconPreview}
                                            alt="Favicon"
                                            className="w-16 h-16
                                                       object-contain"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFaviconPreview(null)
                                            setFaviconFile(null)
                                        }}
                                        className="absolute top-2
                                                   right-2 p-1
                                                   bg-red-600
                                                   text-white
                                                   rounded-full
                                                   text-xs
                                                   hover:bg-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col
                                                  items-center
                                                  justify-center
                                                  h-24 border-2
                                                  border-dashed
                                                  border-gray-300
                                                  dark:border-gray-600
                                                  rounded-lg
                                                  cursor-pointer
                                                  hover:border-indigo-400
                                                  transition-colors
                                                  bg-gray-50
                                                  dark:bg-gray-900">
                                    <HiOutlinePhotograph
                                        className="w-6 h-6
                                                   text-gray-400
                                                   mb-1"
                                    />
                                    <span className="text-sm
                                                     text-gray-500">
                                        Upload Favicon
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFaviconChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Help Card */}
                        <div className="bg-indigo-50
                                        dark:bg-indigo-900/20
                                        rounded-xl border
                                        border-indigo-200
                                        dark:border-indigo-800
                                        p-5">
                            <h3 className="font-semibold
                                           text-indigo-900
                                           dark:text-indigo-300
                                           mb-2 text-sm">
                                💡 Tips
                            </h3>
                            <ul className="text-sm text-indigo-700
                                           dark:text-indigo-400
                                           space-y-2">
                                <li>
                                    • Logo should be PNG or SVG
                                    with transparent background
                                </li>
                                <li>
                                    • Favicon should be square
                                    (32x32 or 64x64 pixels)
                                </li>
                                <li>
                                    • Maximum file size is 5MB
                                </li>
                                <li>
                                    • Social links must start
                                    with https://
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}