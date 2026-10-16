import api from './api.js'

export const getAllBlogs = async (params) => {
    const response = await api.get('/blogs', { params })
    return response.data
}

export const getFeaturedBlogs = async (limit = 5) => {
    const response = await api.get('/blogs/featured', {
        params: { limit }
    })
    return response.data
}

export const getTrendingBlogs = async (limit = 5) => {
    const response = await api.get('/blogs/trending', {
        params: { limit }
    })
    return response.data
}

export const getLatestBlogs = async (limit = 6) => {
    const response = await api.get('/blogs/latest', {
        params: { limit }
    })
    return response.data
}

export const searchBlogs = async (params) => {
    const response = await api.get('/blogs/search', { params })
    return response.data
}

export const getBlogBySlug = async (slug) => {
    const response = await api.get(`/blogs/${slug}`)
    return response.data
}

export const incrementView = async (id) => {
    const response = await api.put(`/blogs/${id}/view`)
    return response.data
}

export const getAdminBlogs = async (params) => {
    const response = await api.get('/blogs/admin/all', { params })
    return response.data
}

export const createBlog = async (formData) => {
    const response = await api.post('/blogs', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export const updateBlog = async (id, formData) => {
    const response = await api.put(`/blogs/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export const deleteBlog = async (id) => {
    const response = await api.delete(`/blogs/${id}`)
    return response.data
}

export const publishBlog = async (id) => {
    const response = await api.put(`/blogs/${id}/publish`)
    return response.data
}

export const draftBlog = async (id) => {
    const response = await api.put(`/blogs/${id}/draft`)
    return response.data
}

export const toggleFeatured = async (id) => {
    const response = await api.put(`/blogs/${id}/feature`)
    return response.data
}