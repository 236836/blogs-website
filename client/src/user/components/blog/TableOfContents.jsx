import { useState, useEffect } from 'react'
import { HiOutlineMenuAlt2 } from 'react-icons/hi'

export default function TableOfContents({ content }) {
    const [headings, setHeadings] = useState([])
    const [isOpen, setIsOpen] = useState(true)

    useEffect(() => {
        if (!content) return

        const parser = new DOMParser()
        const doc = parser.parseFromString(content, 'text/html')
        const elements = doc.querySelectorAll('h2, h3')

        const items = Array.from(elements).map((el, index) => ({
            id: `heading-${index}`,
            text: el.textContent,
            level: el.tagName === 'H2' ? 2 : 3
        }))

        setHeadings(items)
    }, [content])

    if (headings.length === 0) return null

    const scrollToHeading = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-800/50
                        rounded-xl p-5 mb-8 border
                        border-gray-200 dark:border-gray-700">

            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 w-full
                           text-left"
            >
                <HiOutlineMenuAlt2 className="w-5 h-5
                                              text-indigo-600
                                              dark:text-indigo-400" />
                <span className="font-semibold text-gray-900
                                 dark:text-white">
                    Table of Contents
                </span>
            </button>

            {/* Items */}
            {isOpen && (
                <nav className="mt-4 space-y-1">
                    {headings.map((heading) => (
                        <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={`block w-full text-left text-sm
                                       py-1.5 hover:text-indigo-600
                                       dark:hover:text-indigo-400
                                       transition-colors
                                       text-gray-600
                                       dark:text-gray-400
                                       ${heading.level === 3
                                           ? 'pl-6'
                                           : 'pl-2 font-medium'
                                       }`}
                        >
                            {heading.text}
                        </button>
                    ))}
                </nav>
            )}
        </div>
    )
}