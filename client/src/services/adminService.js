import api from './api.js'

export const getDashboardStats = async () => {
    const response = await api.get('/admin/dashboard/stats')
    return response.data
}

export const getRecentActivity = async () => {
    const response = await api.get('/admin/dashboard/activity')
    return response.data
}

export const getAnalytics = async () => {
    const response = await api.get('/admin/dashboard/analytics')
    return response.data
}

export const getAllUsers = async (params) => {
    const response = await api.get('/admin/users', { params })
    return response.data
}

export const getUserDetail = async (id) => {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
}

export const toggleBlockUser = async (id) => {
    const response = await api.put(`/admin/users/${id}/block`)
    return response.data
}

export const changeUserRole = async (id, data) => {
    const response = await api.put(`/admin/users/${id}/role`, data)
    return response.data
}

export const deleteUser = async (id) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
}