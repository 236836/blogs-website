import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange
}) {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        let end = Math.min(totalPages, start + maxVisible - 1)

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1)
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        return pages
    }

    const pages = getPageNumbers()

    return (
        <div className="flex items-center justify-center gap-2
                        mt-10">

            {/* Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2
                           rounded-lg text-sm font-medium
                           text-gray-600 dark:text-gray-400
                           hover:bg-gray-100
                           dark:hover:bg-gray-800
                           disabled:opacity-50
                           disabled:cursor-not-allowed
                           transition-colors"
            >
                <HiChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
            </button>

            {/* First Page */}
            {pages[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="w-10 h-10 rounded-lg text-sm
                                   font-medium text-gray-600
                                   dark:text-gray-400
                                   hover:bg-gray-100
                                   dark:hover:bg-gray-800
                                   transition-colors"
                    >
                        1
                    </button>
                    {pages[0] > 2 && (
                        <span className="text-gray-400">...</span>
                    )}
                </>
            )}

            {/* Page Numbers */}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-lg text-sm
                               font-medium transition-colors
                               ${currentPage === page
                                   ? 'bg-indigo-600 text-white shadow-md'
                                   : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                               }`}
                >
                    {page}
                </button>
            ))}

            {/* Last Page */}
            {pages[pages.length - 1] < totalPages && (
                <>
                    {pages[pages.length - 1] < totalPages - 1 && (
                        <span className="text-gray-400">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="w-10 h-10 rounded-lg text-sm
                                   font-medium text-gray-600
                                   dark:text-gray-400
                                   hover:bg-gray-100
                                   dark:hover:bg-gray-800
                                   transition-colors"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2
                           rounded-lg text-sm font-medium
                           text-gray-600 dark:text-gray-400
                           hover:bg-gray-100
                           dark:hover:bg-gray-800
                           disabled:opacity-50
                           disabled:cursor-not-allowed
                           transition-colors"
            >
                <span className="hidden sm:inline">Next</span>
                <HiChevronRight className="w-4 h-4" />
            </button>
        </div>
    )
}