"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight, Code, PenTool, Lightbulb, Rocket, MessageSquare, Clock, Link, CheckCircle, BrainCircuit, Copy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Journey steps data
const journeySteps = [
  {
    id: 'idea',
    title: 'Share Your Idea',
    description: 'Describe what you want to build in plain language - no technical details required.',
    icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
    prompt: 'I want to build a marketplace for connecting local service providers with customers.',
    outputs: []
  },
  {
    id: 'analysis',
    title: 'AI Analysis',
    description: 'Our AI analyzes your idea and breaks it down into logical components and features.',
    icon: <BrainCircuit className="h-6 w-6 text-blue-500" />,
    prompt: '',
    outputs: [
      'User Management & Authentication',
      'Service Provider Profiles',
      'Service Listings & Categories',
      'Search & Discovery',
      'Booking & Scheduling',
      'Reviews & Ratings',
      'Messaging System',
      'Payment Processing'
    ]
  },
  {
    id: 'planning',
    title: 'Sprint Planning',
    description: 'Structured development plan with sprints, tasks, and timelines.',
    icon: <PenTool className="h-6 w-6 text-purple-500" />,
    prompt: '',
    outputs: [
      {
        title: 'Authentication Sprint',
        duration: '2 weeks',
        tasks: [
          'User registration flow',
          'Login system',
          'Profile management',
          'User type segmentation'
        ]
      },
      {
        title: 'Provider Profiles Sprint',
        duration: '3 weeks',
        tasks: [
          'Service provider onboarding',
          'Profile creation UI',
          'Skill/service selection',
          'Verification system'
        ]
      }
    ]
  },
  {
    id: 'prompts',
    title: 'Implementation Prompts',
    description: 'Step-by-step instructions you can paste into any AI coding assistant.',
    icon: <MessageSquare className="h-6 w-6 text-green-500" />,
    prompt: '',
    outputs: [
      {
        title: 'User Authentication System',
        prompt: 'Create a Next.js authentication system with email/password and social login using NextAuth.js. Include user registration, login, password reset, and protected routes for both service providers and customers.'
      },
      {
        title: 'Provider Profile Component',
        prompt: 'Design a responsive service provider profile page using React and Tailwind CSS. Include sections for profile photo, bio, services offered, pricing, availability calendar, and customer reviews.'
      }
    ]
  },
  {
    id: 'implementation',
    title: 'Implementation',
    description: 'Use the prompts in your preferred AI coding assistant to build each component.',
    icon: <Code className="h-6 w-6 text-indigo-500" />,
    prompt: '',
    outputs: [
      {
        title: 'Working Code',
        description: 'Paste prompts into Claude, ChatGPT, Cursor, or GitHub Copilot to generate complete, working code.'
      },
      {
        title: 'Continuous Refinement',
        description: 'Iterate on your product with additional prompts for improvements and new features.'
      }
    ]
  },
  {
    id: 'launch',
    title: 'Product Launch',
    description: 'Deploy your finished product with comprehensive documentation.',
    icon: <Rocket className="h-6 w-6 text-rose-500" />,
    prompt: '',
    outputs: [
      'Deployment Instructions',
      'User Documentation',
      'Marketing Materials',
      'Maintenance Guidelines'
    ]
  }
];

