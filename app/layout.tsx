'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { Toaster } from '@/components/ui/toaster'
import { UserAccountProvider } from '@/contexts/UserAccountContext'
import JiraHeader from '@/components/JiraHeader'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import AuthWrapper from '@/components/auth/AuthWrapper'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Show header and sidebar for dashboard and related pages
  const showHeaderAndSidebar = pathname?.startsWith('/dashboard') || pathname?.startsWith('/projects') || pathname?.startsWith('/features')

  return (
    <html lang="en" className={cn(inter.className, "overflow-x-hidden")} suppressHydrationWarning>
      <head>
        <title>SaaSprint - AI-Powered Sprint Planning</title>
        <meta name="description" content="Generate comprehensive sprint plans, technical documentation, and project structure recommendations using AI" />
        <link rel="icon" href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3mPYVDehq6Y1uj1Bz-Ha6DU457FBBtHkaRA&s" />
      </head>
      <body className={cn('min-h-screen bg-background overflow-x-hidden', inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <AuthWrapper>
              <UserAccountProvider>
                <SidebarProvider>
                  {showHeaderAndSidebar && <JiraHeader />}
                  <div 
                    id="main-content" 
                    className={showHeaderAndSidebar ? "absolute top-[48px] left-0 right-0 bottom-0 overflow-auto bg-slate-50 dark:bg-slate-900" : ""}
                  >
                    {children}
                  </div>
                  <Toaster />
                </SidebarProvider>
              </UserAccountProvider>
            </AuthWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
