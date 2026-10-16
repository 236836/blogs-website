import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    HiOutlineClock,
    HiOutlineEye,
    HiOutlineCalendar,
    HiArrowLeft
} from 'react-icons/hi'
import Layout from '../components/layout/Layout.jsx'
import LikeButton from '../components/blog/LikeButton.jsx'
import BookmarkButton from '../components/blog/BookmarkButton.jsx'
import ShareButtons from '../components/blog/ShareButtons.jsx'
import TableOfContents from '../components/blog/TableOfContents.jsx'
import RelatedPosts from '../components/blog/RelatedPosts.jsx'
import CommentSection from '../components/comments/CommentSection.jsx'
import Avatar from '../../shared/components/ui/Avatar.jsx'
import Badge from '../../shared/components/ui/Badge.jsx'
import Spinner from '../../shared/components/ui/Spinner.jsx'
import { getBlogBySlug, incrementView } from '../../services/blogService.js'
import { formatDate } from '../../utils/formatDate.js'
import { getReadingTime } from '../../utils/readingTime.js'

export default function BlogDetail() {
    const { slug } = useParams()
    const [blog, setBlog] = useState(null)
    const [relatedBlogs, setRelatedBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true)
                const response = await getBlogBySlug(slug)
                setBlog(response?.data?.blog || null)
                setRelatedBlogs(response?.data?.relatedBlogs || [])

                if (response?.data?.blog?._id) {
                    incrementView(response.data.blog._id)
                }
            } catch (error) {
                console.error('Failed to fetch blog:', error)
            } finally {
                setLoading(false)
            }
        }

        if (slug) fetchBlog()
        window.scrollTo(0, 0)
    }, [slug])

    // Add IDs to headings for table of contents
    const addHeadingIds = (htmlContent) => {
        if (!htmlContent) return ''

        let index = 0
        return htmlContent.replace(
            /<(h[23])(.*?)>(.*?)<\/h[23]>/gi,
            (match, tag, attrs, text) => {
                const id = `heading-${index++}`
                return `<${tag}${attrs} id="${id}">${text}</${tag}>`
            }
        )
    }

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center
                                justify-center">
                    <Spinner size="xl" />
                </div>
            </Layout>
        )
    }

    if (!blog) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center
                                justify-center flex-col gap-4">
                    <h1 className="text-4xl font-bold text-gray-900
                                   dark:text-white">
                        Blog Not Found
                    </h1>
                    <Link
                        to="/blogs"
                        className="text-indigo-600
                                   dark:text-indigo-400
                                   hover:underline"
                    >
                        ← Back to Blogs
                    </Link>
                </div>
            </Layout>
        )
    }

    const processedContent = addHeadingIds(blog.content)

    return (
        <Layout>
            {/* Featured Image */}
            {blog.featuredImage && (
                <div className="w-full h-64 sm:h-80 lg:h-96
                                overflow-hidden">
                    <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <article className="max-w-4xl mx-auto px-4 sm:px-6
                                lg:px-8 py-8">

                {/* Back Button */}
                <Link
                    to="/blogs"
                    className="inline-flex items-center gap-1
                               text-sm text-gray-500
                               dark:text-gray-400
                               hover:text-indigo-600
                               dark:hover:text-indigo-400
                               mb-6 transition-colors"
                >
                    <HiArrowLeft className="w-4 h-4" />
                    Back to Blogs
                </Link>

                {/* Category + Tags */}
                <div className="flex flex-wrap items-center
                                gap-2 mb-4">
                    <Badge variant="primary">
                        {blog.category?.icon || '📁'}{' '}
                        {blog.category?.name}
                    </Badge>
                    {blog.tags && blog.tags.map((tag) => (
                        <Badge key={tag._id} variant="default">
                            #{tag.name}
                        </Badge>
                    ))}
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl
                               font-bold text-gray-900
                               dark:text-white mb-6 leading-tight">
                    {blog.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4
                                text-sm text-gray-500
                                dark:text-gray-400 mb-6">
                    <span className="flex items-center gap-1.5">
                        <HiOutlineCalendar className="w-4 h-4" />
                        {formatDate(blog.publishedAt || blog.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <HiOutlineClock className="w-4 h-4" />
                        {getReadingTime(blog.readingTime)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <HiOutlineEye className="w-4 h-4" />
                        {blog.views || 0} views
                    </span>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 mb-8 pb-8
                                border-b border-gray-200
                                dark:border-gray-700">
                    <Avatar
                        src={blog.author?.avatar}
                        name={blog.author?.name}
                        size="lg"
                    />
                    <div>
                        <Link
                            to={`/profile/${blog.author?.username}`}
                            className="font-semibold text-gray-900
                                       dark:text-white
                                       hover:text-indigo-600
                                       dark:hover:text-indigo-400
                                       transition-colors"
                        >
                            {blog.author?.name}
                        </Link>
                        <p className="text-sm text-gray-500">
                            @{blog.author?.username}
                        </p>
                        {blog.author?.bio && (
                            <p className="text-sm text-gray-500 mt-1">
                                {blog.author.bio}
                            </p>
                        )}
                    </div>
                </div>

                {/* Share + Like + Bookmark */}
                <div className="flex flex-wrap items-center
                                justify-between gap-4 mb-8">
                    <ShareButtons
                        title={blog.title}
                        slug={blog.slug}
                    />
                    <div className="flex items-center gap-2">
                        <LikeButton blogId={blog._id} />
                        <BookmarkButton blogId={blog._id} />
                    </div>
                </div>

                {/* Table of Contents */}
                <TableOfContents content={blog.content} />

                {/* Blog Content */}
                <div
                    className="prose prose-lg dark:prose-invert
                               max-w-none mb-12
                               prose-headings:font-bold
                               prose-headings:text-gray-900
                               dark:prose-headings:text-white
                               prose-p:text-gray-600
                               dark:prose-p:text-gray-300
                               prose-a:text-indigo-600
                               dark:prose-a:text-indigo-400
                               prose-img:rounded-xl
                               prose-code:bg-gray-100
                               dark:prose-code:bg-gray-800
                               prose-code:px-1.5
                               prose-code:py-0.5
                               prose-code:rounded"
                    dangerouslySetInnerHTML={{
                        __html: processedContent
                    }}
                />

                {/* Bottom Like + Bookmark */}
                <div className="flex items-center gap-3 mb-8
                                pb-8 border-b border-gray-200
                                dark:border-gray-700">
                    <LikeButton blogId={blog._id} />
                    <BookmarkButton blogId={blog._id} />
                </div>

                {/* Related Posts */}
                <RelatedPosts blogs={relatedBlogs} />

                {/* Comments */}
                <CommentSection blogId={blog._id} />
            </article>
        </Layout>
    )
}