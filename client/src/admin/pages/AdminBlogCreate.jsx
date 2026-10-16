import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { HiArrowLeft, HiOutlinePhotograph } from 'react-icons/hi'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Button from '../../shared/components/ui/Button.jsx'
import { createBlog } from '../../services/blogService.js'
import { getAllCategories } from '../../services/categoryService.js'
import { getAllTags } from '../../services/tagService.js'
import toast from 'react-hot-toast'

export default function AdminBlogCreate() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const [imagePreview, setImagePreview] = useState(null)
    const [imageFile, setImageFile] = useState(null)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, tagRes] = await Promise.allSettled([
                    getAllCategories(),
                    getAllTags()
                ])

                if (catRes.status === 'fulfilled') {
                    setCategories(catRes.value?.data?.categories || [])
                }
                if (tagRes.status === 'fulfilled') {
                    setTags(tagRes.value?.data?.tags || [])
                }
            } catch (error) {
                console.error('Failed to fetch data:', error)
            }
        }

        fetchData()
    }, [])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result)
            reader.readAsDataURL(file)
        }
    }

    const toggleTag = (tagId) => {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        )
    }

    const onSubmit = async (data) => {
        try {
            setLoading(true)

            const formData = new FormData()
            formData.append('title', data.title)
            formData.append('content', data.content)
            formData.append('excerpt', data.excerpt || '')
            formData.append('category', data.category)
            formData.append('status', data.status)
            formData.append('isFeatured', data.isFeatured || false)
            formData.append('metaTitle', data.metaTitle || '')
            formData.append('metaDescription', data.metaDescription || '')

            if (selectedTags.length > 0) {
                formData.append('tags', selectedTags.join(','))
            }

            if (imageFile) {
                formData.append('image', imageFile)
            }

            await createBlog(formData)
            toast.success('Blog created successfully!')
            navigate('/admin/blogs')
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to create blog'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/blogs')}
                    className="p-2 rounded-lg text-gray-500
                               hover:bg-gray-100
                               dark:hover:bg-gray-800
                               transition-colors"
                >
                    <HiArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900
                               dark:text-white">
                    Create New Blog
                </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Title */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-5">
                            <label className="block text-sm
                                              font-medium
                                              text-gray-700
                                              dark:text-gray-300
                                              mb-1.5">
                                Blog Title *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter blog title"
                                {...register('title', {
                                    required: 'Title is required'
                                })}
                                className="w-full px-4 py-3
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
                                           text-lg font-medium"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm
                                              text-red-500">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Excerpt */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-5">
                            <label className="block text-sm
                                              font-medium
                                              text-gray-700
                                              dark:text-gray-300
                                              mb-1.5">
                                Excerpt
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Brief description of the blog..."
                                {...register('excerpt')}
                                className="w-full px-4 py-3
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

                        {/* Content */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-5">
                            <label className="block text-sm
                                              font-medium
                                              text-gray-700
                                              dark:text-gray-300
                                              mb-1.5">
                                Content * (HTML supported)
                            </label>
                            <textarea
                                rows={15}
                                placeholder="Write your blog content here... HTML tags supported"
                                {...register('content', {
                                    required: 'Content is required'
                                })}
                                className="w-full px-4 py-3
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
                                           resize-none text-sm
                                           font-mono"
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm
                                              text-red-500">
                                    {errors.content.message}
                                </p>
                            )}
                        </div>

                        {/* SEO */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-5">
                            <h3 className="font-semibold text-gray-900
                                           dark:text-white mb-4">
                                SEO Settings
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm
                                                      font-medium
                                                      text-gray-700
                                                      dark:text-gray-300
                                                      mb-1.5">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="SEO title"
                                        {...register('metaTitle')}
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
                                        Meta Description
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="SEO description"
                                        {...register('metaDescription')}
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
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        {/* Publish */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-5">
                            <h3 className="font-semibold text-gray-900
                                           dark:text-white mb-4">
                                Publish
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm
                                                      font-medium
                                                      text-gray-700
                                                      dark:text-gray-300
                                                      mb-1.5">
                                        Status
                                    </label>
                                    <select
                                        {...register('status')}
                                        className="w-full px-3 py-2.5
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
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>

                                <label className="flex items-center
                                                  gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register('isFeatured')}
                                        className="w-4 h-4 rounded
                                                   border-gray-300
                                                   text-indigo-600
                                                   focus:ring-indigo-500"
                                    />
                                    <span className="text-sm
                                                     text-gray-700
                                                     dark:text-gray-300">
                                        Featured Post
                                    </span>
                                </label>

                                <Button
                                    type="submit"
                                    loading={loading}
                                    fullWidth
                                >
                                    Create Blog
                                </Button>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-5">
                            <h3 className="font-semibold text-gray-900
                                           dark:text-white mb-4">
                                Featured Image
                            </h3>

                            {imagePreview ? (
                                <div className="relative mb-3">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-40
                                                   object-cover
                                                   rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null)
                                            setImageFile(null)
                                        }}
                                        className="absolute top-2
                                                   right-2 p-1
                                                   bg-red-600
                                                   text-white
                                                   rounded-full
                                                   text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col
                                                  items-center
                                                  justify-center
                                                  h-40 border-2
                                                  border-dashed
                                                  border-gray-300
                                                  dark:border-gray-600
                                                  rounded-lg
                                                  cursor-pointer
                                                  hover:border-indigo-400
                                                  transition-colors">
                                    <HiOutlinePhotograph
                                        className="w-8 h-8
                                                   text-gray-400 mb-2"
                                    />
                                    <span className="text-sm
                                                     text-gray-500">
                                        Click to upload
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Category */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-5">
                            <h3 className="font-semibold text-gray-900
                                           dark:text-white mb-4">
                                Category *
                            </h3>
                            <select
                                {...register('category', {
                                    required: 'Category is required'
                                })}
                                className="w-full px-3 py-2.5
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
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-5">
                            <h3 className="font-semibold text-gray-900
                                           dark:text-white mb-4">
                                Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <button
                                        key={tag._id}
                                        type="button"
                                        onClick={() => toggleTag(tag._id)}
                                        className={`px-3 py-1.5
                                                   rounded-lg text-xs
                                                   font-medium
                                                   transition-colors
                                                   ${selectedTags.includes(tag._id)
                                                       ? 'bg-indigo-600 text-white'
                                                       : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                   }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                                {tags.length === 0 && (
                                    <p className="text-sm text-gray-500">
                                        No tags available
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}