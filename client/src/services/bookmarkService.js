import api from './api.js'

export const toggleBookmark = async (blogId) => {
    const response = await api.post(`/bookmarks/blog/${blogId}`)
    return response.data
}

export const getBookmarks = async (params) => {
    const response = await api.get('/bookmarks', { params })
    return response.data
}

export const getBookmarkStatus = async (blogId) => {
    const response = await api.get(`/bookmarks/blog/${blogId}`)
    return response.data
}