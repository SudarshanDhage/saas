"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Project, SprintPlan, getProject, getSprintPlans, createSprintPlan } from '@/lib/firestore-v2'
import { ArrowLeft, Code, Loader2, PackageCheck, Server, Database, LayoutDashboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SprintPlanView from '@/components/projects/SprintPlanView'
import FeatureCard from '@/components/projects/FeatureCard'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { generateSprintPlan } from '@/lib/gemini'
import { useToast } from '@/components/ui/use-toast'

interface ProjectDetailClientProps {
  projectId: string
}

const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({ projectId }) => {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [sprintPlans, setSprintPlans] = useState<SprintPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const { setActiveSection } = useSidebar()
  const { toast } = useToast()
  
  useEffect(() => {
    // Set active section when component mounts
    setActiveSection('sprints')
    
    const fetchProjectData = async () => {
      if (!projectId) return
      
      try {
        setIsLoading(true)
        
        // Fetch project details
        const projectData = await getProject(projectId)
        setProject(projectData)
        
        // Fetch sprint plans
        const plansData = await getSprintPlans(projectId)
        setSprintPlans(plansData)
      } catch (error) {
        console.error('Error fetching project data:', error)
        toast({
          title: "Error",
          description: "Error loading project data. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjectData()
  }, [projectId, setActiveSection, toast])
  
  // Function to handle generating a new sprint plan
  const handleGenerateSprintPlan = async () => {
    if (!project) return;
    
    try {
      setIsGeneratingPlan(true);
      
      // Generate sprint plans using Gemini AI
      const sprintPlans = await generateSprintPlan(
        { ...project }, 
        project.techStack || {}
      );
      
      // Save sprint plans to Firestore
      const newSprintPlan = await createSprintPlan({
        projectId: projectId,
        developerPlan: sprintPlans.developerSprintPlan,
        aiPlan: sprintPlans.aiSprintPlan
      });
      
      // Update local state with the new sprint plan
      setSprintPlans(prevPlans => [
        { ...newSprintPlan, createdAt: Date.now() } as SprintPlan,
        ...prevPlans
      ]);
      
      // Show success message
      toast({
        title: "Sprint Plan Generated",
        description: "Sprint plan generated successfully!"
      })
      
    } catch (error) {
      console.error('Error generating sprint plan:', error);
      toast({
        title: "Error",
        description: "An error occurred while generating the sprint plan. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingPlan(false);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-[70vh]">
            <Loader2 size={48} className="animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      )
    }
    
    if (!project) {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-xl font-medium text-slate-900 dark:text-white mb-2">Project Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              The project you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/projects">
              <Button variant="jira">
                <ArrowLeft size={16} className="mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      )
    }
    
    // Tech stack icons
    const techStackIcons: Record<string, React.ReactNode> = {
      frontend: <LayoutDashboard size={20} className="text-blue-600 dark:text-blue-400" />,
      backend: <Server size={20} className="text-green-600 dark:text-green-400" />,
      database: <Database size={20} className="text-purple-600 dark:text-purple-400" />,
      authentication: <PackageCheck size={20} className="text-yellow-600 dark:text-yellow-400" />,
      additionalTools: <Code size={20} className="text-slate-900 dark:text-white" />
    }
    
    return (
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/projects')}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
            
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{project.title}</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-3xl">{project.description}</p>
        </div>
        
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Project Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="sprint-plan">
              Sprint Plan {sprintPlans.length > 0 && `(${sprintPlans.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Summary</CardTitle>
                    <CardDescription>
                      Overview of the project structure and technologies
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Features summary */}
                      <div>
                        <h3 className="text-md font-medium text-slate-900 dark:text-white mb-3">Core Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.coreFeatures.map((feature, index) => (
                            <Card key={feature.id} className="border-l-4 border-l-blue-600 dark:border-l-blue-400">
                              <CardContent className="p-4">
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">{feature.name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{feature.description}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      {/* Sprint plan summary */}
                      {sprintPlans.length > 0 && (
                        <div>
                          <h3 className="text-md font-medium text-slate-900 dark:text-white mb-3">Sprint Plan</h3>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-4">
                            <div className="flex justify-between items-center mb-3">
                              <div>
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                  {sprintPlans[0].developerPlan.sprints.length} Sprints Created
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Click on the Sprint Plan tab to view detailed implementation plans
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setActiveTab('sprint-plan')}
                              >
                                View Sprint Plan
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {sprintPlans[0].developerPlan.sprints.map((sprint: any, index: number) => (
                                <div 
                                  key={index} 
                                  className="px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs rounded-full"
                                >
                                  {sprint.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Tech stack sidebar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Technology Stack</CardTitle>
                    <CardDescription>
                      Selected technologies with detailed analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.techStack && Object.entries(project.techStack).map(([category, tech]: [string, any]) => {
                        // Handle both old format (single tech) and new format (array of options)
                        const techOption = Array.isArray(tech) ? tech.find(t => t.recommended) || tech[0] : tech;
                        
                        return (
                          <div key={category}>
                            <div className="flex items-center mb-2">
                              {techStackIcons[category] || <Code size={20} className="text-slate-900 dark:text-white" />}
                              <h4 className="text-sm font-medium text-slate-900 dark:text-white ml-2 capitalize">
                                {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </h4>
                            </div>
                            <Card className="border-l-4 border-l-blue-600 dark:border-l-blue-400">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-sm font-medium text-slate-900 dark:text-white">{techOption.name}</h5>
                                  <div className="flex items-center space-x-1">
                                    {techOption.recommended && (
                                      <span className="px-2 py-0.5 text-[10px] bg-yellow-600 dark:bg-yellow-500 text-white rounded-full">
                                        Recommended
                                      </span>
                                    )}
                                    {techOption.fitScore && (
                                      <span className="px-2 py-0.5 text-[10px] bg-green-600 dark:bg-green-500 text-white rounded-full">
                                        {techOption.fitScore}% fit
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{techOption.reason}</p>
                                
                                {/* Comprehensive tech analysis */}
                                {(techOption.learningCurve || techOption.scalability || techOption.cost || techOption.performance) && (
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    {techOption.learningCurve && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Learning:</span>
                                        <span className={`font-medium ${
                                          techOption.learningCurve === 'beginner' ? 'text-green-600 dark:text-green-400' :
                                          techOption.learningCurve === 'intermediate' ? 'text-yellow-600 dark:text-yellow-400' :
                                          'text-red-600 dark:text-red-400'
                                        }`}>
                                          {techOption.learningCurve}
                                        </span>
                                      </div>
                                    )}
                                    {techOption.scalability && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Scale:</span>
                                        <span className={`font-medium ${
                                          techOption.scalability === 'high' || techOption.scalability === 'enterprise' ? 'text-green-600 dark:text-green-400' :
                                          techOption.scalability === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                          'text-red-600 dark:text-red-400'
                                        }`}>
                                          {techOption.scalability}
                                        </span>
                                      </div>
                                    )}
                                    {techOption.cost && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Cost:</span>
                                        <span className={`font-medium ${
                                          techOption.cost === 'free' ? 'text-green-600 dark:text-green-400' :
                                          techOption.cost === 'low' ? 'text-blue-600 dark:text-blue-400' :
                                          techOption.cost === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                          'text-red-600 dark:text-red-400'
                                        }`}>
                                          {techOption.cost}
                                        </span>
                                      </div>
                                    )}
                                    {techOption.performance && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Performance:</span>
                                        <span className={`font-medium ${
                                          techOption.performance === 'excellent' || techOption.performance === 'exceptional' ? 'text-green-600 dark:text-green-400' :
                                          techOption.performance === 'good' ? 'text-blue-600 dark:text-blue-400' :
                                          'text-yellow-600 dark:text-yellow-400'
                                        }`}>
                                          {techOption.performance}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Best for and considerations */}
                                {(techOption.bestFor || techOption.considerations) && (
                                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                    {techOption.bestFor && (
                                      <div className="mb-2">
                                        <span className="text-xs font-medium text-green-700 dark:text-green-300">Best for:</span>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{techOption.bestFor}</p>
                                      </div>
                                    )}
                                    {techOption.considerations && (
                                      <div>
                                        <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Consider:</span>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{techOption.considerations}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                      
                      {/* Additional Tools Section */}
                      {project.techStack?.additionalTools && Array.isArray(project.techStack.additionalTools) && (
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center mb-3">
                            <Code size={20} className="text-purple-600 dark:text-purple-400" />
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white ml-2">
                              Additional Tools & Services
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {project.techStack.additionalTools.map((tool: any, index: number) => (
                              <Card key={index} className="border-l-4 border-l-purple-600 dark:border-l-purple-400">
                                <CardContent className="p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center">
                                      <span className="text-xs font-medium text-slate-900 dark:text-white">
                                        {tool.name}
                                      </span>
                                      {tool.category && (
                                        <span className="ml-2 px-1.5 py-0.5 text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                                          {tool.category}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      {tool.priority && (
                                        <span className={`px-1.5 py-0.5 text-[9px] rounded ${
                                          tool.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                          tool.priority === 'important' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                                          'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        }`}>
                                          {tool.priority}
                                        </span>
                                      )}
                                      {tool.implementationPhase && (
                                        <span className="px-1.5 py-0.5 text-[9px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">
                                          {tool.implementationPhase}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{tool.reason}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                  {[...project.coreFeatures, ...project.suggestedFeatures].map(feature => (
                    <FeatureCard key={feature.id} feature={feature} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sprint-plan" className="mt-0">
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
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Sprint Plans Available</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
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
          </TabsContent>
        </Tabs>
      </div>
    )
  }
  
  return (
    <PageWithSidebar pageTitle="Sprint Projects">
      {renderContent()}
    </PageWithSidebar>
  )
}

export default ProjectDetailClient 