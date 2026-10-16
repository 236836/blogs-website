import { useState, useEffect } from 'react'
import BlogGrid from '../blog/BlogGrid.jsx'
import Pagination from '../blog/Pagination.jsx'
import { getSavedBlogs } from '../../../services/userService.js'

export default function SavedBlogs() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchSavedBlogs = async (page = 1) => {
        try {
            setLoading(true)
            const response = await getSavedBlogs({
                page,
                limit: 6
            })
            setBlogs(response?.data?.blogs || [])
            setTotalPages(response?.pagination?.totalPages || 1)
        } catch (error) {
            console.error('Failed to fetch saved blogs:', error)
            setBlogs([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSavedBlogs()
    }, [])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        fetchSavedBlogs(page)
    }

    return (
        <div>
            <BlogGrid blogs={blogs} loading={loading} columns={3} />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}