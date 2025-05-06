"use client"

import { useState, useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { checkIfIndexesAreBuilt } from '@/lib/documentations-query-fix'

interface IndexBuildingNotificationProps {
  isVisible?: boolean
  onRetry?: () => void
}

export default function IndexBuildingNotification({ 
  isVisible = true, 
  onRetry 
}: IndexBuildingNotificationProps) {
  const [showNotification, setShowNotification] = useState(isVisible)
  const [isRetrying, setIsRetrying] = useState(false)
  
  // Periodically check if indexes are ready
  useEffect(() => {
    if (!showNotification) return
    
    const checkIndexStatus = async () => {
      try {
        const isReady = await checkIfIndexesAreBuilt()
        if (isReady) {
          setShowNotification(false)
          if (onRetry) onRetry()
        }
      } catch (error) {
        console.error("Failed to check index status:", error)
      }
    }
    
    // Check immediately and then every 10 seconds
    checkIndexStatus()
    const interval = setInterval(checkIndexStatus, 10000)
    
    return () => clearInterval(interval)
  }, [showNotification, onRetry])
  
  const handleRetry = async () => {
    setIsRetrying(true)
    
    try {
      const isReady = await checkIfIndexesAreBuilt()
      if (isReady) {
        setShowNotification(false)
        if (onRetry) onRetry()
      }
    } catch (error) {
      console.error("Failed to check index status:", error)
    } finally {
      setIsRetrying(false)
    }
  }
  
  if (!showNotification) return null
  
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md mb-4 shadow-sm">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Database Index Building
          </h3>
          <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            <p>
              The Firebase database is currently building indexes needed for this query. 
              This usually takes a few minutes. We're automatically checking if it's ready.
            </p>
            <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
              You can continue using other parts of the application while this completes.
            </p>
          </div>
          <div className="mt-3">
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-yellow-300 dark:border-yellow-700 text-xs font-medium rounded shadow-sm text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-800/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-yellow-600"
              onClick={handleRetry}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="animate-spin -ml-0.5 mr-2 h-4 w-4" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="-ml-0.5 mr-2 h-4 w-4" />
                  Check Now
                </>
              )}
            </button>
          </div>
        </div>
        <button
          type="button"
          className="ml-3 flex-shrink-0 h-5 w-5 text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 focus:outline-none"
          onClick={() => setShowNotification(false)}
        >
          <span className="sr-only">Dismiss</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
} 