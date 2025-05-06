'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

// Define the generation state type
export type GenerationState = {
  isGenerating: boolean
  progress: number
  progressMessage: string
  projectId: string | null
  error: string | null
}

// Define the context type
type ProjectGenerationContextType = {
  generationState: GenerationState
  startGeneration: (initialState: Partial<GenerationState>) => void
  updateGenerationProgress: (update: Partial<GenerationState>) => void
  completeGeneration: (projectId: string) => void
  cancelGeneration: () => void
  hasActiveGeneration: boolean
}

// Create the context with default values
const ProjectGenerationContext = createContext<ProjectGenerationContextType>({
  generationState: {
    isGenerating: false,
    progress: 0,
    progressMessage: '',
    projectId: null,
    error: null
  },
  startGeneration: () => {},
  updateGenerationProgress: () => {},
  completeGeneration: () => {},
  cancelGeneration: () => {},
  hasActiveGeneration: false
})

// Persist state to localStorage if available
const saveToStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error(`Failed to save ${key} to localStorage`, e)
    }
  }
}

// Load state from localStorage if available
const loadFromStorage = (key: string, defaultValue: any) => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : defaultValue
    } catch (e) {
      console.error(`Failed to load ${key} from localStorage`, e)
      return defaultValue
    }
  }
  return defaultValue
}

// Create the provider component
export const ProjectGenerationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { toast } = useToast()
  const router = useRouter()
  
  // Initialize state from localStorage if available
  const [generationState, setGenerationState] = useState<GenerationState>(
    loadFromStorage('projectGenerationState', {
      isGenerating: false,
      progress: 0,
      progressMessage: '',
      projectId: null,
      error: null
    })
  )
  
  // Computed property for active generation
  const hasActiveGeneration = generationState.isGenerating
  
  // Update localStorage when state changes
  useEffect(() => {
    saveToStorage('projectGenerationState', generationState)
  }, [generationState])
  
  // Start a new generation process
  const startGeneration = (initialState: Partial<GenerationState>) => {
    setGenerationState({
      isGenerating: true,
      progress: initialState.progress || 0,
      progressMessage: initialState.progressMessage || 'Starting project generation...',
      projectId: initialState.projectId || null,
      error: null
    })
  }
  
  // Update the progress of an ongoing generation
  const updateGenerationProgress = (update: Partial<GenerationState>) => {
    setGenerationState(current => ({
      ...current,
      ...update
    }))
  }
  
  // Complete a generation process
  const completeGeneration = (projectId: string) => {
    setGenerationState({
      isGenerating: false,
      progress: 100,
      progressMessage: 'Project generation complete!',
      projectId,
      error: null
    })
    
    // Show a toast notification
    toast({
      title: "Project generation complete!",
      description: "Your project has been successfully created.",
      action: (
        <button 
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-xs"
          onClick={() => router.push(`/projects/${projectId}`)}
        >
          View Project
        </button>
      ),
    })
  }
  
  // Cancel an ongoing generation
  const cancelGeneration = () => {
    setGenerationState({
      isGenerating: false,
      progress: 0,
      progressMessage: '',
      projectId: null,
      error: 'Generation cancelled'
    })
  }
  
  return (
    <ProjectGenerationContext.Provider value={{
      generationState,
      startGeneration,
      updateGenerationProgress,
      completeGeneration,
      cancelGeneration,
      hasActiveGeneration
    }}>
      {children}
    </ProjectGenerationContext.Provider>
  )
}

// Custom hook to use the context
export const useProjectGeneration = () => useContext(ProjectGenerationContext) 