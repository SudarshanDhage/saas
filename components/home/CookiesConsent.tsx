import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Settings, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const CookiesConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, can't be toggled
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem('cookieConsent');
    
    if (!consentGiven) {
      // Delay showing the banner for a better UX
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowConsent(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowPreferences(false);
    setShowConsent(false);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    
    setPreferences(essentialOnly);
    localStorage.setItem('cookieConsent', JSON.stringify(essentialOnly));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowConsent(false);
  };

  const handleTogglePreference = (key: keyof typeof preferences) => {
    if (key === 'essential') return; // Can't toggle essential cookies
    
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 80 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              {!showPreferences ? (
                <div className="p-6">
                  <div className="flex items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Cookie className="h-8 w-8 text-blue-500 flex-shrink-0" />
                      <h3 className="text-xl font-semibold">We value your privacy</h3>
                    </div>
                    <button 
                      onClick={() => setShowConsent(false)} 
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Close cookie consent"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                    By clicking "Accept All", you consent to our use of cookies. You can also choose "Customize" to set your preferences.
                  </p>
                  
                  <div className="mt-5 flex flex-wrap justify-end gap-3">
                    <button
                      onClick={handleRejectNonEssential}
                      className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      Essential Only
                    </button>
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Settings className="h-4 w-4" />
                      Customize
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2 text-sm"
                    >
                      <Check className="h-4 w-4" />
                      Accept All
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Cookie Preferences</h3>
                    <button 
                      onClick={() => setShowPreferences(false)} 
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Back to main consent"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {/* Essential Cookies */}
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={preferences.essential} 
                            disabled 
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2 cursor-not-allowed" 
                          />
                          <span className="font-medium">Essential Cookies</span>
                        </label>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                          Required
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        These cookies are necessary for the website to function and cannot be disabled.
                      </p>
                    </div>
                    
                    {/* Analytics Cookies */}
                    <div className={cn(
                      "p-4 rounded-lg",
                      preferences.analytics 
                        ? "bg-blue-50 dark:bg-blue-900/20" 
                        : "bg-gray-50 dark:bg-gray-900"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.analytics} 
                            onChange={() => handleTogglePreference('analytics')} 
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2" 
                          />
                          <span className="font-medium">Analytics Cookies</span>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Help us understand how visitors interact with our website by collecting and reporting information.
                      </p>
                    </div>
                    
                    {/* Marketing Cookies */}
                    <div className={cn(
                      "p-4 rounded-lg",
                      preferences.marketing 
                        ? "bg-blue-50 dark:bg-blue-900/20" 
                        : "bg-gray-50 dark:bg-gray-900"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.marketing} 
                            onChange={() => handleTogglePreference('marketing')} 
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2" 
                          />
                          <span className="font-medium">Marketing Cookies</span>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Used to track visitors across websites to display relevant advertisements.
                      </p>
                    </div>
                    
                    {/* Personalization Cookies */}
                    <div className={cn(
                      "p-4 rounded-lg",
                      preferences.personalization 
                        ? "bg-blue-50 dark:bg-blue-900/20" 
                        : "bg-gray-50 dark:bg-gray-900"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.personalization} 
                            onChange={() => handleTogglePreference('personalization')} 
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2" 
                          />
                          <span className="font-medium">Personalization Cookies</span>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow us to remember your preferences and provide enhanced, personalized features.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowPreferences(false)}
                      className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookiesConsent; 