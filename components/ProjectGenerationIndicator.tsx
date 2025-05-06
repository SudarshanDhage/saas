'use client'

import React from 'react'
import { useProjectGeneration } from '@/contexts/ProjectGenerationContext'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const ProjectGenerationIndicator = () => {
  const { generationState, hasActiveGeneration } = useProjectGeneration()
  const router = useRouter()
  
  if (!hasActiveGeneration) {
    return null
  }
  
  return (
    <div className="flex items-center gap-3 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-md">
      <div className="flex items-center gap-2">
        <Loader2 size={16} className="animate-spin text-blue-500" />
        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
          {generationState.progressMessage}
        </span>
      </div>
      
      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${generationState.progress}%` }}
        />
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="text-xs h-6 px-2 text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
        onClick={() => {
          if (generationState.projectId) {
            router.push(`/projects/${generationState.projectId}?tab=overview`)
          }
        }}
      >
        {generationState.projectId ? 'View Project' : 'Working...'}
      </Button>
    </div>
  )
}

export default ProjectGenerationIndicator 