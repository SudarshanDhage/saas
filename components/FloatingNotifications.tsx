'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock notifications for demo purposes
const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Project Sprint Ready', message: 'Your project sprint plan is ready for review', isRead: false, time: '2 hours ago' },
  { id: 2, title: 'Feature Plan Completed', message: 'The feature implementation plan has been generated', isRead: true, time: '1 day ago' },
  { id: 3, title: 'Team Invitation', message: 'You have been invited to join a new team', isRead: false, time: '3 days ago' },
];

const FloatingNotifications: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Count unread notifications
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length

  return (
    <div className="fixed top-6 right-6 z-40">
      {/* Notification Button */}
      <button 
        className={cn(
          "flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 rounded-full shadow-lg border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          showNotifications ? "scale-95" : "scale-100"
        )}
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Toggle notifications"
      >
        <div className="relative">
          <Bell size={20} strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center text-white text-xs font-medium">
                {unreadCount}
              </span>
            </span>
          )}
        </div>
      </button>
      
      {/* Notifications Dropdown */}
      {showNotifications && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-transparent z-30"
            onClick={() => setShowNotifications(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <button className="text-sm text-blue-500 hover:underline">Mark all as read</button>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {MOCK_NOTIFICATIONS.map(notification => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors",
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white">{notification.title}</h4>
                        {!notification.isRead && (
                          <span className="h-2 w-2 bg-blue-500 rounded-full ml-2"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <Link 
                href="/notifications" 
                className="text-sm text-blue-500 hover:underline font-medium"
                onClick={() => setShowNotifications(false)}
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default FloatingNotifications 