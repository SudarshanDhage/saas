'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/AuthContext'
import { UserAccountProvider } from '@/contexts/UserAccountContext'
import { ProjectGenerationProvider } from '@/contexts/ProjectGenerationContext'
import { Toaster } from '@/components/ui/toaster'
import JiraHeader from '@/components/JiraHeader'
import { cn } from '@/lib/utils'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // Use pathname to determine if we're on the home page
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up'
  
  // Add viewport meta tag dynamically to ensure proper mobile viewport
  useEffect(() => {
    // Check if viewport meta tag already exists
    let viewport = document.querySelector('meta[name="viewport"]')
    
    // If it doesn't exist, create and add it
    if (!viewport) {
      viewport = document.createElement('meta')
      viewport.setAttribute('name', 'viewport')
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0')
      document.head.appendChild(viewport)
    } else {
      // Update existing viewport meta tag
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0')
    }
  }, [])
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <UserAccountProvider>
          <SidebarProvider>
            <ProjectGenerationProvider>
              <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-[#F4F5F7] dark:bg-gray-900">
                {!isHomePage && !isAuthPage && <JiraHeader />}
                <main 
                  id="main-content" 
                  className={cn(
                    "flex-1",
                    isHomePage || isAuthPage ? 'bg-white dark:bg-gray-900' : '',
                    !isHomePage && !isAuthPage ? 'pt-[48px]' : ''
                  )}
                >
                  {children}
                </main>
              </div>
              <Toaster />
            </ProjectGenerationProvider>
          </SidebarProvider>
        </UserAccountProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 