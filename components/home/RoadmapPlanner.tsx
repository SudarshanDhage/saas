"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Layers, ChevronRight, Plus, X } from 'lucide-react'

export default function RoadmapPlanner() {
  const [expandedSprint, setExpandedSprint] = useState<string | null>(null)
  
  // Toggle expanded sprint
  const toggleSprint = (sprintId: string) => {
    setExpandedSprint(expandedSprint === sprintId ? null : sprintId)
  }
  
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Interactive Roadmap Planning</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Organize your product development with an easy-to-use, visual roadmap planner.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Temporary placeholder content */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Roadmap Planner</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              This component will provide an interactive roadmap planning experience with drag-and-drop functionality and AI-assisted sprint organization.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 