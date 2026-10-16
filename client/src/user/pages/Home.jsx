import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout.jsx'
import HeroSection from '../components/home/HeroSection.jsx'
import FeaturedPost from '../components/home/FeaturedPost.jsx'
import LatestBlogs from '../components/home/LatestBlogs.jsx'
import TrendingBlogs from '../components/home/TrendingBlogs.jsx'
import CategoriesSection from '../components/home/CategoriesSection.jsx'
import NewsletterSection from '../components/home/NewsletterSection.jsx'
import { getFeaturedBlogs, getLatestBlogs, getTrendingBlogs } from '../../services/blogService.js'
import { getAllCategories } from '../../services/categoryService.js'

export default function Home() {
    const [featuredBlog, setFeaturedBlog] = useState(null)
    const [latestBlogs, setLatestBlogs] = useState([])
    const [trendingBlogs, setTrendingBlogs] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true)

                const [featuredRes, latestRes, trendingRes, categoriesRes] =
                    await Promise.allSettled([
                        getFeaturedBlogs(1),
                        getLatestBlogs(6),
                        getTrendingBlogs(4),
                        getAllCategories()
                    ])

                if (featuredRes.status === 'fulfilled' && featuredRes.value?.data?.blogs?.length > 0) {
                    setFeaturedBlog(featuredRes.value.data.blogs[0])
                }

                if (latestRes.status === 'fulfilled') {
                    setLatestBlogs(latestRes.value?.data?.blogs || [])
                }

                if (trendingRes.status === 'fulfilled') {
                    setTrendingBlogs(trendingRes.value?.data?.blogs || [])
                }

                if (categoriesRes.status === 'fulfilled') {
                    setCategories(categoriesRes.value?.data?.categories || [])
                }

            } catch (error) {
                console.error('Failed to fetch home data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchHomeData()
    }, [])

    return (
        <Layout>
            <HeroSection />
            <FeaturedPost blog={featuredBlog} />
            <LatestBlogs blogs={latestBlogs} loading={loading} />
            <TrendingBlogs blogs={trendingBlogs} loading={loading} />
            <CategoriesSection categories={categories} loading={loading} />
            <NewsletterSection />
        </Layout>
    )
}