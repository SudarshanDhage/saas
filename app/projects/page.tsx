"use client"

import React, { useEffect, useState } from 'react'
import { getProjects, Project } from '@/lib/firestore'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Loader2, Plus, Search, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { formatDistanceToNow } from 'date-fns'
import AuthCheck from '@/components/auth/AuthCheck'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { setActiveSection } = useSidebar()
  const router = useRouter()
  
  useEffect(() => {
    setActiveSection('allprojects')
    
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        
        // Ensure user is authenticated
        if (!auth.currentUser) {
          setProjects([])
          setIsLoading(false)
          return
        }
        
        // The getProjects function will automatically filter by the current user
        const projectsData = await getProjects()
        
        // Extra safety: filter projects to only include those belonging to current user
        const userProjects = projectsData.filter(project => project.userId === auth.currentUser?.uid)
        setProjects(userProjects)
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }
    
    // Set up listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchProjects()
      } else {
        setProjects([])
        setIsLoading(false)
      }
    })
    
    return () => unsubscribe()
  }, [setActiveSection])
  
  // Filter projects based on search term
  const filteredProjects = searchTerm 
    ? projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : projects
  
  const content = (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#172B4D] dark:text-white mb-1">
            My Projects
          </h1>
          <p className="text-[#6B778C] dark:text-gray-400">
            View and manage your sprint projects
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center border-[#DFE1E6] dark:border-gray-700"
            onClick={() => {
              setActiveSection('dashboard');
              router.push('/project');
            }}
          >
            <LayoutDashboard size={16} className="mr-2 text-[#0052CC]" />
            Dashboard
          </Button>
          
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-[#6B778C]" />
            </div>
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link href="/project/newproject">
            <Button variant="jira">
              <Plus size={16} className="mr-2" />
              New Project
            </Button>
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 size={48} className="animate-spin text-[#0052CC]" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 bg-[#F4F5F7] dark:bg-gray-700 p-4 rounded-full">
            <Calendar size={36} className="text-[#6B778C] dark:text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-[#172B4D] dark:text-white mb-2">
            {searchTerm ? 'No matching projects found' : 'No projects yet'}
          </h2>
          <p className="text-[#6B778C] dark:text-gray-400 mb-6 max-w-lg">
            {searchTerm 
              ? `Try adjusting your search term or create a new project to get started.` 
              : `Create your first project to get started with sprint planning and documentation.`}
          </p>
          <Link href="/project/newproject">
            <Button variant="jira">
              <Plus size={16} className="mr-2" />
              Create New Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <Card className="hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-[#172B4D] dark:text-white">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 pb-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.coreFeatures.slice(0, 3).map((feature, index) => (
                      <span 
                        key={index} 
                        className="text-xs px-2 py-1 bg-[#DEEBFF] dark:bg-blue-900/30 text-[#0052CC] dark:text-blue-400 rounded-full whitespace-nowrap"
                      >
                        {feature.name}
                      </span>
                    ))}
                    {project.coreFeatures.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-[#F4F5F7] dark:bg-gray-700 text-[#6B778C] dark:text-gray-400 rounded-full">
                        +{project.coreFeatures.length - 3} more
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 mt-auto border-t border-[#F4F5F7] dark:border-gray-700">
                  <div className="text-xs text-[#6B778C] dark:text-gray-400 w-full flex justify-between items-center">
                    <span>
                      Created {formatDistanceToNow(project.createdAt, { addSuffix: true })}
                    </span>
                    {project.techStack && Object.keys(project.techStack).length > 0 && (
                      <span className="px-2 py-1 bg-[#F4F5F7] dark:bg-gray-700 rounded">
                        {Object.keys(project.techStack).length} technologies
                      </span>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
  
  return (
    <AuthCheck>
      <PageWithSidebar pageTitle="My Projects">
        {content}
      </PageWithSidebar>
    </AuthCheck>
  )
} 
