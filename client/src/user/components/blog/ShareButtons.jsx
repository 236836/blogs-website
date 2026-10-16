import {
    HiOutlineShare
} from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function ShareButtons({ title, slug }) {
    const url = `${window.location.origin}/blog/${slug}`

    const shareLinks = [
        {
            name: 'Twitter',
            color: 'bg-sky-500 hover:bg-sky-600',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        },
        {
            name: 'Facebook',
            color: 'bg-blue-600 hover:bg-blue-700',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        },
        {
            name: 'LinkedIn',
            color: 'bg-blue-700 hover:bg-blue-800',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        }
    ]

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url)
            toast.success('Link copied to clipboard!')
        } catch (error) {
            toast.error('Failed to copy link')
        }
    }

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-500
                             dark:text-gray-400 mr-1">
                Share:
            </span>

            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link.color} text-white px-3 py-1.5
                               rounded-lg text-xs font-medium
                               transition-colors`}
                >
                    {link.name}
                </a>
            ))}

            <button
                onClick={copyLink}
                className="flex items-center gap-1 bg-gray-200
                           dark:bg-gray-700 text-gray-700
                           dark:text-gray-300 px-3 py-1.5
                           rounded-lg text-xs font-medium
                           hover:bg-gray-300
                           dark:hover:bg-gray-600
                           transition-colors"
            >
                <HiOutlineShare className="w-3.5 h-3.5" />
                Copy
            </button>
        </div>
    )
}