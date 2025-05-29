"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { PanelLeftClose, PanelLeftOpen, User, Settings, ChevronDown, LogOut, Palette, Monitor, Sun, Moon } from 'lucide-react'
import JiraSidebar from '@/components/JiraSidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useRouter } from 'next/navigation'

const JiraHeader: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const settingsMenuRef = useRef<HTMLDivElement>(null)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={16} />
      case 'dark':
        return <Moon size={16} />
      default:
        return <Monitor size={16} />
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex items-center h-[48px] w-full bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-slate-700 shadow-sm px-2 lg:px-4 z-30">
        {/* Left section with panel toggle and logo */}
        <div className="flex-shrink-0 flex items-center h-full">
          {/* Panel Toggle button */}
          <button 
            className="flex items-center justify-center w-10 h-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <PanelLeftClose size={18} strokeWidth={1.5} /> : <PanelLeftOpen size={18} strokeWidth={1.5} />}
          </button>
          
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center h-full px-3 hover:bg-slate-100 dark:hover:bg-slate-700">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3mPYVDehq6Y1uj1Bz-Ha6DU457FBBtHkaRA&s" 
              alt="AI Project Planner" 
              width="20" 
              height="20" 
              className="mr-2"
            />
            <span className="text-slate-700 dark:text-slate-300 font-medium text-[14px] whitespace-nowrap">AI Project Planner</span>
          </Link>
        </div>

        {/* Right section with Profile and Settings */}
        {user && (
          <div className="flex items-center h-full ml-auto gap-1">
            {/* Settings Menu */}
            <div className="relative" ref={settingsMenuRef}>
              <button
                className="flex items-center justify-center w-10 h-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => {
                  setShowSettingsMenu(!showSettingsMenu)
                  setShowProfileMenu(false)
                }}
              >
                <Settings size={18} strokeWidth={1.5} />
              </button>

              {showSettingsMenu && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Settings</p>
                  </div>
                  
                  {/* Theme Selection */}
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Theme</p>
                    <div className="space-y-1">
                      <button
                        onClick={() => setTheme('light')}
                        className={`w-full flex items-center px-2 py-1.5 text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${theme === 'light' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}
                      >
                        <Sun size={16} className="mr-3" />
                        Light
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`w-full flex items-center px-2 py-1.5 text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${theme === 'dark' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}
                      >
                        <Moon size={16} className="mr-3" />
                        Dark
                      </button>
                      <button
                        onClick={() => setTheme('system')}
                        className={`w-full flex items-center px-2 py-1.5 text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${theme === 'system' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}
                      >
                        <Monitor size={16} className="mr-3" />
                        System
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                className="flex items-center h-full px-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu)
                  setShowSettingsMenu(false)
                }}
              >
                <div className="flex items-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {user.displayName || user.email || 'User'}
                  </span>
                  <ChevronDown size={14} className="ml-1" />
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                  {/* User Info Section */}
                  <div className="px-3 py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                          <User size={20} className="text-white" />
                        </div>
                      )}
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User size={16} className="mr-3" />
                      Dashboard
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Sidebar Component */}
      {sidebarOpen && (
        <div className="absolute top-[48px] left-0 bottom-0 z-20">
          <JiraSidebar isOpen={sidebarOpen} />
        </div>
      )}
    </>
  )
}

export default JiraHeader