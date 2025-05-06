import React from 'react'
import { 
  Workflow,
  Zap,
  Settings,
  PlusCircle,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateViewProps {
  viewType: string;
}

const EmptyStateView: React.FC<EmptyStateViewProps> = ({ viewType }) => {
  // Add logging to understand what viewType is being passed
  console.log('EmptyStateView rendered with viewType:', viewType);
  
  // Map of view types to their configurations
  const viewConfig: Record<string, {
    title: string;
    description: string;
    icon: React.ReactNode;
    actionText?: string;
    actionLink?: string;
  }> = {
    allprojects: {
      title: 'All projects',
      description: 'View all your projects in one place.',
      icon: <Workflow className="w-10 h-10 text-[#0052CC]" />,
      actionText: 'Create new project',
      actionLink: '/projects/create'
    },
    allfeatures: {
      title: 'All features',
      description: 'View all your feature plans in one place.',
      icon: <Zap className="w-10 h-10 text-[#6554C0]" />,
      actionText: 'Create new feature plan',
      actionLink: '/features/create'
    },
    sprints: {
      title: 'Sprint Projects',
      description: 'Create and manage sprint projects for your team.',
      icon: <PlusCircle className="w-10 h-10 text-[#00875A]" />,
      actionText: 'Create new sprint project',
      actionLink: '/projects/create'
    },
    features: {
      title: 'Feature Plans',
      description: 'Create and manage feature plans for your projects.',
      icon: <PlusCircle className="w-10 h-10 text-[#6554C0]" />,
      actionText: 'Create new feature plan',
      actionLink: '/features/create'
    },
    settings: {
      title: 'Settings',
      description: 'Manage your account and application settings.',
      icon: <Settings className="w-10 h-10 text-[#6B778C]" />
    }
  }

  // Handle project-specific empty states
  if (viewType.startsWith('project-')) {
    const parts = viewType.split('-');
    const projectId = parts[1];
    const tab = parts[2] || 'overview';
    
    console.log('Project-specific empty state:', { projectId, tab });
    
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
          <AlertTriangle className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Project Data Issue
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
          There was a problem accessing the project data. This could be due to permission issues or the project might not exist.
        </p>
        
        <div className="flex space-x-4">
          <Link href="/projects">
            <Button variant="outline" size="lg">
              Back to Projects
            </Button>
          </Link>
          <Link href="/projects/create">
            <Button variant="jira" size="lg">
              Create New Project
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded text-left text-sm max-w-md">
          <p className="text-gray-500 mb-2">Debug Info:</p>
          <p>View Type: <code>{viewType}</code></p>
          <p>Project ID: <code>{projectId}</code></p>
          <p>Tab: <code>{tab}</code></p>
        </div>
      </div>
    );
  }

  // Fallback for unknown view types
  const defaultConfig = {
    title: `${viewType.charAt(0).toUpperCase() + viewType.slice(1)}`,
    description: 'Select an item from the sidebar to view details.',
    icon: <Workflow className="w-10 h-10 text-[#0052CC]" />
  }

  // Get the configuration for the current view type or use default
  const config = viewConfig[viewType] || defaultConfig

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
        {config.icon}
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        {config.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {config.description}
      </p>
      
      {config.actionText && config.actionLink && (
        <Link href={config.actionLink}>
          <Button variant="jira" size="lg">
            {config.actionText}
          </Button>
        </Link>
      )}
      
      {/* Show debug info in non-production */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded text-left text-sm max-w-md">
          <p className="text-gray-500 mb-2">Debug Info:</p>
          <p>View Type: <code>{viewType}</code></p>
          <p>Recognized: <code>{viewConfig[viewType] ? 'Yes' : 'No'}</code></p>
        </div>
      )}
    </div>
  )
}

export default EmptyStateView 