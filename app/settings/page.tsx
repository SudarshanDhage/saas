"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import JiraHeader from '@/components/JiraHeader'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Settings() {
  const { theme, toggleTheme, setTheme } = useTheme()
  const { logout } = useAuth()
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error: any) {
      setError(error.message || 'Failed to log out')
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <JiraHeader />
        
        <main className="flex-1 p-6 container mx-auto max-w-3xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 text-sm bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900/30 dark:border-red-900/50 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Appearance Section */}
              <section className="py-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Appearance
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Theme
                    </label>
                    <div className="flex space-x-4">
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        className={`flex items-center ${theme === 'light' ? 'bg-blue-600' : ''}`}
                        onClick={() => setTheme('light')}
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </Button>
                      
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        className={`flex items-center ${theme === 'dark' ? 'bg-blue-600' : ''}`}
                        onClick={() => setTheme('dark')}
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Choose how AI Project Planner looks to you. Select a theme preference.
                    </p>
                  </div>
                </div>
              </section>
              
              {/* Notification Settings */}
              <section className="py-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Notifications
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="email-notifications"
                        name="email-notifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                        Email notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive email notifications about project updates, task assignments, and deadlines.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="browser-notifications"
                        name="browser-notifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="browser-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                        Browser notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive browser notifications when you're using the application.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              
              {/* Account Settings */}
              <section className="py-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Account
                </h2>
                
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => window.confirm('Are you sure you want to delete your account? This action cannot be undone.') && alert('Account deletion requested')}
                  >
                    Delete my account
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Once you delete your account, there is no going back. All your data will be permanently deleted.
                  </p>
                </div>
              </section>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => router.push('/profile')}
                variant="outline"
              >
                Back to Profile
              </Button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 