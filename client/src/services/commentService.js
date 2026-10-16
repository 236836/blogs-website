import api from './api.js'

export const getBlogComments = async (blogId, params) => {
    const response = await api.get(`/comments/blog/${blogId}`, { params })
    return response.data
}

export const addComment = async (blogId, data) => {
    const response = await api.post(`/comments/blog/${blogId}`, data)
    return response.data
}

export const replyToComment = async (commentId, data) => {
    const response = await api.post(`/comments/${commentId}/reply`, data)
    return response.data
}

export const updateComment = async (commentId, data) => {
    const response = await api.put(`/comments/${commentId}`, data)
    return response.data
}

export const deleteComment = async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
}

export const getAdminComments = async (params) => {
    const response = await api.get('/comments/admin/all', { params })
    return response.data
}

export const hideComment = async (commentId) => {
    const response = await api.put(`/comments/${commentId}/hide`)
    return response.data
}

export const approveComment = async (commentId) => {
    const response = await api.put(`/comments/${commentId}/approve`)
    return response.data
}