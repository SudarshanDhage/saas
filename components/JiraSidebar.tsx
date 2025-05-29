"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Plus,
  Workflow,
  Zap,
  Eye,
  LayoutDashboard
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useSidebar } from '@/contexts/SidebarContext'

interface JiraSidebarProps {
  isOpen: boolean
}

const JiraSidebar: React.FC<JiraSidebarProps> = ({ isOpen }) => {
  const { activeSection, setActiveSection } = useSidebar();
  const pathname = usePathname();
  
  if (!isOpen) return null

  // Function to handle navigation item clicks
  const handleNavClick = (section: string) => {
    setActiveSection(section);
  };

  // Determine active section based on current path
  const isActive = (path: string, section: string) => {
    return pathname === path || activeSection === section;
  };

  return (
    <aside className="relative w-[240px] bg-white dark:bg-gray-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto flex flex-col h-full">
      <div className="flex flex-col flex-grow overflow-y-auto">
        {/* Main Navigation Section */}
        <div className="px-3 py-4">
          {/* Dashboard Button */}
          <div className="mb-6">
            <Link 
              href="/dashboard"
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors font-medium ${
                isActive('/dashboard', 'dashboard') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="w-6 h-6 mr-3 flex items-center justify-center">
                <LayoutDashboard size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium">Dashboard</span>
          </Link>
            </div>

          <div className="mb-4">
            <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Sprint Projects</h3>
            
            {/* View Sprint Projects */}
            <div className="mb-2">
              <Link 
                href="/projects"
                onClick={() => handleNavClick('sprints')}
                className={`w-full flex items-center px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors ${
                  isActive('/projects', 'sprints') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
              }`}
              >
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <Eye size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium">View Sprint Projects</span>
          </Link>
            </div>
          
            {/* Create Project Sprint */}
            <div className="relative mb-2">
              <Link
                href="/projects/create"
                onClick={() => handleNavClick('create-project')}
                className={`w-full flex items-center px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors ${
                  isActive('/projects/create', 'create-project') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <Plus size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium">Create Project Sprint</span>
            </Link>
            <Badge 
              variant="new" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
                AI
            </Badge>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Feature Plans</h3>
            
            {/* View Feature Plans */}
            <div className="mb-2">
              <Link
                href="/features"
                onClick={() => handleNavClick('features')}
                className={`w-full flex items-center px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors ${
                  isActive('/features', 'features') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <Eye size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium">View Feature Plans</span>
              </Link>
            </div>

            {/* Create Feature Plan */}
            <div className="relative mb-2">
              <Link
                href="/features/create"
                onClick={() => handleNavClick('create-feature')}
                className={`w-full flex items-center px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors ${
                  isActive('/features/create', 'create-feature') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <Plus size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
                <span className="text-sm font-medium">Create Feature Plan</span>
            </Link>
            <Badge 
              variant="feature" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
                AI
            </Badge>
            </div>
        </div>
        
          {/* Quick Actions Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Quick Actions</h3>
            
            <div className="space-y-2">
              <Link
                href="/projects/create"
                onClick={() => handleNavClick('create-project')}
                className="w-full flex items-center px-3 py-2 rounded bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors"
              >
                <Workflow size={16} className="mr-3" />
                <span className="text-sm font-medium">New Sprint Project</span>
          </Link>
          
              <Link
                href="/features/create"
                onClick={() => handleNavClick('create-feature')}
                className="w-full flex items-center px-3 py-2 rounded bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white transition-colors"
            >
                <Zap size={16} className="mr-3" />
                <span className="text-sm font-medium">New Feature Plan</span>
          </Link>
            </div>
            </div>
        </div>
      </div>
    </aside>
  )
}

export default JiraSidebar 