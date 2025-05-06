"use client"

import React, { useEffect, useState } from 'react'
import { getFeaturePlans, SingleFeaturePlan } from '@/lib/firestore'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Loader2, Plus, Search, Zap } from 'lucide-react'
import Link from 'next/link'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { formatDistanceToNow } from 'date-fns'
import AuthCheck from '@/components/auth/AuthCheck'
import { auth } from '@/lib/firebase'

export default function FeaturesPage() {
  const [featurePlans, setFeaturePlans] = useState<SingleFeaturePlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { setActiveSection } = useSidebar()
  
  useEffect(() => {
    setActiveSection('allfeatures')
    
    const fetchFeaturePlans = async () => {
      try {
        setIsLoading(true)
        
        // Ensure user is authenticated
        if (!auth.currentUser) {
          setFeaturePlans([])
          setIsLoading(false)
          return
        }
        
        // The getFeaturePlans function will automatically filter by the current user
        const plansData = await getFeaturePlans()
        
        // Extra safety: filter plans to only include those belonging to current user
        const userPlans = plansData.filter(plan => plan.userId === auth.currentUser?.uid)
        setFeaturePlans(userPlans)
      } catch (error) {
        console.error('Error fetching feature plans:', error)
        setFeaturePlans([])
      } finally {
        setIsLoading(false)
      }
    }
    
    // Set up listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchFeaturePlans()
      } else {
        setFeaturePlans([])
        setIsLoading(false)
      }
    })
    
    return () => unsubscribe()
  }, [setActiveSection])
  
  // Filter feature plans based on search term
  const filteredFeaturePlans = searchTerm 
    ? featurePlans.filter(plan => 
        plan.feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.feature.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : featurePlans
  
  const content = (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#172B4D] dark:text-white mb-1">
            My Feature Plans
          </h1>
          <p className="text-[#6B778C] dark:text-gray-400">
            View and manage your feature implementation plans
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-[#6B778C]" />
            </div>
            <Input
              type="search"
              placeholder="Search features..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link href="/features/create">
            <Button variant="jira">
              <Plus size={16} className="mr-2" />
              New Feature Plan
            </Button>
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 size={48} className="animate-spin text-[#6554C0]" />
        </div>
      ) : filteredFeaturePlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 bg-[#F4F5F7] dark:bg-gray-700 p-4 rounded-full">
            <Zap size={36} className="text-[#6B778C] dark:text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-[#172B4D] dark:text-white mb-2">
            {searchTerm ? 'No matching feature plans found' : 'No feature plans yet'}
          </h2>
          <p className="text-[#6B778C] dark:text-gray-400 mb-6 max-w-lg">
            {searchTerm 
              ? `Try adjusting your search term or create a new feature plan to get started.` 
              : `Create your first feature plan to get started with detailed implementation guidance.`}
          </p>
          <Link href="/features/create">
            <Button variant="jira">
              <Plus size={16} className="mr-2" />
              Create New Feature Plan
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeaturePlans.map((plan) => (
            <Link href={`/features/${plan.id}`} key={plan.id}>
              <Card className="hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-[#172B4D] dark:text-white">
                    {plan.feature.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {plan.feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 pb-4 flex-grow">
                  <div className="mt-2">
                    <div className="text-xs text-[#6B778C] dark:text-gray-400 mb-1">Implementation Details:</div>
                    
                    {/* Count the tasks in developer plan */}
                    {plan.developerPlan.tasks && (
                      <div className="flex items-center mt-2">
                        <span className="px-2 py-1 bg-[#EAE6FF] dark:bg-purple-900/30 text-[#6554C0] dark:text-purple-400 text-xs rounded-full">
                          {plan.developerPlan.tasks.length} Development Tasks
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 mt-auto border-t border-[#F4F5F7] dark:border-gray-700">
                  <div className="text-xs text-[#6B778C] dark:text-gray-400 w-full text-left">
                    Created {formatDistanceToNow(plan.createdAt, { addSuffix: true })}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
  
  return (
    <AuthCheck>
      <PageWithSidebar pageTitle="My Feature Plans">
        {content}
      </PageWithSidebar>
    </AuthCheck>
  )
} 