import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineTag
} from 'react-icons/hi'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Button from '../../shared/components/ui/Button.jsx'
import Badge from '../../shared/components/ui/Badge.jsx'
import Modal from '../../shared/components/ui/Modal.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import ConfirmDialog from '../../shared/components/ui/ConfirmDialog.jsx'
import {
    getAllTags,
    createTag,
    updateTag,
    deleteTag
} from '../../services/tagService.js'
import { formatDate } from '../../utils/formatDate.js'
import toast from 'react-hot-toast'

export default function AdminTags() {
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingTag, setEditingTag] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const fetchTags = async () => {
        try {
            setLoading(true)
            const response = await getAllTags()
            setTags(response?.data?.tags || [])
        } catch (error) {
            console.error('Failed to fetch tags:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTags()
    }, [])

    const openCreateModal = () => {
        setEditingTag(null)
        reset({ name: '' })
        setShowModal(true)
    }

    const openEditModal = (tag) => {
        setEditingTag(tag)
        reset({ name: tag.name })
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingTag(null)
        reset()
    }

    const onSubmit = async (data) => {
        try {
            setSubmitLoading(true)

            if (editingTag) {
                await updateTag(editingTag._id, data)
                toast.success('Tag updated successfully')
            } else {
                await createTag(data)
                toast.success('Tag created successfully')
            }

            closeModal()
            fetchTags()
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to save tag'
            )
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            setDeleteLoading(true)
            await deleteTag(deleteId)
            toast.success('Tag deleted successfully')
            setDeleteId(null)
            fetchTags()
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to delete tag'
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
                        Tags
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400
                                  text-sm mt-1">
                        {tags.length} total tags
                    </p>
                </div>

                <Button onClick={openCreateModal}>
                    <HiOutlinePlus className="w-4 h-4" />
                    Add Tag
                </Button>
            </div>

            {/* Tags */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                </div>
            ) : tags.length === 0 ? (
                <div className="text-center py-16 bg-white
                                dark:bg-gray-800 rounded-xl
                                border border-gray-200
                                dark:border-gray-700">
                    <HiOutlineTag className="w-12 h-12
                                             text-gray-300
                                             dark:text-gray-600
                                             mx-auto mb-4" />
                    <h3 className="text-lg font-medium
                                   text-gray-900
                                   dark:text-white mb-2">
                        No tags yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400
                                  mb-4">
                        Create tags to organize your blogs.
                    </p>
                    <Button onClick={openCreateModal}>
                        <HiOutlinePlus className="w-4 h-4" />
                        Add Tag
                    </Button>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800
                                rounded-xl border border-gray-200
                                dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50
                                               dark:bg-gray-900/50
                                               border-b
                                               border-gray-200
                                               dark:border-gray-700">
                                    <th className="text-left px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase">
                                        Tag Name
                                    </th>
                                    <th className="text-left px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase
                                                   hidden sm:table-cell">
                                        Slug
                                    </th>
                                    <th className="text-left px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase">
                                        Blogs
                                    </th>
                                    <th className="text-left px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase
                                                   hidden md:table-cell">
                                        Created
                                    </th>
                                    <th className="text-right px-5
                                                   py-3 text-xs
                                                   font-semibold
                                                   text-gray-500
                                                   dark:text-gray-400
                                                   uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y
                                              divide-gray-200
                                              dark:divide-gray-700">
                                {tags.map((tag) => (
                                    <tr
                                        key={tag._id}
                                        className="hover:bg-gray-50
                                                   dark:hover:bg-gray-700/30
                                                   transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex
                                                            items-center
                                                            gap-2">
                                                <HiOutlineTag
                                                    className="w-4 h-4
                                                               text-indigo-500"
                                                />
                                                <span className="font-medium
                                                                 text-gray-900
                                                                 dark:text-white
                                                                 text-sm">
                                                    {tag.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4
                                                       hidden
                                                       sm:table-cell">
                                            <span className="text-sm
                                                             text-gray-500">
                                                {tag.slug}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <Badge variant="info">
                                                {tag.blogCount || 0}
                                            </Badge>
                                        </td>

                                        <td className="px-5 py-4
                                                       hidden
                                                       md:table-cell">
                                            <span className="text-sm
                                                             text-gray-500">
                                                {formatDate(tag.createdAt)}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex
                                                            items-center
                                                            justify-end
                                                            gap-1">
                                                <button
                                                    onClick={() => openEditModal(tag)}
                                                    className="p-1.5
                                                               rounded-lg
                                                               text-gray-400
                                                               hover:text-indigo-600
                                                               hover:bg-indigo-50
                                                               dark:hover:bg-indigo-900/20
                                                               transition-colors"
                                                >
                                                    <HiOutlinePencil
                                                        className="w-4 h-4"
                                                    />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(tag._id)}
                                                    className="p-1.5
                                                               rounded-lg
                                                               text-gray-400
                                                               hover:text-red-600
                                                               hover:bg-red-50
                                                               dark:hover:bg-red-900/20
                                                               transition-colors"
                                                >
                                                    <HiOutlineTrash
                                                        className="w-4 h-4"
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={editingTag ? 'Edit Tag' : 'Create Tag'}
                size="sm"
            >
                <form onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium
                                          text-gray-700
                                          dark:text-gray-300 mb-1.5">
                            Tag Name *
                        </label>
                        <input
                            type="text"
                            placeholder="Enter tag name"
                            {...register('name', {
                                required: 'Tag name is required'
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
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

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
                            {editingTag ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Tag"
                message="Are you sure? Blogs using this tag must have it removed first."
                loading={deleteLoading}
            />
        </AdminLayout>
    )
}