import api from './api.js'

export const registerUser = async (data) => {
    const response = await api.post('/auth/register', data)
    return response.data
}

export const loginUser = async (data) => {
    const response = await api.post('/auth/login', data)
    return response.data
}

export const getMyProfile = async () => {
    const response = await api.get('/auth/me')
    return response.data
}

export const updateProfile = async (formData) => {
    const response = await api.put('/auth/update-profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export const changePassword = async (data) => {
    const response = await api.put('/auth/change-password', data)
    return response.data
}

export const forgotPassword = async (data) => {
    const response = await api.post('/auth/forgot-password', data)
    return response.data
}

export const resetPassword = async (token, data) => {
    const response = await api.put(`/auth/reset-password/${token}`, data)
    return response.data
}