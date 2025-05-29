"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { 
  Project, 
  getProject, 
  updateProject, 
  getCurrentUserId,
  createProjectInvitation,
  removeProjectAccess,
  getUserProfile,
  UserProfile,
  debugUserAccount,
  ensureUserInitialized,
  validateEmailForSharing
} from '@/lib/firestore-v2'
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  Share2, 
  UserPlus, 
  UserMinus, 
  Mail, 
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Edit,
  Save,
  X
} from 'lucide-react'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import { useSidebar } from '@/contexts/SidebarContext'

export default function ProjectManagePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Sharing state
  const [shareEmail, setShareEmail] = useState('')
  const [sharePermission, setSharePermission] = useState<'read' | 'write'>('read')
  const [isSharing, setIsSharing] = useState(false)
  
  // Project editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  const { setActiveSection } = useSidebar()
  
  useEffect(() => {
    setActiveSection('sprints')
    
    const initializePage = async () => {
      try {
        // Ensure current user is properly initialized
        const userProfile = await ensureUserInitialized()
        const userId = userProfile.id
        setCurrentUserId(userId)
        
        console.log('🔐 Current user initialized:', userProfile.email)
        
        if (params.id) {
          const projectData = await getProject(params.id as string)
          
          // Check if user is the project owner
          if (projectData.userId !== userId) {
            toast({
              title: "Access Denied",
              description: "Only project owners can access the management page.",
              variant: "destructive",
            })
            router.push('/projects')
            return
          }
          
          setProject(projectData)
          setEditTitle(projectData.title)
          setEditDescription(projectData.description)
        }
      } catch (error) {
        console.error('Error loading project:', error)
        toast({
          title: "Error Loading Project",
          description: "Error loading project. Please try again.",
          variant: "destructive",
        })
        router.push('/projects')
      } finally {
        setIsLoading(false)
      }
    }
    
    initializePage()
  }, [params.id, router, setActiveSection, toast])

  const handleShareProject = async () => {
    if (!project || !shareEmail.trim()) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSharing(true)
    try {
      console.log('🚀 Starting share process for email:', shareEmail)
      
      // Validate email and check if user exists
      const validation = await validateEmailForSharing(shareEmail)
      
      if (!validation.isValid) {
        toast({
          title: "User Not Found",
          description: validation.message,
          variant: "destructive",
        })
        setIsSharing(false)
        return
      }
      
      const confirmMessage = `Share project "${project.title}" with ${shareEmail}?\n\nPermission: ${sharePermission.toUpperCase()}\n\nThey will receive an email invitation to accept access.`
      
      if (!confirm(confirmMessage)) {
        setIsSharing(false)
        return
      }

      console.log('📤 Creating project invitation...')
      await createProjectInvitation(project.id!, shareEmail, sharePermission)
      
      toast({
        title: "Project Shared",
        description: `✅ Project shared successfully!\n\nAn invitation has been sent to ${shareEmail} with ${sharePermission} access.`,
        variant: "default",
      })
      setShareEmail('')
      
      // Refresh project data
      const updatedProject = await getProject(project.id!)
      setProject(updatedProject)
      
    } catch (error) {
      console.error('🚨 Error sharing project:', error)
      
      // Provide more specific error messages based on the error
      if (error instanceof Error) {
        if (error.message.includes('User not found')) {
          toast({
            title: "User Not Registered",
            description: `❌ The user ${shareEmail} is not registered on this platform.\n\nPlease ask them to sign up first, then try sharing again.`,
            variant: "destructive",
          })
        } else if (error.message.includes('already has access')) {
          toast({
            title: "User Already Has Access",
            description: `ℹ️ The user ${shareEmail} already has access to this project.`,
            variant: "default",
          })
        } else {
          toast({
            title: "Error Sharing Project",
            description: `❌ Error sharing project: ${error.message}`,
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Error Sharing Project",
          description: "❌ Error sharing project. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSharing(false)
    }
  }

  const handleRemoveAccess = async (userId: string, userEmail: string) => {
    if (!project) return

    if (!confirm(`Are you sure you want to remove access for ${userEmail}?`)) {
      return
    }

    try {
      await removeProjectAccess(project.id!, userId)
      toast({
        title: "Access Removed",
        description: "Access removed successfully.",
        variant: "default",
      })
      
      // Refresh project data
      const updatedProject = await getProject(project.id!)
      setProject(updatedProject)
    } catch (error) {
      console.error('Error removing access:', error)
      toast({
        title: "Error Removing Access",
        description: "Error removing access. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveProject = async () => {
    if (!project || !editTitle.trim()) {
      toast({
        title: "Project Title Required",
        description: "Project title is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await updateProject(project.id!, {
        title: editTitle,
        description: editDescription
      })
      
      setProject({
        ...project,
        title: editTitle,
        description: editDescription
      })
      
      setIsEditing(false)
      toast({
        title: "Project Updated",
        description: "Project updated successfully!",
        variant: "default",
      })
    } catch (error) {
      console.error('Error updating project:', error)
      toast({
        title: "Error Updating Project",
        description: "Error updating project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <PageWithSidebar pageTitle="Project Management">
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={48} className="animate-spin text-blue-600 dark:text-blue-400 mb-4" />
            <p className="text-slate-600 dark:text-slate-300">Loading project management...</p>
          </div>
        </div>
      </PageWithSidebar>
    )
  }

  if (!project) {
    return (
      <PageWithSidebar pageTitle="Project Management">
        <div className="container py-8 max-w-7xl mx-auto">
          <div className="text-center py-16">
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Project Not Found</h2>
            <p className="text-slate-600 dark:text-slate-300">The project you're looking for doesn't exist or you don't have access to it.</p>
          </div>
        </div>
      </PageWithSidebar>
    )
  }

  return (
    <PageWithSidebar pageTitle="Project Management">
      <div className="container py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/projects')}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
            
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center">
              <Settings size={24} className="mr-3 text-blue-600 dark:text-blue-400" />
              Manage Project
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Manage all aspects of your project including team access, settings, and sharing.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Project Overview</TabsTrigger>
            <TabsTrigger value="team">Team & Sharing</TabsTrigger>
            <TabsTrigger value="settings">Project Settings</TabsTrigger>
          </TabsList>

          {/* Project Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Project Information</CardTitle>
                        <CardDescription>Basic project details and statistics</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? (
                          <>
                            <X size={16} className="mr-2" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit size={16} className="mr-2" />
                            Edit
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Project Title</Label>
                          <Input
                            id="title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Enter project title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Project Description</Label>
                          <Textarea
                            id="description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Enter project description"
                            rows={4}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button onClick={handleSaveProject} disabled={isSaving}>
                            {isSaving ? (
                              <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={16} className="mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            {project.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300">
                            {project.description}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                              {project.coreFeatures.length}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Core Features</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                              {project.suggestedFeatures.length}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Suggested Features</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                              {Object.keys(project.techStack || {}).length}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Technologies</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {project.sharedWith?.length || 0}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">Team Members</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common project management tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('team')}
                    >
                      <Share2 size={16} className="mr-2" />
                      Share Project
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('team')}
                    >
                      <Users size={16} className="mr-2" />
                      Manage Team
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings size={16} className="mr-2" />
                      Project Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Team & Sharing Tab */}
          <TabsContent value="team" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Share Project Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus size={20} className="mr-2 text-blue-600 dark:text-blue-400" />
                    Share Project
                  </CardTitle>
                  <CardDescription>
                    Invite team members to collaborate on this project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shareEmail">Email Address</Label>
                    <Input
                      id="shareEmail"
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      placeholder="user@example.com"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      User must be registered on this platform
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="permission">Permission Level</Label>
                    <select
                      id="permission"
                      value={sharePermission}
                      onChange={(e) => setSharePermission(e.target.value as 'read' | 'write')}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
                    >
                      <option value="read">Read Only - Can view project details</option>
                      <option value="write">Read & Write - Can edit project content</option>
                    </select>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Note: Only project owners can have admin access
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleShareProject} 
                    disabled={isSharing || !shareEmail.trim()}
                    className="w-full"
                  >
                    {isSharing ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Mail size={16} className="mr-2" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                  
                  {/* Debug Section - Remove this in production */}
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">🔧 Debug Helper</h5>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                      If sharing fails, click below to check if the user account exists:
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => shareEmail.trim() && debugUserAccount(shareEmail)}
                      disabled={!shareEmail.trim()}
                      className="text-xs"
                    >
                      Check User Account
                    </Button>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      Check browser console for debug results
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Team Members Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users size={20} className="mr-2 text-green-600 dark:text-green-400" />
                    Team Members
                  </CardTitle>
                  <CardDescription>
                    Manage access for current team members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Project Owner */}
                    <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                          {currentUserId?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">You</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Project Owner</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          <Shield size={12} className="mr-1" />
                          Admin
                        </Badge>
                      </div>
                    </div>

                    {/* Shared Members */}
                    {project.sharedWith && project.sharedWith.length > 0 ? (
                      project.sharedWith.map((userId) => {
                        const permission = project.permissions?.[userId] || 'read'
                        return (
                          <div key={userId} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-600 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                {userId.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{userId}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Team Member</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={permission === 'write' ? 'default' : 'secondary'}>
                                {permission === 'write' ? 'Write' : 'Read'}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveAccess(userId, userId)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <UserMinus size={14} />
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Users size={32} className="text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-500 dark:text-slate-400">No team members yet</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Share your project to collaborate with others</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Project Settings Tab */}
          <TabsContent value="settings" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">Delete Project</h4>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                    Once you delete a project, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" size="sm">
                    Delete Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageWithSidebar>
  )
} 