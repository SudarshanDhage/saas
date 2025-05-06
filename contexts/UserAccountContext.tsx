'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { onAuthChange } from '@/lib/auth'
import { getUserAccount, updateUserAccount, UserAccount } from '@/lib/firestore'

interface UserAccountContextType {
  userAccount: UserAccount | null
  isLoading: boolean
  error: string | null
  refreshUserAccount: () => Promise<void>
  updateAccount: (data: Partial<UserAccount>) => Promise<void>
}

const UserAccountContext = createContext<UserAccountContextType | undefined>(undefined)

export function UserAccountProvider({ children }: { children: ReactNode }) {
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserAccount = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const account = await getUserAccount()
      setUserAccount(account as UserAccount)
    } catch (err) {
      console.error('Error fetching user account:', err)
      setError(err instanceof Error ? err.message : 'Failed to load user account')
      setUserAccount(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateAccount = async (data: Partial<UserAccount>) => {
    try {
      setIsLoading(true)
      setError(null)
      await updateUserAccount(data)
      await fetchUserAccount()
    } catch (err) {
      console.error('Error updating user account:', err)
      setError(err instanceof Error ? err.message : 'Failed to update user account')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        await fetchUserAccount()
      } else {
        setUserAccount(null)
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <UserAccountContext.Provider
      value={{
        userAccount,
        isLoading,
        error,
        refreshUserAccount: fetchUserAccount,
        updateAccount: handleUpdateAccount
      }}
    >
      {children}
    </UserAccountContext.Provider>
  )
}

export function useUserAccount() {
  const context = useContext(UserAccountContext)
  if (context === undefined) {
    throw new Error('useUserAccount must be used within a UserAccountProvider')
  }
  return context
} 