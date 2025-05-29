"use client"

import { useSidebar } from '@/contexts/SidebarContext'

export default function Dashboard() {
  const { sidebarOpen } = useSidebar()

  return (
    <div className={`h-full ${sidebarOpen ? 'ml-[240px]' : ''} transition-all duration-200`}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 bg-slate-50 dark:bg-slate-900">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">AI Project Dashboard</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Create intelligent sprint plans and feature implementation guides using AI.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Sprint Projects Info */}
            <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Sprint Projects</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Generate comprehensive sprint plans with AI-powered task breakdown, timeline estimation, and tech stack recommendations.
              </p>
            </div>

            {/* Feature Plans Info */}
            <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Feature Plans</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Transform feature requirements into detailed implementation guides with component breakdowns and best practices.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Get Started</h4>
            <p className="text-slate-600 dark:text-slate-300">
              Use the sidebar to navigate between viewing existing projects/features or creating new ones with AI assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 