"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, MessageSquare, Heart, Share2, ThumbsUp, Bookmark, 
  ArrowRight, Code, FileText, Search, Filter, GitBranch } from 'lucide-react'

interface CommunityPost {
  id: string
  author: {
    name: string
    avatar: string
    role: string
  }
  title: string
  content: string
  tags: string[]
  category: 'question' | 'resource' | 'showcase'
  likes: number
  comments: number
  timestamp: string
  saved?: boolean
  liked?: boolean
}

interface CommunityStats {
  members: number
  topics: number
  resources: number
  questionsAnswered: number
}

export default function CommunityHub() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Sample community stats
  const stats: CommunityStats = {
    members: 12867,
    topics: 587,
    resources: 1453,
    questionsAnswered: 8942
  }
  
  // Sample community posts
  const posts: CommunityPost[] = [
    {
      id: 'post-1',
      author: {
        name: 'Alex Morgan',
        avatar: '/images/avatars/avatar-man-1.png',
        role: 'Full Stack Developer'
      },
      title: 'Implementing user authentication with Next.js and Supabase',
      content: 'I\'ve just completed a sprint for implementing user authentication. Here\'s how I approached it using Next.js App Router and Supabase Auth. The integration was seamless and I\'ve included some tips for handling refresh tokens.',
      tags: ['next.js', 'supabase', 'authentication', 'typescript'],
      category: 'resource',
      likes: 42,
      comments: 12,
      timestamp: '2 days ago',
      saved: true
    },
    {
      id: 'post-2',
      author: {
        name: 'Samantha Liu',
        avatar: '/images/avatars/avatar-woman-1.png',
        role: 'Frontend Developer'
      },
      title: 'How do you structure your React components for complex dashboards?',
      content: 'I\'m working on a sprint to build a complex analytics dashboard. I\'m wondering how others structure their components to keep things maintainable. Do you prefer smaller atomic components or larger compound ones?',
      tags: ['react', 'architecture', 'component-design', 'dashboard'],
      category: 'question',
      likes: 18,
      comments: 24,
      timestamp: '1 day ago',
      liked: true
    },
    {
      id: 'post-3',
      author: {
        name: 'Jamal Wilson',
        avatar: '/images/avatars/avatar-man-2.png',
        role: 'Backend Developer'
      },
      title: 'Built a real-time collaborative editor using WebSockets',
      content: 'Just finished a sprint where I implemented a real-time collaborative editor. Used WebSockets with a custom conflict resolution algorithm. Happy to share my approach and code patterns!',
      tags: ['websockets', 'real-time', 'collaboration', 'node.js'],
      category: 'showcase',
      likes: 74,
      comments: 16,
      timestamp: '3 days ago'
    }
  ]
  
  // Filter posts based on active category and search query
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })
  
  // Category tabs with icons
  const categories = [
    { id: 'all', name: 'All Posts', icon: <FileText className="w-4 h-4" /> },
    { id: 'question', name: 'Questions', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'resource', name: 'Resources', icon: <Code className="w-4 h-4" /> },
    { id: 'showcase', name: 'Showcases', icon: <GitBranch className="w-4 h-4" /> }
  ]
  
  // Format large numbers with k/m suffixes
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }
  
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Developer Community</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Connect with thousands of developers sharing insights, resources, and solutions.
            Get help with your sprints and share your successes with the community.
          </p>
        </div>
        
        {/* Community stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Community Members', value: formatNumber(stats.members), icon: <Users className="w-5 h-5 text-blue-500" /> },
            { label: 'Topics Discussed', value: formatNumber(stats.topics), icon: <MessageSquare className="w-5 h-5 text-green-500" /> },
            { label: 'Shared Resources', value: formatNumber(stats.resources), icon: <FileText className="w-5 h-5 text-purple-500" /> },
            { label: 'Questions Answered', value: formatNumber(stats.questionsAnswered), icon: <ThumbsUp className="w-5 h-5 text-amber-500" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col items-center justify-center text-center"
            >
              <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar - Community features */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Join the Conversation</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
                Share your development journey, ask questions, and contribute to the community of AI-powered sprint developers.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center">
                Create New Post <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Trending Topics</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Authentication patterns', count: 128 },
                  { name: 'React performance', count: 95 },
                  { name: 'TypeScript best practices', count: 84 },
                  { name: 'State management', count: 76 },
                  { name: 'API design', count: 63 }
                ].map((topic, index) => (
                  <li key={index}>
                    <button className="w-full text-left flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded">
                      <span className="text-sm font-medium">{topic.name}</span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-full">
                        {topic.count} posts
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Main content - Community posts */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              {/* Search and filters */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="relative">
                    <button className="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-600 flex items-center text-slate-600 dark:text-slate-300">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                  </div>
                </div>
                
                {/* Category tabs */}
                <div className="flex overflow-x-auto mt-4 pb-1 gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 rounded-md flex items-center whitespace-nowrap ${
                        activeCategory === category.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {category.icon}
                      <span className="ml-2">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Posts list */}
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-6"
                    >
                      <div className="flex items-start">
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full object-cover mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h4 className="font-medium mr-2">{post.author.name}</h4>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{post.author.role}</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">{post.timestamp}</span>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                          <p className="text-slate-600 dark:text-slate-300 mb-3">{post.content}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, i) => (
                              <span 
                                key={i}
                                className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <button className={`flex items-center mr-4 ${post.liked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500'}`}>
                              <Heart className="w-4 h-4 mr-1" fill={post.liked ? "currentColor" : "none"} />
                              {post.likes}
                            </button>
                            <button className="flex items-center mr-4 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-500">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {post.comments}
                            </button>
                            <button className="flex items-center mr-4 text-slate-500 dark:text-slate-400 hover:text-green-500 dark:hover:text-green-500">
                              <Share2 className="w-4 h-4 mr-1" />
                              Share
                            </button>
                            <button className={`flex items-center ml-auto ${post.saved ? 'text-yellow-500' : 'text-slate-500 dark:text-slate-400 hover:text-yellow-500 dark:hover:text-yellow-500'}`}>
                              <Bookmark className="w-4 h-4" fill={post.saved ? "currentColor" : "none"} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-slate-500 dark:text-slate-400">
                      No posts match your search criteria. Try adjusting your filters.
                    </p>
                  </div>
                )}
              </div>
              
              {/* "See more" button */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center">
                <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  View More Posts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 