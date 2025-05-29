"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SingleFeaturePlan, getFeaturePlans } from '@/lib/firestore-v2'
import { 
  Zap, 
  Plus, 
  ChevronRight, 
  Search,
  Filter,
  Bot, 
  User,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Code,
  Star,
  MoreVertical,
  Eye,
  Edit,
  Download,
  CheckCircle,
  Circle,
  Layers
} from 'lucide-react'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'

const FeaturePlanCard: React.FC<{ featurePlan: SingleFeaturePlan }> = ({ featurePlan }) => {
  const { id, feature, developerPlan, aiPlan, createdAt } = featurePlan
  
  const developerTaskCount = developerPlan.tasks.length
  const aiTaskCount = aiPlan.tasks.length
  const totalTasks = developerTaskCount + aiTaskCount
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getComplexityColor = () => {
    if (totalTasks <= 5) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    if (totalTasks <= 10) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  }

  const getComplexityText = () => {
    if (totalTasks <= 5) return 'Simple'
    if (totalTasks <= 10) return 'Medium'
    return 'Complex'
  }
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-600 dark:border-l-purple-400 bg-white dark:bg-gray-800">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {feature.title}
              </CardTitle>
              <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor()}`}>
                {getComplexityText()}
              </Badge>
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {feature.description.length > 120 
                ? `${feature.description.substring(0, 120)}...` 
                : feature.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Star size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{totalTasks}</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{developerTaskCount}</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">Dev Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">{aiTaskCount}</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">AI Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">92%</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">AI Score</div>
          </div>
        </div>

        {/* Implementation Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Developer Plan */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Developer Plan</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Manual implementation</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300">
                {developerTaskCount} tasks
              </Badge>
            </div>
            
            <div className="space-y-2">
              {developerPlan.tasks.slice(0, 2).map((task: any, index: number) => (
                <div key={index} className="flex items-center text-xs">
                  <Circle size={12} className="text-slate-600 dark:text-slate-400 mr-2 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 truncate">{task.title}</span>
                </div>
              ))}
              {developerTaskCount > 2 && (
                <div className="text-xs text-slate-600 dark:text-slate-400 pl-5">
                  +{developerTaskCount - 2} more tasks
                </div>
              )}
            </div>
          </div>
          
          {/* AI Plan */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">AI Assistant Plan</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Optimized automation</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300">
                {aiTaskCount} tasks
              </Badge>
            </div>
            
            <div className="space-y-2">
              {aiPlan.tasks.slice(0, 2).map((task: any, index: number) => (
                <div key={index} className="flex items-center text-xs">
                  <Zap size={12} className="text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 truncate">{task.title}</span>
                </div>
              ))}
              {aiTaskCount > 2 && (
                <div className="text-xs text-slate-600 dark:text-slate-400 pl-5">
                  +{aiTaskCount - 2} more tasks
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Timeline */}
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" />
            Created {formatDate(createdAt.toString())}
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-2" />
            Est. 3-5 days
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
            <Layers size={16} className="text-purple-600 dark:text-purple-400 mr-2" />
            <span className="font-medium">
              Dual Implementation Strategy
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <Eye size={16} className="mr-1" />
            Preview
          </Button>
          <Link href={`/features/${id}`}>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white">
              <Edit size={16} className="mr-1" />
              Implement
          </Button>
        </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

const FeaturesPage = () => {
  const [featurePlans, setFeaturePlans] = useState<SingleFeaturePlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterComplexity, setFilterComplexity] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const { setActiveSection } = useSidebar()
  
  useEffect(() => {
    setActiveSection('features')
    
    const fetchFeaturePlans = async () => {
      try {
        const plansData = await getFeaturePlans()
        setFeaturePlans(plansData)
      } catch (error) {
        console.error('Error fetching feature plans:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchFeaturePlans()
  }, [setActiveSection])

  const filteredFeatures = featurePlans.filter(plan => 
    plan.feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.feature.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const featureContent = (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container py-8 max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-start">
        <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Feature Plans</h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
                AI-powered feature implementation for developers and teams
              </p>
              
              {/* Stats Overview */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mr-2"></div>
                  <span className="text-slate-600 dark:text-slate-300">{featurePlans.length} Total Features</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-slate-600 dark:text-slate-300">5 In Progress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mr-2"></div>
                  <span className="text-green-600 dark:text-green-400 font-medium">+3 this week</span>
                </div>
        </div>
      </div>
      
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Export
              </Button>
              <Link href="/features/create">
                <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white">
                  <Plus size={16} className="mr-2" />
                  New Feature Plan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600 dark:text-slate-400" />
                <input
                  type="text"
              placeholder="Search features by name, description, or implementation details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                />
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={filterComplexity}
              onChange={(e) => setFilterComplexity(e.target.value)}
              className="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Complexity</option>
              <option value="simple">Simple</option>
              <option value="medium">Medium</option>
              <option value="complex">Complex</option>
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name A-Z</option>
              <option value="complexity">Complexity</option>
              <option value="tasks">Most Tasks</option>
            </select>
            
            <Button variant="outline" className="flex items-center">
              <Filter size={16} className="mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 dark:border-purple-400 mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Loading your feature plans...</p>
                </div>
        ) : filteredFeatures.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={32} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {searchTerm ? 'No features found' : 'Create Your First Feature Plan'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : 'Transform feature requirements into detailed implementation guides with AI assistance. Get both developer and AI-optimized task breakdowns.'
                }
              </p>
              {!searchTerm && (
                <Link href="/features/create">
                  <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white">
                    <Zap size={16} className="mr-2" />
                    Create Your First Feature
              </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredFeatures.map((featurePlan) => (
              <FeaturePlanCard key={featurePlan.id} featurePlan={featurePlan} />
            ))}
          </div>
        )}
        </div>
    </div>
  )
  
  return (
    <PageWithSidebar pageTitle="Feature Plans">
      {featureContent}
    </PageWithSidebar>
  )
}

export default FeaturesPage 