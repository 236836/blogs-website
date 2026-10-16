import { useState } from 'react'
import AdminSidebar from './AdminSidebar.jsx'
import AdminHeader from './AdminHeader.jsx'

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950
                        flex">

            {/* Sidebar */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Header */}
                <AdminHeader
                    onMenuClick={() => setSidebarOpen(true)}
                />

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}