import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { HiArrowLeft, HiOutlinePhotograph } from 'react-icons/hi'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Button from '../../shared/components/ui/Button.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import { getAdminBlogs, updateBlog } from '../../services/blogService.js'
import { getAllCategories } from '../../services/categoryService.js'
import { getAllTags } from '../../services/tagService.js'
import api from '../../services/api.js'
import toast from 'react-hot-toast'

export default function AdminBlogEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [blog, setBlog] = useState(null)
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const [imagePreview, setImagePreview] = useState(null)
    const [imageFile, setImageFile] = useState(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetching(true)

                const [blogsRes, catRes, tagRes] =
                    await Promise.allSettled([
                        api.get(`/blogs/admin/all?search=&page=1&limit=100`),
                        getAllCategories(),
                        getAllTags()
                    ])

                if (catRes.status === 'fulfilled') {
                    setCategories(catRes.value?.data?.categories || [])
                }
                if (tagRes.status === 'fulfilled') {
                    setTags(tagRes.value?.data?.tags || [])
                }

                if (blogsRes.status === 'fulfilled') {
                    const allBlogs = blogsRes.value?.data?.data?.blogs || []
                    const foundBlog = allBlogs.find((b) => b._id === id)

                    if (foundBlog) {
                        setBlog(foundBlog)
                        setSelectedTags(
                            foundBlog.tags?.map((t) => t._id) || []
                        )
                        setImagePreview(foundBlog.featuredImage || null)

                        reset({
                            title: foundBlog.title,
                            excerpt: foundBlog.excerpt || '',
                            content: foundBlog.content,
                            category: foundBlog.category?._id || '',
                            status: foundBlog.status,
                            isFeatured: foundBlog.isFeatured,
                            metaTitle: foundBlog.metaTitle || '',
                            metaDescription: foundBlog.metaDescription || ''
                        })
                    }
                }
            } catch (error) {
                console.error('Failed to fetch blog:', error)
            } finally {
                setFetching(false)
            }
        }

        fetchData()
    }, [id, reset])

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
                ? prev.filter((tid) => tid !== tagId)
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

            await updateBlog(id, formData)
            toast.success('Blog updated successfully!')
            navigate('/admin/blogs')
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to update blog'
            )
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
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
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/blogs')}
                    className="p-2 rounded-lg text-gray-500
                               hover:bg-gray-100
                               dark:hover:bg-gray-800"
                >
                    <HiArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900
                               dark:text-white">
                    Edit Blog
                </h1>
            </div>

            {/* Form - Same as Create but with default values */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3
                                gap-6">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
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
                                {...register('excerpt')}
                                className="w-full px-4 py-3
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
                                           resize-none text-sm"
                            />
                        </div>

                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-5">
                            <label className="block text-sm
                                              font-medium
                                              text-gray-700
                                              dark:text-gray-300
                                              mb-1.5">
                                Content *
                            </label>
                            <textarea
                                rows={15}
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
                            <h3 className="font-semibold
                                           text-gray-900
                                           dark:text-white mb-4">
                                SEO Settings
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Meta Title"
                                    {...register('metaTitle')}
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
                                <textarea
                                    rows={2}
                                    placeholder="Meta Description"
                                    {...register('metaDescription')}
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
                                               resize-none text-sm"
                                />
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
                            <h3 className="font-semibold
                                           text-gray-900
                                           dark:text-white mb-4">
                                Publish
                            </h3>
                            <div className="space-y-4">
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
                                               text-sm"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>

                                <label className="flex items-center
                                                  gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register('isFeatured')}
                                        className="w-4 h-4 rounded
                                                   border-gray-300
                                                   text-indigo-600"
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
                                    Update Blog
                                </Button>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-5">
                            <h3 className="font-semibold
                                           text-gray-900
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
                                                   rounded-full"
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
                                                  cursor-pointer">
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
                            <h3 className="font-semibold
                                           text-gray-900
                                           dark:text-white mb-4">
                                Category
                            </h3>
                            <select
                                {...register('category')}
                                className="w-full px-3 py-2.5
                                           rounded-lg border
                                           border-gray-300
                                           dark:border-gray-600
                                           bg-gray-50
                                           dark:bg-gray-900
                                           text-gray-900
                                           dark:text-gray-100
                                           text-sm"
                            >
                                <option value="">Select</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tags */}
                        <div className="bg-white dark:bg-gray-800
                                        rounded-xl border
                                        border-gray-200
                                        dark:border-gray-700 p-5">
                            <h3 className="font-semibold
                                           text-gray-900
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
                                                       : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                   }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}