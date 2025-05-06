import React from 'react'
import ProjectDetailClient from '@/components/projects/ProjectDetailClient'
import { Loader2 } from 'lucide-react'
import AuthCheck from '@/components/auth/AuthCheck'

// Define params type according to Next.js dynamic route pattern
type ProjectParams = {
  projectId: string
}

// Server component that safely passes the ID to the client component
export default async function ProjectDetailPage({
  params,
  searchParams
}: {
  params: Promise<ProjectParams>
  searchParams: Promise<{ tab?: string }>
}) {
  // Properly await the params object to access projectId
  const { projectId } = await params
  
  // Get the tab from search params (must await them as well)
  const resolvedSearchParams = await searchParams
  const tab = resolvedSearchParams.tab || 'overview'
  
  return (
    <AuthCheck>
      <React.Suspense fallback={
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-[70vh]">
            <Loader2 size={48} className="animate-spin text-[#0052CC]" />
          </div>
        </div>
      }>
        <ProjectDetailClient 
          projectId={projectId} 
          initialTab={tab} 
        />
      </React.Suspense>
    </AuthCheck>
  )
} 