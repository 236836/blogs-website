import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineFolder
} from 'react-icons/hi'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Button from '../../shared/components/ui/Button.jsx'
import Badge from '../../shared/components/ui/Badge.jsx'
import Modal from '../../shared/components/ui/Modal.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import ConfirmDialog from '../../shared/components/ui/ConfirmDialog.jsx'
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../../services/categoryService.js'
import { formatDate } from '../../utils/formatDate.js'
import toast from 'react-hot-toast'

export default function AdminCategories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await getAllCategories()
            setCategories(response?.data?.categories || [])
        } catch (error) {
            console.error('Failed to fetch categories:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const openCreateModal = () => {
        setEditingCategory(null)
        reset({
            name: '',
            description: '',
            icon: '📁'
        })
        setShowModal(true)
    }

    const openEditModal = (category) => {
        setEditingCategory(category)
        reset({
            name: category.name,
            description: category.description || '',
            icon: category.icon || '📁'
        })
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingCategory(null)
        reset()
    }

    const onSubmit = async (data) => {
        try {
            setSubmitLoading(true)

            if (editingCategory) {
                await updateCategory(editingCategory._id, data)
                toast.success('Category updated successfully')
            } else {
                await createCategory(data)
                toast.success('Category created successfully')
            }

            closeModal()
            fetchCategories()
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to save category'
            )
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            setDeleteLoading(true)
            await deleteCategory(deleteId)
            toast.success('Category deleted successfully')
            setDeleteId(null)
            fetchCategories()
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to delete category'
            )
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row
                            sm:items-center sm:justify-between
                            gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900
                                   dark:text-white">
                        Categories
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400
                                  text-sm mt-1">
                        {categories.length} total categories
                    </p>
                </div>

                <Button onClick={openCreateModal}>
                    <HiOutlinePlus className="w-4 h-4" />
                    Add Category
                </Button>
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-16 bg-white
                                dark:bg-gray-800 rounded-xl
                                border border-gray-200
                                dark:border-gray-700">
                    <HiOutlineFolder className="w-12 h-12
                                                text-gray-300
                                                dark:text-gray-600
                                                mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900
                                   dark:text-white mb-2">
                        No categories yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400
                                  mb-4">
                        Create your first category to organize
                        your blogs.
                    </p>
                    <Button onClick={openCreateModal}>
                        <HiOutlinePlus className="w-4 h-4" />
                        Add Category
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2
                                lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            className="bg-white dark:bg-gray-800
                                       rounded-xl border
                                       border-gray-200
                                       dark:border-gray-700 p-5
                                       hover:shadow-md
                                       transition-shadow"
                        >
                            {/* Icon + Name */}
                            <div className="flex items-start
                                            justify-between mb-3">
                                <div className="flex items-center
                                                gap-3">
                                    <span className="text-3xl">
                                        {category.icon || '📁'}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold
                                                       text-gray-900
                                                       dark:text-white">
                                            {category.name}
                                        </h3>
                                        <p className="text-xs
                                                      text-gray-400">
                                            /{category.slug}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center
                                                gap-1">
                                    <button
                                        onClick={() => openEditModal(category)}
                                        className="p-1.5 rounded-lg
                                                   text-gray-400
                                                   hover:text-indigo-600
                                                   hover:bg-indigo-50
                                                   dark:hover:bg-indigo-900/20
                                                   transition-colors"
                                    >
                                        <HiOutlinePencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(category._id)}
                                        className="p-1.5 rounded-lg
                                                   text-gray-400
                                                   hover:text-red-600
                                                   hover:bg-red-50
                                                   dark:hover:bg-red-900/20
                                                   transition-colors"
                                    >
                                        <HiOutlineTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            {category.description && (
                                <p className="text-sm text-gray-500
                                              dark:text-gray-400 mb-3
                                              line-clamp-2">
                                    {category.description}
                                </p>
                            )}

                            {/* Meta */}
                            <div className="flex items-center
                                            justify-between pt-3
                                            border-t border-gray-100
                                            dark:border-gray-700">
                                <Badge variant="primary">
                                    {category.blogCount || 0} blogs
                                </Badge>
                                <span className="text-xs text-gray-400">
                                    {formatDate(category.createdAt)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editingCategory
                    ? 'Edit Category'
                    : 'Create Category'
                }
                size="sm"
            >
                <form onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4">

                    {/* Icon */}
                    <div>
                        <label className="block text-sm font-medium
                                          text-gray-700
                                          dark:text-gray-300 mb-1.5">
                            Icon (emoji)
                        </label>
                        <input
                            type="text"
                            placeholder="📁"
                            {...register('icon')}
                            className="w-full px-4 py-2.5 rounded-lg
                                       border border-gray-300
                                       dark:border-gray-600
                                       bg-gray-50 dark:bg-gray-900
                                       text-gray-900
                                       dark:text-gray-100
                                       focus:outline-none
                                       focus:ring-2
                                       focus:ring-indigo-500
                                       text-2xl text-center"
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium
                                          text-gray-700
                                          dark:text-gray-300 mb-1.5">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            placeholder="Enter category name"
                            {...register('name', {
                                required: 'Name is required'
                            })}
                            className="w-full px-4 py-2.5 rounded-lg
                                       border border-gray-300
                                       dark:border-gray-600
                                       bg-gray-50 dark:bg-gray-900
                                       text-gray-900
                                       dark:text-gray-100
                                       placeholder-gray-400
                                       focus:outline-none
                                       focus:ring-2
                                       focus:ring-indigo-500
                                       text-sm"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium
                                          text-gray-700
                                          dark:text-gray-300 mb-1.5">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Brief description..."
                            {...register('description')}
                            className="w-full px-4 py-2.5 rounded-lg
                                       border border-gray-300
                                       dark:border-gray-600
                                       bg-gray-50 dark:bg-gray-900
                                       text-gray-900
                                       dark:text-gray-100
                                       placeholder-gray-400
                                       focus:outline-none
                                       focus:ring-2
                                       focus:ring-indigo-500
                                       resize-none text-sm"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end pt-2">
                        <Button
                            variant="secondary"
                            onClick={closeModal}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={submitLoading}
                        >
                            {editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Category"
                message="Are you sure? Blogs using this category must be reassigned first."
                loading={deleteLoading}
            />
        </AdminLayout>
    )
}