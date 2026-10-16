import { useEffect } from 'react'
import { HiX } from 'react-icons/hi'

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center
                        justify-center">
            <div
                className="fixed inset-0 bg-black/50
                           backdrop-blur-sm"
                onClick={onClose}
            />
            <div className={`${sizes[size]} w-full mx-4 bg-white
                            dark:bg-gray-800 rounded-2xl shadow-2xl
                            relative z-10 max-h-[90vh]
                            overflow-y-auto`}>
                <div className="flex items-center justify-between
                                p-5 border-b border-gray-200
                                dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900
                                   dark:text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400
                                   hover:text-gray-600
                                   dark:hover:text-gray-300
                                   rounded-lg hover:bg-gray-100
                                   dark:hover:bg-gray-700
                                   transition-colors"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    )
}