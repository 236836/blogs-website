import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes.jsx'
import ScrollToTop from './shared/components/ui/ScrollToTop.jsx'

export default function App() {
    return (
        <>
            <ScrollToTop />
            <AppRoutes />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1f2937',
                        color: '#f9fafb',
                        borderRadius: '12px',
                        border: '1px solid #374151',
                        fontSize: '14px',
                        padding: '12px 16px'
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#f9fafb'
                        }
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#f9fafb'
                        }
                    }
                }}
            />
        </>
    )
}