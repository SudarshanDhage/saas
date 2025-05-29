"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { SingleFeaturePlan } from '@/lib/firestore-v2'
import { Clock, User, Bot, CheckCircle, AlertCircle, Target } from 'lucide-react'
import { Column, Task } from '@/components/board/types'
import { 
  loadFeatureTaskStates, 
  saveFeatureTaskStates, 
  updateTaskState,
  TaskState 
} from '@/lib/firestore-v2'

// Import the same components used in project sprint plans
import EnhancedJiraBoard from '../projects/EnhancedJiraBoard'
import AITaskCard from '../projects/AITaskCard'

interface FeaturePlanViewProps {
  featurePlan: SingleFeaturePlan
}

// Convert feature plan tasks to board format
function mapFeatureTasksToTaskObjects(tasks: any[], planType: 'developer' | 'ai'): Task[] {
  if (!Array.isArray(tasks)) return []
  
  return tasks.map((task: any, index: number) => ({
    id: task.id || `${planType}-task-${index}`,
    content: task.title || task.name || 'Untitled Task',
    description: task.description || '',
    status: task.status || 'todo', // Use saved status or default to todo
    priority: task.priority || 'medium',
    type: task.type || 'feature',
    estimatedHours: task.estimatedHours || undefined,
    aiPrompt: planType === 'ai' ? task.description : undefined,
    implementation: task.implementation || task.description,
    acceptanceCriteria: task.acceptanceCriteria || [],
    dependencies: task.dependencies || [],
    isCompleted: false,
    taskId: `${planType.toUpperCase()}-${index + 1}`,
    comments: task.comments || [],
    commitId: task.commitId || ''
  }))
}

// Create initial board columns for features (now includes Review column)
function createFeatureColumns(tasks: Task[]): Column[] {
  const todoTasks = tasks.filter(task => task.status === 'todo')
  const inProgressTasks = tasks.filter(task => task.status === 'inprogress')
  const reviewTasks = tasks.filter(task => task.status === 'review')
  const doneTasks = tasks.filter(task => task.status === 'done')
  
  return [
    {
      id: 'todo',
      title: 'To Do',
      tasks: todoTasks
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: inProgressTasks
    },
    {
      id: 'review',
      title: 'Review',
      tasks: reviewTasks
    },
    {
      id: 'done',
      title: 'Done',
      tasks: doneTasks
    }
  ]
}

