"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronRight, FolderGit2, Zap, LayoutGrid } from 'lucide-react'
import Link from 'next/link'

const ProjectPage = () => {
  const router = useRouter()
  
  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#172B4D] dark:text-white">Project Dashboard</h1>
        
        <Button 
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => router.push('/projects')}
        >
          View All Projects
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Quick access card for Project Sprint */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#DFE1E6] dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
              <FolderGit2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-[#172B4D] dark:text-white">Project Sprint</h2>
          </div>
          <p className="text-[#6B778C] dark:text-gray-400 mb-4">Create a new project with comprehensive sprint plans and technical documentation.</p>
          <Link 
            href="/projects/create" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
          >
            Create Project Sprint
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {/* Quick access card for Feature Plan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#DFE1E6] dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
              <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-[#172B4D] dark:text-white">Feature Plan</h2>
          </div>
          <p className="text-[#6B778C] dark:text-gray-400 mb-4">Generate implementation plans for individual features with AI assistance.</p>
          <Link 
            href="/features/create" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
          >
            Create Feature Plan
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {/* Quick access card for All Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#DFE1E6] dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
              <LayoutGrid className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-[#172B4D] dark:text-white">Projects</h2>
          </div>
          <p className="text-[#6B778C] dark:text-gray-400 mb-4">View and manage all your existing projects and their sprint plans.</p>
          <Link 
            href="/projects" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
          >
            Browse Projects
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-[#DFE1E6] dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-[#172B4D] dark:text-white mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-[#6B778C] dark:text-gray-400">No recent activity to display</p>
        </div>
      </div>
    </div>
  )
}

export default ProjectPage 