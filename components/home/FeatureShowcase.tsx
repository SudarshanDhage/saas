"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Layers, Rocket, Users, Zap } from 'lucide-react'

interface FeatureStep {
  title: string
  description: string
  icon: React.ReactNode
  status: 'completed' | 'in-progress' | 'upcoming'
}

const sprintSteps: FeatureStep[] = [
  {
    title: 'Define Project Goals',
    description: 'Set objectives and key outcomes',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    status: 'completed'
  },
  {
    title: 'Generate Sprint Plan',
    description: 'AI creates tasks and timeline',
    icon: <Rocket className="h-5 w-5 text-blue-500" />,
    status: 'in-progress'
  },
  {
    title: 'Assign Resources',
    description: 'Distribute tasks to team members',
    icon: <Users className="h-5 w-5 text-purple-500" />,
    status: 'upcoming'
  },
  {
    title: 'Track Progress',
    description: 'Monitor sprint completion',
    icon: <Layers className="h-5 w-5 text-orange-500" />,
    status: 'upcoming'
  }
];

const featureSteps: FeatureStep[] = [
  {
    title: 'Feature Request',
    description: 'Capture feature requirements',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    status: 'completed'
  },
  {
    title: 'AI Analysis',
    description: 'Technical feasibility assessment',
    icon: <Zap className="h-5 w-5 text-blue-500" />,
    status: 'in-progress'
  },
  {
    title: 'Implementation Plan',
    description: 'Development roadmap creation',
    icon: <Layers className="h-5 w-5 text-purple-500" />,
    status: 'upcoming'
  },
  {
    title: 'Delivery Schedule',
    description: 'Timeline and milestone planning',
    icon: <Rocket className="h-5 w-5 text-orange-500" />,
    status: 'upcoming'
  }
];

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState('sprint')
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="sprint">Sprint Planning</TabsTrigger>
            <TabsTrigger value="feature">Feature Planning</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="sprint" className="mt-0">
          <Card className="border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="ml-2 font-medium">New Product Launch</span>
              </div>
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                Sprint Plan
              </Badge>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-900">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sprint Timeline</h3>
                  <div className="space-y-4">
                    {sprintSteps.map((step, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 mr-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                            step.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            {step.icon}
                          </div>
                          {index < sprintSteps.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 ml-4"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{step.title}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
                          {step.status === 'in-progress' && (
                            <Badge className="mt-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-none">
                              In Progress
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sprint Details</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <p className="text-sm font-medium">AI-Generated Summary</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        This 2-week sprint focuses on delivering the core features for the product launch,
                        including user authentication, dashboard interface, and initial reporting capabilities.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Sprint Duration</p>
                        <p className="font-medium">2 Weeks</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Team Size</p>
                        <p className="font-medium">5 Members</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Story Points</p>
                        <p className="font-medium">32 Points</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Completion</p>
                        <p className="font-medium">25%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="feature" className="mt-0">
          <Card className="border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="ml-2 font-medium">User Authentication System</span>
              </div>
              <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                Feature Plan
              </Badge>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-900">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Implementation Steps</h3>
                  <div className="space-y-4">
                    {featureSteps.map((step, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 mr-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                            step.status === 'in-progress' ? 'bg-purple-100 dark:bg-purple-900/30' :
                            'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            {step.icon}
                          </div>
                          {index < featureSteps.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 ml-4"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{step.title}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
                          {step.status === 'in-progress' && (
                            <Badge className="mt-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-none">
                              In Progress
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Feature Specifications</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <p className="text-sm font-medium">AI-Generated Requirements</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        Secure authentication system with email/password login, social login options,
                        password recovery, and multi-factor authentication capabilities.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>User registration flow</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Email verification</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="h-4 w-4 border-2 border-slate-300 dark:border-slate-600 rounded-full mr-2"></div>
                        <span className="text-slate-600 dark:text-slate-400">Password reset functionality</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="h-4 w-4 border-2 border-slate-300 dark:border-slate-600 rounded-full mr-2"></div>
                        <span className="text-slate-600 dark:text-slate-400">OAuth integration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 