"use client"

import { useState, useEffect } from 'react'

interface Stat {
  label: string
  value: number
  suffix: string
  color: string
}

const stats: Stat[] = [
  {
    label: 'Projects Created',
    value: 12500,
    suffix: '+',
    color: 'blue'
  },
  {
    label: 'Hours Saved',
    value: 75000,
    suffix: '+',
    color: 'purple'
  },
  {
    label: 'Teams Using SprintPro',
    value: 2300,
    suffix: '+',
    color: 'green'
  },
  {
    label: 'Success Rate',
    value: 94,
    suffix: '%',
    color: 'orange'
  }
];

export default function StatsSection() {
  const [animatedStats, setAnimatedStats] = useState<Stat[]>(stats.map(stat => ({ ...stat, value: 0 })))
  const [hasAnimated, setHasAnimated] = useState(false)
  
  useEffect(() => {
    // Only animate once
    if (hasAnimated) return
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setHasAnimated(true)
        
        const duration = 2000 // Animation duration in ms
        const frameDuration = 1000 / 60 // 60fps
        const totalFrames = Math.round(duration / frameDuration)
        
        let frame = 0
        const timer = setInterval(() => {
          frame++
          
          const progress = frame / totalFrames
          const easedProgress = easeOutExpo(progress)
          
          setAnimatedStats(stats.map(stat => ({
            ...stat,
            value: Math.round(easedProgress * stat.value)
          })))
          
          if (frame === totalFrames) {
            clearInterval(timer)
          }
        }, frameDuration)
      }
    }, { threshold: 0.1 })
    
    const element = document.getElementById('stats-section')
    if (element) observer.observe(element)
    
    return () => {
      if (element) observer.unobserve(element)
    }
  }, [hasAnimated])
  
  // Easing function for smoother animation
  const easeOutExpo = (x: number): number => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
  }
  
  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      green: 'bg-green-500/10 text-green-600 dark:text-green-400',
      orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
    }
    
    return colorMap[color] || colorMap.blue
  }
  
  return (
    <div id="stats-section" className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {animatedStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(stat.color)}`}>
              <span className="text-2xl font-bold">{stat.value.toLocaleString()}{stat.suffix}</span>
            </div>
            <p className="text-lg font-medium text-slate-900 dark:text-white">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 