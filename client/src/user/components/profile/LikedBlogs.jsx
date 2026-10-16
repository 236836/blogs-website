import { useState, useEffect } from 'react'
import BlogGrid from '../blog/BlogGrid.jsx'
import Pagination from '../blog/Pagination.jsx'
import { getLikedBlogs } from '../../../services/userService.js'

export default function LikedBlogs() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchLikedBlogs = async (page = 1) => {
        try {
            setLoading(true)
            const response = await getLikedBlogs({
                page,
                limit: 6
            })
            setBlogs(response?.data?.blogs || [])
            setTotalPages(response?.pagination?.totalPages || 1)
        } catch (error) {
            console.error('Failed to fetch liked blogs:', error)
            setBlogs([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLikedBlogs()
    }, [])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        fetchLikedBlogs(page)
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