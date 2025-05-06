"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, CreditCard, Zap, Users, Infinity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Plan features data
const plans = [
  {
    name: 'Free',
    description: 'Perfect for trying out the platform',
    priceMonthly: 0,
    features: [
      '3 sprint plans per month',
      'Basic implementation prompts',
      'Public projects only',
      'Community support'
    ],
    icon: <CreditCard className="h-5 w-5 text-blue-500" />,
    color: 'border-blue-200 dark:border-blue-900',
    delay: 0.1,
    ctaText: 'Start Free',
    ctaColor: 'bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300'
  },
  {
    name: 'Pro',
    description: 'For individual creators and developers',
    priceMonthly: 19,
    features: [
      'Unlimited sprint plans',
      'Advanced prompt engineering',
      'Private projects',
      'Priority support',
      'Export to GitHub/GitLab',
      'Team collaboration (up to 2 members)'
    ],
    icon: <Zap className="h-5 w-5 text-purple-500" />,
    color: 'border-purple-200 dark:border-purple-900',
    delay: 0.2,
    popular: true,
    ctaText: 'Get Started',
    ctaColor: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
  },
  {
    name: 'Team',
    description: 'For startups and small teams',
    priceMonthly: 49,
    features: [
      'Everything in Pro',
      'Team collaboration (up to 10 members)',
      'Advanced analytics',
      'Custom templates',
      'API access',
      'Dedicated support'
    ],
    icon: <Users className="h-5 w-5 text-green-500" />,
    color: 'border-green-200 dark:border-green-900',
    delay: 0.3,
    ctaText: 'Try Team Plan',
    ctaColor: 'bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300'
  }
];

export default function PricingCTA() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
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
    <section className="py-16 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-slate-900/80">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <motion.div 
            variants={itemVariants}
            custom={0}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
              Flexible Plans
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Choose the Perfect Plan for Your Needs</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              From solo developers to growing teams, we have a plan that's right for you. Upgrade or downgrade anytime.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                custom={plan.delay}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 ${plan.color} p-6 flex flex-col ${
                  plan.popular ? 'transform md:-translate-y-4 md:shadow-xl' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="self-start mb-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                    Most Popular
                  </Badge>
                )}
                
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-full bg-${plan.color.split('-')[1]}/10 flex items-center justify-center mr-3`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">${plan.priceMonthly}</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2">/month</span>
                  </div>
                  {plan.name === 'Free' && (
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">No credit card required</div>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href={`/sign-up?plan=${plan.name.toLowerCase()}`} className="mt-auto">
                  <Button className={`w-full ${plan.ctaColor}`}>
                    {plan.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            variants={itemVariants}
            custom={0.4}
            className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-xl p-6 text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <Infinity className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Enterprise Solutions</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-2xl mx-auto">
              Need a custom solution for your organization? Contact our sales team for personalized pricing and features.
            </p>
            <Button variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300">
              Contact Sales
            </Button>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            custom={0.5}
            className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            All plans include a 14-day money-back guarantee. No questions asked.
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 