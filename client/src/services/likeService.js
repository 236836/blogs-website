import api from './api.js'

export const toggleLike = async (blogId) => {
    const response = await api.post(`/likes/blog/${blogId}`)
    return response.data
}

export const getLikeStatus = async (blogId) => {
    const response = await api.get(`/likes/blog/${blogId}`)
    return response.data
}

export const getLikedBlogs = async (params) => {
    const response = await api.get('/likes/user/liked', { params })
    return response.data
}