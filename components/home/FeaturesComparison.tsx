import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type PlanFeature = {
  name: string;
  free: boolean;
  pro: boolean;
  enterprise: boolean;
  highlight?: boolean;
};

const FeaturesComparison: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('yearly');
  
  const features: PlanFeature[] = [
    { name: 'Basic project management', free: true, pro: true, enterprise: true },
    { name: 'AI-powered sprint planning', free: false, pro: true, enterprise: true, highlight: true },
    { name: 'Unlimited sprints', free: false, pro: true, enterprise: true },
    { name: 'Step-by-step prompts', free: false, pro: true, enterprise: true, highlight: true },
    { name: 'Code generation assistance', free: false, pro: true, enterprise: true },
    { name: 'Team collaboration', free: false, pro: true, enterprise: true },
    { name: 'Advanced analytics', free: false, pro: false, enterprise: true },
    { name: 'Priority support', free: false, pro: false, enterprise: true, highlight: true },
    { name: 'Custom integrations', free: false, pro: false, enterprise: true },
    { name: 'Dedicated account manager', free: false, pro: false, enterprise: true },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };
  
  const prices = {
    monthly: {
      free: '$0',
      pro: '$39',
      enterprise: '$99',
    },
    yearly: {
      free: '$0',
      pro: '$29',
      enterprise: '$79',
    },
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-3xl my-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
            Compare Plans and Features
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the plan that best suits your project needs and scale as you grow
          </p>
          
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center mt-8 mb-12">
            <div className="bg-gray-200 dark:bg-gray-800 p-1 rounded-full flex items-center">
              <button
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeTab === 'monthly' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-400'
                )}
                onClick={() => setActiveTab('monthly')}
              >
                Monthly
              </button>
              <button
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all relative",
                  activeTab === 'yearly' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-400'
                )}
                onClick={() => setActiveTab('yearly')}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  -25%
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Comparison Table */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Features Column */}
          <motion.div variants={itemVariants} className="lg:col-span-1 bg-transparent rounded-xl p-6">
            <div className="h-40"></div>
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <li 
                  key={index} 
                  className={cn(
                    "py-4 font-medium text-gray-700 dark:text-gray-300",
                    feature.highlight ? "bg-blue-50 dark:bg-blue-900/20 px-4 -mx-4 rounded-lg" : ""
                  )}
                >
                  {feature.name}
                  {feature.highlight && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <Zap size={12} className="mr-1" />
                      Popular
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Free Plan */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 relative"
          >
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-1">{prices[activeTab].free}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">per user / {activeTab}</div>
              <button className="mt-4 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 h-10 px-4 py-2 w-full">
                Try for free
              </button>
            </div>
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <li 
                  key={index} 
                  className={cn(
                    "py-4 text-center",
                    feature.highlight ? "bg-blue-50 dark:bg-blue-900/20 px-4 -mx-4 rounded-lg" : ""
                  )}
                >
                  {feature.free ? (
                    <Check className="mx-auto text-green-500" size={20} />
                  ) : (
                    <X className="mx-auto text-gray-400" size={20} />
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Pro Plan */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-blue-500 relative z-10 transform lg:-translate-y-2"
          >
            <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 bg-blue-600 text-white text-sm rounded-full font-medium">
              Most Popular
            </div>
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-1">{prices[activeTab].pro}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">per user / {activeTab}</div>
              <button className="mt-4 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 h-10 px-4 py-2 w-full">
                Get Started <ArrowRight className="ml-2" size={16} />
              </button>
            </div>
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <li 
                  key={index} 
                  className={cn(
                    "py-4 text-center",
                    feature.highlight ? "bg-blue-50 dark:bg-blue-900/20 px-4 -mx-4 rounded-lg" : ""
                  )}
                >
                  {feature.pro ? (
                    <Check className="mx-auto text-green-500" size={20} />
                  ) : (
                    <X className="mx-auto text-gray-400" size={20} />
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Enterprise Plan */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 relative"
          >
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-1">{prices[activeTab].enterprise}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">per user / {activeTab}</div>
              <button className="mt-4 inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 h-10 px-4 py-2 w-full">
                Contact Sales
              </button>
            </div>
            <ul className="space-y-6">
              {features.map((feature, index) => (
                <li 
                  key={index} 
                  className={cn(
                    "py-4 text-center",
                    feature.highlight ? "bg-blue-50 dark:bg-blue-900/20 px-4 -mx-4 rounded-lg" : ""
                  )}
                >
                  {feature.enterprise ? (
                    <Check className="mx-auto text-green-500" size={20} />
                  ) : (
                    <X className="mx-auto text-gray-400" size={20} />
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <button className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 h-10 px-6 py-2">
            Start your free trial today
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesComparison; 