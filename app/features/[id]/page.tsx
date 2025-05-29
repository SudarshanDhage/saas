import React from 'react'
import FeatureDetailClient from '@/components/features/FeatureDetailClient'
import { Loader2 } from 'lucide-react'

// Server component that safely passes the ID to the client component
export default async function FeatureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <React.Suspense fallback={
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2 size={48} className="animate-spin text-purple-600 dark:text-purple-400" />
        </div>
      </div>
    }>
      <FeatureDetailClient featureId={id} />
    </React.Suspense>
  )
} 