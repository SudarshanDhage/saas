"use client"

import React, { ReactNode, useEffect } from 'react'
import { useSidebar } from '@/contexts/SidebarContext'
import EmptyStateView from '@/components/board/EmptyStateView'
import { cn } from '@/lib/utils'

interface PageWithSidebarProps {
  children: ReactNode;
  pageTitle?: string;
}

const PageWithSidebar: React.FC<PageWithSidebarProps> = ({ 
  children,
  pageTitle = 'Home'
}) => {
  const { activeSection, sidebarOpen } = useSidebar();
  
  // Add logging to help identify issues
  useEffect(() => {
    console.log('PageWithSidebar rendered:', { 
      pageTitle, 
      activeSection,
      shouldRenderMainContent: shouldRenderMainContent() 
    });
  }, [pageTitle, activeSection]);
  
  // Determine if we should render the main content or an EmptyStateView
  const shouldRenderMainContent = () => {
    // Add debug logging
    if (!activeSection) {
      console.warn('No active section set');
    }
    
    // Add special cases for project pages
    if (pageTitle === 'Project Details' && activeSection?.startsWith('project-')) {
      return true;
    }

    // Add special case for feature plans detail pages
    if (pageTitle === 'Feature Plans' && (
      activeSection === 'features' || 
      activeSection === 'allfeatures' || 
      activeSection?.startsWith('feature-')
    )) {
      return true;
    }
    
    // Always show main content for specific routes regardless of sidebar selection
    if (pageTitle === 'Sprint Projects' && activeSection === 'sprints') {
      return true;
    }
    
    if (pageTitle === 'Home' && activeSection === 'company') {
      return true;
    }
    
    // Project related pages
    if (activeSection === 'allprojects' || activeSection === 'sprints' || activeSection === 'features') {
      return true;
    }
    
    return false;
  };
  
  // For sections with corresponding EmptyStateView types
  const sectionToViewType: Record<string, any> = {
    summary: 'summary',
    timeline: 'timeline',
    calendar: 'calendar', 
    list: 'list',
    forms: 'forms',
    goals: 'goals',
    code: 'code',
    archived: 'archived',
    allprojects: 'allprojects',
    plans: 'pages',
    foryou: 'foryou',
    recent: 'recent',
    starred: 'starred',
    apps: 'apps',
    explore: 'explore',
    filters: 'filters',
    dashboards: 'dashboards',
    teams: 'teams',
    customize: 'customize',
    feedback: 'feedback',
    projects: 'projects',
    // Pass through project-specific sections without mapping
    // They'll be handled in EmptyStateView
  };
  
  return (
    <div className={cn(
      "pt-[48px] min-h-screen w-full transition-all duration-300 ease-in-out",
      // Responsive margins - only apply margin when sidebar is open on larger screens
      sidebarOpen ? "lg:ml-[240px]" : "ml-0"
    )}>
      <div className="w-full px-4 md:px-6 lg:px-8">
        {shouldRenderMainContent() ? (
          children
        ) : (
          <EmptyStateView 
            viewType={activeSection && sectionToViewType[activeSection] ? sectionToViewType[activeSection] : activeSection} 
          />
        )}
      </div>
    </div>
  );
};

export default PageWithSidebar; 