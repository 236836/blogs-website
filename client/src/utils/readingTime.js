export const getReadingTime = (minutes) => {
    if (!minutes || minutes < 1) return '1 min read'
    return `${minutes} min read`
}