"use client"

import React, { useState } from 'react'
import { useUserAccount } from '@/contexts/UserAccountContext'
import PageWithSidebar from '@/components/layouts/PageWithSidebar'
import AuthCheck from '@/components/auth/AuthCheck'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, User, Mail, Camera, Save, CreditCard } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { useSidebar } from '@/contexts/SidebarContext'

export default function ProfilePage() {
  const { userAccount, isLoading, updateAccount } = useUserAccount()
  const { toast } = useToast()
  const { setActiveSection } = useSidebar()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    photoURL: ''
  })
  const [emailPreferences, setEmailPreferences] = useState({
    marketing: false,
    updates: false
  })

  // Initialize form with user data when it loads
  React.useEffect(() => {
    if (userAccount) {
      setFormData({
        displayName: userAccount.displayName || '',
        email: userAccount.email || '',
        photoURL: userAccount.photoURL || ''
      })
      setEmailPreferences({
        marketing: userAccount.settings?.emailPreferences?.marketing || false,
        updates: userAccount.settings?.emailPreferences?.updates || false
      })
    }
    
    setActiveSection('profile')
  }, [userAccount, setActiveSection])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePreferenceChange = (key: 'marketing' | 'updates') => {
    setEmailPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      await updateAccount({
        displayName: formData.displayName,
        email: formData.email,
        photoURL: formData.photoURL,
        settings: {
          // Ensure all required fields are provided with default values if needed
          theme: userAccount?.settings?.theme || 'system',
          notifications: userAccount?.settings?.notifications ?? true,
          emailPreferences: emailPreferences
        }
      })
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getSubscriptionBadge = () => {
    if (!userAccount?.subscription) return null
    
    const type = userAccount.subscription.type
    switch (type) {
      case 'free':
        return <Badge variant="outline" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Free Plan</Badge>
      case 'pro':
        return <Badge variant="outline" className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">Pro Plan</Badge>
      case 'enterprise':
        return <Badge variant="outline" className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">Enterprise Plan</Badge>
      default:
        return null
    }
  }

  const getSubscriptionExpiry = () => {
    if (!userAccount?.subscription?.expiresAt) return null
    
    return format(new Date(userAccount.subscription.expiresAt), 'MMMM d, yyyy')
  }

  return (
    <AuthCheck>
      <PageWithSidebar pageTitle="My Profile">
        <div className="container py-8 max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold text-[#172B4D] dark:text-white mb-6">
            My Profile
          </h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <Loader2 size={48} className="animate-spin text-[#0052CC]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column - User info */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your personal details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div className="flex flex-col items-center md:flex-row md:items-start gap-4 mb-6">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={formData.photoURL} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                              {formData.displayName.substring(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-[#172B4D] dark:text-white mb-1">
                              Profile Picture
                            </h3>
                            <p className="text-sm text-[#6B778C] dark:text-gray-400 mb-3">
                              Update your profile photo by providing a URL to your image
                            </p>
                            <div className="flex">
                              <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <Camera className="h-4 w-4 text-[#6B778C]" />
                                </div>
                                <Input
                                  type="text"
                                  name="photoURL"
                                  value={formData.photoURL}
                                  onChange={handleInputChange}
                                  placeholder="https://example.com/your-photo.jpg"
                                  className="pl-10"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="displayName" className="text-[#172B4D] dark:text-white">
                              Display Name
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <User className="h-4 w-4 text-[#6B778C]" />
                              </div>
                              <Input
                                id="displayName"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleInputChange}
                                placeholder="Your name"
                                className="pl-10"
                              />
                            </div>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="email" className="text-[#172B4D] dark:text-white">
                              Email
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail className="h-4 w-4 text-[#6B778C]" />
                              </div>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t border-[#DFE1E6] dark:border-gray-700 pt-6">
                          <h3 className="text-lg font-medium text-[#172B4D] dark:text-white mb-4">
                            Email Preferences
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-[#172B4D] dark:text-white">
                                  Marketing Emails
                                </Label>
                                <p className="text-sm text-[#6B778C] dark:text-gray-400">
                                  Receive emails about new features and offers
                                </p>
                              </div>
                              <Switch
                                checked={emailPreferences.marketing}
                                onCheckedChange={() => handlePreferenceChange('marketing')}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-[#172B4D] dark:text-white">
                                  Product Updates
                                </Label>
                                <p className="text-sm text-[#6B778C] dark:text-gray-400">
                                  Get notified about product updates and new features
                                </p>
                              </div>
                              <Switch
                                checked={emailPreferences.updates}
                                onCheckedChange={() => handlePreferenceChange('updates')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button
                          type="submit"
                          disabled={isSaving}
                          className="bg-[#0052CC] hover:bg-[#0747A6] text-white"
                        >
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
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right column - Subscription Info */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>
                      Your current plan and billing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center mb-2">
                          {getSubscriptionBadge()}
                        </div>
                        <p className="text-sm text-[#6B778C] dark:text-gray-400">
                          {userAccount?.subscription?.type === 'free' 
                            ? 'You are currently on the free plan with limited features.'
                            : 'You have access to all premium features.'}
                        </p>
                      </div>
                      
                      <div className="border-t border-[#DFE1E6] dark:border-gray-700 pt-4">
                        <h4 className="text-sm font-medium text-[#172B4D] dark:text-white mb-2">
                          Subscription Details
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between text-sm">
                            <span className="text-[#6B778C] dark:text-gray-400">Plan</span>
                            <span className="text-[#172B4D] dark:text-white font-medium capitalize">
                              {userAccount?.subscription?.type || 'Free'}
                            </span>
                          </li>
                          <li className="flex justify-between text-sm">
                            <span className="text-[#6B778C] dark:text-gray-400">Renewal Date</span>
                            <span className="text-[#172B4D] dark:text-white font-medium">
                              {getSubscriptionExpiry() || 'N/A'}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {userAccount?.subscription?.type === 'free' ? (
                      <Button className="w-full bg-[#0052CC] hover:bg-[#0747A6] text-white">
                        <CreditCard size={16} className="mr-2" />
                        Upgrade to Pro
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full">
                        Manage Subscription
                      </Button>
                    )}
                  </CardFooter>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Account Usage</CardTitle>
                    <CardDescription>
                      Your current usage statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex justify-between text-sm">
                        <span className="text-[#6B778C] dark:text-gray-400">Projects</span>
                        <span className="text-[#172B4D] dark:text-white font-medium">
                          0 / {userAccount?.subscription?.type === 'free' ? '3' : 'Unlimited'}
                        </span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-[#6B778C] dark:text-gray-400">Feature Plans</span>
                        <span className="text-[#172B4D] dark:text-white font-medium">
                          0 / {userAccount?.subscription?.type === 'free' ? '5' : 'Unlimited'}
                        </span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span className="text-[#6B778C] dark:text-gray-400">AI Generations</span>
                        <span className="text-[#172B4D] dark:text-white font-medium">
                          0 / {userAccount?.subscription?.type === 'free' ? '10' : 'Unlimited'} per month
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </PageWithSidebar>
    </AuthCheck>
  )
} 