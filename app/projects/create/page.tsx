"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProjectIdeaForm from '@/components/projects/ProjectIdeaForm'
import ProjectStructure from '@/components/projects/ProjectStructure'
import TechStackSelection from '@/components/projects/TechStackSelection'
import { Button } from '@/components/ui/button'
import { 
  generateProjectStructure, 
  generateTechStack, 
  generateSprintPlan 
} from '@/lib/gemini'
import { createProject, createSprintPlan, Feature, Project, SprintPlan } from '@/lib/firestore-v2'
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { useToast } from '@/components/ui/use-toast'

type StepType = 'idea' | 'structure' | 'tech-stack' | 'generating-plan' | 'complete'

const CreateProjectPage = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<StepType>('idea')
  const [isLoading, setIsLoading] = useState(false)
  const [projectData, setProjectData] = useState<Project | null>(null)
  const [techStackData, setTechStackData] = useState<any>(null)
  const [techStackSelections, setTechStackSelections] = useState<Record<string, string>>({})
  const { setActiveSection } = useSidebar()
  const { toast } = useToast()
  
  useEffect(() => {
    // Set active section when component mounts
    setActiveSection('sprints')
  }, [setActiveSection])
  
  // Handle project idea submission
  const handleIdeaSubmit = async (idea: string) => {
    try {
      setIsLoading(true)
      
      // Generate project structure from idea using Gemini AI
      const projectStructure = await generateProjectStructure(idea)
      
      // Setup initial project data
      setProjectData({
        title: projectStructure.title,
        description: projectStructure.description,
        coreFeatures: projectStructure.coreFeatures,
        suggestedFeatures: projectStructure.suggestedFeatures,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId: '' // Will be set automatically when creating
      })
      
      // Proceed to next step
      setCurrentStep('structure')
    } catch (error) {
      console.error('Error generating project structure:', error)
      toast({
        title: "Error",
        description: "An error occurred while generating the project structure. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle features update
  const handleUpdateFeatures = (coreFeatures: Feature[], suggestedFeatures: Feature[]) => {
    if (!projectData) return
    
    setProjectData({
      ...projectData,
      coreFeatures,
      suggestedFeatures
    })
  }
  
  // Generate tech stack recommendations
  const generateTechStackRecommendations = async () => {
    if (!projectData) return
    
    try {
      setIsLoading(true)
      
      // Generate tech stack recommendations based on project features
      const techStackRecommendations = await generateTechStack(projectData)
      setTechStackData(techStackRecommendations)
      
      // Initialize selections with recommended options
      const initialSelections: Record<string, string> = {}
      Object.keys(techStackRecommendations).forEach(category => {
        const recommendedItem = techStackRecommendations[category].find((item: any) => item.recommended)
        if (recommendedItem) {
          initialSelections[category] = recommendedItem.name
        }
      })
      
      setTechStackSelections(initialSelections)
      setCurrentStep('tech-stack')
    } catch (error) {
      console.error('Error generating tech stack recommendations:', error)
      toast({
        title: "Error",
        description: "An error occurred while generating tech stack recommendations. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle tech stack selection change
  const handleTechStackSelectionChange = (category: string, selection: string) => {
    setTechStackSelections(prev => ({
      ...prev,
      [category]: selection
    }))
  }
  
  // Generate final sprint plan
  const generateFinalSprintPlan = async () => {
    if (!projectData || !techStackData) return
    
    try {
      setCurrentStep('generating-plan')
      setIsLoading(true)
      
      // Create selected tech stack object
      const selectedTechStack: Record<string, any> = {}
      Object.keys(techStackSelections).forEach(category => {
        const selection = techStackSelections[category]
        const item = techStackData[category].find((i: any) => i.name === selection)
        if (item) {
          selectedTechStack[category] = item
        }
      })
      
      // Save project to Firestore
      const createdProject = await createProject({
        ...projectData,
        techStack: selectedTechStack
      })
      
      // Generate sprint plans using Gemini AI
      const sprintPlans = await generateSprintPlan(
        { ...projectData, techStack: selectedTechStack },
        selectedTechStack
      )
      
      // Save sprint plans to Firestore
      await createSprintPlan({
        projectId: createdProject.id as string,
        developerPlan: sprintPlans.developerSprintPlan,
        aiPlan: sprintPlans.aiSprintPlan
      })
      
      // Navigate to projects page
      router.push('/projects')
    } catch (error) {
      console.error('Error generating sprint plan:', error)
      toast({
        title: "Error",
        description: "An error occurred while generating the sprint plan. Please try again."
      })
      setCurrentStep('tech-stack')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Regenerate project structure
  const handleRegenerateStructure = async () => {
    if (!projectData) return
    
    try {
      setIsLoading(true)
      
      // Generate new project structure
      const projectStructure = await generateProjectStructure(projectData.description)
      
      setProjectData({
        ...projectData,
        title: projectStructure.title,
        description: projectStructure.description,
        coreFeatures: projectStructure.coreFeatures,
        suggestedFeatures: projectStructure.suggestedFeatures
      })
    } catch (error) {
      console.error('Error regenerating project structure:', error)
      toast({
        title: "Error",
        description: "An error occurred while regenerating the project structure. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const renderContent = () => {
    // Show loading indicator when generating final sprint plan
    if (currentStep === 'generating-plan') {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="w-full py-12 flex flex-col items-center justify-center">
            <div className="text-center">
              <Loader2 size={48} className="mx-auto mb-4 animate-spin text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-medium text-slate-900 dark:text-white mb-2">Generating Sprint Plan</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Creating detailed sprints and tasks based on your project features...
              </p>
            </div>
          </div>
        </div>
      )
    }
    
    // Show loading indicator when transitioning between steps
    if (isLoading && currentStep === 'structure') {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="w-full py-12 flex flex-col items-center justify-center">
            <div className="text-center">
              <Loader2 size={48} className="mx-auto mb-4 animate-spin text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-medium text-slate-900 dark:text-white mb-2">Generating Tech Stack Recommendations</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Analyzing your project features to recommend the optimal technology stack...
              </p>
            </div>
          </div>
        </div>
      )
    }
    
    // Map step to component
    const stepContent = {
      'idea': (
        <div className="container py-8 max-w-7xl mx-auto">
          <ProjectIdeaForm 
            onSubmit={handleIdeaSubmit} 
            isLoading={isLoading}
          />
        </div>
      ),
      'structure': projectData && (
        <div className="container py-8 max-w-7xl mx-auto">
          <ProjectStructure
            projectData={projectData}
            onUpdateFeatures={handleUpdateFeatures}
            onNext={generateTechStackRecommendations}
            onRegenerate={handleRegenerateStructure}
            isRegenerating={isLoading}
            isNextLoading={isLoading}
          />
        </div>
      ),
      'tech-stack': techStackData && (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="w-full max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('structure')}
                disabled={isLoading}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Features
              </Button>
              <Button 
                variant="jira" 
                onClick={generateFinalSprintPlan}
                disabled={isLoading || Object.keys(techStackSelections).length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>Generate Sprint Plan</>
                )}
              </Button>
            </div>
            
            <TechStackSelection
              techStackData={techStackData}
              selections={techStackSelections}
              onSelectionChange={handleTechStackSelectionChange}
            />
          </div>
        </div>
      ),
      'complete': (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Project Created Successfully!
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Your project has been created and saved.
            </p>
          </div>
        </div>
      )
    }
    
    return stepContent[currentStep] || null
  }
  
  return (
    <PageWithSidebar pageTitle="Sprint Projects">
      {renderContent()}
    </PageWithSidebar>
  )
}

export default CreateProjectPage 