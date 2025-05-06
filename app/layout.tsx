import './globals.css'
import JiraHeader from '@/components/JiraHeader'
import { Inter } from 'next/font/google'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { UserAccountProvider } from '@/contexts/UserAccountContext'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils'
import ClientLayout from '@/components/layouts/ClientLayout'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SaaSprint - AI-Powered Sprint Planning',
  description: 'Generate comprehensive sprint plans, technical documentation, and project structure recommendations using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3mPYVDehq6Y1uj1Bz-Ha6DU457FBBtHkaRA&s" />
      </head>
      <body className={cn('min-h-screen', inter.className)}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
