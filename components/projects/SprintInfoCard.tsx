"use client"

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Target, ChevronLeft, ChevronRight, Calendar, CheckCircle, TrendingUp, AlertTriangle, Clock, Users } from 'lucide-react'

interface SprintInfoCardProps {
  sprintName: string
  sprintFocus?: string
  currentSprintIndex: number
  totalSprints: number
  onPrevious: () => void
  onNext: () => void
  sprint?: any // The complete sprint object with all AI-generated data
  projectAnalysis?: any // Project analysis data from AI
}

const SprintInfoCard: React.FC<SprintInfoCardProps> = ({ 
  sprintName, 
  sprintFocus, 
  currentSprintIndex, 
  totalSprints,
  onPrevious,
  onNext,
  sprint,
  projectAnalysis
}) => {
  return (
    <Card className="mb-4 border-l-4 border-l-blue-600 dark:border-l-blue-400">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Target size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-lg">{sprintName}</CardTitle>
              {sprint?.duration && (
                <Badge variant="outline" className="ml-2 flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {sprint.duration}
                </Badge>
              )}
            </div>
            {sprintFocus && (
              <CardDescription className="text-slate-600 dark:text-slate-300 mb-3">
                {sprintFocus}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPrevious}
              disabled={currentSprintIndex === 0}
              className="px-2 py-1 h-8"
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-xs">
              {currentSprintIndex + 1} of {totalSprints}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNext}
              disabled={currentSprintIndex === totalSprints - 1}
              className="px-2 py-1 h-8"
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Enhanced sprint information */}
      {(sprint || projectAnalysis) && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Sprint Objectives */}
            {sprint?.objectives && Array.isArray(sprint.objectives) && (
              <div>
                <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                  <CheckCircle size={14} className="mr-2 text-green-600 dark:text-green-400" />
                  Sprint Objectives
                </h5>
                <div className="space-y-1">
                  {sprint.objectives.slice(0, 3).map((objective: string, index: number) => (
                    <div key={index} className="text-xs text-slate-600 dark:text-slate-400 flex items-start">
                      <span className="mr-2 text-green-600 dark:text-green-400">•</span>
                      <span className="line-clamp-2">{objective}</span>
                    </div>
                  ))}
                  {sprint.objectives.length > 3 && (
                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      +{sprint.objectives.length - 3} more objectives
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Features Implemented */}
            {sprint?.featuresImplemented && Array.isArray(sprint.featuresImplemented) && (
              <div>
                <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                  <TrendingUp size={14} className="mr-2 text-blue-600 dark:text-blue-400" />
                  Features Implemented
                </h5>
                <div className="flex flex-wrap gap-1">
                  {sprint.featuresImplemented.slice(0, 4).map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {feature.length > 15 ? `${feature.substring(0, 15)}...` : feature}
                    </Badge>
                  ))}
                  {sprint.featuresImplemented.length > 4 && (
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      +{sprint.featuresImplemented.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Sprint Metrics */}
            {(sprint?.tasks || projectAnalysis) && (
              <div>
                <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                  <TrendingUp size={14} className="mr-2 text-purple-600 dark:text-purple-400" />
                  Sprint Metrics
                </h5>
                <div className="space-y-2">
                  {sprint?.tasks && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Total Tasks:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{sprint.tasks.length}</span>
                    </div>
                  )}
                  {sprint?.tasks && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Est. Hours:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {sprint.tasks.reduce((total: number, task: any) => total + (task.estimatedHours || 0), 0)}h
                      </span>
                    </div>
                  )}
                  {projectAnalysis?.complexityLevel && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Complexity:</span>
                      <span className={`font-medium ${
                        projectAnalysis.complexityLevel === 'Simple' ? 'text-green-600 dark:text-green-400' :
                        projectAnalysis.complexityLevel === 'Moderate' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {projectAnalysis.complexityLevel}
                      </span>
                    </div>
                  )}
                  {projectAnalysis?.totalFeatures && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Total Features:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{projectAnalysis.totalFeatures}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Project Analysis Summary */}
          {projectAnalysis?.reasoning && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                <AlertTriangle size={14} className="mr-2 text-orange-600 dark:text-orange-400" />
                Project Analysis
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {projectAnalysis.reasoning}
              </p>
            </div>
          )}

          {/* Task Complexity Distribution */}
          {sprint?.tasks && Array.isArray(sprint.tasks) && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h5 className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                <Clock size={14} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                Task Complexity
              </h5>
              <div className="flex flex-wrap gap-2">
                {['simple', 'moderate', 'complex', 'very-complex'].map(complexity => {
                  const count = sprint.tasks.filter((task: any) => task.complexity === complexity).length
                  if (count === 0) return null
                  return (
                    <div key={complexity} className="flex items-center text-xs">
                      <span className={`w-2 h-2 rounded-full mr-1 ${
                        complexity === 'simple' ? 'bg-green-500' :
                        complexity === 'moderate' ? 'bg-yellow-500' :
                        complexity === 'complex' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}></span>
                      <span className="text-slate-600 dark:text-slate-400 capitalize">{complexity}:</span>
                      <span className="ml-1 font-medium text-slate-900 dark:text-white">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default SprintInfoCard; 