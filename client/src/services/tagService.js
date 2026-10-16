import api from './api.js'

export const getAllTags = async () => {
    const response = await api.get('/tags')
    return response.data
}

export const getTagBySlug = async (slug, params) => {
    const response = await api.get(`/tags/${slug}`, { params })
    return response.data
}

export const createTag = async (data) => {
    const response = await api.post('/tags', data)
    return response.data
}

export const updateTag = async (id, data) => {
    const response = await api.put(`/tags/${id}`, data)
    return response.data
}

export const deleteTag = async (id) => {
    const response = await api.delete(`/tags/${id}`)
    return response.data
}