// Feature info card component
const FeatureInfoCard: React.FC<{
  featureTitle: string
  featureDescription: string
  totalTasks: number
  estimatedHours?: number
}> = ({ featureTitle, featureDescription, totalTasks, estimatedHours }) => {
  return (
    <Card className="mb-6 border-l-4 border-l-blue-600 dark:border-l-blue-400">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
              <Target size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
              {featureTitle}
            </h4>
            <p className="text-slate-600 dark:text-slate-300 mb-4">{featureDescription}</p>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-green-600 dark:text-green-400" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
                </span>
              </div>
              
              {estimatedHours && (
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    ~{estimatedHours} hours estimated
                  </span>
                </div>
              )}
            </div>
      </div>
      
          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            Feature Plan
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

const FeaturePlanView: React.FC<FeaturePlanViewProps> = ({ featurePlan }) => {
  const [activeView, setActiveView] = useState('developer')
  const [columns, setColumns] = useState<Column[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Convert feature plan data into board format with task state persistence
  useEffect(() => {
    if (!featurePlan || !featurePlan.id) return

    const loadTasksWithStates = async () => {
    setIsLoading(true)
    
    try {
        // Load the appropriate plan data based on active view
        let baseTasks: Task[] = []
        
        if (activeView === 'developer') {
          if (featurePlan.developerPlan?.tasks) {
            baseTasks = mapFeatureTasksToTaskObjects(featurePlan.developerPlan.tasks, 'developer')
          }
      } else {
          if (featurePlan.aiPlan?.tasks) {
            baseTasks = mapFeatureTasksToTaskObjects(featurePlan.aiPlan.tasks, 'ai')
          }
        }
        
        // Load saved task states from Firebase
        const savedTaskStates = await loadFeatureTaskStates(
          featurePlan.id!,
          activeView as 'developer' | 'ai'
        )
        
        // Merge base tasks with saved states
        const tasksWithStates = baseTasks.map(task => {
          const savedState = savedTaskStates.find(state => 
            state.taskId === task.taskId || state.id === task.id
          )
          
          if (savedState) {
            return {
              ...task,
              status: savedState.status,
              comments: savedState.comments || [],
              commitId: savedState.commitId || ''
            }
          }
          
          return task
        })
        
        setTasks(tasksWithStates)
        setColumns(createFeatureColumns(tasksWithStates))
        
        console.log(`📋 Loaded ${tasksWithStates.length} feature tasks with ${savedTaskStates.length} saved states`)
    } catch (error) {
        console.error('Error loading feature tasks with states:', error)
        // Fallback to basic task loading
        let planTasks: Task[] = []
        
        if (activeView === 'developer') {
          if (featurePlan.developerPlan?.tasks) {
            planTasks = mapFeatureTasksToTaskObjects(featurePlan.developerPlan.tasks, 'developer')
          }
        } else {
          if (featurePlan.aiPlan?.tasks) {
            planTasks = mapFeatureTasksToTaskObjects(featurePlan.aiPlan.tasks, 'ai')
          }
        }
        
        setTasks(planTasks)
        setColumns(createFeatureColumns(planTasks))
    } finally {
      setIsLoading(false)
    }
    }

    loadTasksWithStates()
  }, [featurePlan, activeView])

  // Handle task status changes with persistence
  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    // Update UI immediately using column-based update for EnhancedJiraBoard
    const updatedColumns = columns.map(column => {
      // Remove task from all columns first
      const filteredTasks = column.tasks.filter(task => task.id !== taskId)
      
      if (column.id === newStatus) {
        // Find the task from all columns
        const task = columns.flatMap(col => col.tasks).find(t => t.id === taskId)
        if (task) {
          return {
            ...column,
            tasks: [...filteredTasks, { ...task, status: newStatus }]
          }
        }
      }
      
      return {
        ...column,
        tasks: filteredTasks
      }
    })
    
    setColumns(updatedColumns)
    
    // Save to Firebase
    try {
      await updateTaskState(taskId, { status: newStatus as any }, {
        type: 'feature',
        featureId: featurePlan.id!,
        planType: activeView as 'developer' | 'ai'
      })
      
      console.log(`✅ Saved feature task status change: ${taskId} -> ${newStatus}`)
    } catch (error) {
      console.error('Error saving feature task status change:', error)
    }
  }

  // Save all task states when columns change (for drag and drop)
  useEffect(() => {
    if (!featurePlan.id || columns.length === 0 || isLoading) return

    const saveTaskStates = async () => {
      try {
        // Extract task states from current columns
        const taskStates: TaskState[] = columns.flatMap(column =>
          column.tasks.map(task => ({
            id: task.id,
            taskId: task.taskId,
            status: task.status as 'todo' | 'inprogress' | 'review' | 'done',
            comments: (task.comments || []).map(comment => ({
              id: comment.id,
              text: comment.text,
              author: comment.author,
              authorEmail: comment.author, // Use author as authorEmail fallback
              timestamp: comment.timestamp
            })),
            commitId: task.commitId || '',
            updatedAt: Date.now(),
            updatedBy: 'current-user' // This will be updated in the function
          }))
        )
        
        await saveFeatureTaskStates(
          featurePlan.id!,
          activeView as 'developer' | 'ai',
          taskStates
        )
        
        console.log(`💾 Auto-saved ${taskStates.length} feature task states`)
      } catch (error) {
        console.error('Error auto-saving feature task states:', error)
      }
    }

    // Debounce the save operation
    const timeoutId = setTimeout(saveTaskStates, 1000)
    return () => clearTimeout(timeoutId)
  }, [columns, featurePlan.id, activeView, isLoading])

  // Calculate total estimated hours for developer plan
  const totalEstimatedHours = featurePlan.developerPlan?.tasks?.reduce((total: number, task: any) => {
    return total + (task.estimatedHours || 0)
  }, 0)

  return (
    <div className="mb-8">
      <div className="mb-6">
          <Tabs defaultValue="developer" className="w-full" onValueChange={setActiveView}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
                <TabsTrigger value="developer" className="flex items-center">
                  <User size={16} className="mr-2" />
                  Developer Plan
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center">
                  <Bot size={16} className="mr-2" />
                  AI Assistant Plan
                </TabsTrigger>
              </TabsList>
          </div>
        
          <TabsContent value="developer" className="mt-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Developer Implementation Plan</h3>
            
            {/* Feature Info Card */}
            <FeatureInfoCard 
              featureTitle={featurePlan.feature.title}
              featureDescription={featurePlan.feature.description}
              totalTasks={featurePlan.developerPlan?.tasks?.length || 0}
              estimatedHours={totalEstimatedHours}
            />
                  
            {isLoading ? (
              <Card>
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-slate-600 dark:text-slate-400 text-center mt-4">Loading task states...</p>
                </CardContent>
                    </Card>
            ) : tasks.length > 0 ? (
              <div className="border border-slate-200 dark:border-slate-700 rounded-md" style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}>
                    <EnhancedJiraBoard columns={columns} setColumns={setColumns} />
                </div>
              ) : (
                <Card>
                <CardContent className="p-8 flex flex-col items-center">
                  <AlertCircle size={48} className="text-slate-400 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 text-center">No developer tasks available for this feature</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
          <TabsContent value="ai" className="mt-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">AI Assistant Implementation Plan</h3>
                  
            {/* Feature Info Card */}
            <FeatureInfoCard 
              featureTitle={featurePlan.feature.title}
              featureDescription={featurePlan.feature.description}
              totalTasks={featurePlan.aiPlan?.tasks?.length || 0}
            />
            
            {isLoading ? (
              <Card>
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-slate-600 dark:text-slate-400 text-center mt-4">Loading task states...</p>
                </CardContent>
                    </Card>
            ) : featurePlan.aiPlan?.tasks && featurePlan.aiPlan.tasks.length > 0 ? (
              <div className="grid gap-4">
                {tasks.map((task: Task, index: number) => (
                  <AITaskCard 
                    key={task.id}
                    task={{
                      id: task.id,
                      content: task.content,
                      description: task.description || '',
                      priority: task.priority || 'medium',
                      aiPrompt: task.aiPrompt || '',
                      implementation: task.implementation || '',
                      status: task.status || 'todo', // Use saved status
                      isCompleted: task.isCompleted || false,
                      taskId: task.taskId,
                      comments: task.comments || [],
                      commitId: task.commitId || ''
                    }}
                    onStatusChange={handleTaskStatusChange}
                  />
                ))}
                </div>
              ) : (
                <Card>
                <CardContent className="p-8 flex flex-col items-center">
                  <Bot size={48} className="text-slate-400 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 text-center">No AI assistant tasks available for this feature</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
      </div>
    </div>
  )
}

export default FeaturePlanView 