"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Code, PencilRuler, BarChart3, Briefcase, Target, GitBranch, ArrowRight, CheckCircle, LayoutDashboard, FileCode, ChevronRight, Users, Workflow, Trello, Clock, Zap } from 'lucide-react'

interface ProjectType {
  id: string
  name: string
  description: string
}

interface ProductRole {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  color: string
}

interface DevelopmentTask {
  id: string
  title: string
  description: string
  estimatedDays: number
  complexity: 'low' | 'medium' | 'high'
  skills: string[]
  completed?: boolean
  status?: 'planning' | 'in-progress' | 'review' | 'completed'
}

interface DevelopmentPlan {
  projectId: string
  roleId: string
  tasks: DevelopmentTask[]
}

export default function PersonalizedDevPlan() {
  const [selectedProject, setSelectedProject] = useState<string>('saas')
  const [selectedRole, setSelectedRole] = useState<string>('frontend')
  
  // Sample project types
  const projectTypes: ProjectType[] = [
    {
      id: 'saas',
      name: 'SaaS Platform',
      description: 'Subscription-based software solution with multi-tenant architecture'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Online store with product catalog, cart, and checkout functionality'
    },
    {
      id: 'mobile',
      name: 'Mobile App',
      description: 'Cross-platform application with responsive design and native features'
    }
  ]
  
  // Sample product roles
  const productRoles: ProductRole[] = [
    {
      id: 'frontend',
      name: 'Frontend Developer',
      icon: <Code className="w-5 h-5" />,
      description: 'UI implementation, state management, and client-side functionality',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    },
    {
      id: 'backend',
      name: 'Backend Developer',
      icon: <GitBranch className="w-5 h-5" />,
      description: 'APIs, server logic, database operations, and infrastructure',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    },
    {
      id: 'designer',
      name: 'UI/UX Designer',
      icon: <PencilRuler className="w-5 h-5" />,
      description: 'User interfaces, workflows, and visual experience design',
      color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
    },
    {
      id: 'product',
      name: 'Product Manager',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Feature scope, prioritization, and coordinating development',
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    },
    {
      id: 'data',
      name: 'Data Engineer',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Data pipelines, analytics, and metrics implementation',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    }
  ]
  
  // Sample development plans
  const developmentPlans: DevelopmentPlan[] = [
    {
      projectId: 'saas',
      roleId: 'frontend',
      tasks: [
        {
          id: 'sf-1',
          title: 'Authentication Flow Implementation',
          description: 'Build secure login, registration, and password reset interfaces with validation',
          estimatedDays: 5,
          complexity: 'medium',
          skills: ['React', 'NextAuth.js', 'Form Validation', 'State Management'],
          status: 'completed',
          completed: true
        },
        {
          id: 'sf-2',
          title: 'Dashboard UI Components',
          description: 'Create responsive dashboard layout with navigation, cards, and data visualization',
          estimatedDays: 7,
          complexity: 'medium',
          skills: ['TailwindCSS', 'Component Design', 'Responsive Layout', 'Chart.js'],
          status: 'completed',
          completed: true
        },
        {
          id: 'sf-3',
          title: 'Subscription Management Interface',
          description: 'Build user subscription management screens with plan selection and payment integration',
          estimatedDays: 6,
          complexity: 'high',
          skills: ['Payment API', 'State Management', 'Form Handling'],
          status: 'in-progress',
          completed: false
        },
        {
          id: 'sf-4',
          title: 'User Settings & Profile',
          description: 'Implement user profile management with avatar upload and preferences',
          estimatedDays: 4,
          complexity: 'medium',
          skills: ['File Upload', 'Form Validation', 'API Integration'],
          status: 'planning',
          completed: false
        },
        {
          id: 'sf-5',
          title: 'Team Collaboration Features',
          description: 'Create interfaces for team management, permissions, and shared workspaces',
          estimatedDays: 8,
          complexity: 'high',
          skills: ['Complex State', 'Role-based UI', 'Real-time Updates'],
          status: 'planning',
          completed: false
        }
      ]
    },
    {
      projectId: 'ecommerce',
      roleId: 'frontend',
      tasks: [
        {
          id: 'ef-1',
          title: 'Product Catalog Implementation',
          description: 'Build responsive product grid with filtering, sorting, and search functionality',
          estimatedDays: 6,
          complexity: 'medium',
          skills: ['Grid Layout', 'Filtering Logic', 'Search Implementation'],
          status: 'in-progress',
          completed: false
        },
        {
          id: 'ef-2',
          title: 'Shopping Cart Development',
          description: 'Create full cart management system with persistent state',
          estimatedDays: 5,
          complexity: 'high',
          skills: ['State Management', 'LocalStorage', 'Cart Calculations'],
          status: 'planning',
          completed: false
        },
        {
          id: 'ef-3',
          title: 'Checkout Process Flow',
          description: 'Build multi-step checkout with address, shipping, and payment steps',
          estimatedDays: 7,
          complexity: 'high',
          skills: ['Multi-step Form', 'Validation', 'Payment Processing'],
          status: 'planning',
          completed: false
        }
      ]
    }
  ]
  
  // Get the current development plan based on selected project and role
  const currentPlan = developmentPlans.find(
    plan => plan.projectId === selectedProject && plan.roleId === selectedRole
  ) || developmentPlans[0] // Fallback to first plan
  
  // Calculate progress percentage
  const completedTasks = currentPlan.tasks.filter(task => task.completed).length
  const progressPercentage = (completedTasks / currentPlan.tasks.length) * 100
  
  // Group tasks by status
  const tasksByStatus = {
    planning: currentPlan.tasks.filter(task => task.status === 'planning'),
    'in-progress': currentPlan.tasks.filter(task => task.status === 'in-progress'),
    review: currentPlan.tasks.filter(task => task.status === 'review'),
    completed: currentPlan.tasks.filter(task => task.status === 'completed')
  }
  
  // Calculate total estimate (in days)
  const totalEstimate = currentPlan.tasks.reduce((total, task) => total + task.estimatedDays, 0)
  
  // Status color mapping
  const statusColors = {
    planning: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    review: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  }
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
            Personalized Development Plans
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            AI-generated project roadmaps tailored to your specific role and project type.
            Get a structured development plan with prioritized tasks and technical requirements.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Project & Role Selection */}
          <div className="md:col-span-1 space-y-6">
            {/* Project Type selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Project Type
              </h3>
              <div className="space-y-3">
                {projectTypes.map(project => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors border ${
                      selectedProject === project.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`p-2 rounded-md ${selectedProject === project.id ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div className="ml-3 text-left">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{project.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Role selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Your Role
              </h3>
              <div className="space-y-3">
                {productRoles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors border ${
                      selectedRole === role.id
                        ? `${role.color} border-slate-200 dark:border-slate-700`
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`p-2 rounded-md ${selectedRole === role.id ? 'bg-white/60 dark:bg-slate-800/60' : ''}`}>
                      {role.icon}
                    </div>
                    <div className="ml-3 text-left">
                      <h4 className="font-medium">{role.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Development Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                Plan Overview
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-700 dark:text-slate-300">Completion</span>
                    <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {completedTasks} of {currentPlan.tasks.length} tasks completed
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {totalEstimate}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Total Days
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {Object.keys(tasksByStatus).filter(status => tasksByStatus[status as keyof typeof tasksByStatus].length > 0).length}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Active Phases
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Development Plan Content */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-medium flex items-center">
                    <span className="mr-2">
                      {productRoles.find(role => role.id === selectedRole)?.name || 'Developer'} Plan:
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {projectTypes.find(project => project.id === selectedProject)?.name || 'Project'}
                    </span>
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Organized implementation roadmap with technical requirements and timeline
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md text-sm font-medium flex items-center">
                    <Workflow className="w-4 h-4 mr-1.5" /> 
                    View Timeline
                  </button>
                </div>
              </div>
              
              {/* Development Board */}
              <div className="space-y-6">
                {/* Sprint/Phase display */}
                <div className="flex flex-col md:flex-row gap-4 pb-4 overflow-x-auto">
                  {Object.entries(tasksByStatus).map(([status, tasks]) => tasks.length > 0 && (
                    <div key={status} className="min-w-[280px] flex-1">
                      <div className={`flex items-center px-3 py-2 rounded-t-lg ${
                        status === 'planning' ? 'bg-slate-100 dark:bg-slate-800' :
                        status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        status === 'review' ? 'bg-amber-100 dark:bg-amber-900/30' :
                        'bg-green-100 dark:bg-green-900/30'
                      }`}>
                        <span className="text-sm font-medium capitalize">
                          {status === 'in-progress' ? 'In Progress' : status}
                        </span>
                        <span className="ml-2 px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded-full text-xs">
                          {tasks.length}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mt-3">
                        {tasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 shadow-sm"
                          >
                            <div className="flex items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-medium">{task.title}</h4>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    task.complexity === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                    task.complexity === 'medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                  }`}>
                                    {task.complexity}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{task.description}</p>
                                
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {task.skills.map((skill, i) => (
                                    <span 
                                      key={i}
                                      className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                                
                                <div className="mt-4 flex items-center justify-between">
                                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                                    <Clock className="w-4 h-4 mr-1.5" />
                                    {task.estimatedDays} days
                                  </span>
                                  <button className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline">
                                    {task.status === 'completed' ? 'View details' : 'Start task'} 
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* AI Recommendation */}
              <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-100 dark:border-blue-800/50">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Zap className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      AI Recommendation
                    </h4>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Based on your project type and role, we recommend focusing on <strong>Subscription Management Interface</strong> next. 
                      Complete this task before moving to User Settings to ensure a cohesive payment and profile workflow.
                    </p>
                    <div className="mt-3">
                      <button className="inline-flex items-center px-3 py-1.5 border border-blue-300 dark:border-blue-700 rounded-md bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 text-sm font-medium">
                        Generate Technical Requirements <FileCode className="ml-1.5 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 