import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

dotenv.config()

// ── Import All Models ─────────────────────────────────────
import User from './models/User.model.js'
import Blog from './models/Blog.model.js'
import Category from './models/Category.model.js'
import Tag from './models/Tag.model.js'
import Comment from './models/Comment.model.js'
import Like from './models/Like.model.js'
import Bookmark from './models/Bookmark.model.js'
import Newsletter from './models/Newsletter.model.js'
import Settings from './models/Settings.model.js'

// ── Connect to Database ───────────────────────────────────
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('✅ MongoDB Connected for seeding...')
    } catch (error) {
        console.error('❌ Database connection failed:', error.message)
        process.exit(1)
    }
}

// ── Clear All Data ────────────────────────────────────────
const clearData = async () => {
    console.log('🗑️  Clearing existing data...')

    await User.deleteMany()
    await Blog.deleteMany()
    await Category.deleteMany()
    await Tag.deleteMany()
    await Comment.deleteMany()
    await Like.deleteMany()
    await Bookmark.deleteMany()
    await Newsletter.deleteMany()
    await Settings.deleteMany()

    console.log('✅ All data cleared')
}

// ── Seed Settings ─────────────────────────────────────────
const seedSettings = async () => {
    console.log('⚙️  Seeding settings...')

    await Settings.create({
        siteName: 'BlogFlow',
        contactEmail: 'contact@blogflow.com',
        socialLinks: {
            twitter: 'https://twitter.com/blogflow',
            facebook: 'https://facebook.com/blogflow',
            instagram: 'https://instagram.com/blogflow',
            linkedin: 'https://linkedin.com/company/blogflow'
        }
    })

    console.log('✅ Settings seeded')
}

// ── Seed Users ────────────────────────────────────────────
const seedUsers = async () => {
    console.log('👥 Seeding users...')

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash('123456', salt)

    const users = await User.create([
        {
            name: 'Admin User',
            username: 'admin',
            email: 'admin@blogflow.com',
            password: hashedPassword,
            role: 'admin',
            bio: 'Administrator of BlogFlow. MERN Stack Developer.',
            socialLinks: {
                twitter: 'https://twitter.com/admin',
                github: 'https://github.com/admin',
                linkedin: 'https://linkedin.com/in/admin',
                website: 'https://blogflow.com'
            }
        },
        {
            name: 'John Developer',
            username: 'johndeveloper',
            email: 'john@blogflow.com',
            password: hashedPassword,
            role: 'user',
            bio: 'Full Stack Developer passionate about React and Node.js',
            socialLinks: {
                twitter: 'https://twitter.com/johndeveloper',
                github: 'https://github.com/johndeveloper'
            }
        },
        {
            name: 'Sarah Coder',
            username: 'sarahcoder',
            email: 'sarah@blogflow.com',
            password: hashedPassword,
            role: 'user',
            bio: 'Frontend Developer specializing in React and Tailwind CSS',
            socialLinks: {
                github: 'https://github.com/sarahcoder',
                linkedin: 'https://linkedin.com/in/sarahcoder'
            }
        },
        {
            name: 'Mike Backend',
            username: 'mikebackend',
            email: 'mike@blogflow.com',
            password: hashedPassword,
            role: 'user',
            bio: 'Backend Developer with expertise in Node.js and MongoDB'
        }
    ])

    console.log(`✅ ${users.length} users seeded`)
    return users
}

// ── Seed Categories ───────────────────────────────────────
const seedCategories = async () => {
    console.log('📁 Seeding categories...')

    const categories = await Category.create([
        {
            name: 'JavaScript',
            slug: 'javascript',
            description: 'Everything about JavaScript programming language',
            icon: '🟨'
        },
        {
            name: 'React',
            slug: 'react',
            description: 'React.js tutorials, tips and best practices',
            icon: '⚛️'
        },
        {
            name: 'Node.js',
            slug: 'nodejs',
            description: 'Backend development with Node.js and Express',
            icon: '🟢'
        },
        {
            name: 'MongoDB',
            slug: 'mongodb',
            description: 'NoSQL database tutorials and design patterns',
            icon: '🍃'
        },
        {
            name: 'CSS',
            slug: 'css',
            description: 'CSS styling, animations and responsive design',
            icon: '🎨'
        },
        {
            name: 'TypeScript',
            slug: 'typescript',
            description: 'TypeScript tutorials for JavaScript developers',
            icon: '🔷'
        },
        {
            name: 'DevOps',
            slug: 'devops',
            description: 'DevOps practices, Docker and deployment',
            icon: '🚀'
        },
        {
            name: 'MERN Stack',
            slug: 'mern-stack',
            description: 'Full stack development with MERN Stack',
            icon: '💻'
        }
    ])

    console.log(`✅ ${categories.length} categories seeded`)
    return categories
}

// ── Seed Tags ─────────────────────────────────────────────
const seedTags = async () => {
    console.log('🏷️  Seeding tags...')

    const tags = await Tag.create([
        { name: 'React', slug: 'react' },
        { name: 'JavaScript', slug: 'javascript' },
        { name: 'Node.js', slug: 'nodejs' },
        { name: 'MongoDB', slug: 'mongodb' },
        { name: 'Express', slug: 'express' },
        { name: 'Tailwind CSS', slug: 'tailwind-css' },
        { name: 'TypeScript', slug: 'typescript' },
        { name: 'API', slug: 'api' },
        { name: 'REST API', slug: 'rest-api' },
        { name: 'JWT', slug: 'jwt' },
        { name: 'Authentication', slug: 'authentication' },
        { name: 'CSS', slug: 'css' },
        { name: 'HTML', slug: 'html' },
        { name: 'Git', slug: 'git' },
        { name: 'Docker', slug: 'docker' },
        { name: 'Hooks', slug: 'hooks' },
        { name: 'CRUD', slug: 'crud' },
        { name: 'Beginner', slug: 'beginner' },
        { name: 'Advanced', slug: 'advanced' },
        { name: 'Tutorial', slug: 'tutorial' }
    ])

    console.log(`✅ ${tags.length} tags seeded`)
    return tags
}

