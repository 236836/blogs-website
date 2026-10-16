import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { HiArrowUp } from 'react-icons/hi'

export default function ScrollToTop() {
    const { pathname } = useLocation()
    const [showButton, setShowButton] = useState(false)

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    // Show button when scrolled down
    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 400)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    if (!showButton) return null

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50
                       w-12 h-12 bg-indigo-600
                       hover:bg-indigo-700 text-white
                       rounded-full shadow-lg
                       flex items-center justify-center
                       transition-all duration-300
                       hover:scale-110
                       animate-fade-in"
        >
            <HiArrowUp className="w-5 h-5" />
        </button>
    )
}