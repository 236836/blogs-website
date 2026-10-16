import Spinner from './Spinner.jsx'

export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    className = '',
    ...props
}) {
    const baseStyles = `inline-flex items-center justify-center
        font-medium rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        cursor-pointer disabled:opacity-50
        disabled:cursor-not-allowed`

    const variants = {
        primary: `bg-indigo-600 text-white hover:bg-indigo-700
                  focus:ring-indigo-500`,
        secondary: `bg-gray-100 text-gray-700 hover:bg-gray-200
                    focus:ring-gray-400 dark:bg-gray-700
                    dark:text-gray-200 dark:hover:bg-gray-600`,
        danger: `bg-red-600 text-white hover:bg-red-700
                 focus:ring-red-500`,
        success: `bg-green-600 text-white hover:bg-green-700
                  focus:ring-green-500`,
        outline: `border-2 border-indigo-600 text-indigo-600
                  hover:bg-indigo-50 focus:ring-indigo-500
                  dark:hover:bg-indigo-900/20`,
        ghost: `text-gray-600 hover:bg-gray-100 focus:ring-gray-400
                dark:text-gray-300 dark:hover:bg-gray-800`
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2',
        xl: 'px-8 py-4 text-lg gap-3'
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                ${baseStyles}
                ${variants[variant]}
                ${sizes[size]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
            {...props}
        >
            {loading && <Spinner size="sm" />}
            {children}
        </button>
    )
}