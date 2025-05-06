"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getFeaturePlan, SingleFeaturePlan } from '@/lib/firestore'
import { ArrowLeft, Loader2, ShieldAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FeaturePlanView from '@/components/features/FeaturePlanView'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { auth } from '@/lib/firebase'

interface FeatureDetailClientProps {
  featureId: string
}

const FeatureDetailClient: React.FC<FeatureDetailClientProps> = ({ featureId }) => {
  const router = useRouter()
  const [featurePlan, setFeaturePlan] = useState<SingleFeaturePlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setActiveSection } = useSidebar()
  
  useEffect(() => {
    // Set active section with feature ID format to highlight in sidebar
    setActiveSection(`feature-${featureId}`)
    
    const fetchFeatureData = async () => {
      if (!featureId) return
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        setError('Authentication required. Please log in to view this feature plan.')
        setIsLoading(false)
        return
      }
      
      try {
        setIsLoading(true)
        
        // Fetch feature plan details
        const planData = await getFeaturePlan(featureId)
        
        // Check if the feature plan belongs to the current user
        if (planData.userId && planData.userId !== auth.currentUser.uid) {
          setError('You do not have permission to view this feature plan.')
          setIsLoading(false)
          return
        }
        
        setFeaturePlan(planData)
      } catch (error) {
        console.error('Error fetching feature plan:', error)
        setError('Error loading feature plan. The plan may not exist or you may not have access.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchFeatureData()
  }, [featureId, setActiveSection])
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-[70vh]">
            <Loader2 size={48} className="animate-spin text-[#6554C0]" />
          </div>
        </div>
      )
    }
    
    if (error) {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="text-center py-16">
            <ShieldAlert size={64} className="mx-auto mb-6 text-amber-500" />
            <h2 className="text-xl font-medium text-[#172B4D] dark:text-white mb-2">Access Denied</h2>
            <p className="text-[#6B778C] dark:text-gray-400 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <Link href="/features">
              <Button variant="jiraPurple">
                <ArrowLeft size={16} className="mr-2" />
                Back to My Features
              </Button>
            </Link>
          </div>
        </div>
      )
    }
    
    if (!featurePlan) {
      return (
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-xl font-medium text-[#172B4D] dark:text-white mb-2">Feature Plan Not Found</h2>
            <p className="text-[#6B778C] dark:text-gray-400 mb-6">
              The feature plan you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/features">
              <Button variant="jiraPurple">
                <ArrowLeft size={16} className="mr-2" />
                Back to Features
              </Button>
            </Link>
          </div>
        </div>
      )
    }
    
    return (
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/features', { scroll: false })}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Features
            </Button>
            
            <h1 className="text-2xl font-semibold text-[#172B4D] dark:text-white">{featurePlan.feature.title}</h1>
          </div>
          <p className="text-[#6B778C] dark:text-gray-400 max-w-3xl mb-6">{featurePlan.feature.description}</p>
          
          <FeaturePlanView featurePlan={featurePlan} />
        </div>
      </div>
    )
  }
  
  return (
    <PageWithSidebar pageTitle="Feature Plans">
      {renderContent()}
    </PageWithSidebar>
  )
}

export default FeatureDetailClient 