// ── Seed Blogs ────────────────────────────────────────────
const seedBlogs = async (users, categories, tags) => {
    console.log('📝 Seeding blogs...')

    const adminUser = users[0]
    const johnUser = users[1]
    const sarahUser = users[2]
    const mikeUser = users[3]

    const jsCat = categories.find((c) => c.slug === 'javascript')
    const reactCat = categories.find((c) => c.slug === 'react')
    const nodeCat = categories.find((c) => c.slug === 'nodejs')
    const mongoCat = categories.find((c) => c.slug === 'mongodb')
    const cssCat = categories.find((c) => c.slug === 'css')
    const mernCat = categories.find((c) => c.slug === 'mern-stack')
    const tsCat = categories.find((c) => c.slug === 'typescript')
    const devopsCat = categories.find((c) => c.slug === 'devops')

    const reactTag = tags.find((t) => t.slug === 'react')
    const jsTag = tags.find((t) => t.slug === 'javascript')
    const nodeTag = tags.find((t) => t.slug === 'nodejs')
    const mongoTag = tags.find((t) => t.slug === 'mongodb')
    const expressTag = tags.find((t) => t.slug === 'express')
    const tailwindTag = tags.find((t) => t.slug === 'tailwind-css')
    const tsTag = tags.find((t) => t.slug === 'typescript')
    const apiTag = tags.find((t) => t.slug === 'api')
    const jwtTag = tags.find((t) => t.slug === 'jwt')
    const authTag = tags.find((t) => t.slug === 'authentication')
    const hooksTag = tags.find((t) => t.slug === 'hooks')
    const beginnerTag = tags.find((t) => t.slug === 'beginner')
    const tutorialTag = tags.find((t) => t.slug === 'tutorial')
    const dockerTag = tags.find((t) => t.slug === 'docker')
    const crudTag = tags.find((t) => t.slug === 'crud')

    const blogs = await Blog.create([
        // Blog 1
        {
            title: 'Getting Started with React.js — A Complete Beginner Guide',
            slug: 'getting-started-with-reactjs-complete-beginner-guide',
            content: `<h2>Introduction to React</h2>
<p>React is a JavaScript library for building user interfaces. It was developed by Facebook and has become one of the most popular frontend frameworks in the world. React allows developers to create large web applications that can update and render efficiently in response to data changes.</p>

<h2>Why Learn React?</h2>
<p>There are many reasons why React has become so popular among developers:</p>
<ul>
<li><strong>Component-Based Architecture</strong> — Build encapsulated components that manage their own state</li>
<li><strong>Virtual DOM</strong> — React uses a virtual DOM for fast rendering</li>
<li><strong>Large Ecosystem</strong> — Huge community and tons of libraries</li>
<li><strong>Job Market</strong> — React is the most in-demand frontend skill</li>
</ul>

<h2>Setting Up Your First React App</h2>
<p>The easiest way to create a React application is using Vite. Open your terminal and run:</p>
<pre><code>npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev</code></pre>

<h2>Understanding Components</h2>
<p>Components are the building blocks of React applications. A component is a JavaScript function that returns JSX (HTML-like syntax).</p>
<pre><code>export default function Welcome({ name }) {
  return (
    &lt;div&gt;
      &lt;h1&gt;Hello, {name}!&lt;/h1&gt;
      &lt;p&gt;Welcome to React.&lt;/p&gt;
    &lt;/div&gt;
  )
}</code></pre>

<h2>State and Props</h2>
<p>State is data that can change over time. Props are data passed from parent to child components.</p>
<pre><code>import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    &lt;button onClick={() => setCount(count + 1)}&gt;
      Count: {count}
    &lt;/button&gt;
  )
}</code></pre>

<h2>Conclusion</h2>
<p>React is a powerful library that makes building user interfaces fun and efficient. Start with the basics, build small projects, and gradually learn advanced concepts like hooks, context, and routing.</p>`,
            excerpt: 'Learn React.js from scratch with this complete guide. Understand components, state, props, and build your first React application.',
            author: adminUser._id,
            category: reactCat._id,
            tags: [reactTag._id, jsTag._id, beginnerTag._id, tutorialTag._id],
            status: 'published',
            isFeatured: true,
            readingTime: 8,
            views: 1250,
            likesCount: 45,
            commentsCount: 12,
            metaTitle: 'Getting Started with React.js — Complete Guide for Beginners',
            metaDescription: 'Learn React.js from scratch with this complete beginner guide covering components, state, props and more.',
            publishedAt: new Date('2024-01-15')
        },

        // Blog 2
        {
            title: 'Building REST APIs with Node.js and Express',
            slug: 'building-rest-apis-nodejs-express',
            content: `<h2>What is a REST API?</h2>
<p>A REST API (Representational State Transfer) is an architectural style for building web services. It uses standard HTTP methods like GET, POST, PUT, and DELETE to perform operations on resources.</p>

<h2>Setting Up Node.js and Express</h2>
<p>First, create a new Node.js project and install Express:</p>
<pre><code>mkdir my-api
cd my-api
npm init -y
npm install express dotenv cors</code></pre>

<h2>Creating Your First Route</h2>
<p>Create a simple Express server with basic routes:</p>
<pre><code>import express from 'express'
const app = express()

app.use(express.json())

app.get('/api/users', (req, res) => {
  res.json({ users: [] })
})

app.post('/api/users', (req, res) => {
  const { name, email } = req.body
  res.status(201).json({ message: 'User created', name, email })
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})</code></pre>

<h2>Middleware in Express</h2>
<p>Middleware functions are functions that have access to the request, response, and next function in the application's request-response cycle.</p>
<pre><code>const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}</code></pre>

<h2>Error Handling</h2>
<p>Always handle errors properly in your API:</p>
<pre><code>app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  })
})</code></pre>

<h2>Conclusion</h2>
<p>Building REST APIs with Node.js and Express is straightforward. Follow RESTful conventions, handle errors properly, and always validate user input for secure and reliable APIs.</p>`,
            excerpt: 'Learn how to build production-ready REST APIs with Node.js and Express. Covers routing, middleware, error handling and best practices.',
            author: johnUser._id,
            category: nodeCat._id,
            tags: [nodeTag._id, expressTag._id, apiTag._id, tutorialTag._id],
            status: 'published',
            isFeatured: true,
            readingTime: 10,
            views: 980,
            likesCount: 38,
            commentsCount: 8,
            metaTitle: 'Building REST APIs with Node.js and Express',
            metaDescription: 'Complete guide to building REST APIs with Node.js and Express including middleware and error handling.',
            publishedAt: new Date('2024-01-20')
        },

        // Blog 3
        {
            title: 'MongoDB Complete Guide — From Basics to Advanced',
            slug: 'mongodb-complete-guide-basics-to-advanced',
            content: `<h2>Introduction to MongoDB</h2>
<p>MongoDB is a NoSQL database that stores data in JSON-like documents. Unlike relational databases, MongoDB does not require a fixed schema, making it flexible and scalable for modern applications.</p>

<h2>Installing MongoDB</h2>
<p>You can use MongoDB Atlas for a cloud-hosted database or install it locally. For development, MongoDB Atlas is recommended as it is free and easy to set up.</p>

<h2>Connecting with Mongoose</h2>
<p>Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js:</p>
<pre><code>import mongoose from 'mongoose'

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected:', conn.connection.host)
}

export default connectDB</code></pre>

<h2>Creating a Schema and Model</h2>
<p>A schema defines the structure of your documents:</p>
<pre><code>import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model('User', userSchema)
export default User</code></pre>

<h2>CRUD Operations</h2>
<p>Perform basic Create, Read, Update, Delete operations:</p>
<pre><code>// Create
const user = await User.create({ name: 'John', email: 'john@example.com' })

// Read
const users = await User.find()
const user = await User.findById(id)

// Update
const updated = await User.findByIdAndUpdate(id, { name: 'Jane' }, { new: true })

// Delete
await User.findByIdAndDelete(id)</code></pre>

<h2>Conclusion</h2>
<p>MongoDB is a powerful database for modern web applications. Its flexible schema and rich query language make it perfect for building scalable applications.</p>`,
            excerpt: 'Complete MongoDB guide covering installation, Mongoose setup, schema design, CRUD operations and advanced queries.',
            author: mikeUser._id,
            category: mongoCat._id,
            tags: [mongoTag._id, nodeTag._id, crudTag._id, tutorialTag._id],
            status: 'published',
            isFeatured: false,
            readingTime: 12,
            views: 756,
            likesCount: 29,
            commentsCount: 6,
            metaTitle: 'MongoDB Complete Guide — Basics to Advanced',
            metaDescription: 'Complete MongoDB guide with Mongoose, schema design and CRUD operations.',
            publishedAt: new Date('2024-01-25')
        },

        // Blog 4
        {
            title: 'Mastering Tailwind CSS — Build Beautiful UIs Fast',
            slug: 'mastering-tailwind-css-build-beautiful-uis-fast',
            content: `<h2>What is Tailwind CSS?</h2>
<p>Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without leaving your HTML. Instead of pre-built components, Tailwind gives you the building blocks you need.</p>

<h2>Installing Tailwind CSS</h2>
<pre><code>npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p</code></pre>

<h2>Core Concepts</h2>
<p>Tailwind uses utility classes that map directly to CSS properties:</p>
<pre><code>&lt;div class="flex items-center justify-center min-h-screen bg-gray-50"&gt;
  &lt;div class="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full"&gt;
    &lt;h1 class="text-3xl font-bold text-gray-900 mb-4"&gt;
      Hello World
    &lt;/h1&gt;
    &lt;p class="text-gray-600"&gt;
      This is styled with Tailwind CSS
    &lt;/p&gt;
    &lt;button class="mt-6 w-full bg-indigo-600 hover:bg-indigo-700
                   text-white font-medium py-3 rounded-xl
                   transition-colors"&gt;
      Click Me
    &lt;/button&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>

<h2>Responsive Design</h2>
<p>Tailwind makes responsive design easy with breakpoint prefixes:</p>
<pre><code>&lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
  &lt;div class="bg-white p-6 rounded-xl"&gt;Card 1&lt;/div&gt;
  &lt;div class="bg-white p-6 rounded-xl"&gt;Card 2&lt;/div&gt;
  &lt;div class="bg-white p-6 rounded-xl"&gt;Card 3&lt;/div&gt;
&lt;/div&gt;</code></pre>

<h2>Dark Mode</h2>
<p>Tailwind makes dark mode simple with the dark: prefix:</p>
<pre><code>&lt;div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"&gt;
  &lt;p class="text-gray-600 dark:text-gray-400"&gt;
    This works in both light and dark mode!
  &lt;/p&gt;
&lt;/div&gt;</code></pre>

<h2>Conclusion</h2>
<p>Tailwind CSS is a game-changer for frontend development. It speeds up your workflow, keeps your CSS consistent, and makes building responsive designs a breeze.</p>`,
            excerpt: 'Learn Tailwind CSS from scratch. Master utility classes, responsive design, dark mode and build stunning user interfaces quickly.',
            author: sarahUser._id,
            category: cssCat._id,
            tags: [tailwindTag._id, jsTag._id, beginnerTag._id],
            status: 'published',
            isFeatured: true,
            readingTime: 9,
            views: 1100,
            likesCount: 52,
            commentsCount: 15,
            metaTitle: 'Mastering Tailwind CSS — Build Beautiful UIs Fast',
            metaDescription: 'Learn Tailwind CSS utility-first approach and build beautiful responsive UIs quickly.',
            publishedAt: new Date('2024-02-01')
        },

        // Blog 5
        {
            title: 'JWT Authentication in Node.js — Complete Guide',
            slug: 'jwt-authentication-nodejs-complete-guide',
            content: `<h2>What is JWT?</h2>
<p>JSON Web Token (JWT) is an open standard for securely transmitting information between parties as a JSON object. It is commonly used for authentication and authorization in web applications.</p>

<h2>How JWT Works</h2>
<p>A JWT consists of three parts separated by dots:</p>
<ul>
<li><strong>Header</strong> — Contains the token type and algorithm</li>
<li><strong>Payload</strong> — Contains the claims (user data)</li>
<li><strong>Signature</strong> — Verifies the token has not been tampered</li>
</ul>

<h2>Installing Required Packages</h2>
<pre><code>npm install jsonwebtoken bcryptjs</code></pre>

<h2>Generating a JWT Token</h2>
<pre><code>import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export default generateToken</code></pre>

<h2>Verifying JWT Token</h2>
<pre><code>import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded.id)
  next()
}</code></pre>

<h2>Login with JWT</h2>
<pre><code>const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+password')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = generateToken(user._id)
  res.json({ token, user })
}</code></pre>

<h2>Conclusion</h2>
<p>JWT authentication is a secure and stateless way to handle authentication in Node.js applications. Always store JWTs securely and set appropriate expiration times.</p>`,
            excerpt: 'Learn how to implement JWT authentication in Node.js. Covers token generation, verification, login, register and protected routes.',
            author: adminUser._id,
            category: nodeCat._id,
            tags: [nodeTag._id, jwtTag._id, authTag._id, apiTag._id],
            status: 'published',
            isFeatured: false,
            readingTime: 11,
            views: 890,
            likesCount: 41,
            commentsCount: 9,
            metaTitle: 'JWT Authentication in Node.js — Complete Guide',
            metaDescription: 'Implement JWT authentication in Node.js with this complete guide.',
            publishedAt: new Date('2024-02-05')
        },

        // Blog 6
        {
            title: 'React Hooks Complete Guide — useState, useEffect and More',
            slug: 'react-hooks-complete-guide-usestate-useeffect',
            content: `<h2>What are React Hooks?</h2>
<p>Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and have transformed how we write React components.</p>

<h2>useState Hook</h2>
<p>useState lets you add state to functional components:</p>
<pre><code>import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;Increment&lt;/button&gt;
      &lt;input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      /&gt;
    &lt;/div&gt;
  )
}</code></pre>

<h2>useEffect Hook</h2>
<p>useEffect lets you perform side effects in function components:</p>
<pre><code>import { useState, useEffect } from 'react'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data)
      setLoading(false)
    }

    fetchUsers()
  }, []) // Empty array means run once on mount

  if (loading) return &lt;p&gt;Loading...&lt;/p&gt;

  return (
    &lt;ul&gt;
      {users.map(user => (
        &lt;li key={user.id}&gt;{user.name}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  )
}</code></pre>

<h2>useContext Hook</h2>
<p>useContext lets you consume context values:</p>
<pre><code>import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)
  return (
    &lt;ThemeContext.Provider value={{ isDark, setIsDark }}&gt;
      {children}
    &lt;/ThemeContext.Provider&gt;
  )
}

export const useTheme = () => useContext(ThemeContext)</code></pre>

<h2>Custom Hooks</h2>
<p>You can create your own hooks to reuse stateful logic:</p>
<pre><code>import { useState, useEffect } from 'react'

const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [url])

  return { data, loading, error }
}

export default useFetch</code></pre>

<h2>Conclusion</h2>
<p>React Hooks have revolutionized React development. They make code more readable, reusable, and easier to test. Master these hooks and you will be a much more effective React developer.</p>`,
            excerpt: 'Complete guide to React Hooks including useState, useEffect, useContext, useRef and custom hooks with practical examples.',
            author: sarahUser._id,
            category: reactCat._id,
            tags: [reactTag._id, jsTag._id, hooksTag._id, tutorialTag._id],
            status: 'published',
            isFeatured: false,
            readingTime: 13,
            views: 1450,
            likesCount: 67,
            commentsCount: 18,
            metaTitle: 'React Hooks Complete Guide — useState useEffect and More',
            metaDescription: 'Master React Hooks with this complete guide covering all built-in hooks and custom hooks.',
            publishedAt: new Date('2024-02-10')
        },

        // Blog 7
        {
            title: 'Building a Full Stack MERN App — Step by Step',
            slug: 'building-full-stack-mern-app-step-by-step',
            content: `<h2>What is MERN Stack?</h2>
<p>MERN Stack is a popular technology stack for building full-stack web applications. It consists of:</p>
<ul>
<li><strong>M</strong>ongoDB — NoSQL database</li>
<li><strong>E</strong>xpress.js — Web framework for Node.js</li>
<li><strong>R</strong>eact.js — Frontend library</li>
<li><strong>N</strong>ode.js — JavaScript runtime</li>
</ul>

<h2>Project Structure</h2>
<p>A typical MERN project structure looks like this:</p>
<pre><code>mern-app/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── server/          # Node.js backend
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   └── controllers/
│   └── package.json
└── README.md</code></pre>

<h2>Setting Up the Backend</h2>
<pre><code>import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

await mongoose.connect(process.env.MONGO_URI)

app.listen(5000, () => console.log('Server on port 5000'))</code></pre>

<h2>Setting Up the Frontend</h2>
<pre><code>npm create vite@latest client -- --template react
cd client
npm install axios react-router-dom</code></pre>

<h2>Connecting Frontend to Backend</h2>
<pre><code>import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export const getUsers = async () => {
  const response = await api.get('/users')
  return response.data
}</code></pre>

<h2>Conclusion</h2>
<p>The MERN stack is a powerful combination for building modern web applications. With JavaScript on both frontend and backend, you can build full-stack applications efficiently.</p>`,
            excerpt: 'Learn to build a complete full-stack application using MongoDB, Express, React and Node.js with this comprehensive step-by-step guide.',
            author: johnUser._id,
            category: mernCat._id,
            tags: [reactTag._id, nodeTag._id, mongoTag._id, expressTag._id],
            status: 'published',
            isFeatured: true,
            readingTime: 15,
            views: 2100,
            likesCount: 89,
            commentsCount: 24,
            metaTitle: 'Building a Full Stack MERN App — Step by Step Guide',
            metaDescription: 'Complete guide to building a full-stack MERN application from scratch.',
            publishedAt: new Date('2024-02-15')
        },

        // Blog 8
        {
            title: 'TypeScript for JavaScript Developers',
            slug: 'typescript-for-javascript-developers',
            content: `<h2>Why TypeScript?</h2>
<p>TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing and class-based object-oriented programming to the language.</p>

<h2>Basic Types</h2>
<pre><code>// String
let name: string = 'John'

// Number
let age: number = 25

// Boolean
let isActive: boolean = true

// Array
let numbers: number[] = [1, 2, 3]
let names: string[] = ['John', 'Jane']

// Object
let user: { name: string; age: number } = {
  name: 'John',
  age: 25
}</code></pre>

<h2>Interfaces</h2>
<pre><code>interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: Date
}

const createUser = (userData: Partial&lt;User&gt;): User => {
  return {
    id: '123',
    role: 'user',
    createdAt: new Date(),
    ...userData
  } as User
}</code></pre>

<h2>Generics</h2>
<pre><code>const getFirst = &lt;T&gt;(arr: T[]): T => {
  return arr[0]
}

const firstNumber = getFirst([1, 2, 3]) // type: number
const firstName = getFirst(['John', 'Jane']) // type: string</code></pre>

<h2>Conclusion</h2>
<p>TypeScript helps catch errors at compile time, improves code readability, and makes refactoring easier. It is highly recommended for large JavaScript projects.</p>`,
            excerpt: 'Learn TypeScript fundamentals including types, interfaces, generics and how to migrate your JavaScript projects to TypeScript.',
            author: adminUser._id,
            category: tsCat._id,
            tags: [tsTag._id, jsTag._id, tutorialTag._id],
            status: 'published',
            isFeatured: false,
            readingTime: 10,
            views: 670,
            likesCount: 31,
            commentsCount: 7,
            metaTitle: 'TypeScript for JavaScript Developers',
            metaDescription: 'Learn TypeScript from a JavaScript perspective with practical examples.',
            publishedAt: new Date('2024-02-20')
        },

        // Blog 9 - Draft
        {
            title: 'Docker for Node.js Developers',
            slug: 'docker-for-nodejs-developers',
            content: `<h2>Introduction to Docker</h2>
<p>Docker is a platform for building, shipping and running applications in containers. Containers are lightweight, portable and consistent environments that ensure your app runs the same everywhere.</p>

<h2>Installing Docker</h2>
<p>Download and install Docker Desktop from docker.com. Then verify installation:</p>
<pre><code>docker --version
docker compose version</code></pre>

<h2>Creating a Dockerfile</h2>
<pre><code>FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]</code></pre>

<h2>Docker Compose</h2>
<pre><code>version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/myapp
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:</code></pre>

<h2>Conclusion</h2>
<p>Docker simplifies development and deployment of Node.js applications. Use it to ensure consistency across development, staging and production environments.</p>`,
            excerpt: 'Learn how to containerize your Node.js applications with Docker. Covers Dockerfile, Docker Compose and deployment best practices.',
            author: mikeUser._id,
            category: devopsCat._id,
            tags: [dockerTag._id, nodeTag._id],
            status: 'draft',
            isFeatured: false,
            readingTime: 8,
            views: 0,
            likesCount: 0,
            commentsCount: 0,
            metaTitle: 'Docker for Node.js Developers',
            metaDescription: 'Learn Docker containerization for Node.js applications.',
            publishedAt: null
        },

        // Blog 10
        {
            title: 'JavaScript ES6+ Features Every Developer Should Know',
            slug: 'javascript-es6-features-every-developer-should-know',
            content: `<h2>Arrow Functions</h2>
<p>Arrow functions provide a concise syntax for writing functions:</p>
<pre><code>// Traditional function
function add(a, b) {
  return a + b
}

// Arrow function
const add = (a, b) => a + b

// With body
const multiply = (a, b) => {
  const result = a * b
  return result
}</code></pre>

<h2>Destructuring</h2>
<pre><code>// Object destructuring
const { name, age, email } = user

// Array destructuring
const [first, second, ...rest] = numbers

// With default values
const { name = 'Anonymous', role = 'user' } = user</code></pre>

<h2>Spread and Rest</h2>
<pre><code>// Spread
const newArray = [...array1, ...array2]
const newObj = { ...obj1, ...obj2 }

// Rest
const sum = (...numbers) => {
  return numbers.reduce((total, num) => total + num, 0)
}</code></pre>

<h2>Async/Await</h2>
<pre><code>// Instead of promises
const fetchUser = async (id) => {
  try {
    const response = await fetch('/api/users/' + id)
    const user = await response.json()
    return user
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error
  }
}</code></pre>

<h2>Optional Chaining</h2>
<pre><code>// Without optional chaining (can throw errors)
const city = user && user.address && user.address.city

// With optional chaining
const city = user?.address?.city</code></pre>

<h2>Conclusion</h2>
<p>ES6+ features have made JavaScript much more powerful and readable. Master these features to write cleaner and more efficient code.</p>`,
            excerpt: 'Learn the most important ES6+ features including arrow functions, destructuring, async/await, optional chaining and more.',
            author: johnUser._id,
            category: jsCat._id,
            tags: [jsTag._id, beginnerTag._id, tutorialTag._id],
            status: 'published',
            isFeatured: false,
            readingTime: 9,
            views: 1320,
            likesCount: 58,
            commentsCount: 14,
            metaTitle: 'JavaScript ES6+ Features Every Developer Should Know',
            metaDescription: 'Learn essential ES6+ JavaScript features for modern web development.',
            publishedAt: new Date('2024-03-01')
        }
    ])

    console.log(`✅ ${blogs.length} blogs seeded`)
    return blogs
}

