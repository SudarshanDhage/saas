"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSidebar } from '@/contexts/SidebarContext'
import ProjectSelector from './projects/ProjectSelector'
import ProjectNavigation from './projects/ProjectNavigation'
import { usePathname, useRouter } from 'next/navigation'
import { getFeaturePlans, SingleFeaturePlan } from '@/lib/firestore'
import { FileText, Loader2, X } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { cn } from '@/lib/utils'
import { User } from 'firebase/auth'

interface JiraSidebarProps {
  isOpen: boolean
}

// Simple, non-interactive component to render on server
const StaticSidebar = () => (
  <aside className="fixed left-0 top-0 bottom-0 z-20 w-[240px] pt-16 bg-white dark:bg-gray-800 border-r border-[#EBECF0] dark:border-gray-700 overflow-y-auto flex flex-col h-screen">
    <div className="border-b border-[#EBECF0] dark:border-gray-700">
      {/* Empty Project Selector */}
      <div className="p-3">
        <div className="flex items-center p-2 rounded-md border border-[#DFE1E6] dark:border-gray-700">
          <span className="text-[#42526E] dark:text-gray-300 text-sm">Select a project</span>
        </div>
      </div>
    </div>
    <div className="flex-grow"></div>
  </aside>
)

// Define component as a regular React functional component for compatibility
const JiraSidebar: React.FC<JiraSidebarProps> = ({ isOpen }) => {
  const { selectedProject, setSelectedProject, setActiveSection, activeSection, sidebarOpen, setSidebarOpen } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const [recentFeaturePlans, setRecentFeaturePlans] = useState<SingleFeaturePlan[]>([])
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // Set isClient to true after initial render to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
    
    // After hydration completes, start loading features
    setIsLoadingFeatures(true)
    
    // Then fetch features if user is authenticated
    const currentUser = auth?.currentUser as User | null
    if (currentUser) {
      fetchRecentFeaturePlans()
    }
  }, []) // Empty dependency array - only run once
  
  // Extract project ID from the URL if on a project page
  const projectIdFromUrl = pathname?.startsWith('/projects/') 
    ? pathname.split('/')[2]?.split('?')[0] 
    : undefined
  
  // Handle navigation to avoid page reloads
  const handleNavClick = (section: string, path: string, e: React.MouseEvent) => {
    e.preventDefault()
    setActiveSection(section)
    router.push(path, { scroll: false })
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  // Function to fetch recent feature plans
  const fetchRecentFeaturePlans = async () => {
    try {
      setIsLoadingFeatures(true)
      
      // Only fetch when user is authenticated
      const currentUser = auth?.currentUser as User | null
      if (!currentUser) {
        setRecentFeaturePlans([])
        setIsLoadingFeatures(false)
        return
      }
      
      const plansData = await getFeaturePlans()
      
      // Filter to get only user's plans and sort by most recent
      const userPlans = plansData
        .filter(plan => plan.userId === currentUser.uid)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5) // Show only the 5 most recent plans
      
      setRecentFeaturePlans(userPlans)
    } catch (error) {
      console.error('Error fetching feature plans:', error)
      setRecentFeaturePlans([])
    } finally {
      setIsLoadingFeatures(false)
    }
  }

  // Refresh feature plans when path changes
  useEffect(() => {
    const currentUser = auth?.currentUser as User | null
    if (isClient && currentUser) {
      fetchRecentFeaturePlans()
    }
  }, [pathname, isClient])

  // If not client-side yet, render static sidebar
  if (!isClient) {
    return <StaticSidebar />
  }

  // Client-side render after hydration
  return (
    <>
      {/* Mobile backdrop - only visible when sidebar is open on mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-10 transition-opacity duration-200 ease-in-out"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <aside 
        className={cn(
          "fixed top-0 left-0 bottom-0 z-20 w-[240px] pt-16 bg-white dark:bg-gray-800 border-r border-[#EBECF0] dark:border-gray-700 overflow-y-auto flex flex-col h-screen transition-transform duration-300 ease-in-out",
          // Mobile (slide in/out)
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button - only visible on mobile */}
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute right-3 top-3 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
        
        {/* Project Selector */}
        <div className="border-b border-[#EBECF0] dark:border-gray-700">
          <ProjectSelector 
            onSelectProject={setSelectedProject}
            selectedProjectId={projectIdFromUrl || selectedProject?.id}
          />
        </div>
        
        {/* Project-specific Navigation - only show if a project is selected */}
        {selectedProject && (
          <div className="border-b border-[#EBECF0] dark:border-gray-700">
            <ProjectNavigation project={selectedProject} />
          </div>
        )}
        
        {/* Features Section */}
        <div className="border-b border-[#EBECF0] dark:border-gray-700">
          <div className="px-3 py-2">
            <p className="text-[#6B778C] dark:text-gray-400 text-xs font-medium uppercase px-2 mb-2">
              Feature Plans
            </p>
            
            {isLoadingFeatures ? (
              <div className="px-2 py-2 text-sm text-[#6B778C] dark:text-gray-400">
                Loading plans...
              </div>
            ) : recentFeaturePlans.length === 0 ? (
              <div className="px-2 py-2 text-sm text-[#6B778C] dark:text-gray-400">
                No feature plans yet
              </div>
            ) : (
              <div className="space-y-1">
                {recentFeaturePlans.map((plan) => (
                  <a 
                    key={plan.id}
                    href={`/features/${plan.id}`}
                    className={`flex items-center px-2 py-2 rounded text-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700 text-[#42526E] dark:text-gray-300 cursor-pointer ${
                      activeSection === `feature-${plan.id}` ? 'bg-[#E6EFFC] text-[#0052CC] dark:bg-gray-700 dark:text-blue-400' : ''
                    }`}
                    onClick={(e) => handleNavClick(`feature-${plan.id}`, `/features/${plan.id}`, e)}
                  >
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <FileText size={16} className="text-[#6554C0]" />
                    </div>
                    <span className="font-medium line-clamp-1">{plan.feature.title}</span>
                  </a>
                ))}
                
                {/* View All Feature Plans link */}
                <a 
                  href="/features"
                  className={`flex items-center px-2 py-2 rounded text-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700 text-[#42526E] dark:text-gray-300 cursor-pointer ${
                    activeSection === 'allfeatures' ? 'bg-[#E6EFFC] text-[#0052CC] dark:bg-gray-700 dark:text-blue-400' : ''
                  }`}
                  onClick={(e) => handleNavClick('allfeatures', '/features', e)}
                >
                  <span className="ml-8 text-xs font-medium text-[#6554C0] dark:text-purple-400">View all feature plans</span>
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Spacer to fill remaining space */}
        <div className="flex-grow"></div>
      </aside>
    </>
  )
}

export default JiraSidebar 