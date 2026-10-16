import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('blogflow_user')
        const storedToken = localStorage.getItem('blogflow_token')

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser))
            setToken(storedToken)
        }

        setLoading(false)
    }, [])

    const login = (userData, userToken) => {
        setUser(userData)
        setToken(userToken)
        localStorage.setItem('blogflow_user', JSON.stringify(userData))
        localStorage.setItem('blogflow_token', userToken)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('blogflow_user')
        localStorage.removeItem('blogflow_token')
    }

    const updateUser = (updatedUser) => {
        setUser(updatedUser)
        localStorage.setItem('blogflow_user', JSON.stringify(updatedUser))
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            logout,
            updateUser,
            isAuthenticated: !!token,
            isAdmin: user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}