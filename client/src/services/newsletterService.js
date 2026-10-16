import api from './api.js'

export const subscribe = async (data) => {
    const response = await api.post('/newsletter/subscribe', data)
    return response.data
}

export const unsubscribe = async (data) => {
    const response = await api.post('/newsletter/unsubscribe', data)
    return response.data
}

export const getAllSubscribers = async (params) => {
    const response = await api.get('/newsletter', { params })
    return response.data
}

export const deleteSubscriber = async (id) => {
    const response = await api.delete(`/newsletter/${id}`)
    return response.data
}