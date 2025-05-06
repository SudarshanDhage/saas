"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RedirectToProjectsCreate() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/projects/create')
  }, [router])
  
  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-[#6B778C] dark:text-gray-400">Redirecting to project creation...</p>
      </div>
    </div>
  )
} 