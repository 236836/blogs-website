import api from './api.js'

export const getUserProfile = async (username) => {
    const response = await api.get(`/users/profile/${username}`)
    return response.data
}

export const getUserBlogs = async (username, params) => {
    const response = await api.get(`/users/profile/${username}/blogs`, {
        params
    })
    return response.data
}

export const getCommentHistory = async (params) => {
    const response = await api.get('/users/comments/history', { params })
    return response.data
}

export const getSavedBlogs = async (params) => {
    const response = await api.get('/users/saved-blogs', { params })
    return response.data
}

export const getLikedBlogs = async (params) => {
    const response = await api.get('/users/liked-blogs', { params })
    return response.data
}

export const getUserDashboard = async () => {
    const response = await api.get('/users/dashboard')
    return response.data
}