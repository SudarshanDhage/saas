"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Mail } from 'lucide-react';

// Pre-defined values for the gradient blobs to ensure consistency
const gradientBlobs = [
  {
    width: "225px",
    height: "263px",
    background: "hsl(246, 100%, 50%)",
    left: "95%",
    top: "0.4%",
    animateX: [-5, 10],
    animateY: [-10, 5],
    duration: 15
  },
  {
    width: "296px",
    height: "288px",
    background: "hsl(253, 100%, 50%)",
    left: "86%",
    top: "14%",
    animateX: [0, -15],
    animateY: [0, 15],
    duration: 18
  },
  {
    width: "267px",
    height: "553px",
    background: "hsl(223, 100%, 50%)",
    left: "18%",
    top: "40%",
    animateX: [0, 20],
    animateY: [0, -20],
    duration: 20
  },
  {
    width: "461px",
    height: "402px",
    background: "hsl(201, 100%, 50%)",
    left: "71%",
    top: "56%",
    animateX: [-10, 10],
    animateY: [-5, 5],
    duration: 14
  },
  {
    width: "423px",
    height: "559px",
    background: "hsl(231, 100%, 50%)",
    left: "80%",
    top: "48%",
    animateX: [0, -10],
    animateY: [10, 0],
    duration: 17
  }
];

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after initial render
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      
      // Clear form after successful submission
      setEmail('');
    }, 1500);
  };

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

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {isClient ? (
          gradientBlobs.map((blob, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-20"
              style={{
                width: blob.width,
                height: blob.height,
                background: blob.background,
                left: blob.left,
                top: blob.top,
              }}
              animate={{
                x: blob.animateX,
                y: blob.animateY,
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: blob.duration,
              }}
            />
          ))
        ) : (
          // Server-side rendering - static version
          gradientBlobs.map((blob, i) => (
            <div
              key={i}
              className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-20"
              style={{
                width: blob.width,
                height: blob.height,
                background: blob.background,
                left: blob.left,
                top: blob.top,
              }}
            />
          ))
        )}
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Accent circles */}
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-blue-500/10" />
          <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-purple-500/10" />
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
            <Mail className="h-12 w-12 text-blue-500" strokeWidth={1.5} />
            <h2 className="text-2xl md:text-3xl font-bold text-center sm:text-left">
              Get <span className="text-blue-600 dark:text-blue-400">Sprint Tips</span> in Your Inbox
            </h2>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-xl mx-auto">
            Join our newsletter for the latest AI project planning tips, tutorials, and exclusive resources to build better products, faster.
          </motion.p>
          
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center"
            >
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-green-800 dark:text-green-300 mb-2">Thank you for subscribing!</h3>
              <p className="text-green-700 dark:text-green-400">
                You've been added to our newsletter. Check your inbox for a confirmation email.
              </p>
            </motion.div>
          ) : (
            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="w-full">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border ${
                        error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white`}
                    />
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1 absolute"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Subscribe <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
          
          <motion.p variants={itemVariants} className="text-gray-500 dark:text-gray-400 text-sm text-center mt-4">
            We respect your privacy. Unsubscribe at any time.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSignup; 