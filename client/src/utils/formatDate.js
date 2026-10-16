import { format, formatDistanceToNow } from 'date-fns'

export const formatDate = (date) => {
    if (!date) return ''
    return format(new Date(date), 'MMM dd, yyyy')
}

export const formatDateTime = (date) => {
    if (!date) return ''
    return format(new Date(date), 'MMM dd, yyyy • hh:mm a')
}

export const timeAgo = (date) => {
    if (!date) return ''
    return formatDistanceToNow(new Date(date), { addSuffix: true })
}