"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { 
  ProjectInvitation, 
  getUserProjectInvitations,
  acceptProjectInvitation,
  declineProjectInvitation,
  getCurrentUserId 
} from '@/lib/firestore-v2'
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Shield,
  Loader2
} from 'lucide-react'

export default function ProjectInvitations() {
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingInvitation, setProcessingInvitation] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadInvitations()
  }, [])

  const loadInvitations = async () => {
    try {
      const userInvitations = await getUserProjectInvitations()
      setInvitations(userInvitations)
    } catch (error) {
      console.error('Error loading invitations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptInvitation = async (invitationId: string) => {
    setProcessingInvitation(invitationId)
    try {
      await acceptProjectInvitation(invitationId)
      toast({
        title: 'Project invitation accepted!',
        description: 'You now have access to the project.'
      })
      await loadInvitations() // Refresh invitations
    } catch (error) {
      console.error('Error accepting invitation:', error)
      toast({
        title: 'Error accepting invitation',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setProcessingInvitation(null)
    }
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    setProcessingInvitation(invitationId)
    try {
      await declineProjectInvitation(invitationId)
      toast({
        title: 'Project invitation declined',
        description: 'You will no longer receive access to the project.'
      })
      await loadInvitations() // Refresh invitations
    } catch (error) {
      console.error('Error declining invitation:', error)
      toast({
        title: 'Error declining invitation',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setProcessingInvitation(null)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isExpired = (expiresAt: number) => {
    return expiresAt < Date.now()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={24} className="animate-spin text-blue-600 dark:text-blue-400" />
        <span className="ml-2 text-slate-600 dark:text-slate-300">Loading invitations...</span>
      </div>
    )
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-8">
        <Mail size={32} className="text-slate-400 mx-auto mb-2" />
        <p className="text-slate-500 dark:text-slate-400">No pending invitations</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">You'll see project invitations here when someone shares a project with you</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Project Invitations ({invitations.length})
      </h3>
      
      {invitations.map((invitation) => (
        <Card key={invitation.id} className="border-l-4 border-l-blue-600 dark:border-l-blue-400">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{invitation.projectTitle}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <User size={14} className="mr-1" />
                  Invited by {invitation.ownerEmail}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={invitation.permission === 'write' ? 'default' : 'secondary'}>
                  <Shield size={12} className="mr-1" />
                  {invitation.permission === 'write' ? 'Read & Write' : 'Read Only'}
                </Badge>
                {isExpired(invitation.expiresAt) && (
                  <Badge variant="destructive">
                    <Clock size={12} className="mr-1" />
                    Expired
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  Invited on {formatDate(invitation.createdAt)}
                </div>
                <div className="mt-1">
                  Expires on {formatDate(invitation.expiresAt)}
                </div>
              </div>
              
              {!isExpired(invitation.expiresAt) && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeclineInvitation(invitation.id!)}
                    disabled={processingInvitation === invitation.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    {processingInvitation === invitation.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <XCircle size={14} className="mr-1" />
                    )}
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAcceptInvitation(invitation.id!)}
                    disabled={processingInvitation === invitation.id}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {processingInvitation === invitation.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <CheckCircle size={14} className="mr-1" />
                    )}
                    Accept
                  </Button>
                </div>
              )}
              
              {isExpired(invitation.expiresAt) && (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  This invitation has expired
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 