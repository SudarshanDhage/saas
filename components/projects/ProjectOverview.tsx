'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Project } from '@/lib/firestore'
import { Database, Code, LayoutDashboard, Server, PackageCheck, AlertCircle, Bug } from 'lucide-react'

interface ProjectOverviewProps {
  project: Project
  sprintCount: number
  onViewSprintPlan: () => void
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  project, 
  sprintCount = 0,
  onViewSprintPlan
}) => {
  const [activeTab, setActiveTab] = useState<string>('summary')
  
  // Add debug logging to help troubleshoot
  console.log('ProjectOverview received:', { 
    project: project ? { 
      id: project.id, 
      title: project.title,
      coreFeatures: project.coreFeatures?.length,
      suggestedFeatures: project.suggestedFeatures?.length,
      techStack: project.techStack ? 'present' : 'missing'
    } : 'undefined',
    sprintCount 
  });
  
  // Debug mode - show raw project data if there are issues
  const showDebugInfo = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

  // Safety check for undefined project
  if (!project) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#172B4D] dark:text-white mb-2">Project Data Error</h3>
          <p className="text-[#6B778C] dark:text-gray-400 mb-4">
            Unable to display project information. The data may be corrupted or missing.
          </p>
          {showDebugInfo && (
            <div className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-[300px] text-xs">
              <h4 className="font-bold mb-2 flex items-center">
                <Bug className="h-4 w-4 mr-1" /> Debug Information
              </h4>
              <pre>{JSON.stringify({ project }, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Ensure these fields exist to prevent errors
  const coreFeatures = project.coreFeatures || [];
  const suggestedFeatures = project.suggestedFeatures || [];
  const techStack = project.techStack || {};
  
  // Add debug info at the end if in development mode
  const renderDebugInfo = () => {
    if (!showDebugInfo) return null;
    
    return (
      <Card className="mt-6 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bug className="h-5 w-5 mr-2" /> Debug Information
          </CardTitle>
          <CardDescription>
            This section is only visible in development mode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-[400px] text-xs">
            <pre>{JSON.stringify(project, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Tech stack icons mapping
  const techStackIcons: Record<string, React.ReactNode> = {
    frontend: <LayoutDashboard size={20} className="text-[#0052CC]" />,
    backend: <Server size={20} className="text-[#00875A]" />,
    database: <Database size={20} className="text-[#6554C0]" />,
    authentication: <PackageCheck size={20} className="text-[#FF8B00]" />,
    additionalTools: <Code size={20} className="text-[#172B4D] dark:text-gray-300" />
  }

  return (
    <>
      <div className="mb-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">Project Summary</TabsTrigger>
            <TabsTrigger value="tech">Tech Stack</TabsTrigger>
          </TabsList>
          
          {/* Summary Tab */}
          <TabsContent value="summary">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Summary</CardTitle>
                    <CardDescription>
                      Overview of the project structure and features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Project Description */}
                      <div>
                        <h3 className="text-md font-medium text-[#172B4D] dark:text-white mb-3">About this Project</h3>
                        <p className="text-sm text-[#6B778C] dark:text-gray-400">{project.description || 'No description available'}</p>
                      </div>
                      
                      {/* Features summary */}
                      <div>
                        <h3 className="text-md font-medium text-[#172B4D] dark:text-white mb-3">Core Features ({coreFeatures.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {coreFeatures.length > 0 ? (
                            coreFeatures.map(feature => (
                              <Card key={feature?.id || Math.random().toString()} className="border-l-4 border-l-[#0052CC]">
                                <CardContent className="p-3">
                                  <h4 className="text-sm font-medium text-[#172B4D] dark:text-white mb-1">{feature?.name || 'Unnamed Feature'}</h4>
                                  <p className="text-xs text-[#6B778C] dark:text-gray-400">{feature?.description || 'No description available'}</p>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <div className="col-span-2 text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                              <p className="text-[#6B778C] dark:text-gray-400">No core features defined for this project</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Sprint plan summary */}
                      <div>
                        <h3 className="text-md font-medium text-[#172B4D] dark:text-white mb-3">Sprint Plan</h3>
                        <div className="bg-[#F4F5F7] dark:bg-gray-700 rounded-md p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h4 className="text-sm font-medium text-[#172B4D] dark:text-white">
                                {sprintCount > 0 ? `${sprintCount} Sprints Created` : 'No sprints created yet'}
                              </h4>
                              <p className="text-xs text-[#6B778C] dark:text-gray-400">
                                {sprintCount > 0 
                                  ? 'Click on the Sprint Plan tab to view detailed implementation plans'
                                  : 'Generate a sprint plan to start implementing your project'
                                }
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={onViewSprintPlan}
                            >
                              {sprintCount > 0 ? 'View Sprint Plan' : 'Generate Sprint Plan'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Debug Information */}
              {renderDebugInfo()}
            </div>
          </TabsContent>
          
          {/* Tech Stack Tab */}
          <TabsContent value="tech">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Tech Stack</CardTitle>
                    <CardDescription>
                      Technologies used in this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(techStack).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(techStack).map(([category, tech]: [string, any]) => {
                          // Skip if the tech entry is invalid
                          if (!tech || typeof tech !== 'object') return null;
                          
                          return (
                            <Card key={category} className="border-0 shadow-sm">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-md flex items-center">
                                  {techStackIcons[category] && (
                                    <div className="mr-2">
                                      {techStackIcons[category]}
                                    </div>
                                  )}
                                  <span className="capitalize">
                                    {category.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-sm font-medium text-[#172B4D] dark:text-white mb-1">
                                  {tech.name || 'Unknown Technology'}
                                </div>
                                <p className="text-sm text-[#6B778C] dark:text-gray-400">
                                  {tech.description || 'No description available'}
                                </p>
                                
                                {tech.features && tech.features.length > 0 && (
                                  <div className="mt-3">
                                    <h4 className="text-xs font-medium text-[#172B4D] dark:text-white mb-1">Key Features</h4>
                                    <ul className="list-disc list-inside text-xs text-[#6B778C] dark:text-gray-400">
                                      {tech.features.map((feature: string, idx: number) => (
                                        <li key={idx}>{feature}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <p className="text-[#6B778C] dark:text-gray-400">No tech stack defined for this project</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Debug Information */}
      {activeTab === 'summary' && renderDebugInfo()}
    </>
  )
}

export default ProjectOverview 