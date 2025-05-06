'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Project } from '@/lib/firestore'

type SidebarContextType = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeSection: string
  setActiveSection: (section: string) => void
  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void
}

const SidebarContext = createContext<SidebarContextType>({
  sidebarOpen: true,
  setSidebarOpen: () => {},
  activeSection: 'allprojects',
  setActiveSection: () => {},
  selectedProject: null,
  setSelectedProject: () => {},
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
  // Initialize with true but will update based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState(getInitialSection())
  const [selectedProject, setSelectedProject] = useState<Project | null>(getInitialProject())
  
  // Listen for window resize and update sidebar state accordingly
  useEffect(() => {
    // Set initial state based on screen size
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    
    // Set initial state
    handleResize()
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('activeSection', activeSection)
    } catch (e) {
      console.error('Failed to save activeSection to localStorage', e)
    }
  }, [activeSection])
  
  useEffect(() => {
    try {
      if (selectedProject) {
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
      setSelectedProject
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext) 