"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Code, Copy, Terminal, CheckCircle, ArrowRight, Sparkles, BookOpen, GitBranch, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'

const techStack = [
  { 
    name: 'Frontend', 
    icon: <Code className="h-6 w-6 text-blue-500" />,
    skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS']
  },
  { 
    name: 'Backend', 
    icon: <GitBranch className="h-6 w-6 text-purple-500" />,
    skills: ['Node.js', 'Express', 'Authentication', 'API Design']
  },
  { 
    name: 'Database', 
    icon: <Database className="h-6 w-6 text-green-500" />,
    skills: ['Supabase', 'PostgreSQL', 'Prisma', 'Data Modeling']
  },
  { 
    name: 'DevOps', 
    icon: <Terminal className="h-6 w-6 text-amber-500" />,
    skills: ['CI/CD', 'Docker', 'Vercel', 'Monitoring']
  }
];

export default function AICodeGenerator() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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

  // Floating elements animations
  const floatingVariants = {
    initial: (i: number) => ({
      y: 0,
      x: 0,
      rotate: i % 2 === 0 ? -5 : 5,
      scale: 1
    }),
    animate: (i: number) => ({
      y: [0, i % 2 === 0 ? -12 : -8, 0],
      x: [0, i % 2 === 0 ? -5 : 5, 0],
      rotate: [i % 2 === 0 ? -5 : 5, i % 2 === 0 ? 5 : -5, i % 2 === 0 ? -5 : 5],
      scale: [1, 1.05, 1],
      transition: {
        duration: i % 2 === 0 ? 4 : 5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut" as const
      }
    })
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left column - Text content */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Development</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Generate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Entire Product</span> From Idea to Code
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-xl">
              SprintPro generates complete development plans and ready-to-use AI prompts that build your product step-by-step—even if you're not a developer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start Building Now
              </Button>
              <Button variant="outline" size="lg" className="border-slate-600 text-slate-200 hover:bg-slate-800">
                See Example Plans <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          
          {/* Right column - 3D tech elements */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              {/* Glowing background effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-purple-500/20 rounded-full filter blur-3xl"></div>
              
              {/* Center platform */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/80 shadow-xl"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <Sparkles className="h-10 w-10 text-blue-400" />
                  </div>
                </div>
              </motion.div>
              
              {/* Floating tech stack cards */}
              {techStack.map((tech, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="initial"
                  animate="animate"
                  variants={floatingVariants}
                  className="absolute bg-slate-800/90 backdrop-blur-md rounded-lg p-4 border border-slate-700 shadow-lg w-40"
                  style={{
                    top: `${30 + (i * 20) % 60}%`,
                    left: i % 2 === 0 ? '15%' : '65%',
                    zIndex: i % 2 === 0 ? 10 : 5
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {tech.icon}
                    <span className="font-semibold">{tech.name}</span>
                  </div>
                  <div className="space-y-1">
                    {tech.skills.map((skill, j) => (
                      <div key={j} className="text-xs flex items-center text-slate-300">
                        <CheckCircle className="h-3 w-3 mr-1.5 text-blue-400" />
                        {skill}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                <motion.line 
                  x1="50%" y1="50%" 
                  x2="25%" y2="35%" 
                  stroke="#3b82f6" 
                  strokeWidth="1.5" 
                  strokeDasharray="5,5"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.line 
                  x1="50%" y1="50%" 
                  x2="25%" y2="70%" 
                  stroke="#8b5cf6" 
                  strokeWidth="1.5" 
                  strokeDasharray="5,5"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.line 
                  x1="50%" y1="50%" 
                  x2="75%" y2="30%" 
                  stroke="#10b981" 
                  strokeWidth="1.5" 
                  strokeDasharray="5,5"
                  animate={{ opacity: [0.2, 0.7, 0.2] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />
                <motion.line 
                  x1="50%" y1="50%" 
                  x2="75%" y2="65%" 
                  stroke="#f59e0b" 
                  strokeWidth="1.5" 
                  strokeDasharray="5,5"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 4.5, repeat: Infinity }}
                />
              </svg>
              
              {/* Floating particles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1.5 h-1.5 rounded-full bg-blue-400"
                  initial={{ 
                    x: Math.random() * 400 - 200, 
                    y: Math.random() * 400 - 200,
                    opacity: Math.random() * 0.5 + 0.3
                  }}
                  animate={{ 
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
} 