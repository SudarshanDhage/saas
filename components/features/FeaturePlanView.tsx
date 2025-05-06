"use client"

import React, { useEffect, useState, useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SingleFeaturePlan } from '@/lib/firestore'
import { User, Bot, Loader2, MoreHorizontal, ChevronLeft, ChevronRight, Clock, Target, Edit2, Zap, X } from 'lucide-react'
import { Column, Task } from '@/components/board/types'
import { Button } from '@/components/ui/button'

interface FeaturePlanViewProps {
  featurePlan: SingleFeaturePlan
}

// Enhanced Jira-style board with full drag and drop functionality
const EnhancedJiraBoard: React.FC<{ 
  columns: Column[], 
  setColumns: React.Dispatch<React.SetStateAction<Column[]>> 
}> = ({ columns, setColumns }) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  
  // Calculate column width based on the number of columns and container width
  useEffect(() => {
    const calculateColumnWidth = () => {
      if (!boardRef.current) return;
      const containerWidth = boardRef.current.offsetWidth;
      const columnCount = columns.length;
      const minColumnWidth = 280; // Minimum column width
      const padding = 16; // Padding on both sides
      
      // Calculate optimal column width while maintaining minimum
      const optimalWidth = Math.max(
        minColumnWidth,
        Math.floor((containerWidth - (padding * 2) - (columnCount * 8)) / columnCount)
      );
      
      // Apply the width to all column elements
      const columnElements = boardRef.current.querySelectorAll('.jira-column');
      columnElements.forEach((el) => {
        (el as HTMLElement).style.width = `${optimalWidth}px`;
      });
    };
    
    calculateColumnWidth();
    
    // Add resize listener
    window.addEventListener('resize', calculateColumnWidth);
    return () => window.removeEventListener('resize', calculateColumnWidth);
  }, [columns.length]);
  
  const handleDragStart = (e: React.DragEvent, task: Task, columnId: string) => {
    setDraggedTask(task);
    setDraggedFromColumn(columnId);
    
    // Set data transfer for better cross-browser compatibility
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    
    // For better drag-and-drop visuals
    if (e.dataTransfer.setDragImage) {
      const ghostElement = e.currentTarget.cloneNode(true) as HTMLElement;
      ghostElement.style.position = 'absolute';
      ghostElement.style.top = '-1000px';
      ghostElement.style.opacity = '0.8';
      ghostElement.style.transform = 'rotate(2deg)';
      document.body.appendChild(ghostElement);
      e.dataTransfer.setDragImage(ghostElement, 20, 20);
      
      setTimeout(() => {
        document.body.removeChild(ghostElement);
      }, 0);
    }
    
    // Add dragging class to task
    const taskElement = e.currentTarget as HTMLElement;
    taskElement.classList.add('opacity-50');
  };
  
  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };
  
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };
  
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    
    if (draggedTask && draggedFromColumn) {
      // Only update state if dropping in a different column
      if (columnId !== draggedFromColumn) {
        // Create updated columns
        const updatedColumns = columns.map(column => {
          // Remove from source column
          if (column.id === draggedFromColumn) {
            return {
              ...column,
              tasks: column.tasks.filter(task => task.id !== draggedTask.id)
            };
          }
          
          // Add to target column
          if (column.id === columnId) {
            // Update the task to reflect its new status
            const updatedTask = {
              ...draggedTask,
              status: columnId
            };
            
            return {
              ...column,
              tasks: [...column.tasks, updatedTask]
            };
          }
          
          return column;
        });
        
        setColumns(updatedColumns);
      }
    }
    
    setDraggedTask(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
  };
  
  const handleDragEnd = (e: React.DragEvent) => {
    // Reset the opacity for the dragged task
    const taskElement = e.currentTarget as HTMLElement;
    taskElement.classList.remove('opacity-50');
    
    setDraggedTask(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
  };
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    // In a real implementation, this would open a modal or navigate to a task detail page
    console.log('Task clicked:', task);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Board content */}
      <div 
        ref={boardRef}
        className="flex p-4 bg-white dark:bg-gray-800 w-full h-full"
      >
        {columns.map(column => (
          <div 
            key={column.id} 
            className={`jira-column flex-shrink-0 mx-2 flex flex-col h-full
              ${dragOverColumn === column.id ? 'bg-[#F8F9FA]' : ''}
              transition-colors duration-100`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column header - fixed */}
            <div className="bg-[#F4F5F7] dark:bg-gray-700 rounded-t p-2 mb-2 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-[#42526E] dark:text-gray-300">{column.title}</h3>
                <span className="ml-2 text-xs bg-[#DFE1E6] px-2 py-0.5 rounded-full text-[#42526E] dark:text-gray-300">
                  {column.tasks.length}
                </span>
              </div>
              <div className="flex items-center">
                <button className="text-[#6B778C] dark:text-gray-400 hover:text-[#42526E] dark:hover:text-gray-300 p-1 rounded-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
            
            {/* Column tasks - scrollable */}
            <div className="space-y-2 min-h-[50px] pb-2 overflow-y-auto flex-1 pr-1" style={{ maxHeight: 'calc(100% - 40px)' }}>
              {column.tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`bg-white dark:bg-gray-800 border rounded-sm shadow-sm p-3 cursor-move hover:bg-[#F4F5F7] dark:hover:bg-gray-700
                    ${draggedTask?.id === task.id ? 'opacity-50' : 'opacity-100'}
                    transform transition-transform duration-100 ease-in-out hover:translate-y-[-2px] hover:shadow-md`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, column.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="text-sm font-medium text-[#172B4D] dark:text-white mb-2">
                    {task.content}
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs font-medium text-[#42526E] dark:text-gray-300 bg-[#DFE1E6] px-1.5 py-0.5 rounded">
                      {task.taskId}
                    </span>
                    {task.priority && (
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white ${
                        task.priority === 'high' 
                          ? 'bg-[#E5493A]' 
                          : task.priority === 'medium' 
                          ? 'bg-[#FF8B00]' 
                          : 'bg-[#4CAF50]'
                      }`}>
                        {task.priority}
                      </span>
                    )}
                    {task.estimatedHours && (
                      <span className="text-xs text-[#6B778C] dark:text-gray-300 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {task.estimatedHours}h
                      </span>
                    )}
                    {task.description && (
                      <span className="text-xs text-[#6B778C] dark:text-gray-300 block w-full mt-1 line-clamp-2">
                        {task.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Empty column state with drop indicator */}
              {column.tasks.length === 0 && (
                <div className={`h-16 border-2 border-dashed rounded flex items-center justify-center
                  ${dragOverColumn === column.id ? 'border-[#4C9AFF] bg-[#DEEBFF]' : 'border-[#DFE1E6]'}
                  transition-colors duration-100`}>
                  <span className="text-xs text-[#6B778C] dark:text-gray-300">
                    {dragOverColumn === column.id 
                      ? 'Drop to add task here'
                      : 'No tasks yet'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Task preview modal - would be replaced with a proper modal in a real implementation */}
      {selectedTask && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedTask(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-md shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-xs font-medium text-[#42526E] dark:text-gray-300 bg-[#DFE1E6] px-1.5 py-0.5 rounded mr-2">
                  {selectedTask.taskId}
                </span>
                <h2 className="text-xl font-medium text-[#172B4D] dark:text-white">{selectedTask.content}</h2>
              </div>
              
              {selectedTask.sprintName && (
                <div className="mb-4">
                  <span className="text-sm text-[#6B778C] dark:text-gray-300 font-medium">Sprint:</span>
                  <span className="ml-2 text-sm bg-[#E3FCEF] text-[#00875A] px-2 py-0.5 rounded-full">
                    {selectedTask.sprintName}
                  </span>
                </div>
              )}

              <div className="mb-4">
                <span className="text-sm text-[#6B778C] dark:text-gray-300 font-medium">Priority:</span>
                <span className={`ml-2 text-sm px-2 py-0.5 rounded-full text-white ${
                  selectedTask.priority === 'high' 
                    ? 'bg-[#E5493A]' 
                    : selectedTask.priority === 'medium' 
                    ? 'bg-[#FF8B00]' 
                    : 'bg-[#4CAF50]'
                }`}>
                  {selectedTask.priority || 'Low'}
                </span>
              </div>
              
              {selectedTask.estimatedHours && (
                <div className="mb-4">
                  <span className="text-sm text-[#6B778C] dark:text-gray-300 font-medium">Estimated time:</span>
                  <span className="ml-2 text-sm text-[#172B4D] dark:text-white">
                    {selectedTask.estimatedHours} hours
                  </span>
                </div>
              )}
              
              {selectedTask.description && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-[#6B778C] dark:text-gray-300 mb-2">Description</h3>
                  <p className="text-sm text-[#172B4D] dark:text-white">{selectedTask.description}</p>
                </div>
              )}

              {selectedTask.implementation && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-[#6B778C] dark:text-gray-300 mb-2">Implementation Details</h3>
                  <p className="text-sm text-[#172B4D] dark:text-white whitespace-pre-line">{selectedTask.implementation}</p>
                </div>
              )}

              {selectedTask.acceptanceCriteria && selectedTask.acceptanceCriteria.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-[#6B778C] dark:text-gray-300 mb-2">Acceptance Criteria</h3>
                  <ul className="list-disc pl-5">
                    {selectedTask.acceptanceCriteria.map((criteria, index) => (
                      <li key={index} className="text-sm text-[#172B4D] dark:text-white mb-1">{criteria}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTask.dependencies && selectedTask.dependencies.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-[#6B778C] dark:text-gray-300 mb-2">Dependencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.dependencies.map((dep, index) => (
                      <span key={index} className="text-xs bg-[#DEEBFF] text-[#0052CC] px-2 py-1 rounded">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedTask.aiPrompt && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-[#6B778C] dark:text-gray-300 mb-2">AI Prompt</h3>
                  <div className="bg-[#F8F9FA] p-3 rounded border border-[#DFE1E6] dark:bg-gray-700">
                    <p className="text-sm text-[#172B4D] dark:text-white whitespace-pre-line">{selectedTask.aiPrompt}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <Button 
                  className="px-4 py-2 bg-[#6554C0] text-white rounded hover:bg-[#5243AA] text-sm font-medium"
                  onClick={() => setSelectedTask(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FeaturePlanView: React.FC<FeaturePlanViewProps> = ({ featurePlan }) => {
  const [activeView, setActiveView] = useState('developer')
  const [columns, setColumns] = useState<Column[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeSprint, setActiveSprint] = useState<number>(0)
  const [sprints, setSprints] = useState<any[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editMode, setEditMode] = useState<'developer' | 'ai'>('developer')
  const [editValue, setEditValue] = useState('')

  // Process feature plan data when view changes
  useEffect(() => {
    if (!featurePlan) return

    setIsLoading(true)
    
    try {
      const planData = activeView === 'developer' 
        ? featurePlan.developerPlan 
        : featurePlan.aiPlan
      
      // Ensure planData is properly structured
      if (!planData) {
        console.error('Plan data is undefined or null')
        setSprints([])
        setActiveSprint(0)
        setIsLoading(false)
        return
      }
      
      // Handle string planData by trying to parse it as JSON
      let processedPlanData = planData;
      if (typeof planData === 'string') {
        try {
          // Try to parse as JSON if it looks like JSON
          if (planData.trim().startsWith('{') || planData.trim().startsWith('[')) {
            processedPlanData = JSON.parse(planData);
          } else {
            // If it's just text, create a simple plan with one task
            processedPlanData = {
              tasks: [{ 
                id: '1', 
                title: 'Implement Feature', 
                description: planData 
              }]
            };
          }
        } catch (e) {
          // If parsing fails, create a plan with the string as the description
          console.warn('Failed to parse plan data as JSON, using as plain text');
          processedPlanData = {
            tasks: [{ 
              id: '1', 
              title: 'Implement Feature', 
              description: planData 
            }]
          };
        }
      }
      
      // Now process the data
      if (processedPlanData.sprints && Array.isArray(processedPlanData.sprints) && processedPlanData.sprints.length > 0) {
        // Ensure each sprint has a proper tasks array
        const formattedSprints = processedPlanData.sprints.map((sprint: any) => ({
          ...sprint,
          name: sprint.name || 'Unnamed Sprint',
          tasks: Array.isArray(sprint.tasks) ? sprint.tasks : []
        }))
        setSprints(formattedSprints)
        setActiveSprint(0) // Reset to first sprint when changing views
      } else {
        // Otherwise create a single "sprint" from task data
        const tasks = Array.isArray(processedPlanData.tasks) 
          ? processedPlanData.tasks 
          : processedPlanData.tasks 
            ? [processedPlanData.tasks].flat() // Handle case where tasks is an object or single item
            : [];
        
        // If tasks is not an array, try to convert it
        if (!Array.isArray(processedPlanData.tasks) && processedPlanData.tasks) {
          console.warn('Tasks is not an array, attempting to convert:', processedPlanData.tasks)
          try {
            // This is a fallback to handle cases where tasks might be an object or other non-array
            const fallbackTasks = typeof processedPlanData.tasks === 'object' 
              ? Object.entries(processedPlanData.tasks).map(([key, value]: [string, any]) => ({
                  id: key,
                  title: `Task ${key}`,
                  description: typeof value === 'string' ? value : JSON.stringify(value),
                }))
              : []
            
            const singleSprint = {
              name: "Feature Implementation",
              duration: "2 weeks",
              focus: "Implement all feature requirements",
              tasks: fallbackTasks
            }
            setSprints([singleSprint])
          } catch (conversionError) {
            console.error('Failed to convert tasks object:', conversionError)
            // Fallback to empty tasks array
            const singleSprint = {
              name: "Feature Implementation",
              duration: "2 weeks",
              focus: "Implement all feature requirements",
              tasks: []
            }
            setSprints([singleSprint])
          }
        } else {
          // Standard case with proper tasks array
          const singleSprint = {
            name: "Feature Implementation",
            duration: "2 weeks",
            focus: "Implement all feature requirements",
            tasks: tasks
          }
          setSprints([singleSprint])
        }
        setActiveSprint(0)
      }
    } catch (error) {
      console.error('Error processing feature plan data:', error)
      // Set up a fallback empty sprint
      setSprints([{
        name: "Feature Implementation",
        duration: "2 weeks",
        focus: "Implement all feature requirements",
        tasks: []
      }])
      setActiveSprint(0)
    } finally {
      setIsLoading(false)
    }
  }, [featurePlan, activeView])

  // Update columns when active sprint changes
  useEffect(() => {
    if (!sprints || sprints.length === 0) return

    try {
      const currentSprint = sprints[activeSprint]
      
      // Get tasks from the current sprint
      let allTasks: Task[] = []
      
      if (currentSprint && currentSprint.tasks && Array.isArray(currentSprint.tasks) && currentSprint.tasks.length > 0) {
        allTasks = currentSprint.tasks.map((task: any, taskIndex: number) => {
          const taskId = `${activeView === 'developer' ? 'DEV' : 'AI'}-${activeSprint > 0 ? `S${activeSprint + 1}-` : ''}T${taskIndex + 1}`
          
          // Ensure task is properly formed
          if (!task) {
            console.warn('Task is undefined or null at index', taskIndex)
            return {
              id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              content: `Task ${taskIndex + 1}`,
              isCompleted: false,
              taskId,
              status: 'todo',
            } as Task
          }
          
          // Prioritize title field, fallback to description only if title is empty
          const content = task.title || task.description || `Task ${taskIndex + 1}`;
          
          return {
            id: `task-${task.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`}`,
            content,
            isCompleted: false,
            taskId,
            description: typeof task.description === 'string' ? task.description : JSON.stringify(task.description),
            implementation: typeof task.implementation === 'string' ? task.implementation : JSON.stringify(task.implementation),
            sprintName: currentSprint.name,
            sprintId: sprints.length > 1 ? `S${activeSprint + 1}` : undefined,
            priority: task.priority || 'medium',
            estimatedHours: task.estimatedHours,
            dependencies: Array.isArray(task.dependencies) ? task.dependencies : [],
            acceptanceCriteria: Array.isArray(task.acceptanceCriteria) ? task.acceptanceCriteria : [],
            aiPrompt: typeof task.aiPrompt === 'string' ? task.aiPrompt : '',
            status: 'todo',
            type: task.type || 'task'
          } as Task
        })
      }
      
      // Distribute tasks to columns
      const todoTasks: Task[] = [...allTasks]
      const inProgressTasks: Task[] = []
      const doneTasks: Task[] = []
      
      setColumns([
        { id: 'todo', title: 'TO DO', tasks: todoTasks },
        { id: 'inprogress', title: 'IN PROGRESS', tasks: inProgressTasks },
        { id: 'done', title: 'DONE', tasks: doneTasks }
      ])
    } catch (error) {
      console.error('Error converting sprint data to board:', error)
      // Set up fallback columns with empty tasks
      setColumns([
        { id: 'todo', title: 'TO DO', tasks: [] },
        { id: 'inprogress', title: 'IN PROGRESS', tasks: [] },
        { id: 'done', title: 'DONE', tasks: [] }
      ])
    }
  }, [sprints, activeSprint, activeView])

  const handlePreviousSprint = () => {
    if (activeSprint > 0) {
      setActiveSprint(activeSprint - 1)
    }
  }

  const handleNextSprint = () => {
    if (activeSprint < sprints.length - 1) {
      setActiveSprint(activeSprint + 1)
    }
  }

  const handleSprintChange = (value: string) => {
    const sprintIndex = parseInt(value, 10)
    if (!isNaN(sprintIndex) && sprintIndex >= 0 && sprintIndex < sprints.length) {
      setActiveSprint(sprintIndex)
    }
  }

  const handleEdit = (mode: 'developer' | 'ai') => {
    setEditMode(mode)
    setShowEditModal(true)
  }

  const handleSave = () => {
    // Implement the logic to save the edited plan
    console.log('Saving', editMode, editValue)
    setShowEditModal(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 size={32} className="animate-spin text-[#6554C0]" />
      </div>
    )
  }

  const currentSprint = sprints[activeSprint] || {}

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <Tabs defaultValue="developer" className="w-full" onValueChange={setActiveView}>
            <div className="flex flex-wrap items-center justify-between">
              <TabsList className="grid grid-cols-2 w-[400px]">
                <TabsTrigger value="developer" className="flex items-center">
                  <User size={16} className="mr-2" />
                  Developer Plan
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center">
                  <Bot size={16} className="mr-2" />
                  AI Assistant Plan
                </TabsTrigger>
              </TabsList>
              
              {sprints.length > 1 && (
                <div className="w-[350px] mt-2 md:mt-0">
                  <Select value={activeSprint.toString()} onValueChange={handleSprintChange}>
                    <SelectTrigger className="w-full truncate">
                      <div className="flex items-center w-full truncate">
                        <span className="truncate text-sm font-medium">
                          {currentSprint.name || 'Select a sprint'}
                        </span>
                        {currentSprint.duration && (
                          <span className="ml-2 flex-shrink-0 text-xs text-[#6B778C] dark:text-gray-400 inline-flex items-center">
                            <Clock size={12} className="mr-1" />
                            {currentSprint.duration}
                          </span>
                        )}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="w-[350px]">
                      {sprints.map((sprint, index) => (
                        <SelectItem key={index} value={index.toString()} className="w-full">
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate">{sprint.name}</span>
                            {index === activeSprint && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded ml-2 flex-shrink-0">
                                Current
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <TabsContent value="developer" className="mt-6">
              {sprints.length > 0 ? (
                <div>
                  {/* Tab heading */}
                  <h3 className="text-lg font-medium text-[#172B4D] dark:text-white mb-4">Developer Implementation Plan</h3>
                  
                  {/* Sprint Information Card - Only show for multi-sprint view */}
                  {sprints.length > 1 && currentSprint.focus && (
                    <Card className="mb-4">
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-md">{currentSprint.name}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Target size={14} className="mr-1" />
                              {currentSprint.focus}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#6B778C] dark:text-gray-400">
                            <span className="bg-[#DFE1E6] text-[#42526E] px-2 py-1 rounded text-xs">
                              {activeSprint + 1} of {sprints.length}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )}
                  
                  {/* Sprint Board */}
                  <div className="border border-[#DFE1E6] rounded-md" style={{ height: 'calc(100vh - 350px)', minHeight: '500px' }}>
                    <EnhancedJiraBoard columns={columns} setColumns={setColumns} />
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 flex justify-center">
                    <p className="text-[#6B778C] dark:text-gray-400">No tasks available for this feature plan</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="ai" className="mt-6">
              {sprints.length > 0 ? (
                <div>
                  {/* Tab heading */}
                  <h3 className="text-lg font-medium text-[#172B4D] dark:text-white mb-4">AI-Assisted Implementation Plan</h3>
                  
                  {/* Sprint Information Card - Only show for multi-sprint view */}
                  {sprints.length > 1 && currentSprint.focus && (
                    <Card className="mb-4">
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-md">{currentSprint.name}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Target size={14} className="mr-1" />
                              {currentSprint.focus}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#6B778C] dark:text-gray-400">
                            <span className="bg-[#DFE1E6] text-[#42526E] px-2 py-1 rounded text-xs">
                              {activeSprint + 1} of {sprints.length}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )}
                  
                  {/* Sprint Board */}
                  <div className="border border-[#DFE1E6] rounded-md" style={{ height: 'calc(100vh - 350px)', minHeight: '500px' }}>
                    <EnhancedJiraBoard columns={columns} setColumns={setColumns} />
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 flex justify-center">
                    <p className="text-[#6B778C] dark:text-gray-400">No tasks available for this feature plan</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main board content */}
      <div className="flex p-4 bg-white dark:bg-gray-800 w-full h-full">
        {/* Columns */}
        <div className="flex w-full space-x-4">
          {/* Original Plan Column */}
          <div className="flex-1 min-w-[300px]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-medium text-[#172B4D] dark:text-white">
                Feature Details
              </h3>
            </div>
            
            <div className="p-3 bg-[#F4F5F7] dark:bg-gray-700 rounded-sm">
              <h4 className="font-medium text-[#172B4D] dark:text-white mb-2">{featurePlan?.feature.title}</h4>
              <p className="text-sm text-[#42526E] dark:text-gray-300 mb-3">{featurePlan?.feature.description}</p>
              
              {/* Display the feature card */}
              <div 
                className={`bg-white dark:bg-gray-800 border rounded-sm shadow-sm p-3 cursor-move hover:bg-[#F4F5F7] dark:hover:bg-gray-700
                  border-l-4 border-l-[#6554C0] border-t border-r border-b border-[#DFE1E6] dark:border-gray-700`
                }
              >
                <div className="mb-2 flex justify-between">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-sm bg-[#6554C0] flex items-center justify-center mr-2">
                      <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <button className="text-[#6B778C] dark:text-gray-400">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-2">
                  <h3 className="text-sm text-[#172B4D] dark:text-white font-medium">
                    {featurePlan?.feature.title}
                  </h3>
                </div>
                
                <div className="text-xs text-[#6B778C] dark:text-gray-400 flex justify-between">
                  <div>FEAT-{featurePlan?.id?.substring(0, 5)}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Developer Plan Column */}
          <div className="flex-1 min-w-[300px]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-medium text-[#172B4D] dark:text-white">
                Developer Plan
              </h3>
              <button 
                className="text-[#6B778C] dark:text-gray-400 hover:text-[#42526E] dark:hover:text-gray-300 p-1 rounded-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700"
                onClick={() => handleEdit('developer')}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-3 bg-[#F4F5F7] dark:bg-gray-700 rounded-sm max-h-[calc(100vh-220px)] overflow-y-auto">
              {featurePlan?.developerPlan ? (
                <div className="text-sm whitespace-pre-wrap text-[#172B4D] dark:text-white">
                  {typeof featurePlan.developerPlan === 'string' 
                    ? featurePlan.developerPlan 
                    : typeof featurePlan.developerPlan === 'object' 
                      ? JSON.stringify(featurePlan.developerPlan, null, 2)
                      : String(featurePlan.developerPlan)}
                </div>
              ) : (
                <div className="text-sm text-[#6B778C] dark:text-gray-400 italic">
                  No developer plan yet. Click the edit icon to add one.
                </div>
              )}
            </div>
          </div>
          
          {/* AI Plan Column */}
          <div className="flex-1 min-w-[300px]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-medium text-[#172B4D] dark:text-white">
                AI Plan
              </h3>
              <button 
                className="text-[#6B778C] dark:text-gray-400 hover:text-[#42526E] dark:hover:text-gray-300 p-1 rounded-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700"
                onClick={() => handleEdit('ai')}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-3 bg-[#F4F5F7] dark:bg-gray-700 rounded-sm max-h-[calc(100vh-220px)] overflow-y-auto">
              {featurePlan?.aiPlan ? (
                <div className="text-sm whitespace-pre-wrap text-[#172B4D] dark:text-white">
                  {typeof featurePlan.aiPlan === 'string' 
                    ? featurePlan.aiPlan 
                    : typeof featurePlan.aiPlan === 'object' 
                      ? JSON.stringify(featurePlan.aiPlan, null, 2)
                      : String(featurePlan.aiPlan)}
                </div>
              ) : (
                <div className="text-sm text-[#6B778C] dark:text-gray-400 italic">
                  No AI plan yet. Click the edit icon to add one.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-[#DFE1E6] dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-[#172B4D] dark:text-white">
                Edit {editMode === 'developer' ? 'Developer' : 'AI'} Plan
              </h2>
              <button 
                className="text-[#6B778C] dark:text-gray-400 hover:text-[#42526E] dark:hover:text-gray-300"
                onClick={() => setShowEditModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <textarea 
                className="w-full h-[60vh] border border-[#DFE1E6] dark:border-gray-700 rounded-sm p-3 text-[#172B4D] dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] dark:focus:ring-blue-500"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Enter ${editMode === 'developer' ? 'developer' : 'AI'} plan...`}
              />
            </div>
            
            <div className="p-4 border-t border-[#DFE1E6] dark:border-gray-700 flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-[#EBECF0] dark:bg-gray-700 text-[#42526E] dark:text-gray-300 rounded-sm hover:bg-[#DFE1E6] dark:hover:bg-gray-600"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-[#0052CC] dark:bg-blue-600 text-white rounded-sm hover:bg-[#0065FF] dark:hover:bg-blue-500"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeaturePlanView 