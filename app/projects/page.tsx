"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Project, getProjects, getSprintPlans, getCurrentUserId, getUserProfile, UserProfile, ensureUserInitialized } from '@/lib/firestore-v2'
import { 
  Workflow, 
  Plus, 
  ChevronRight, 
  Code, 
  Search, 
  Filter,
  Calendar,
  Clock,
  Users,
  Target,
  TrendingUp,
  GitBranch,
  Zap,
  Star,
  MoreVertical,
  Eye,
  Edit,
  Archive,
  Download,
  Settings,
  Share2,
  AlertTriangle
} from 'lucide-react'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import ProjectInvitations from '@/components/ProjectInvitations'

interface ProjectWithPlansProps {
  project: Project
}

const ProjectCard: React.FC<ProjectWithPlansProps> = ({ project }) => {
  const [hasPlans, setHasPlans] = useState(false)
  const [planCount, setPlanCount] = useState(0)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  
  useEffect(() => {
    const checkPlans = async () => {
      if (!project.id) return
      
      try {
        const plans = await getSprintPlans(project.id)
        setHasPlans(plans.length > 0)
        setPlanCount(plans.length)
      } catch (error) {
        console.error('Error getting sprint plans:', error)
      }
    }
    
    // Get current user ID
    const initCurrentUser = async () => {
      try {
        const userId = getCurrentUserId()
        setCurrentUserId(userId)
      } catch (error) {
        console.error('Error getting current user:', error)
      }
    }
    
    checkPlans()
    initCurrentUser()
  }, [project.id])

  const getStatusColor = () => {
    if (!hasPlans) return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
  }

  const getStatusText = () => {
    if (!hasPlans) return 'Planning'
    return 'Active'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Check if current user is the project owner (admin)
  const isProjectOwner = currentUserId && project.userId === currentUserId
  
  // Check if this is a shared project
  const isSharedProject = currentUserId && project.userId !== currentUserId

  // Handle manage button click with permission check
  const handleManageClick = () => {
    if (!isProjectOwner) {
      toast({
        title: "Access Denied",
        description: "You do not have admin access to manage this project. Only the project owner can access the management page.",
        variant: "destructive",
      })
      return
    }
    router.push(`/projects/${project.id}/manage`)
  }
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-600 dark:border-l-blue-400 bg-white dark:bg-gray-800">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </CardTitle>
              <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
                {getStatusText()}
              </Badge>
              {/* Shared with me tag */}
              {isSharedProject && (
                <Badge variant="outline" className="px-2 py-1 text-xs font-medium rounded-full border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30">
                  <Share2 size={12} className="mr-1" />
                  Shared with me
                </Badge>
              )}
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Star size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{project.coreFeatures.length}</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">Features</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{planCount}</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">Sprints</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900 dark:text-white">
              {Object.keys(project.techStack || {}).length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">Tech Stack</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">85%</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">AI Score</div>
          </div>
        </div>

        {/* Core Features */}
        <div>
          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3 flex items-center">
            <Target size={14} className="mr-2 text-blue-600 dark:text-blue-400" />
            Core Features
          </h4>
        <div className="flex flex-wrap gap-2">
            {project.coreFeatures.slice(0, 4).map((feature) => (
              <Badge 
              key={feature.id} 
                variant="secondary"
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              {feature.name}
              </Badge>
          ))}
            {project.coreFeatures.length > 4 && (
              <Badge variant="outline" className="px-3 py-1">
                +{project.coreFeatures.length - 4} more
              </Badge>
            )}
            </div>
        </div>
        
        {/* Technology Stack */}
        {project.techStack && Object.keys(project.techStack).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3 flex items-center">
              <Code size={14} className="mr-2 text-purple-600 dark:text-purple-400" />
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(project.techStack).slice(0, 3).map(([category, tech]: [string, any]) => (
                <Badge 
                  key={category} 
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center"
                >
                  <GitBranch size={12} className="mr-1" />
                  {tech.name}
                </Badge>
              ))}
              {Object.keys(project.techStack).length > 3 && (
                <Badge variant="outline" className="px-3 py-1">
                  +{Object.keys(project.techStack).length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Project Timeline */}
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" />
                         Created {formatDate(project.createdAt.toString())}
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-2" />
            Last updated 2 days ago
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
            <Workflow size={16} className="text-green-600 dark:text-green-400 mr-2" />
            <span className="font-medium">
              {hasPlans ? `${planCount} Sprint${planCount !== 1 ? 's' : ''} Generated` : 'Ready for Sprint Planning'}
          </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Manage Button - Only for project owners */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            onClick={handleManageClick}
          >
            <Settings size={16} className="mr-1" />
            Manage
          </Button>
          
          {/* Preview Button - Available for everyone with access */}
          <Link href={`/projects/${project.id}`}>
            <Button size="sm" className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
              <Eye size={16} className="mr-1" />
              Preview
          </Button>
        </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const { setActiveSection } = useSidebar()
  
  useEffect(() => {
    setActiveSection('sprints')
    
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects()
        setProjects(projectsData)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjects()
  }, [setActiveSection])

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const projectContent = (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container py-8 max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-start">
        <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Sprint Projects</h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
                AI-powered project planning for developers and entrepreneurs
              </p>
              
              {/* Stats Overview */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mr-2"></div>
                  <span className="text-slate-600 dark:text-slate-300">{projects.length} Total Projects</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-slate-600 dark:text-slate-300">3 Active Sprints</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp size={14} className="text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-green-600 dark:text-green-400 font-medium">+2 this week</span>
                </div>
        </div>
      </div>
      
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Export
              </Button>
              <Link href="/projects/create">
                <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white">
                  <Plus size={16} className="mr-2" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 dark:text-slate-400" />
                <input
                  type="text"
              placeholder="Search projects by name, description, or technology..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                />
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name A-Z</option>
              <option value="features">Most Features</option>
              <option value="sprints">Most Sprints</option>
            </select>
            
            <Button variant="outline" className="flex items-center">
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Loading your projects...</p>
                </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Workflow size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {searchTerm ? 'No projects found' : 'Start Your First Project'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : 'Transform your ideas into structured sprint plans with AI assistance. Perfect for startups, SaaS products, and development teams.'
                }
              </p>
              {!searchTerm && (
                <Link href="/projects/create">
                  <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white">
                    <Zap size={16} className="mr-2" />
                    Create Your First Project
              </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
        </div>
    </div>
  )
  
  return (
    <PageWithSidebar pageTitle="Sprint Projects">
      {projectContent}
    </PageWithSidebar>
  )
}

export default ProjectsPage 