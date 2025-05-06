'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CostEstimation } from '@/lib/firestore'
import { Loader2, DollarSign, TrendingUp, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

// Define types for item structures
interface CostBreakdownItem {
  service: string;
  tier: string;
  cost: string;
  description: string;
}

interface OptimizationStrategy {
  name: string;
  description: string;
  potentialSavings: string;
  tradeoffs: string;
  applicableScales: string[];
}

interface CostEstimationViewProps {
  costEstimation: CostEstimation | null
  isLoading?: boolean
  projectId?: string
}

const CostEstimationView: React.FC<CostEstimationViewProps> = ({ 
  costEstimation, 
  isLoading = false,
  projectId 
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [expandedStrategies, setExpandedStrategies] = useState<Record<number, boolean>>({})
  
  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }))
  }
  
  // Toggle strategy expansion
  const toggleStrategy = (index: number) => {
    setExpandedStrategies(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Loading cost estimation...
          </p>
        </CardContent>
      </Card>
    )
  }
  
  if (!costEstimation) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center py-8">
          <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Cost Estimation Available</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Cost estimation data is not available for this project.
          </p>
          {projectId && (
            <Button disabled className="mx-auto">
              Generate Cost Estimation
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }
  
  // Format cost string to be more readable
  const formatCost = (costString: string | undefined | null) => {
    if (!costString || typeof costString !== 'string') {
      return '$0'; // Return a default value if invalid
    }
    return costString.replace('₹', '₹ ');
  }
  
  // Helper function to safely render array items that might be objects
  const renderArrayItem = (item: any) => {
    if (typeof item === 'string') {
      return item;
    }
    if (item && typeof item === 'object') {
      // Handle cost objects with setup, monthly, annual properties
      if (item.monthly || item.setup || item.annual) {
        const parts = [];
        if (item.monthly) parts.push(`Monthly: ${item.monthly}`);
        if (item.annual) parts.push(`Annual: ${item.annual}`);
        if (item.setup) parts.push(`Setup: ${item.setup}`);
        return parts.join(', ');
      }
      
      // If it's an object with known properties (like majorCostDrivers items)
      if (item.component && item.percentage) {
        return `${item.component} (${item.percentage}): ${item.rationale}`;
      }
      
      // For other objects, try to extract the most meaningful properties
      const mainProps = ['name', 'description', 'title', 'text', 'value'];
      for (const prop of mainProps) {
        if (item[prop] && typeof item[prop] === 'string') {
          return item[prop];
        }
      }
      
      // As a fallback, return JSON string representation
      try {
        return JSON.stringify(item);
      } catch (e) {
        return 'Complex object';
      }
    }
    
    // For null, undefined, or other non-string primitives
    return String(item || '');
  }
  
  // Helper function to format cost object or string
  const formatCategoryConstValue = (cost: any) => {
    if (!cost) return '$0';
    
    if (typeof cost === 'string') {
      return cost;
    }
    
    if (typeof cost === 'object') {
      // If it's a cost object with monthly property
      if (cost.monthly) {
        return cost.monthly;
      }
      
      // If it's a nested cost object with setup/monthly/annual
      if (cost.cost && typeof cost.cost === 'object') {
        return cost.cost.monthly || cost.cost.annual || cost.cost.setup || '$0';
      }
      
      // Try to get any property that might contain the cost value
      for (const key of ['value', 'amount', 'total']) {
        if (cost[key]) return cost[key];
      }
      
      // If nothing works, convert to string
      try {
        return JSON.stringify(cost);
      } catch (e) {
        return '$0';
      }
    }
    
    return '$0';
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" /> 
            Infrastructure & Operational Costs
          </CardTitle>
          <CardDescription>
            Estimated costs at different scale levels, excluding personnel and development costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="breakdown">Detailed Breakdown</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-green-500">
                  <CardContent className="p-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Early Stage</div>
                    <div className="text-lg font-semibold mt-1">{formatCost(costEstimation?.overview?.totalCostSmallScale)}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">Up to 100 users</div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-blue-500">
                  <CardContent className="p-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Growth Stage</div>
                    <div className="text-lg font-semibold mt-1">{formatCost(costEstimation?.overview?.totalCostMediumScale)}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">Up to 5,000 users</div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-purple-500">
                  <CardContent className="p-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Scaled Stage</div>
                    <div className="text-lg font-semibold mt-1">{formatCost(costEstimation?.overview?.totalCostLargeScale)}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">10,000+ users</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mt-4">
                <h3 className="text-sm font-medium mb-2">Executive Summary</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{costEstimation?.overview?.summary}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Major Cost Drivers</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  {costEstimation?.overview?.majorCostDrivers?.map((driver, index) => (
                    <li key={index}>{renderArrayItem(driver)}</li>
                  )) || <li>No major cost drivers identified</li>}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Development Environment</h3>
                  <div className="text-md font-semibold">
                    {renderArrayItem(costEstimation?.environmentCosts?.development?.cost?.monthly) || 
                     renderArrayItem(costEstimation?.environmentCosts?.development) || '$0'}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Staging Environment</h3>
                  <div className="text-md font-semibold">
                    {renderArrayItem(costEstimation?.environmentCosts?.staging?.cost?.monthly) || 
                     renderArrayItem(costEstimation?.environmentCosts?.staging) || '$0'}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Detailed Breakdown Tab */}
            <TabsContent value="breakdown" className="space-y-6">
              {(costEstimation?.costCategories || []).map((category, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div 
                    className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 cursor-pointer"
                    onClick={() => toggleCategory(category.name)}
                  >
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{category.description}</p>
                    </div>
                    {expandedCategories[category.name] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  
                  {expandedCategories[category.name] && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <h4 className="text-xs uppercase text-green-700 dark:text-green-400 font-medium">Small Scale</h4>
                          <div className="text-sm font-medium mt-1">
                            {formatCategoryConstValue(category?.smallScale?.cost) || '$0'}
                          </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <h4 className="text-xs uppercase text-blue-700 dark:text-blue-400 font-medium">Medium Scale</h4>
                          <div className="text-sm font-medium mt-1">
                            {formatCategoryConstValue(category?.mediumScale?.cost) || '$0'}
                          </div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                          <h4 className="text-xs uppercase text-purple-700 dark:text-purple-400 font-medium">Large Scale</h4>
                          <div className="text-sm font-medium mt-1">
                            {formatCategoryConstValue(category?.largeScale?.cost) || '$0'}
                          </div>
                        </div>
                      </div>
                      
                      <Tabs defaultValue="small" className="w-full">
                        <TabsList className="grid grid-cols-3">
                          <TabsTrigger value="small">Small Scale</TabsTrigger>
                          <TabsTrigger value="medium">Medium Scale</TabsTrigger>
                          <TabsTrigger value="large">Large Scale</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="small" className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Cost Breakdown</h4>
                          <div className="space-y-2">
                            {(category?.smallScale?.breakdown || []).map((item: CostBreakdownItem, idx: number) => (
                              <div key={idx} className="text-sm border-b pb-2">
                                <div className="flex justify-between">
                                  <div className="font-medium">{item.service}</div>
                                  <div>{renderArrayItem(item.cost)}</div>
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">Tier: {item.tier}</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">{item.description}</div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-1">Reasoning</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{category?.smallScale?.reasoning || 'No reasoning provided'}</p>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="medium" className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Cost Breakdown</h4>
                          <div className="space-y-2">
                            {(category?.mediumScale?.breakdown || []).map((item: CostBreakdownItem, idx: number) => (
                              <div key={idx} className="text-sm border-b pb-2">
                                <div className="flex justify-between">
                                  <div className="font-medium">{item.service}</div>
                                  <div>{renderArrayItem(item.cost)}</div>
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">Tier: {item.tier}</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">{item.description}</div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-1">Reasoning</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{category?.mediumScale?.reasoning || 'No reasoning provided'}</p>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="large" className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Cost Breakdown</h4>
                          <div className="space-y-2">
                            {(category?.largeScale?.breakdown || []).map((item: CostBreakdownItem, idx: number) => (
                              <div key={idx} className="text-sm border-b pb-2">
                                <div className="flex justify-between">
                                  <div className="font-medium">{item.service}</div>
                                  <div>{renderArrayItem(item.cost)}</div>
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">Tier: {item.tier}</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400">{item.description}</div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-1">Reasoning</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{category?.largeScale?.reasoning || 'No reasoning provided'}</p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            
            {/* Optimization Tab */}
            <TabsContent value="optimization" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Cost Optimization Strategies</h3>
                <div className="space-y-3">
                  {(costEstimation?.optimizationStrategies || []).map((strategy, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div 
                        className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 cursor-pointer"
                        onClick={() => toggleStrategy(index)}
                      >
                        <div>
                          <h4 className="font-medium">{strategy.name}</h4>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            Potential Savings: <span className="text-green-600 font-medium">
                              {typeof strategy.potentialSavings === 'object' 
                                ? `${strategy.potentialSavings?.amount || ''} (${strategy.potentialSavings?.percentage || ''})`
                                : strategy.potentialSavings}
                            </span>
                          </div>
                        </div>
                        {expandedStrategies[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                      
                      {expandedStrategies[index] && (
                        <div className="p-3">
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{strategy.description}</p>
                          <div className="mt-2">
                            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Trade-offs:</div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{renderArrayItem(strategy.tradeoffs)}</p>
                          </div>
                          <div className="mt-2">
                            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Applicable Scales:</div>
                            <div className="flex gap-2 mt-1">
                              {(strategy?.applicableScales || []).map((scale: string, i: number) => (
                                <span 
                                  key={i} 
                                  className={`text-xs px-2 py-1 rounded ${
                                    scale === 'small' ? 'bg-green-100 text-green-800' : 
                                    scale === 'medium' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-purple-100 text-purple-800'
                                  } dark:bg-opacity-20`}
                                >
                                  {typeof scale === 'string' 
                                    ? scale.charAt(0).toUpperCase() + scale.slice(1) 
                                    : 'Unknown'}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Key Recommendations</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  {(costEstimation?.recommendations || []).map((recommendation, index) => (
                    <li key={index}>{renderArrayItem(recommendation)}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Cost Calculation Assumptions</h3>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {(costEstimation?.assumptions || []).map((assumption, index) => (
                      <li key={index}>{renderArrayItem(assumption)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default CostEstimationView 