export default function StatsCard({
    title,
    value,
    icon: Icon,
    color = 'indigo',
    change
}) {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
        green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        pink: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
        yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5
                        border border-gray-200 dark:border-gray-700
                        hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex
                                items-center justify-center
                                ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>

                {change && (
                    <span className={`text-xs font-medium px-2 py-1
                                     rounded-full
                                     ${change > 0
                                         ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                         : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                     }`}>
                        {change > 0 ? '+' : ''}{change}%
                    </span>
                )}
            </div>

            <p className="text-2xl font-bold text-gray-900
                          dark:text-white mb-1">
                {value?.toLocaleString() || 0}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
                {title}
            </p>
        </div>
    )
}