"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle, ChevronDown, ChevronRight, MapPin, Play, User, XCircle } from 'lucide-react'

interface TourStep {
  id: string
  title: string
  description: string
  image: string
  duration: string
  features: string[]
}

export default function GuidedTour() {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [showDrawer, setShowDrawer] = useState<boolean>(false)
  const [autoplay, setAutoplay] = useState<boolean>(false)
  const [windowWidth, setWindowWidth] = useState<number>(0)
  
  // Track window width for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize() // Set initial width
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Autoplay handling
  useEffect(() => {
    if (!autoplay) return
    
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev === tourSteps.length - 1 ? 0 : prev + 1))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [autoplay])
  
  // Sample tour steps
  const tourSteps: TourStep[] = [
    {
      id: 'requirements',
      title: 'Define Your Requirements',
      description: 'Start by describing your project requirements in natural language. The AI understands your goals and helps refine and structure them.',
      image: '/images/guided-tour/requirements.png',
      duration: '5 minutes',
      features: [
        'Natural language processing',
        'Requirement validation',
        'Auto-categorization',
        'Priority suggestions'
      ]
    },
    {
      id: 'planning',
      title: 'AI Sprint Planning',
      description: 'The AI analyzes your requirements and creates an optimized sprint plan with task breakdown, time estimates, and dependencies.',
      image: '/images/guided-tour/planning.png',
      duration: '10 minutes',
      features: [
        'Automated task breakdown',
        'Resource allocation',
        'Timeline optimization',
        'Dependency management'
      ]
    },
    {
      id: 'development',
      title: 'Guided Development',
      description: 'Get step-by-step guidance during implementation with AI-generated prompts tailored to each task in your sprint.',
      image: '/images/guided-tour/development.png',
      duration: '15 minutes',
      features: [
        'Task-specific prompts',
        'Code snippets generation',
        'Best practices recommendations',
        'Integration guidelines'
      ]
    },
    {
      id: 'tracking',
      title: 'Progress Tracking',
      description: 'Monitor your progress in real-time with visual dashboards, velocity metrics, and predictive analytics for project completion.',
      image: '/images/guided-tour/tracking.png',
      duration: '5 minutes',
      features: [
        'Real-time progress metrics',
        'Burndown charts',
        'Predictive completion dates',
        'Automated status updates'
      ]
    },
    {
      id: 'review',
      title: 'Code Review & Testing',
      description: 'AI-powered code review highlights potential bugs, security issues, and performance problems before they reach production.',
      image: '/images/guided-tour/review.png',
      duration: '10 minutes',
      features: [
        'Automated code analysis',
        'Security vulnerability scanning',
        'Performance optimization suggestions',
        'Test case generation'
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment & Documentation',
      description: 'Seamlessly deploy your completed project with AI-generated deployment scripts and comprehensive documentation.',
      image: '/images/guided-tour/deployment.png',
      duration: '10 minutes',
      features: [
        'Infrastructure-as-code generation',
        'Automated documentation',
        'Release notes creation',
        'Deployment verification'
      ]
    }
  ]
  
  const handleNextStep = () => {
    setCurrentStep(prev => (prev === tourSteps.length - 1 ? 0 : prev + 1))
  }
  
  const handlePrevStep = () => {
    setCurrentStep(prev => (prev === 0 ? tourSteps.length - 1 : prev - 1))
  }
  
  const toggleAutoplay = () => {
    setAutoplay(prev => !prev)
  }
  
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Platform Tour</h2>
          <p className="text-slate-600 dark:text-slate-300">
            See how our AI-powered development platform helps you go from concept to completed product
            with guided steps throughout the entire development process.
          </p>
        </div>
        
        {/* Mobile progress indicators */}
        <div className="md:hidden mb-6 flex justify-center">
          <div className="flex space-x-2">
            {tourSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full ${
                  currentStep === index 
                    ? 'bg-blue-600 dark:bg-blue-400' 
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
          {/* Left sidebar - Tour steps (desktop only) */}
          <div className="hidden md:block md:w-1/4 pr-8">
            <div className="space-y-1">
              {tourSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                    currentStep === index 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    currentStep === index
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="ml-3">{step.title}</span>
                  {currentStep === index && (
                    <ChevronRight className="ml-auto w-5 h-5 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-8 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800">
              <h3 className="font-medium mb-2 text-slate-900 dark:text-white">Why Take the Tour?</h3>
              <ul className="space-y-2">
                {[
                  'Discover key platform features',
                  'Understand the development workflow',
                  'See AI-powered assistance in action',
                  'Learn time-saving shortcuts'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="md:w-3/4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
              {/* Tour step content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {tourSteps[currentStep].title}
                        </h3>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Step {currentStep + 1} of {tourSteps.length} • Approx. {tourSteps[currentStep].duration}
                        </div>
                      </div>
                      
                      {/* Mobile step selector */}
                      <div className="md:hidden">
                        <button
                          onClick={() => setShowDrawer(true)}
                          className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400"
                        >
                          Steps <ChevronDown className="ml-1 w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                      {tourSteps[currentStep].description}
                    </p>
                    
                    {/* Image area */}
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden mb-6 flex items-center justify-center relative">
                      {/* In a real app, this would be a real image */}
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-slate-400 dark:text-slate-500 mb-2">
                            {tourSteps[currentStep].title}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400">
                            Image placeholder
                          </div>
                        </div>
                      </div>
                      
                      {/* Autoplay indicator */}
                      {autoplay && (
                        <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Play className="w-3 h-3 mr-1" fill="currentColor" />
                          Auto-playing
                        </div>
                      )}
                      
                      {/* Interactive hotspots - would be positioned based on the actual image */}
                      {[{ top: '20%', left: '15%' }, { top: '40%', left: '80%' }, { top: '70%', left: '50%' }].map((position, i) => (
                        <div
                          key={i}
                          className="absolute w-6 h-6 cursor-pointer"
                          style={{ top: position.top, left: position.left }}
                        >
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-25 rounded-full animate-ping"></div>
                          <div className="absolute inset-0 bg-blue-600 rounded-full flex items-center justify-center">
                            <MapPin className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Feature highlights */}
                    <div>
                      <h4 className="font-medium mb-3 text-slate-900 dark:text-white">Key Features</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tourSteps[currentStep].features.map((feature, i) => (
                          <div 
                            key={i}
                            className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start"
                          >
                            <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Navigation controls */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                <button
                  onClick={handlePrevStep}
                  className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                
                <div className="flex items-center">
                  <button
                    onClick={toggleAutoplay}
                    className={`flex items-center text-xs px-3 py-1.5 rounded-full mr-4 ${
                      autoplay
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Play className="w-3 h-3 mr-1" fill={autoplay ? 'currentColor' : 'none'} />
                    {autoplay ? 'Stop' : 'Auto'} Tour
                  </button>
                  
                  <button
                    onClick={handleNextStep}
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tour completion CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-purple-900 rounded-xl text-white flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Ready to Start Your Journey?</h3>
                <p className="text-blue-100 dark:text-blue-200">Sign up now and build your first AI-powered sprint in minutes.</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-colors">
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile drawer for steps */}
      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowDrawer(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl shadow-lg z-50 max-h-[80vh] overflow-auto"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-medium">Tour Steps</h3>
                <button onClick={() => setShowDrawer(false)}>
                  <XCircle className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-2">
                {tourSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      setCurrentStep(index)
                      setShowDrawer(false)
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                      currentStep === index 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      currentStep === index
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <div>{step.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {step.duration}
                      </div>
                    </div>
                    {currentStep === index && (
                      <CheckCircle className="ml-auto w-5 h-5 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
} 