"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RedirectToFeaturesCreate() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/features/create')
  }, [router])
  
  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-[#6B778C] dark:text-gray-400">Redirecting to feature creation...</p>
      </div>
    </div>
  )
} 