// ── Seed Comments ─────────────────────────────────────────
const seedComments = async (users, blogs) => {
    console.log('💬 Seeding comments...')

    const admin = users[0]
    const john = users[1]
    const sarah = users[2]
    const mike = users[3]

    const publishedBlogs = blogs.filter((b) => b.status === 'published')

    const comments = []

    for (const blog of publishedBlogs.slice(0, 5)) {
        const comment1 = await Comment.create({
            blog: blog._id,
            author: john._id,
            content: 'This is an excellent article! Very well explained and easy to understand. I learned a lot from this post. Thank you for sharing!',
            parentComment: null,
            isApproved: true,
            isHidden: false
        })
        comments.push(comment1)

        const comment2 = await Comment.create({
            blog: blog._id,
            author: sarah._id,
            content: 'Great content! I have been looking for a clear explanation of this topic for a while. This post answered all my questions.',
            parentComment: null,
            isApproved: true,
            isHidden: false
        })
        comments.push(comment2)

        const reply = await Comment.create({
            blog: blog._id,
            author: admin._id,
            content: 'Thank you for your kind words! I am glad this was helpful. Feel free to ask if you have any questions.',
            parentComment: comment1._id,
            isApproved: true,
            isHidden: false
        })
        comments.push(reply)

        await Comment.findByIdAndUpdate(comment1._id, {
            $push: { replies: reply._id }
        })

        const comment3 = await Comment.create({
            blog: blog._id,
            author: mike._id,
            content: 'Really useful post. I am going to implement this in my project right away. Could you write a follow-up post on advanced topics?',
            parentComment: null,
            isApproved: true,
            isHidden: false
        })
        comments.push(comment3)
    }

    console.log(`✅ ${comments.length} comments seeded`)
    return comments
}

