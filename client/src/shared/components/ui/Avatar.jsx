import { DEFAULT_AVATAR } from '../../../utils/constants.js'

export default function Avatar({
    src,
    name = 'User',
    size = 'md',
    className = ''
}) {
    const sizes = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-14 w-14 text-lg',
        xl: 'h-20 w-20 text-2xl'
    }

    const imageUrl = src || `${DEFAULT_AVATAR}${encodeURIComponent(name)}`

    return (
        <img
            src={imageUrl}
            alt={name}
            className={`${sizes[size]} rounded-full object-cover
                        border-2 border-white dark:border-gray-700
                        shadow-sm ${className}`}
            onError={(e) => {
                e.target.src = `${DEFAULT_AVATAR}${encodeURIComponent(name)}`
            }}
        />
    )
}