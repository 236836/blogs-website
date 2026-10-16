import { Routes, Route } from 'react-router-dom'
import { AdminRoute, AuthRoute } from './ProtectedRoute.jsx'

// User Pages
import Home from '../user/pages/Home.jsx'
import BlogListing from '../user/pages/BlogListing.jsx'
import BlogDetail from '../user/pages/BlogDetail.jsx'
import CategoryPage from '../user/pages/CategoryPage.jsx'
import SearchPage from '../user/pages/SearchPage.jsx'
import Login from '../user/pages/Login.jsx'
import Register from '../user/pages/Register.jsx'
import ForgotPassword from '../user/pages/ForgotPassword.jsx'
import ResetPassword from '../user/pages/ResetPassword.jsx'
import UserProfile from '../user/pages/UserProfile.jsx'
import EditProfile from '../user/pages/EditProfile.jsx'
import NotFound from '../user/pages/NotFound.jsx'

// Admin Pages
import AdminDashboard from '../admin/pages/AdminDashboard.jsx'
import AdminBlogs from '../admin/pages/AdminBlogs.jsx'
import AdminBlogCreate from '../admin/pages/AdminBlogCreate.jsx'
import AdminBlogEdit from '../admin/pages/AdminBlogEdit.jsx'
import AdminCategories from '../admin/pages/AdminCategories.jsx'
import AdminTags from '../admin/pages/AdminTags.jsx'
import AdminUsers from '../admin/pages/AdminUsers.jsx'
import AdminUserDetail from '../admin/pages/AdminUserDetail.jsx'
import AdminComments from '../admin/pages/AdminComments.jsx'
import AdminNewsletter from '../admin/pages/AdminNewsletter.jsx'
import AdminSettings from '../admin/pages/AdminSettings.jsx'

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<BlogListing />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile/:username" element={<UserProfile />} />

            {/* Auth Protected Routes */}
            <Route path="/profile/edit" element={
                <AuthRoute><EditProfile /></AuthRoute>
            } />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={
                <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="/admin/blogs" element={
                <AdminRoute><AdminBlogs /></AdminRoute>
            } />
            <Route path="/admin/blogs/create" element={
                <AdminRoute><AdminBlogCreate /></AdminRoute>
            } />
            <Route path="/admin/blogs/edit/:id" element={
                <AdminRoute><AdminBlogEdit /></AdminRoute>
            } />
            <Route path="/admin/categories" element={
                <AdminRoute><AdminCategories /></AdminRoute>
            } />
            <Route path="/admin/tags" element={
                <AdminRoute><AdminTags /></AdminRoute>
            } />
            <Route path="/admin/users" element={
                <AdminRoute><AdminUsers /></AdminRoute>
            } />
            <Route path="/admin/users/:id" element={
                <AdminRoute><AdminUserDetail /></AdminRoute>
            } />
            <Route path="/admin/comments" element={
                <AdminRoute><AdminComments /></AdminRoute>
            } />
            <Route path="/admin/newsletter" element={
                <AdminRoute><AdminNewsletter /></AdminRoute>
            } />
            <Route path="/admin/settings" element={
                <AdminRoute><AdminSettings /></AdminRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}