// ── Seed Likes ────────────────────────────────────────────
const seedLikes = async (users, blogs) => {
    console.log('❤️  Seeding likes...')

    const publishedBlogs = blogs.filter((b) => b.status === 'published')
    const likes = []

    for (const blog of publishedBlogs) {
        for (const user of users) {
            const shouldLike = Math.random() > 0.3

            if (shouldLike) {
                try {
                    const like = await Like.create({
                        user: user._id,
                        blog: blog._id
                    })
                    likes.push(like)
                } catch (error) {
                    // Skip duplicate likes
                }
            }
        }
    }

    console.log(`✅ ${likes.length} likes seeded`)
    return likes
}

// ── Seed Bookmarks ────────────────────────────────────────
const seedBookmarks = async (users, blogs) => {
    console.log('🔖 Seeding bookmarks...')

    const publishedBlogs = blogs.filter((b) => b.status === 'published')
    const bookmarks = []

    for (const user of users) {
        const blogsToBookmark = publishedBlogs
            .filter(() => Math.random() > 0.5)
            .slice(0, 4)

        for (const blog of blogsToBookmark) {
            try {
                const bookmark = await Bookmark.create({
                    user: user._id,
                    blog: blog._id
                })
                bookmarks.push(bookmark)
            } catch (error) {
                // Skip duplicates
            }
        }
    }

    console.log(`✅ ${bookmarks.length} bookmarks seeded`)
    return bookmarks
}

