import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Spinner from '../shared/components/ui/Spinner.jsx'

export function AuthRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center
                            justify-center">
                <Spinner size="xl" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center
                            justify-center">
                <Spinner size="xl" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}