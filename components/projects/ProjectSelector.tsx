"use client"

import React, { useState, useEffect } from 'react'
import { getProjects, Project } from '@/lib/firestore'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FolderGit2, Loader2, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ProjectSelectorProps {
  onSelectProject: (project: Project) => void
  selectedProjectId?: string
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ 
  onSelectProject, 
  selectedProjectId 
}) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Setup auth state listener to respond to login/logout events
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchProjects()
      } else {
        // Clear projects if user is not authenticated
        setProjects([])
        setError('auth-required')
        setIsLoading(false)
      }
    })
    
    return () => unsubscribe()
  }, [])
  
  const fetchProjects = async () => {
    try {
      // First check if user is authenticated
      if (!auth.currentUser) {
        setError('auth-required')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const projectsData = await getProjects()
      
      // Strict verification that projects belong to current user
      const userProjects = projectsData.filter(project => project.userId === auth.currentUser?.uid)
      setProjects(userProjects)
      
      // If we have a selected project ID, find that project
      if (selectedProjectId && userProjects.length > 0) {
        const selectedProject = userProjects.find(p => p.id === selectedProjectId)
        if (selectedProject) {
          onSelectProject(selectedProject)
        } else {
          // If selected project doesn't belong to current user, clear selection
          router.push('/projects', { scroll: false })
        }
      }
      // If we don't have a selected project but have projects, select the first one
      else if (!selectedProjectId && userProjects.length > 0) {
        onSelectProject(userProjects[0])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to load projects')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      onSelectProject(project)
      // Navigate to project detail page
      router.push(`/projects/${projectId}`, { scroll: false })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center p-3 text-sm text-[#6B778C] dark:text-gray-400">
        <Loader2 size={16} className="mr-2 animate-spin" />
        Loading projects...
      </div>
    )
  }

  if (error === 'auth-required') {
    return (
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[#6B778C] dark:text-gray-400 text-xs font-medium uppercase">Projects</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md text-amber-700 dark:text-amber-400 text-xs">
          <div className="flex items-center mb-1">
            <LogIn size={14} className="mr-1" />
            <span className="font-medium">Login Required</span>
          </div>
          <p className="mb-2">Sign in to view and manage your projects</p>
          <Link href="/">
            <Button variant="outline" size="sm" className="w-full text-xs h-7">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-3 text-sm text-red-500 dark:text-red-400">
        <p className="text-[#6B778C] dark:text-gray-400 text-xs font-medium uppercase mb-1">Error</p>
        <p>{error}</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[#6B778C] dark:text-gray-400 text-xs font-medium uppercase">Projects</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md text-[#6B778C] dark:text-gray-400 text-xs">
          <p className="mb-2">No projects found</p>
          <Link href="/projects/create">
            <Button variant="outline" size="sm" className="w-full text-xs h-7">
              Create New Project
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-3 py-2">
      <div className="mb-2">
        <p className="text-[#6B778C] dark:text-gray-400 text-xs font-medium uppercase px-2">Current Project</p>
      </div>
      <Select
        value={selectedProjectId}
        onValueChange={handleProjectChange}
      >
        <SelectTrigger className="w-full bg-white dark:bg-gray-700 text-[#172B4D] dark:text-white border-[#DFE1E6] dark:border-gray-600">
          <div className="flex items-center space-x-2 w-full overflow-hidden">
            <FolderGit2 size={16} className="flex-shrink-0 text-[#0052CC] dark:text-blue-400" />
            <SelectValue placeholder="Select a project" className="truncate" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id || ''}>
              <div className="truncate max-w-[180px]">{project.title}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default ProjectSelector 