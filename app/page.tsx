"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowRight, FolderGit2, Zap, Rocket, Users, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import FeatureShowcase from '@/components/home/FeatureShowcase'
import StatsSection from '@/components/home/StatsSection'
import { ThemeToggle } from '@/components/ThemeToggle'

// Import existing components
import AICodeGenerator from '@/components/home/AICodeGenerator'
import PromptJourney from '@/components/home/PromptJourney'
import BenefitsGrid from '@/components/home/BenefitsGrid'
import SuccessStories from '@/components/home/SuccessStories'
import PricingCTA from '@/components/home/PricingCTA'
import FeaturesComparison from '@/components/home/FeaturesComparison'
import FAQ from '@/components/home/FAQ'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import CookiesConsent from '@/components/home/CookiesConsent'


import RoadmapPlanner from '@/components/home/RoadmapPlanner'
import PersonalizedDevPlan from '@/components/home/LearningPaths'
import CommunityHub from '@/components/home/CommunityHub'

// Additional new components if available
// Temporarily comment out components that might be causing issues
// import IntegrationShowcase from '@/components/home/IntegrationShowcase'
// import GuidedTour from '@/components/home/GuidedTour'
// import TemplateGallery from '@/components/home/TemplateGallery'

export default function Home() {
  const { user, signInWithGoogle, logout } = useAuth()
  const router = useRouter()
  const [dashboardItems, setDashboardItems] = useState([
    { title: 'Dashboard', description: 'View your main dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-6 w-6 text-green-500" /> },
    { title: 'Profile', description: 'Manage your account settings', path: '/sign-in', icon: <Users className="h-6 w-6 text-blue-500" /> },
    { title: 'Analytics', description: 'View your activity and progress', path: '/dashboard', icon: <Rocket className="h-6 w-6 text-purple-500" /> },
  ])

  // Redirect if user is logged in - uncomment to enable auto-redirect
  // useEffect(() => {
  //   if (user) {
  //     router.push('/projects')
  //   }
  // }, [user, router])

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      router.push('/dashboard')
    } catch (error) {
      console.error('Google sign in failed:', error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header with logo and sign in */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-md text-white flex items-center justify-center mr-2 font-bold text-sm">
              SP
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-white">SprintPro</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle iconOnly />

            {!user ? (
              <>
                <Link href="/sign-in">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button size="sm">Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      await logout()
                      router.push('/')
                    } catch (error) {
                      console.error('Logout failed:', error)
                    }
                  }}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Code Generator Hero Section */}
      {!user && <AICodeGenerator />}

      {/* Dashboard Section - Only for logged in users */}
      {user && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                Welcome back, <span className="text-blue-600 dark:text-blue-400">{user.displayName || 'User'}</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 text-center">
                Continue working on your projects or start something new
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {dashboardItems.map((item, index) => (
                  <Link key={index} href={item.path}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow h-full flex flex-col">
                      <div className="mb-4">
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{item.description}</p>
                      <div className="mt-auto">
                        <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 p-0">
                          Go <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Journey Section - Show the complete journey */}
      {!user && <PromptJourney />}



      {/* Stats Section */}
      <section className="py-12 bg-slate-100 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <StatsSection />
        </div>
      </section>

      {/* Benefits Grid */}
      <BenefitsGrid />






      {/* Roadmap Planner Section */}
      <RoadmapPlanner />






      {/* Template Gallery Section */}
      {/* <TemplateGallery /> */}

      {/* Feature Showcase Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Visual Project Planning</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Visualize your projects from concept to completion
            </p>
          </div>

          <FeatureShowcase />
        </div>
      </section>

      {/* Integration Showcase Section */}
      {/* <IntegrationShowcase /> */}

      {/* Learning Paths Section */}
      <PersonalizedDevPlan />

      {/* Community Hub Section */}
      <CommunityHub />

      {/* Guided Tour Section */}
      {/* <GuidedTour /> */}

      {/* Success Stories Section */}
      <SuccessStories />

      {/* Perfect For Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/60">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect for All Teams</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Developers</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Technical roadmaps and implementation plans with minimal overhead
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Product Managers</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Turn ideas into structured product plans and feature specifications
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Non-Technical Founders</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Build your product without learning to code or hiring expensive developers
              </p>
            </div>
          </div>
        </div>
      </section>




      {/* Pricing Section */}
      <PricingCTA />

      {/* FAQ Section */}
      <FAQ />

      {/* Newsletter Signup Section */}
      <NewsletterSignup />

      {/* Footer Section */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SprintPro</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-slate-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/projects/features" className="text-slate-300 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/blog" className="text-slate-300 hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-slate-300 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/guides" className="text-slate-300 hover:text-white transition-colors">Guides</Link></li>
                <li><Link href="/api" className="text-slate-300 hover:text-white transition-colors">API</Link></li>
                <li><Link href="/community" className="text-slate-300 hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-slate-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-slate-300 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/partners" className="text-slate-300 hover:text-white transition-colors">Partners</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-slate-300 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-slate-300 hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} SprintPro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cookies Consent */}
      <CookiesConsent />
    </div>
  )
}