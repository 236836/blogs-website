import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineSearch } from 'react-icons/hi'

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`)
        }
    }

    return (
        <section className="relative bg-gradient-to-br from-indigo-600
                            via-indigo-700 to-purple-800 overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-72 h-72
                                bg-white rounded-full -translate-x-1/2
                                -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96
                                bg-white rounded-full translate-x-1/3
                                translate-y-1/3" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64
                                bg-white rounded-full -translate-x-1/2
                                -translate-y-1/2" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6
                            lg:px-8 py-20 sm:py-28 lg:py-32">
                <div className="text-center max-w-3xl mx-auto">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2
                                    bg-white/10 backdrop-blur-sm
                                    border border-white/20
                                    rounded-full px-4 py-1.5 mb-6">
                        <span className="w-2 h-2 bg-green-400
                                         rounded-full animate-pulse" />
                        <span className="text-white/90 text-sm
                                         font-medium">
                            Discover Amazing Stories
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl
                                   font-bold text-white mb-6
                                   leading-tight">
                        Your Daily Dose of
                        <span className="block text-indigo-200">
                            Knowledge & Inspiration
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl text-indigo-100
                                  mb-10 max-w-2xl mx-auto
                                  leading-relaxed">
                        Explore articles on JavaScript, React,
                        Node.js, MongoDB and more. Written by
                        developers, for developers.
                    </p>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="max-w-xl mx-auto mb-8"
                    >
                        <div className="relative">
                            <HiOutlineSearch
                                className="absolute left-4 top-1/2
                                           -translate-y-1/2
                                           text-gray-400 w-5 h-5"
                            />
                            <input
                                type="text"
                                placeholder="Search articles, topics, authors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-32 py-4
                                           rounded-2xl bg-white
                                           text-gray-900
                                           placeholder-gray-400
                                           text-base
                                           focus:outline-none
                                           focus:ring-4
                                           focus:ring-indigo-300
                                           shadow-lg"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2
                                           -translate-y-1/2
                                           bg-indigo-600
                                           hover:bg-indigo-700
                                           text-white px-6 py-2.5
                                           rounded-xl font-medium
                                           transition-colors text-sm"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Stats */}
                    <div className="flex items-center justify-center
                                    gap-8 sm:gap-12 text-white/80">
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl
                                          font-bold text-white">
                                100+
                            </p>
                            <p className="text-sm">Articles</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl
                                          font-bold text-white">
                                50+
                            </p>
                            <p className="text-sm">Authors</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl
                                          font-bold text-white">
                                10K+
                            </p>
                            <p className="text-sm">Readers</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}