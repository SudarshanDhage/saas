"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Project, SprintPlan, getProject, getSprintPlans, createSprintPlan, getCostEstimation } from '@/lib/firestore'
import { ArrowLeft, Code, Loader2, PackageCheck, Server, Database, LayoutDashboard, FileText, ShieldAlert, AlertCircle, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SprintPlanView from '@/components/projects/SprintPlanView'
import FeatureCard from '@/components/projects/FeatureCard'
import DocumentationView from '@/components/projects/DocumentationView'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { generateSprintPlan } from '@/lib/gemini'
import { auth } from '@/lib/firebase'
import ProjectOverview from './ProjectOverview'
import CostEstimationView from './CostEstimationView'

interface ProjectDetailClientProps {
  projectId: string
  initialTab?: string
}

const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({ projectId, initialTab = 'overview' }) => {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [sprintPlans, setSprintPlans] = useState<SprintPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [error, setError] = useState<string | null>(null)
  const { setActiveSection, setSelectedProject } = useSidebar()
  
  // Add useState hooks for cost estimation
  const [costEstimation, setCostEstimation] = useState<any>(null)
  const [isLoadingCost, setIsLoadingCost] = useState(false)
  
  useEffect(() => {
    // Set active section when component mounts
    setActiveSection(`project-${projectId}-${activeTab}`)
  }, [activeTab, projectId, setActiveSection])
  
  useEffect(() => {
    // Update the tab when initialTab changes (e.g., from URL)
    setActiveTab(initialTab)
  }, [initialTab])
  
  // Add useEffect for loading cost estimation data when tab changes
  useEffect(() => {
    const loadCostEstimation = async () => {
      if (!projectId || activeTab !== 'cost-estimation') return;
      
      try {
        setIsLoadingCost(true);
        const data = await getCostEstimation(projectId);
        setCostEstimation(data);
      } catch (error) {
        console.error('Error loading cost estimation:', error);
      } finally {
        setIsLoadingCost(false);
      }
    };
    
    loadCostEstimation();
  }, [projectId, activeTab]);
  
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        setError('Authentication required. Please log in to view this project.')
        setIsLoading(false)
        return
      }
      
      try {
        setIsLoading(true)
        
        // Fetch project details
        console.log('Fetching project data for ID:', projectId)
        const projectData = await getProject(projectId)
        console.log('Project data loaded:', projectData)
        
        // Validate project data has all required fields
        if (!projectData || !projectData.id) {
          console.error('Invalid project data received:', projectData)
          setError('Invalid project data structure. Please contact support.')
          setIsLoading(false)
          return
        }
        
        // Check if the project belongs to the current user
        if (projectData.userId && projectData.userId !== auth.currentUser.uid) {
          setError('You do not have permission to view this project.')
          setIsLoading(false)
          return
        }
        
        // Ensure the project has the required fields
        const validatedProject: Project = {
          ...projectData,
          coreFeatures: Array.isArray(projectData.coreFeatures) ? projectData.coreFeatures : [],
          suggestedFeatures: Array.isArray(projectData.suggestedFeatures) ? projectData.suggestedFeatures : [],
          techStack: projectData.techStack || {}
        }
        
        setProject(validatedProject)
        
        // Also update the selected project in the sidebar context
        setSelectedProject(validatedProject)
        
        // Fetch sprint plans
        const plansData = await getSprintPlans(projectId)
        console.log(`Loaded ${plansData.length} sprint plans`)
        setSprintPlans(plansData)
      } catch (error: any) {
        console.error('Error fetching project data:', error)
        setError(error.message || 'Error loading project data. The project may not exist or you may not have access.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjectData()
  }, [projectId, setSelectedProject])

  // Function to handle tab changes and update URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setActiveSection(`project-${projectId}-${tab === 'overview' ? 'overview' : 
                                          tab === 'sprint-plan' ? 'sprint' : 
                                          tab === 'documentation' ? 'docs' : tab}`)
    
    // Update URL without full page reload - simplified for cleaner navigation
    router.push(`/projects/${projectId}?tab=${tab}`, { scroll: false })
  }
  
  const handleGenerateSprintPlan = async () => {
    if (!project) return
    
    try {
      setIsGeneratingPlan(true)
      
      // Generate sprint plans using Gemini AI
      const sprintPlans = await generateSprintPlan(project)
      
      console.log('Generated sprint plans:', sprintPlans);
      
      // Validate the sprint plans before saving
      if (!sprintPlans || typeof sprintPlans !== 'object') {
        throw new Error('Invalid sprint plan format returned from AI');
      }
      
      // Extract and ensure developerPlan and aiPlan are not undefined
      const developerPlan = sprintPlans.developerSprintPlan || { sprints: [] };
      const aiPlan = sprintPlans.aiSprintPlan || { sprints: [] };
      
      // Save sprint plans to Firestore
      await createSprintPlan({
        projectId: projectId,
        developerPlan,
        aiPlan
      })
      
      // Reload sprint plans
      const plansData = await getSprintPlans(projectId)
      setSprintPlans(plansData)
    } catch (error) {
      console.error('Error generating sprint plan:', error)
      alert('Failed to generate sprint plan. Please try again.')
    } finally {
      setIsGeneratingPlan(false)
    }
  }
  
  // Render the overview section
  const renderOverviewSection = () => {
    return (
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/projects', { scroll: false })}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to My Projects
            </Button>
            
            <h1 className="text-2xl font-semibold text-[#172B4D] dark:text-white">{project?.title}</h1>
          </div>
          <p className="text-[#6B778C] dark:text-gray-400 max-w-3xl">{project?.description}</p>
        </div>
        
        <Tabs value={activeTab === 'overview' ? 'overview' : 'features'} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Project Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            {project ? (
              <ProjectOverview 
                project={project}
                sprintCount={
                  sprintPlans.length > 0 && 
                  sprintPlans[0]?.developerPlan?.sprints?.length ? 
                  sprintPlans[0].developerPlan.sprints.length : 0
                }
                onViewSprintPlan={() => router.push(`/projects/${projectId}?tab=sprint-plan`, { scroll: false })}
              />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#172B4D] dark:text-white mb-2">Project Data Missing</h3>
                  <p className="text-[#6B778C] dark:text-gray-400">
                    Unable to load project data. Try refreshing the page.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="features" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Project Features</CardTitle>
                <CardDescription>
                  All features included in this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project && [...project.coreFeatures, ...project.suggestedFeatures].map(feature => (
                    <FeatureCard key={feature.id} feature={feature} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  // Render the sprint planning section
  const renderSprintPlanSection = () => {
    return (
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/projects', { scroll: false })}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to My Projects
            </Button>
            
            <h1 className="text-2xl font-semibold text-[#172B4D] dark:text-white">{project?.title}</h1>
          </div>
          <p className="text-[#6B778C] dark:text-gray-400 max-w-3xl">{project?.description}</p>
        </div>
        
        <h2 className="text-xl font-semibold text-[#172B4D] dark:text-white mb-4">Sprint Plan</h2>
        
        {sprintPlans.length > 0 ? (
          <div>
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                onClick={handleGenerateSprintPlan}
                disabled={isGeneratingPlan}
              >
                {isGeneratingPlan ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Regenerate Sprint Plan</>
                )}
              </Button>
            </div>
            <SprintPlanView sprintPlan={sprintPlans[0]} />
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-medium text-[#172B4D] dark:text-white mb-2">No Sprint Plans Available</h3>
                <p className="text-[#6B778C] dark:text-gray-400 mb-6 max-w-md mx-auto">
                  This project doesn't have any sprint plans yet. Generate a new sprint plan to get started.
                </p>
                <Button 
                  variant="jira"
                  onClick={handleGenerateSprintPlan}
                  disabled={isGeneratingPlan}
                >
                  {isGeneratingPlan ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Generating Sprint Plan...
                    </>
                  ) : (
                    <>Generate Sprint Plan</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };
  
  // Render the documentation section
  const renderDocumentationSection = () => {
    return (
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/projects', { scroll: false })}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to My Projects
            </Button>
            
            <h1 className="text-2xl font-semibold text-[#172B4D] dark:text-white">{project?.title}</h1>
          </div>
          <p className="text-[#6B778C] dark:text-gray-400 max-w-3xl">{project?.description}</p>
        </div>
        
        <h2 className="text-xl font-semibold text-[#172B4D] dark:text-white mb-4">Documentation</h2>
        
        {project ? (
          <DocumentationView 
            project={project} 
            sprintPlan={sprintPlans.length > 0 ? sprintPlans[0] : null} 
          />
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-medium text-[#172B4D] dark:text-white mb-2">No Project Available</h3>
                <p className="text-[#6B778C] dark:text-gray-400 mb-6 max-w-md mx-auto">
                  A project is required to generate documentation.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };
  
  // Render the cost estimation section
  const renderCostEstimationSection = () => {
    return (
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/projects', { scroll: false })}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to My Projects
            </Button>
            
            <h1 className="text-2xl font-semibold text-[#172B4D] dark:text-white">{project?.title}</h1>
          </div>
          <p className="text-[#6B778C] dark:text-gray-400 max-w-3xl">{project?.description}</p>
        </div>
        
        <div className="flex items-center mb-4">
          <DollarSign className="h-6 w-6 mr-2 text-[#FF5630]" />
          <h2 className="text-xl font-semibold text-[#172B4D] dark:text-white">Cost Estimation</h2>
        </div>
        
        <CostEstimationView 
          costEstimation={costEstimation} 
          isLoading={isLoadingCost}
          projectId={projectId}
        />
      </div>
    );
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-[70vh]">
            <Loader2 size={48} className="animate-spin text-[#0052CC]" />
          </div>
        </div>
      )
    }
    
    if (error) {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="text-center py-16">
            <ShieldAlert size={64} className="mx-auto mb-6 text-amber-500" />
            <h2 className="text-xl font-medium text-[#172B4D] dark:text-white mb-2">Access Denied</h2>
            <p className="text-[#6B778C] dark:text-gray-400 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <Link href="/projects" scroll={false}>
              <Button variant="jira">
                <ArrowLeft size={16} className="mr-2" />
                Back to My Projects
              </Button>
            </Link>
          </div>
        </div>
      )
    }
    
    if (!project) {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-xl font-medium text-[#172B4D] dark:text-white mb-2">Project Not Found</h2>
            <p className="text-[#6B778C] dark:text-gray-400 mb-6">
              The project you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/projects" scroll={false}>
              <Button variant="jira">
                <ArrowLeft size={16} className="mr-2" />
                Back to My Projects
              </Button>
            </Link>
          </div>
        </div>
      )
    }
    
    // Render the appropriate section based on the active tab
    if (activeTab === 'sprint-plan') {
      return renderSprintPlanSection();
    } else if (activeTab === 'documentation') {
      return renderDocumentationSection();
    } else if (activeTab === 'cost-estimation') {
      return renderCostEstimationSection();
    } else {
      // Default to overview section (which includes the features tab)
      return renderOverviewSection();
    }
  }
  
  return (
    <PageWithSidebar pageTitle="Project Details">
      {renderContent()}
    </PageWithSidebar>
  )
}

export default ProjectDetailClient 