export default function PromptJourney() {
  const [activeStep, setActiveStep] = useState(0);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  
  // Toggle card expansion
  const toggleExpand = (id: string) => {
    if (expandedCards.includes(id)) {
      setExpandedCards(expandedCards.filter(cardId => cardId !== id));
    } else {
      setExpandedCards([...expandedCards, id]);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Generate progress line between steps
  const renderProgressLine = (index: number) => {
    if (index === journeySteps.length - 1) return null;
    
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-24 w-full md:w-auto md:h-full">
        <div 
          className={`h-full w-1 rounded ${
            index < activeStep ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
          }`}
        />
      </div>
    );
  };

  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">From Idea to Launch in 5 Simple Steps</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Our AI-powered platform provides all the prompts you need to build your product without coding skills
          </p>
        </div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          {/* Journey steps - desktop view */}
          <div className="hidden md:flex items-start mb-12">
            {journeySteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div 
                  variants={itemVariants}
                  className={`flex-1 flex flex-col items-center cursor-pointer ${
                    index <= activeStep ? 'opacity-100' : 'opacity-50'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    index < activeStep 
                      ? 'bg-blue-500 text-white' 
                      : index === activeStep 
                        ? 'bg-white dark:bg-blue-900 border-2 border-blue-500 text-blue-500 dark:text-blue-400' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {index < activeStep ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className="text-sm font-medium text-center">{step.title}</span>
                  {index === activeStep && (
                    <motion.div 
                      className="w-full h-0.5 bg-blue-500 mt-2"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>
                {index < journeySteps.length - 1 && (
                  <div className={`w-10 h-0.5 mt-6 ${
                    index < activeStep ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Journey steps - mobile view */}
          <div className="md:hidden mb-8 space-y-3">
            {journeySteps.map((step, index) => (
              <motion.div 
                key={step.id}
                variants={itemVariants}
                className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer ${
                  index === activeStep ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < activeStep 
                    ? 'bg-blue-500 text-white' 
                    : index === activeStep 
                      ? 'bg-white dark:bg-blue-900 border-2 border-blue-500 text-blue-500 dark:text-blue-400' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  {index < activeStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    React.cloneElement(step.icon as React.ReactElement<any>, { className: 'h-4 w-4' })
                  )}
                </div>
                <span className="text-sm font-medium flex-1">{step.title}</span>
                {index === activeStep && <ChevronRight className="h-4 w-4 text-blue-500" />}
              </motion.div>
            ))}
          </div>
          
          {/* Active step content */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                {journeySteps[activeStep].icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{journeySteps[activeStep].title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {journeySteps[activeStep].description}
                </p>
              </div>
            </div>
            
            {/* Step specific content */}
            <div className="mt-6">
              {activeStep === 0 && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-2">Your prompt:</div>
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-md text-slate-800 dark:text-slate-200 text-sm font-medium">
                        {journeySteps[0].prompt}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeStep === 1 && (
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-sm font-medium mb-3">Identified Components:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {journeySteps[1].outputs.map((output, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center p-2 bg-white dark:bg-slate-900 rounded-md"
                        >
                          <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-sm">{typeof output === 'string' ? output : JSON.stringify(output)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeStep === 2 && (
                <div className="space-y-3">
                  {journeySteps[2].outputs.map((sprint: any, idx) => (
                    <Card key={idx} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div 
                          className="p-4 flex items-center justify-between cursor-pointer"
                          onClick={() => toggleExpand(`sprint-${idx}`)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3">
                              <PenTool className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{sprint.title}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {sprint.duration}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {sprint.tasks.length} Tasks
                          </Badge>
                          <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${
                            expandedCards.includes(`sprint-${idx}`) ? 'rotate-180' : ''
                          }`} />
                        </div>
                        
                        {expandedCards.includes(`sprint-${idx}`) && (
                          <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800">
                            <div className="ml-11">
                              {sprint.tasks.map((task: string, taskIdx: number) => (
                                <div 
                                  key={taskIdx} 
                                  className="py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-center"
                                >
                                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mr-2"></div>
                                  <span className="text-sm">{task}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {activeStep === 3 && (
                <div className="space-y-4">
                  {journeySteps[3].outputs.map((output: any, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-medium flex items-center">
                            <MessageSquare className="h-4 w-4 text-green-500 mr-2" />
                            {output.title}
                          </div>
                          <Button variant="outline" size="sm" className="text-xs">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Prompt
                          </Button>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md text-sm border border-slate-200 dark:border-slate-700">
                          {output.prompt}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {activeStep === 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {journeySteps[4].outputs.map((output: any, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="font-medium mb-2 flex items-center">
                          <Code className="h-4 w-4 text-indigo-500 mr-2" />
                          {output.title}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {output.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {activeStep === 5 && (
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="text-sm font-medium mb-3">Launch Deliverables:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {journeySteps[5].outputs.map((output, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center p-3 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700"
                      >
                        <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mr-2">
                          <Link className="h-4 w-4" />
                        </div>
                        <span className="text-sm">{typeof output === 'string' ? output : JSON.stringify(output)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
              >
                Previous Step
              </Button>
              <Button 
                onClick={() => setActiveStep(Math.min(journeySteps.length - 1, activeStep + 1))}
                disabled={activeStep === journeySteps.length - 1}
              >
                Next Step
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 