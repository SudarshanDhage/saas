"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Star, TrendingUp, DollarSign, Zap, Users, Shield, Code2 } from 'lucide-react'

interface TechStackItem {
  name: string
  recommended: boolean
  reason: string
  fitScore?: number
  learningCurve?: string
  communitySupport?: string
  scalability?: string
  cost?: string
  maturity?: string
  deploymentComplexity?: string
  performance?: string
  bestFor?: string
  considerations?: string
}

interface TechStackCategory {
  items: TechStackItem[]
  selected: string
}

interface TechStackData {
  [key: string]: TechStackItem[]
}

interface AdditionalTool {
  category: string
  name: string
  recommended: boolean
  reason: string
  priority?: string
  implementationPhase?: string
}

interface TechStackSelectionProps {
  techStackData: TechStackData
  selections: Record<string, string>
  onSelectionChange: (category: string, selection: string) => void
}

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  frontend: <Code2 className="h-5 w-5 text-blue-500" />,
  backend: <Shield className="h-5 w-5 text-green-500" />,
  database: <TrendingUp className="h-5 w-5 text-purple-500" />,
  authentication: <Users className="h-5 w-5 text-yellow-500" />,
  stateManagement: <Zap className="h-5 w-5 text-cyan-500" />,
  realTimeCommunication: <Zap className="h-5 w-5 text-red-500" />,
  fileStorage: <TrendingUp className="h-5 w-5 text-indigo-500" />,
  paymentProcessing: <DollarSign className="h-5 w-5 text-green-600" />,
  searchEngine: <TrendingUp className="h-5 w-5 text-orange-500" />,
  messageQueue: <Zap className="h-5 w-5 text-pink-500" />,
  caching: <TrendingUp className="h-5 w-5 text-gray-500" />,
  monitoring: <Shield className="h-5 w-5 text-slate-500" />,
  emailServices: <Users className="h-5 w-5 text-blue-600" />,
  mobileFramework: <Code2 className="h-5 w-5 text-purple-600" />,
  testingFrameworks: <Shield className="h-5 w-5 text-teal-500" />,
  containerization: <TrendingUp className="h-5 w-5 text-blue-700" />,
  cicd: <Zap className="h-5 w-5 text-orange-600" />,
  security: <Shield className="h-5 w-5 text-red-600" />,
  additionalTools: <Code2 className="h-5 w-5 text-slate-600" />
}

const TechStackSelection: React.FC<TechStackSelectionProps> = ({
  techStackData,
  selections,
  onSelectionChange
}) => {
  // Separate additional tools from main categories
  const mainCategories = Object.keys(techStackData).filter(key => key !== 'additionalTools')
  const additionalTools = techStackData.additionalTools as AdditionalTool[] || []

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Select Technology Stack</h2>
      
      {/* Main Technology Categories */}
      {mainCategories.map(category => (
        <div key={category} className="mb-6">
          <div className="flex items-center mb-3">
            {categoryIcons[category] || <Code2 className="h-5 w-5 text-slate-500" />}
            <h3 className="text-md font-medium text-slate-900 dark:text-white ml-2 capitalize">
              {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStackData[category].map(item => {
              const isSelected = selections[category] === item.name
              return (
                <Card 
                  key={item.name}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected ? 'border-blue-600 dark:border-blue-400 ring-2 ring-blue-600/20 dark:ring-blue-400/20 shadow-lg' : 'hover:border-blue-600 dark:hover:border-blue-400 hover:shadow-md'
                  }`}
                  onClick={() => onSelectionChange(category, item.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</h4>
                          <div className="flex items-center ml-2 space-x-1">
                            {item.recommended && (
                              <div className="text-yellow-600 dark:text-yellow-400">
                                <Star size={14} fill="currentColor" />
                              </div>
                            )}
                            {item.fitScore && (
                              <span className="px-1.5 py-0.5 text-[9px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-medium">
                                {item.fitScore}%
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{item.reason}</p>
                        
                        {/* Enhanced metrics display */}
                        {(item.learningCurve || item.scalability || item.cost || item.performance) && (
                          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                            {item.learningCurve && (
                              <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Learning:</span>
                                <span className={`font-medium ${
                                  item.learningCurve === 'beginner' ? 'text-green-600 dark:text-green-400' :
                                  item.learningCurve === 'intermediate' ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-red-600 dark:text-red-400'
                                }`}>
                                  {item.learningCurve}
                                </span>
                              </div>
                            )}
                            {item.scalability && (
                              <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Scale:</span>
                                <span className={`font-medium ${
                                  item.scalability === 'high' || item.scalability === 'enterprise' ? 'text-green-600 dark:text-green-400' :
                                  item.scalability === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-red-600 dark:text-red-400'
                                }`}>
                                  {item.scalability}
                                </span>
                              </div>
                            )}
                            {item.cost && (
                              <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Cost:</span>
                                <span className={`font-medium ${
                                  item.cost === 'free' ? 'text-green-600 dark:text-green-400' :
                                  item.cost === 'low' ? 'text-blue-600 dark:text-blue-400' :
                                  item.cost === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-red-600 dark:text-red-400'
                                }`}>
                                  {item.cost}
                                </span>
                              </div>
                            )}
                            {item.performance && (
                              <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Perf:</span>
                                <span className={`font-medium ${
                                  item.performance === 'excellent' || item.performance === 'exceptional' ? 'text-green-600 dark:text-green-400' :
                                  item.performance === 'good' ? 'text-blue-600 dark:text-blue-400' :
                                  'text-yellow-600 dark:text-yellow-400'
                                }`}>
                                  {item.performance}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Best for section */}
                        {item.bestFor && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-green-700 dark:text-green-300">Best for:</span>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">{item.bestFor}</p>
                          </div>
                        )}
                        
                        {/* Considerations */}
                        {item.considerations && (
                          <div>
                            <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Consider:</span>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">{item.considerations}</p>
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <div className="text-blue-600 dark:text-blue-400 ml-2">
                          <Check size={18} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
      
      {/* Additional Tools Section */}
      {additionalTools.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center mb-4">
            <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-md font-medium text-slate-900 dark:text-white ml-2">
              Recommended Additional Tools & Services
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalTools.map((tool, index) => (
              <Card key={index} className="border-l-4 border-l-purple-600 dark:border-l-purple-400">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white">{tool.name}</h4>
                        {tool.category && (
                          <span className="ml-2 px-1.5 py-0.5 text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                            {tool.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{tool.reason}</p>
                      <div className="flex items-center space-x-2">
                        {tool.priority && (
                          <span className={`px-2 py-1 text-[10px] rounded ${
                            tool.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                            tool.priority === 'important' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }`}>
                            {tool.priority}
                          </span>
                        )}
                        {tool.implementationPhase && (
                          <span className="px-2 py-1 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">
                            {tool.implementationPhase}
                          </span>
                        )}
                      </div>
                    </div>
                    {tool.recommended && (
                      <div className="text-purple-600 dark:text-purple-400 ml-2">
                        <Star size={16} fill="currentColor" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TechStackSelection 