'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Project } from '@/lib/firestore'
import JiraSidebar from '@/components/JiraSidebar'
import { usePathname } from 'next/navigation'

type SidebarContextType = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeSection: string
  setActiveSection: (section: string) => void
  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void
  shouldShowSidebar: boolean
}

const SidebarContext = createContext<SidebarContextType>({
  sidebarOpen: true,
  setSidebarOpen: () => {},
  activeSection: 'allprojects',
  setActiveSection: () => {},
  selectedProject: null,
  setSelectedProject: () => {},
  shouldShowSidebar: false
})

// Try to rehydrate any persisted state from localStorage
const getInitialSection = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedSection = localStorage.getItem('activeSection')
      return savedSection || 'allprojects'
    } catch (e) {
      // Safely handle localStorage errors
      return 'allprojects'
    }
  }
  return 'allprojects'
}

const getInitialProject = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedProject = localStorage.getItem('selectedProject')
      return savedProject ? JSON.parse(savedProject) : null
    } catch (e) {
      // Safely handle localStorage errors
      return null
    }
  }
  return null
}

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to true on larger screens, false on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(getInitialSection())
  const [selectedProject, setSelectedProject] = useState<Project | null>(getInitialProject())
  const pathname = usePathname()
  
  // Determine if sidebar should be shown on current page
  const shouldShowSidebar = !['/', '/sign-in', '/sign-up'].includes(pathname || '')
  
  // Listen for window resize and update sidebar state accordingly
  useEffect(() => {
    // Set initial state based on screen size
    const handleResize = () => {
      // Only auto-open sidebar on larger screens and when it should be visible
      if (window.innerWidth >= 1024 && shouldShowSidebar) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    
    // Set initial state
    if (typeof window !== 'undefined') {
      handleResize()
      
      // Add event listener for window resize
      window.addEventListener('resize', handleResize)
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [shouldShowSidebar])
  
  // Persist state changes to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeSection', activeSection)
      }
    } catch (e) {
      console.error('Failed to save activeSection to localStorage', e)
    }
  }, [activeSection])
  
  useEffect(() => {
    try {
      if (selectedProject && typeof window !== 'undefined') {
        localStorage.setItem('selectedProject', JSON.stringify(selectedProject))
      }
    } catch (e) {
      console.error('Failed to save selectedProject to localStorage', e)
    }
  }, [selectedProject])

  return (
    <SidebarContext.Provider value={{ 
      sidebarOpen, 
      setSidebarOpen, 
      activeSection, 
      setActiveSection,
      selectedProject,
      setSelectedProject,
      shouldShowSidebar
    }}>
      {children}
      {shouldShowSidebar && <JiraSidebar isOpen={sidebarOpen} />}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext) 