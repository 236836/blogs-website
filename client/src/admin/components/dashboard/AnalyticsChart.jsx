import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'

const COLORS = [
    '#6366f1', '#10b981', '#f59e0b',
    '#ef4444', '#8b5cf6', '#06b6d4'
]

const MONTHS = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export default function AnalyticsChart({ analytics }) {
    if (!analytics) return null

    // Format blogs per month
    const blogsData = (analytics.blogsPerMonth || []).map((item) => ({
        name: `${MONTHS[item._id.month]} ${item._id.year}`,
        blogs: item.count
    }))

    // Format category data
    const categoryData = (analytics.blogsPerCategory || []).map((item) => ({
        name: item.categoryName,
        value: item.count
    }))

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Blogs Per Month Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl
                            border border-gray-200
                            dark:border-gray-700 p-5">
                <h3 className="font-semibold text-gray-900
                               dark:text-white mb-4">
                    Blogs Per Month
                </h3>

                {blogsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={blogsData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                            />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                                stroke="#9ca3af"
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                stroke="#9ca3af"
                            />
                            <Tooltip />
                            <Bar
                                dataKey="blogs"
                                fill="#6366f1"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500 py-12">
                        No data available
                    </p>
                )}
            </div>

            {/* Categories Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl
                            border border-gray-200
                            dark:border-gray-700 p-5">
                <h3 className="font-semibold text-gray-900
                               dark:text-white mb-4">
                    Blogs Per Category
                </h3>

                {categoryData.length > 0 ? (
                    <div className="flex items-center gap-4">
                        <ResponsiveContainer width="60%" height={280}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={60}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Legend */}
                        <div className="flex-1 space-y-2">
                            {categoryData.map((item, index) => (
                                <div
                                    key={item.name}
                                    className="flex items-center
                                               gap-2"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full
                                                   flex-shrink-0"
                                        style={{
                                            backgroundColor:
                                                COLORS[index % COLORS.length]
                                        }}
                                    />
                                    <span className="text-sm
                                                     text-gray-600
                                                     dark:text-gray-400
                                                     truncate">
                                        {item.name}
                                    </span>
                                    <span className="text-sm
                                                     font-medium
                                                     text-gray-900
                                                     dark:text-white
                                                     ml-auto">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-12">
                        No data available
                    </p>
                )}
            </div>
        </div>
    )
}