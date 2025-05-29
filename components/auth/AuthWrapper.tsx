'use client'

import { useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { initializeUser } from '@/lib/firestore-v2'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setLoading(false)
      
      if (user && !initializing) {
        try {
          setInitializing(true)
          await initializeUser({
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || ''
          })
        } catch (error) {
          console.error('Error initializing user:', error)
        } finally {
          setInitializing(false)
        }
      }
    })

    return unsubscribe
  }, [initializing])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
} 