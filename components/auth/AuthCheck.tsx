'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { Loader2 } from 'lucide-react'

interface AuthCheckProps {
  children: React.ReactNode
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      setIsLoading(false)
      
      if (!user) {
        // Redirect to home if not authenticated
        router.push('/', { scroll: false })
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [router])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 z-50">
        <div className="flex flex-col items-center">
          <Loader2 size={48} className="animate-spin text-blue-600 dark:text-blue-400" />
          <p className="mt-4 text-lg text-slate-900 dark:text-white">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null
} 