// ── Seed Newsletter ───────────────────────────────────────
const seedNewsletter = async () => {
    console.log('📧 Seeding newsletter subscribers...')

    const subscribers = await Newsletter.create([
        { email: 'subscriber1@example.com', isSubscribed: true },
        { email: 'subscriber2@example.com', isSubscribed: true },
        { email: 'subscriber3@example.com', isSubscribed: true },
        { email: 'subscriber4@example.com', isSubscribed: true },
        { email: 'subscriber5@example.com', isSubscribed: true },
        { email: 'subscriber6@example.com', isSubscribed: false, unsubscribedAt: new Date() },
        { email: 'subscriber7@example.com', isSubscribed: true },
        { email: 'subscriber8@example.com', isSubscribed: false, unsubscribedAt: new Date() },
        { email: 'subscriber9@example.com', isSubscribed: true },
        { email: 'subscriber10@example.com', isSubscribed: true }
    ])

    console.log(`✅ ${subscribers.length} newsletter subscribers seeded`)
}

// ── Main Seed Function ────────────────────────────────────
const seed = async () => {
    console.log('')
    console.log('🌱 Starting BlogFlow Database Seed...')
    console.log('══════════════════════════════════════')

    await connectDB()
    await clearData()
    await seedSettings()
    const users = await seedUsers()
    const categories = await seedCategories()
    const tags = await seedTags()
    const blogs = await seedBlogs(users, categories, tags)
    await seedComments(users, blogs)
    await seedLikes(users, blogs)
    await seedBookmarks(users, blogs)
    await seedNewsletter()

    console.log('')
    console.log('══════════════════════════════════════')
    console.log('🎉 Database seeded successfully!')
    console.log('')
    console.log('📋 Login Credentials:')
    console.log('══════════════════════════════════════')
    console.log('👑 Admin Account:')
    console.log('   Email    : admin@blogflow.com')
    console.log('   Password : 123456')
    console.log('   Role     : admin')
    console.log('')
    console.log('👤 User Accounts:')
    console.log('   Email    : john@blogflow.com')
    console.log('   Password : 123456')
    console.log('')
    console.log('   Email    : sarah@blogflow.com')
    console.log('   Password : 123456')
    console.log('')
    console.log('   Email    : mike@blogflow.com')
    console.log('   Password : 123456')
    console.log('══════════════════════════════════════')
    console.log('')

    process.exit(0)
}

seed().catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
})