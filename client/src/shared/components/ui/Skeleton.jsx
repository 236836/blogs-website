export function Skeleton({ className = '' }) {
    return (
        <div
            className={`animate-pulse bg-gray-200
            dark:bg-gray-700 rounded-lg ${className}`}
        />
    )
}

export function BlogCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl
                        overflow-hidden shadow-sm">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-5">
                <Skeleton className="h-4 w-20 mb-3" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </div>
    )
}

export function BlogDetailSkeleton() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-48 mb-6" />
            <Skeleton className="h-80 w-full mb-8 rounded-xl" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-5/6 mb-3" />
        </div>
    )
}

export function TableSkeleton({ rows = 5 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
            ))}
        </div>
    )
}