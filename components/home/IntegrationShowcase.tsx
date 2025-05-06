"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, ChevronRight, ExternalLink, GitBranchPlus, GitPullRequest, PlusCircle } from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  category: 'version-control' | 'ide' | 'ci-cd' | 'communication' | 'cloud'
  features: string[]
  popular: boolean
}

export default function IntegrationShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  
  // Sample integrations data
  const integrations: Integration[] = [
    {
      id: 'github',
      name: 'GitHub',
      description: 'Seamlessly create branches, pull requests, and analyze code quality',
      icon: '/images/integrations/github.svg',
      category: 'version-control',
      features: [
        'Auto-generate branch names from sprint tasks',
        'Create pull requests with AI-suggested descriptions',
        'Automatically link commits to sprint tasks',
        'Run code reviews on pull requests'
      ],
      popular: true
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      description: 'Manage your entire DevOps lifecycle within the platform',
      icon: '/images/integrations/gitlab.svg',
      category: 'version-control',
      features: [
        'Auto-generate CI/CD pipelines',
        'Create merge requests from sprint tasks',
        'Automate issue tracking and linking',
        'Run code quality reports'
      ],
      popular: true
    },
    {
      id: 'bitbucket',
      name: 'Bitbucket',
      description: 'Connect your code hosting with Jira and the rest of Atlassian',
      icon: '/images/integrations/bitbucket.svg',
      category: 'version-control',
      features: [
        'Sync with Jira issues and sprint planning',
        'Create pull requests automatically',
        'Analyze code quality with Pipelines',
        'Track development progress'
      ],
      popular: false
    },
    {
      id: 'vscode',
      name: 'VS Code',
      description: 'Bring AI sprint planning and coding directly to your editor',
      icon: '/images/integrations/vscode.svg',
      category: 'ide',
      features: [
        'Access sprint tasks without leaving your editor',
        'Get code suggestions based on task requirements',
        'Track progress and update task status',
        'Commit and push with smart commit messages'
      ],
      popular: true
    },
    {
      id: 'intellij',
      name: 'IntelliJ IDEA',
      description: 'Integrate with JetBrains IDEs for a seamless development workflow',
      icon: '/images/integrations/intellij.svg',
      category: 'ide',
      features: [
        'Access tasks and sprints from your IDE',
        'Track time spent on implementation',
        'Get code suggestions and documentation',
        'Commit with smart messages'
      ],
      popular: false
    },
    {
      id: 'jenkins',
      name: 'Jenkins',
      description: 'Automate your build and deployment pipeline',
      icon: '/images/integrations/jenkins.svg',
      category: 'ci-cd',
      features: [
        'Auto-generate Jenkinsfiles',
        'Configure pipeline stages based on project type',
        'Get notifications about build status',
        'Deploy to staging automatically when tests pass'
      ],
      popular: true
    },
    {
      id: 'circleci',
      name: 'CircleCI',
      description: 'Automate your testing and deployment workflows',
      icon: '/images/integrations/circleci.svg',
      category: 'ci-cd',
      features: [
        'Auto-generate config.yml files',
        'Set up optimal testing strategies',
        'Automate deployment to various platforms',
        'Get notifications about pipeline status'
      ],
      popular: false
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications and updates directly in your team channels',
      icon: '/images/integrations/slack.svg',
      category: 'communication',
      features: [
        'Sprint planning notifications',
        'Daily standup reminders',
        'Task completion alerts',
        'Code review requests and updates'
      ],
      popular: true
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Integrate with your team\'s preferred communication platform',
      icon: '/images/integrations/discord.svg',
      category: 'communication',
      features: [
        'Sprint notifications in dedicated channels',
        'Command-based sprint management',
        'Voice channel for standup meetings',
        'Integration with bot commands'
      ],
      popular: false
    },
    {
      id: 'aws',
      name: 'AWS',
      description: 'Deploy your projects to Amazon Web Services with ease',
      icon: '/images/integrations/aws.svg',
      category: 'cloud',
      features: [
        'Automatic infrastructure provisioning',
        'Deployment to EC2, Lambda, or ECS',
        'S3 and CloudFront for static assets',
        'CI/CD integration with CodeBuild and CodePipeline'
      ],
      popular: true
    },
    {
      id: 'azure',
      name: 'Azure',
      description: 'Seamlessly deploy and manage applications on Microsoft\'s cloud',
      icon: '/images/integrations/azure.svg',
      category: 'cloud',
      features: [
        'Integration with Azure DevOps',
        'Deployment to App Service or Functions',
        'Container orchestration with AKS',
        'Continuous delivery pipelines'
      ],
      popular: false
    },
  ]
  
  // Category options for filtering
  const categories = [
    { id: 'all', name: 'All Integrations' },
    { id: 'version-control', name: 'Version Control' },
    { id: 'ide', name: 'IDE Plugins' },
    { id: 'ci-cd', name: 'CI/CD' },
    { id: 'communication', name: 'Communication' },
    { id: 'cloud', name: 'Cloud Providers' }
  ]
  
  // Filter integrations based on active category and search query
  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = activeCategory === 'all' || integration.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })
  
  // Get the currently selected integration details
  const selectedIntegrationData = selectedIntegration 
    ? integrations.find(i => i.id === selectedIntegration) 
    : null
  
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Developer Ecosystem</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Connect your AI-powered sprint planning with your favorite tools.
            Integrate with version control, IDEs, CI/CD, and communication platforms.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Integration showcase */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
            {/* Search and filter */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
              {/* Integrations list */}
              <div className="md:col-span-1 h-[600px] overflow-y-auto">
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredIntegrations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                      No integrations found matching your criteria
                    </div>
                  ) : (
                    filteredIntegrations.map((integration, index) => (
                      <motion.button
                        key={integration.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`w-full p-4 flex items-start text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          selectedIntegration === integration.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                        onClick={() => setSelectedIntegration(integration.id)}
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 p-2 flex items-center justify-center">
                          {/* Placeholder for actual icon - in a real app, you'd use an image */}
                          <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                            {integration.name.substring(0, 1)}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-slate-900 dark:text-white">
                              {integration.name}
                            </h3>
                            {integration.popular && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {integration.description}
                          </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 ml-2 mt-2 transition-transform ${
                          selectedIntegration === integration.id ? 'rotate-90 text-blue-500' : 'text-slate-400'
                        }`} />
                      </motion.button>
                    ))
                  )}
                </div>
              </div>
              
              {/* Integration details */}
              <div className="md:col-span-2 h-[600px] overflow-y-auto">
                {!selectedIntegrationData ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 p-4 rounded-full bg-slate-100 dark:bg-slate-800">
                      <GitBranchPlus className="w-10 h-10 text-slate-500 dark:text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      Select an integration
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md">
                      Choose an integration from the list to see detailed information about how it connects with your AI sprint planning workflow.
                    </p>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 p-3 flex items-center justify-center">
                        {/* Placeholder for actual icon */}
                        <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">
                          {selectedIntegrationData.name.substring(0, 1)}
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                          {selectedIntegrationData.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mt-1">
                          {selectedIntegrationData.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Integration demo */}
                    <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                      <h4 className="text-lg font-medium mb-4 text-slate-900 dark:text-white">How it works</h4>
                      
                      {selectedIntegrationData.category === 'version-control' && (
                        <div className="space-y-6">
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                            <div className="flex items-center">
                              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                <GitBranchPlus className="w-5 h-5" />
                              </div>
                              <h5 className="ml-3 font-medium">Branch Creation</h5>
                            </div>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                              AI automatically generates branch names based on your sprint tasks, following your team's naming conventions.
                            </p>
                            <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-900/80 rounded text-sm font-mono overflow-x-auto">
                              <span className="text-slate-500 dark:text-slate-400">$ </span>
                              <span className="text-slate-900 dark:text-slate-200">git checkout -b </span>
                              <span className="text-green-600 dark:text-green-400">feature/user-authentication-with-oauth</span>
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                            <div className="flex items-center">
                              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                                <GitPullRequest className="w-5 h-5" />
                              </div>
                              <h5 className="ml-3 font-medium">Pull Request Creation</h5>
                            </div>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                              Once your task is complete, AI generates a detailed PR description with the changes made and how they fulfill requirements.
                            </p>
                            <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-900/80 rounded text-sm">
                              <div className="font-medium">User Authentication with OAuth Integration</div>
                              <div className="mt-2 text-slate-600 dark:text-slate-400">
                                This PR implements user authentication using OAuth providers (Google, GitHub) with the following features:
                                <ul className="mt-1 ml-5 list-disc space-y-1">
                                  <li>Social login buttons on the login page</li>
                                  <li>OAuth callback handling with state validation</li>
                                  <li>User profile creation on first login</li>
                                  <li>Session management for authenticated users</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedIntegrationData.category === 'ide' && (
                        <div className="space-y-6">
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                            <h5 className="font-medium mb-2">Access Tasks Within Your Editor</h5>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              View your sprint tasks directly in your IDE, with details and acceptance criteria.
                            </p>
                            <div className="mt-3 bg-slate-100 dark:bg-slate-900/80 rounded p-3">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <div className="font-medium">Sprint Tasks</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Sprint 3: Frontend Authentication</div>
                              </div>
                              <div className="space-y-2">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded border-l-2 border-blue-500 dark:border-blue-400">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-sm">Implement OAuth Login UI</div>
                                    <div className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-0.5 rounded-full">In Progress</div>
                                  </div>
                                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Create login page with social authentication options
                                  </div>
                                </div>
                                <div className="p-2 bg-white dark:bg-gray-800 rounded border-l-2 border-slate-300 dark:border-slate-600">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-sm">Handle Auth Callbacks</div>
                                    <div className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-full">Todo</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                            <h5 className="font-medium mb-2">Code Suggestions Based on Tasks</h5>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              Get AI-powered code snippets aligned with your task requirements.
                            </p>
                            <div className="mt-3 bg-slate-100 dark:bg-slate-900/80 rounded p-3 font-mono text-xs overflow-x-auto">
                              <div className="text-slate-500 dark:text-slate-400">// Suggested implementation for OAuth login buttons</div>
                              <pre className="mt-1 text-slate-900 dark:text-slate-200">{`export function SocialLoginButtons() {
  const handleGoogleLogin = () => {
    window.location.href = \`/api/auth/oauth/google?redirect=\${encodeURIComponent(window.location.pathname)}\`;
  };
  
  const handleGitHubLogin = () => {
    window.location.href = \`/api/auth/oauth/github?redirect=\${encodeURIComponent(window.location.pathname)}\`;
  };

  return (
    <div className="space-y-3">
      <button 
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-white text-slate-800 border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-50"
      >
        <GoogleIcon /> Continue with Google
      </button>
      <button 
        onClick={handleGitHubLogin}
        className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700"
      >
        <GitHubIcon /> Continue with GitHub
      </button>
    </div>
  );
}`}</pre>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {(selectedIntegrationData.category !== 'version-control' && selectedIntegrationData.category !== 'ide') && (
                        <div className="space-y-4">
                          <img 
                            src={`/images/integrations/${selectedIntegrationData.id}-demo.png`} 
                            alt={`${selectedIntegrationData.name} integration demo`}
                            className="w-full h-64 object-cover rounded-lg bg-slate-200 dark:bg-slate-700"
                          />
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Integration demo image would be displayed here in a production environment.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Features list */}
                    <div className="mt-8">
                      <h4 className="text-lg font-medium mb-4 text-slate-900 dark:text-white">Features</h4>
                      <ul className="space-y-3">
                        {selectedIntegrationData.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="flex items-start"
                          >
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="ml-2 text-slate-700 dark:text-slate-300">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Call to action */}
                    <div className="mt-8">
                      <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        Connect {selectedIntegrationData.name}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filteredIntegrations.length} integrations available
              </p>
              <button className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                <PlusCircle className="w-4 h-4 mr-1" />
                Request new integration
              </button>
            </div>
          </div>
          
          {/* Integration ecosystem */}
          <div className="mt-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold mb-2">Complete Developer Ecosystem</h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Our platform seamlessly integrates with your entire workflow, from planning and coding to deployment and communication.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Planning', 'Development', 'Testing', 'Deployment', 'Monitoring', 'Communication', 'Analytics', 'Security'].map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="font-medium text-slate-900 dark:text-white mb-2">{category}</div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {['10+', '15+', '8+', '12+', '6+', '9+', '7+', '5+'][index]} integrations
                  </p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <a href="#" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline">
                View all integrations <ExternalLink className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 