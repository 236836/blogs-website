import { forwardRef } from 'react'

const Input = forwardRef(({
    label,
    type = 'text',
    error,
    icon,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium
                                  text-gray-700 dark:text-gray-300
                                  mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2
                                    -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={`
                        w-full px-4 py-2.5 rounded-lg border
                        bg-white dark:bg-gray-800
                        text-gray-900 dark:text-gray-100
                        placeholder-gray-400
                        dark:placeholder-gray-500
                        transition-colors duration-200
                        focus:outline-none focus:ring-2
                        focus:ring-indigo-500
                        focus:border-transparent
                        ${icon ? 'pl-10' : ''}
                        ${error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    )
})

Input.displayName = 'Input'

export default Input