"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, Code, Copy, ExternalLink, Eye, Filter, PlusCircle, Search, Star, Tag, Zap } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'design'
  stack: string[]
  stars: number
  downloads: number
  isNew: boolean
  isPremium: boolean
}

export default function TemplateGallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  // Sample template data
  const templates: Template[] = [
    {
      id: 'nextjs-dashboard',
      name: 'Next.js Admin Dashboard',
      description: 'Modern admin dashboard with Next.js, TypeScript, and Tailwind CSS. Includes authentication, dark mode, and data visualization.',
      thumbnail: '/images/templates/nextjs-dashboard.jpg',
      category: 'frontend',
      stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Shadcn UI', 'React Query'],
      stars: 235,
      downloads: 1245,
      isNew: true,
      isPremium: false
    },
    {
      id: 'ecommerce-store',
      name: 'E-commerce Storefront',
      description: 'Complete e-commerce solution with product catalog, cart, checkout, and order management.',
      thumbnail: '/images/templates/ecommerce-store.jpg',
      category: 'fullstack',
      stack: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'Tailwind CSS'],
      stars: 187,
      downloads: 932,
      isNew: false,
      isPremium: true
    },
    {
      id: 'api-backend',
      name: 'API Backend Starter',
      description: 'Scalable REST API backend with authentication, rate limiting, and comprehensive documentation.',
      thumbnail: '/images/templates/api-backend.jpg',
      category: 'backend',
      stack: ['Node.js', 'Express', 'MongoDB', 'Swagger', 'JWT'],
      stars: 145,
      downloads: 876,
      isNew: false,
      isPremium: false
    },
    {
      id: 'react-native-app',
      name: 'React Native Mobile App',
      description: 'Cross-platform mobile app template with navigation, authentication, and offline support.',
      thumbnail: '/images/templates/react-native-app.jpg',
      category: 'mobile',
      stack: ['React Native', 'Expo', 'TypeScript', 'AsyncStorage', 'React Navigation'],
      stars: 112,
      downloads: 654,
      isNew: true,
      isPremium: false
    },
    {
      id: 'design-system',
      name: 'Component Design System',
      description: 'Comprehensive UI component library with design tokens, documentation, and testing.',
      thumbnail: '/images/templates/design-system.jpg',
      category: 'design',
      stack: ['Storybook', 'Figma', 'React', 'Styled Components', 'Jest'],
      stars: 98,
      downloads: 543,
      isNew: false,
      isPremium: true
    },
    {
      id: 'landing-page',
      name: 'Marketing Landing Page',
      description: 'High-converting landing page template with analytics, A/B testing, and SEO optimization.',
      thumbnail: '/images/templates/landing-page.jpg',
      category: 'frontend',
      stack: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'GTM', 'Vercel Analytics'],
      stars: 76,
      downloads: 487,
      isNew: false,
      isPremium: false
    }
  ]
  
  // Category options for filtering
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'design', name: 'Design' }
  ]
  
  // Additional filter options
  const filterGroups = [
    {
      name: 'Access Type',
      options: [
        { id: 'free', label: 'Free' },
        { id: 'premium', label: 'Premium' }
      ]
    },
    {
      name: 'Language',
      options: [
        { id: 'typescript', label: 'TypeScript' },
        { id: 'javascript', label: 'JavaScript' }
      ]
    },
    {
      name: 'Framework',
      options: [
        { id: 'react', label: 'React' },
        { id: 'nextjs', label: 'Next.js' },
        { id: 'vue', label: 'Vue.js' },
        { id: 'angular', label: 'Angular' }
      ]
    }
  ]
  
  // Filter templates based on active category and search query
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.stack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })
  
  // Get the currently selected template details
  const selectedTemplateData = selectedTemplate 
    ? templates.find(t => t.id === selectedTemplate) 
    : null
  
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Project Templates</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Jump-start your development with pre-built templates and starter kits.
            Choose from a variety of projects optimized for different use cases.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto mb-8">
          {/* Search and filter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-300"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div className="relative flex items-center">
                  <select
                    value={activeCategory}
                    onChange={e => setActiveCategory(e.target.value)}
                    className="pl-4 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-600 appearance-none bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Advanced filters */}
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filterGroups.map(group => (
                    <div key={group.name}>
                      <h4 className="font-medium mb-3 text-slate-800 dark:text-slate-200">{group.name}</h4>
                      <div className="space-y-2">
                        {group.options.map(option => (
                          <label key={option.id} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-slate-600 dark:text-slate-300">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Reset filters
                  </button>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Templates grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  No templates found matching your criteria
                </p>
                <button 
                  onClick={() => {
                    setActiveCategory('all')
                    setSearchQuery('')
                  }}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    {/* In a real app, this would be an actual image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                          {template.name}
                        </div>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                      {template.isNew && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                          New
                        </span>
                      )}
                      {template.isPremium && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                          Premium
                        </span>
                      )}
                    </div>
                    
                    {/* Preview button */}
                    <button 
                      className="absolute bottom-2 right-2 px-2 py-1 text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-slate-700 dark:text-slate-300 rounded-md flex items-center"
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                        {template.name}
                      </h3>
                      <div className="flex items-center text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-xs text-slate-600 dark:text-slate-400">{template.stars}</span>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {template.stack.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {template.stack.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">
                          +{template.stack.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {template.downloads.toLocaleString()} downloads
                      </div>
                      <button className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline">
                        Use Template
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          {/* "Load more" button */}
          <div className="mt-10 text-center">
            <button className="px-6 py-2 bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors flex items-center mx-auto">
              <PlusCircle className="w-4 h-4 mr-2" />
              Load More Templates
            </button>
          </div>
        </div>
        
        {/* Template categories section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-2">Browse by Category</h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Explore our templates by project type to find the perfect starting point for your next application.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Frontend Applications',
                description: 'User interfaces, landing pages, and client-side applications using React, Vue, or Angular.',
                count: 24,
                icon: <Code className="w-6 h-6 text-blue-500" />
              },
              {
                title: 'Backend & APIs',
                description: 'Server-side applications, REST APIs, GraphQL endpoints, and database integrations.',
                count: 18,
                icon: <Zap className="w-6 h-6 text-purple-500" />
              },
              {
                title: 'Full Stack Solutions',
                description: 'Complete applications with frontend, backend, and database components working together.',
                count: 15,
                icon: <Tag className="w-6 h-6 text-green-500" />
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 w-fit mb-4">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">{category.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{category.count} templates</span>
                  <button className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline">
                    Explore <ArrowRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Template preview modal */}
      {selectedTemplateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                {selectedTemplateData.name}
              </h3>
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {/* Template preview image */}
                  <div className="bg-slate-200 dark:bg-slate-700 h-64 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                        {selectedTemplateData.name}
                      </div>
                      <div className="text-slate-400 dark:text-slate-500 mt-2">
                        Preview image
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplateData.stack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Stats</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-amber-500 fill-current" />
                        <span className="ml-1 text-slate-600 dark:text-slate-300">{selectedTemplateData.stars} stars</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                        </svg>
                        <span className="ml-1 text-slate-600 dark:text-slate-300">{selectedTemplateData.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Description</h4>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {selectedTemplateData.description}
                  </p>
                  
                  <h4 className="font-medium mb-2 mt-6 text-slate-900 dark:text-white">Features</h4>
                  <ul className="space-y-2">
                    {[
                      'Responsive design for all screen sizes',
                      'Optimized for performance and SEO',
                      'Accessible UI components',
                      'Comprehensive documentation',
                      'Ready for production deployment'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="ml-2 text-slate-600 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className="font-medium mb-2 mt-6 text-slate-900 dark:text-white">Code Snippet</h4>
                  <div className="bg-slate-800 text-slate-200 p-4 rounded-lg overflow-x-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Example component</span>
                      <button className="text-xs text-slate-400 hover:text-white flex items-center">
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        Copy
                      </button>
                    </div>
                    <pre className="text-sm">
                      <code>{`import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-medium mb-2">Counter: {count}</h2>
      <div className="flex space-x-2">
        <button
          onClick={() => setCount(count - 1)}
          className="px-3 py-1 bg-red-100 text-red-700 rounded"
        >
          Decrease
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-3 py-1 bg-green-100 text-green-700 rounded"
        >
          Increase
        </button>
      </div>
    </div>
  );
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div className="flex items-center">
                <ExternalLink className="w-4 h-4 mr-2 text-slate-500" />
                <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View documentation
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Use This Template
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
} 