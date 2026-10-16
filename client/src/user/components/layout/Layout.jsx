import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col
                        bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    )
}