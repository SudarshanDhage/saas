"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Bell, Settings, HelpCircle, Gem, FolderGit2, Zap, Menu } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import JiraSidebar from './JiraSidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { useAuth } from '@/contexts/AuthContext'
import UserProfileMenu from './UserProfileMenu'
import dynamic from 'next/dynamic'
import { useProjectGeneration } from '@/contexts/ProjectGenerationContext'
import { usePathname, useRouter } from 'next/navigation'

// Dynamically import the ProjectGenerationIndicator with SSR disabled to prevent hydration errors
const ProjectGenerationIndicator = dynamic(
  () => import('./ProjectGenerationIndicator'),
  { ssr: false }
)

// Mock notifications for demo purposes
const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Project Sprint Ready', message: 'Your project sprint plan is ready for review', isRead: false, time: '2 hours ago' },
  { id: 2, title: 'Feature Plan Completed', message: 'The feature implementation plan has been generated', isRead: true, time: '1 day ago' },
  { id: 3, title: 'Team Invitation', message: 'You have been invited to join a new team', isRead: false, time: '3 days ago' },
];

const JiraHeader: React.FC = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const { hasActiveGeneration } = useProjectGeneration();
  const { setActiveSection, sidebarOpen, setSidebarOpen, shouldShowSidebar } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  
  // Count unread notifications
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;

  // Handle navigation to avoid page reloads
  const handleNavClick = (section: string, path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSection(section);
    router.push(path, { scroll: false });
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex items-center h-[48px] w-full bg-white dark:bg-gray-900 border-b border-[#EBECF0] dark:border-gray-800 shadow-sm px-2 z-30">
        {/* Mobile menu button - only show when sidebar should be visible */}
        {shouldShowSidebar && (
          <button 
            className="lg:hidden flex items-center justify-center h-[48px] w-[48px] text-[#42526E] dark:text-gray-300"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        
        {/* Left section with logo */}
        <div className="flex-shrink-0 flex items-center h-full">
          {/* Custom Logo and Text */}
          <Link href="/" className="flex items-center h-full px-3 hover:bg-[#F4F5F7] dark:hover:bg-gray-800">
            <div 
              className="w-6 h-6 bg-blue-600 rounded-md text-white flex items-center justify-center mr-2 font-bold text-xs"
            >
              SP
            </div>
            <span className="text-[#42526E] dark:text-gray-200 font-medium text-[14px] whitespace-nowrap">SprintPro</span>
          </Link>
        </div>
        
        {/* Navigation buttons - hidden on mobile, shown on larger screens */}
        <div className="hidden md:flex items-center ml-4">
          {/* Dashboard button */}
          <Link
            href="/project"
            className={`flex items-center px-3 py-2 rounded text-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700 text-[#42526E] dark:text-gray-300 ${
              pathname === '/project' ? 'bg-[#E6EFFC] text-[#0052CC] dark:bg-gray-700 dark:text-blue-400' : ''
            }`}
            onClick={(e) => handleNavClick('dashboard', '/project', e)}
          >
            <span className="font-medium">Dashboard</span>
          </Link>
          
          {/* Project Sprint button - Updated to link directly to create page */}
          <Link
            href="/projects/create"
            className={`flex items-center px-3 py-2 rounded text-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700 text-[#42526E] dark:text-gray-300 ml-2 ${
              pathname === '/projects/create' ? 'bg-[#E6EFFC] text-[#0052CC] dark:bg-gray-700 dark:text-blue-400' : ''
            }`}
            onClick={(e) => handleNavClick('sprints', '/projects/create', e)}
          >
            <FolderGit2 size={16} className="text-[#00875A] mr-1" />
            <span className="font-medium">Project Sprint</span>
          </Link>
          
          {/* Feature Plan button - Updated to link directly to features/create */}
          <Link
            href="/features/create"
            className={`flex items-center px-3 py-2 rounded text-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700 text-[#42526E] dark:text-gray-300 ml-2 ${
              pathname === '/features/create' ? 'bg-[#E6EFFC] text-[#0052CC] dark:bg-gray-700 dark:text-blue-400' : ''
            }`}
            onClick={(e) => handleNavClick('features', '/features/create', e)}
          >
            <Zap size={16} className="text-[#6554C0] mr-1" />
            <span className="font-medium">Feature Plan</span>
          </Link>
        </div>
        
        {/* Center section with project generation indicator only */}
        <div className="flex flex-1 justify-center mx-4">
          {hasActiveGeneration && <ProjectGenerationIndicator />}
        </div>
        
        {/* Right section with action buttons and profile */}
        <div className="flex-shrink-0 flex items-center h-full justify-end gap-2 ml-auto">
          {/* Premium trial button - hidden on mobile */}
          <button className="hidden md:flex items-center justify-center h-[32px] border-2 border-[#4C9AFF] hover:bg-[#F4F5F7] dark:hover:bg-gray-800 text-[#42526E] dark:text-gray-300 rounded-none mr-2 md:mr-3 px-2 md:px-3">
            <Gem size={16} className="text-[#6554C0] dark:text-purple-400 mr-1" />
            <span className="text-sm font-medium">Premium trial</span>
          </button>
          
          {/* Notifications with dropdown */}
          <div className="relative">
            <button 
              className="flex items-center justify-center w-8 h-full text-[#42526E] dark:text-gray-300 hover:bg-[#F4F5F7] dark:hover:bg-gray-800"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </button>
            
            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-1 w-[calc(100vw-32px)] sm:w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <button className="text-xs text-blue-500 hover:underline">Mark all as read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {MOCK_NOTIFICATIONS.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        {!notification.isRead && (
                          <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    href="/notifications" 
                    className="text-sm text-blue-500 hover:underline"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Help - hidden on smaller screens */}
          <button className="hidden md:flex items-center justify-center w-8 h-full text-[#42526E] dark:text-gray-300 hover:bg-[#F4F5F7] dark:hover:bg-gray-800">
            <HelpCircle size={18} strokeWidth={1.5} />
          </button>
          
          {/* Settings */}
          <button className="flex items-center justify-center w-8 h-full text-[#42526E] dark:text-gray-300 hover:bg-[#F4F5F7] dark:hover:bg-gray-800">
            <Settings size={18} strokeWidth={1.5} />
          </button>
          
          {/* Profile Menu */}
          <div className="flex items-center h-full pl-2">
            <UserProfileMenu />
          </div>
        </div>
      </header>
      
      {/* Sidebar Component - renders through context, not directly */}
    </>
  )
}

export default JiraHeader