import { useState } from 'react'
import { HiOutlineMail } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { subscribe } from '../../../services/newsletterService.js'

export default function NewsletterSection() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async (e) => {
        e.preventDefault()

        if (!email.trim()) {
            toast.error('Please enter your email')
            return
        }

        try {
            setLoading(true)
            const response = await subscribe({ email })
            toast.success(response.message)
            setEmail('')
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to subscribe'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="bg-gradient-to-r from-indigo-600
                            to-purple-700 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">

                    {/* Icon */}
                    <div className="w-16 h-16 bg-white/10
                                    backdrop-blur-sm rounded-2xl
                                    flex items-center justify-center
                                    mx-auto mb-6">
                        <HiOutlineMail className="w-8 h-8
                                                  text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl font-bold
                                   text-white mb-4">
                        Stay Updated
                    </h2>

                    {/* Description */}
                    <p className="text-indigo-100 text-lg mb-8
                                  leading-relaxed">
                        Subscribe to our newsletter and never miss
                        a new article. Get the latest posts delivered
                        straight to your inbox.
                    </p>

                    {/* Form */}
                    <form
                        onSubmit={handleSubscribe}
                        className="flex flex-col sm:flex-row gap-3
                                   max-w-md mx-auto"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-5 py-3.5 rounded-xl
                                       bg-white text-gray-900
                                       placeholder-gray-400
                                       focus:outline-none focus:ring-4
                                       focus:ring-indigo-300
                                       text-sm"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3.5 bg-gray-900
                                       hover:bg-gray-800
                                       text-white rounded-xl
                                       font-medium transition-colors
                                       text-sm disabled:opacity-50
                                       whitespace-nowrap"
                        >
                            {loading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>

                    {/* Privacy */}
                    <p className="text-indigo-200 text-xs mt-4">
                        No spam, ever. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    )
}