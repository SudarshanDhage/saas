"use client"

import React, { useCallback, useState, useEffect } from 'react'
import { Project } from '@/lib/firestore'
import { useSidebar } from '@/contexts/SidebarContext'
import { LayoutDashboard, Workflow, FileText, DollarSign, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProjectNavigationProps {
  project: Project
}

const ProjectNavigation: React.FC<ProjectNavigationProps> = ({ project }) => {
  const { activeSection, setActiveSection } = useSidebar()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  
  // Use useEffect to set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Only show project navigation if we have a valid project
  if (!project || !project.id) {
    return null
  }
  
  // Navigation items for the project
  const projectNavItems = [
    { 
      label: 'Project Overview', 
      href: `/projects/${project.id}?tab=overview`, 
      section: `project-${project.id}-overview`,
      icon: <LayoutDashboard size={16} className="text-[#0052CC]" /> 
    },
    { 
      label: 'Sprint Planning', 
      href: `/projects/${project.id}?tab=sprint-plan`, 
      section: `project-${project.id}-sprint`,
      icon: <Workflow size={16} className="text-[#00875A]" /> 
    },
    { 
      label: 'Documentation', 
      href: `/projects/${project.id}?tab=documentation`, 
      section: `project-${project.id}-docs`,
      icon: <FileText size={16} className="text-[#6554C0]" /> 
    },
    { 
      label: 'Cost Estimation', 
      href: `/projects/${project.id}?tab=cost-estimation`, 
      section: `project-${project.id}-cost`,
      icon: <DollarSign size={16} className="text-[#FF5630]" /> 
    }
  ]
  
  // Handle navigation item clicks - use client-side navigation without refresh
  const handleNavClick = useCallback((section: string, href: string, e: React.MouseEvent) => {
    e.preventDefault()
    setActiveSection(section)
    router.push(href, { scroll: false })
  }, [router, setActiveSection])
  
  return (
    <div className="px-3 py-2">
      <p className="text-[#6B778C] dark:text-gray-400 text-xs font-medium uppercase px-2 mb-2">
        Project Navigation
      </p>
      
      {!isClient ? (
        // Server-side or initial client render - show placeholder to prevent hydration mismatch
        <div className="space-y-1">
          {projectNavItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-center px-2 py-2 rounded text-sm text-[#42526E] dark:text-gray-300"
            >
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      ) : (
        // Client-side render after hydration
        <div className="space-y-1">
          {projectNavItems.map((item, index) => (
            <a 
              key={index}
              href={item.href}
              className={`flex items-center px-2 py-2 rounded text-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700 text-[#42526E] dark:text-gray-300 cursor-pointer ${
                activeSection === item.section ? 'bg-[#E6EFFC] text-[#0052CC] dark:bg-gray-700 dark:text-blue-400' : ''
              }`}
              onClick={(e) => handleNavClick(item.section, item.href, e)}
            >
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// Also export a memoized version if needed
export const MemoizedProjectNavigation = React.memo(ProjectNavigation)

export default ProjectNavigation 