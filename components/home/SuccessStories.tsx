"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Star, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Success stories data
const successStories = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Founder, TaskFlow",
    image: "/images/avatars/avatar-woman-1.png",
    quote: "I had the idea for a team task management app but no coding skills. SprintPro helped me generate detailed sprint plans and AI prompts. In just 6 weeks, I launched my MVP and secured my first paying customers.",
    productType: "Task Management App",
    timeline: "6 weeks from idea to launch",
    skills: "No prior coding experience",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Roberts",
    title: "Indie Developer, CodeMentor",
    image: "/images/avatars/avatar-man-1.png",
    quote: "As a developer, I was skeptical about AI-generated prompts, but they actually helped me build faster than ever. The sprint plans were comprehensive and the implementation prompts saved me hours of research and planning time.",
    productType: "Education Platform",
    timeline: "Reduced development time by 70%",
    skills: "Experienced developer",
    rating: 5
  },
  {
    id: 3,
    name: "Aisha Patel",
    title: "Co-founder, StyleMatch",
    image: "/images/avatars/avatar-woman-2.png",
    quote: "My co-founder and I wanted to build a fashion recommendation app but couldn't afford to hire developers. SprintPro guided us through the entire process. The AI prompts were incredibly detailed and helped us build a fully functional app ourselves.",
    productType: "E-commerce & Recommendation App",
    timeline: "3 months from concept to beta",
    skills: "Basic HTML/CSS knowledge only",
    rating: 5
  },
  {
    id: 4,
    name: "David Kim",
    title: "Solo Founder, MealPrep",
    image: "/images/avatars/avatar-man-2.png",
    quote: "I tried building my meal planning app three times and always hit roadblocks. SprintPro broke down the process into manageable sprints and provided step-by-step guidance. I finally have a working product my users love.",
    productType: "Meal Planning Platform",
    timeline: "4 weeks to working prototype",
    skills: "Self-taught programmer",
    rating: 4
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    title: "Startup Founder, EventBox",
    image: "/images/avatars/avatar-woman-3.png",
    quote: "The prompt engineering feature is a game-changer. Instead of vague instructions that get mediocre results from AI tools, SprintPro's detailed prompts consistently produced high-quality, production-ready code that actually worked.",
    productType: "Event Management Platform",
    timeline: "8 weeks to market",
    skills: "Business background, no coding",
    rating: 5
  }
];

export default function SuccessStories() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-advance carousel
  useEffect(() => {
    const startTimeout = () => {
      timeoutRef.current = setTimeout(() => {
        setDirection(1);
        setCurrent(prevCurrent => (prevCurrent + 1) % successStories.length);
      }, 8000);
    };
    
    startTimeout();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [current]);
  
  const handlePrevious = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDirection(-1);
    setCurrent(prevCurrent => (prevCurrent - 1 + successStories.length) % successStories.length);
  };
  
  const handleNext = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDirection(1);
    setCurrent(prevCurrent => (prevCurrent + 1) % successStories.length);
  };
  
  // Animation variants
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };
  
  const dotVariants = {
    inactive: { scale: 1, opacity: 0.5 },
    active: { scale: 1.2, opacity: 1 }
  };
  
  const currentStory = successStories[current];

  return (
    <section className="py-16 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Real people building real products with SprintPro - no coding experience required
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          {/* Controls */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-white/80 dark:bg-gray-800/80 border-slate-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 shadow-md"
              onClick={handlePrevious}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-white/80 dark:bg-gray-800/80 border-slate-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 shadow-md"
              onClick={handleNext}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Testimonials Carousel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="grid grid-cols-1 md:grid-cols-5"
              >
                {/* Left column - User info and quote */}
                <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-6 text-blue-600 dark:text-blue-400">
                    <Quote className="h-10 w-10 opacity-20" />
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-200 mb-8 leading-relaxed">
                    "{currentStory.quote}"
                  </blockquote>
                  
                  <div className="flex items-center">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-md mr-4">
                      <Image 
                        src={currentStory.image} 
                        alt={currentStory.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to a generic avatar if the image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/avatars/default-avatar.svg';
                          // If that also fails, use an inline SVG as data URL
                          target.onerror = () => {
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiBmaWxsPSJub25lIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzRGNDZFNSIvPjxwYXRoIGQ9Ik0yMCAxOUMxNy4yMzg2IDE5IDE1IDE2Ljc2MTQgMTUgMTRDMTUgMTEuMjM4NiAxNy4yMzg2IDkgMjAgOUMyMi43NjE0IDkgMjUgMTEuMjM4NiAyNSAxNEMyNSAxNi43NjE0IDIyLjc2MTQgMTkgMjAgMTlaIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik0zMCAzM0MzMCAyNi4zNzI2IDI1LjUyMjcgMjEgMjAgMjFDMTQuNDc3MyAyMSAxMCAyNi4zNzI2IDEwIDMzSDMwWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=';
                          };
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{currentStory.name}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-sm">{currentStory.title}</div>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < currentStory.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right column - Product info */}
                <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 md:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-400">Product Details</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">Product Type</div>
                        <div className="font-medium">{currentStory.productType}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">Development Timeline</div>
                        <div className="font-medium">{currentStory.timeline}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">Technical Background</div>
                        <div className="font-medium">{currentStory.skills}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      Start Your Project
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Dots pagination */}
          <div className="flex justify-center mt-6">
            {successStories.map((_, index) => (
              <motion.button
                key={index}
                className={`h-3 w-3 mx-1 rounded-full ${
                  current === index ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
                onClick={() => {
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  setDirection(index > current ? 1 : -1);
                  setCurrent(index);
                }}
                variants={dotVariants}
                animate={current === index ? 'active' : 'inactive'}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 