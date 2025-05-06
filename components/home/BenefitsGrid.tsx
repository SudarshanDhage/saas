"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Code, Lightbulb, Rocket, Brain, Clock, Users, Zap, Palette, Terminal, Workflow } from 'lucide-react'

// Benefits data
const benefits = [
  {
    title: 'No Coding Skills Required',
    description: 'Build fully functional products even if you have zero technical experience or coding knowledge.',
    icon: <Code className="h-6 w-6 text-blue-500" />,
    color: 'bg-blue-500/10',
    delay: 0.1
  },
  {
    title: 'AI-Generated Sprint Plans',
    description: 'Get comprehensive development roadmaps with sprints, tasks, and timelines automatically generated from your idea.',
    icon: <Brain className="h-6 w-6 text-indigo-500" />,
    color: 'bg-indigo-500/10',
    delay: 0.2
  },
  {
    title: 'Ready-to-Use Prompts',
    description: 'Copy and paste our step-by-step implementation prompts into any AI coding assistant to build your product.',
    icon: <Terminal className="h-6 w-6 text-purple-500" />,
    color: 'bg-purple-500/10',
    delay: 0.3
  },
  {
    title: 'Save Weeks of Development',
    description: 'Slash development time from months to days with our structured approach to building products.',
    icon: <Clock className="h-6 w-6 text-green-500" />,
    color: 'bg-green-500/10',
    delay: 0.4
  },
  {
    title: 'Perfect for Non-Technical Founders',
    description: 'Turn your vision into reality without hiring developers or learning to code yourself.',
    icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
    color: 'bg-amber-500/10',
    delay: 0.5
  },
  {
    title: 'Rapid Prototyping',
    description: 'Test new ideas quickly and iterate based on feedback without expensive development cycles.',
    icon: <Rocket className="h-6 w-6 text-rose-500" />,
    color: 'bg-rose-500/10',
    delay: 0.6
  },
  {
    title: 'Developer-Grade Output',
    description: 'Get professional-quality code that follows best practices, not just quick prototypes.',
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    color: 'bg-yellow-500/10',
    delay: 0.7
  },
  {
    title: 'Collaborative Team Features',
    description: 'Invite team members to collaborate on sprint plans, track progress, and contribute to development.',
    icon: <Users className="h-6 w-6 text-sky-500" />,
    color: 'bg-sky-500/10',
    delay: 0.8
  }
];

export default function BenefitsGrid() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (delay: number) => ({ 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: delay
      }
    })
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose SprintPro?</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Our platform empowers everyone to build fully-functional products without writing a single line of code
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              variants={itemVariants}
              custom={benefit.delay}
            >
              <div className={`w-12 h-12 ${benefit.color} rounded-full flex items-center justify-center mb-4`}>
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Featured benefit - emphasize prompt-driven development */}
        <motion.div 
          className="mt-12 max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-3 p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Complete Development Lifecycle</h3>
              <p className="mb-6 text-blue-100">
                SprintPro handles every step of your product's journey - from initial idea to deployment-ready code with comprehensive documentation.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Product Requirements</h4>
                    <p className="text-sm text-blue-100">Simply describe your product idea in plain language</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">AI-Powered Sprint Planning</h4>
                    <p className="text-sm text-blue-100">Get a structured development roadmap automatically</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Step-by-Step Implementation Prompts</h4>
                    <p className="text-sm text-blue-100">Copy-paste prompts into any AI coding assistant</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Launch-Ready Product</h4>
                    <p className="text-sm text-blue-100">Deploy your fully functional product with confidence</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 bg-slate-900/30 p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Terminal className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">AI-Generated Prompts</h4>
                <p className="text-sm text-blue-100 mb-4">
                  Over 2,000+ ready-to-use prompts for every development task
                </p>
                <div className="bg-white/10 text-white text-xs p-3 rounded text-left font-mono leading-relaxed">
                  &gt; Create a React authentication system<br />
                  &gt; Build a responsive checkout flow<br />
                  &gt; Design a user profile component<br />
                  &gt; Implement search functionality
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 