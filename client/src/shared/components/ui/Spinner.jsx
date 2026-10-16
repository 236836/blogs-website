export default function Spinner({ size = 'md' }) {
    const sizes = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    }

    return (
        <div className="flex items-center justify-center">
            <div
                className={`${sizes[size]} animate-spin rounded-full
                border-4 border-gray-200 border-t-indigo-600
                dark:border-gray-700 dark:border-t-indigo-400`}
            />
        </div>
    )
}