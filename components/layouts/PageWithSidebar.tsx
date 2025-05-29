"use client"

import React, { ReactNode } from 'react'
import { useSidebar } from '@/contexts/SidebarContext'

interface PageWithSidebarProps {
  children: ReactNode;
  pageTitle?: string;
}

const PageWithSidebar: React.FC<PageWithSidebarProps> = ({ 
  children,
  pageTitle = 'Home'
}) => {
  const { sidebarOpen } = useSidebar();
  
  return (
    <div className={`h-full ${sidebarOpen ? 'ml-[240px]' : ''} transition-all duration-200`}>
      {children}
    </div>
  );
};

export default PageWithSidebar; 