import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  setDoc,
  writeBatch,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  collectionGroup
} from 'firebase/firestore'
import { db, auth } from './firebase'

// Collection Paths - User-centric structure
const USERS_COLLECTION = 'users'

// Helper function to get current user ID
export function getCurrentUserId(): string {
  const user = auth.currentUser
  if (!user) {
    throw new Error('User not authenticated')
  }
  return user.uid
}

// Helper function to get user document reference
function getUserDocRef(userId: string) {
  return doc(db, USERS_COLLECTION, userId)
}

// Helper function to get user projects collection reference
function getUserProjectsRef(userId: string) {
  return collection(getUserDocRef(userId), 'projects')
}

// Helper function to get user features collection reference  
function getUserFeaturesRef(userId: string) {
  return collection(getUserDocRef(userId), 'features')
}

// Helper function to get project sprints collection reference
function getProjectSprintsRef(userId: string, projectId: string) {
  return collection(getUserDocRef(userId), 'projects', projectId, 'sprints')
}

// Enhanced Types with user ownership and sharing
export interface Feature {
  id: string
  name: string
  description: string
}

export interface Project {
  id?: string
  title: string
  description: string
  coreFeatures: Feature[]
  suggestedFeatures: Feature[]
  createdAt: number
  updatedAt: number
  userId: string
  techStack?: any
  // Sharing functionality
  sharedWith?: string[] // Array of user IDs who have access
  permissions?: {
    [userId: string]: 'read' | 'write' | 'admin'
  }
  // Project status
  status?: 'active' | 'completed' | 'archived'
}

export interface SprintPlan {
  id?: string
  projectId: string
  userId: string
  developerPlan: any
  aiPlan: any
  createdAt: number
  updatedAt: number
  // Sprint status and metadata
  status?: 'draft' | 'active' | 'completed'
  sprintNumber?: number
  estimatedDuration?: string
}

export interface SingleFeaturePlan {
  id?: string
  feature: {
    title: string
    description: string
  }
  developerPlan: any
  aiPlan: any
  createdAt: number
  updatedAt: number
  userId: string
  // Optional project association
  projectId?: string
  // Feature status
  status?: 'draft' | 'in-progress' | 'completed'
}

export interface UserProfile {
  id: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: number
  updatedAt: number
  // Subscription and settings
  subscription?: {
    type: 'free' | 'pro' | 'enterprise'
    expiresAt: number
    paymentId?: string
  }
  settings?: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    emailPreferences: {
      marketing: boolean
      updates: boolean
    }
  }
}

export interface SharedProject {
  projectId: string
  ownerUserId: string
  sharedByUserId: string
  sharedAt: number
  permission: 'read' | 'write' | 'admin'
  status: 'pending' | 'accepted' | 'declined'
}

export interface ProjectInvitation {
  id?: string
  projectId: string
  projectTitle: string
  ownerUserId: string
  ownerEmail: string
  invitedEmail: string
  invitedUserId?: string
  permission: 'read' | 'write'
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  createdAt: number
  expiresAt: number
  acceptedAt?: number
  declinedAt?: number
}

// Task State Persistence Interfaces
export interface TaskState {
  id: string // matches task.id from the board
  taskId: string // the display ID like "DEV-S1-T1"
  status: 'todo' | 'inprogress' | 'review' | 'done'
  comments: TaskComment[]
  commitId?: string
  updatedAt: number
  updatedBy: string
}

export interface TaskComment {
  id: string
  text: string
  author: string
  authorEmail: string
  timestamp: number
}

export interface SprintTaskStates {
  id?: string
  projectId: string
  sprintIndex: number
  planType: 'developer' | 'ai'
  taskStates: TaskState[]
  updatedAt: number
  userId: string
}

export interface FeatureTaskStates {
  id?: string
  featureId: string
  planType: 'developer' | 'ai'
  taskStates: TaskState[]
  updatedAt: number
  userId: string
}

// User Management Functions
export async function initializeUser(userData: Partial<UserProfile>) {
  try {
    const userId = getCurrentUserId()
    const userRef = getUserDocRef(userId)
    
    const userDoc = await getDoc(userRef)
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        id: userId,
        email: userData.email || '',
        displayName: userData.displayName || '',
        photoURL: userData.photoURL || '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        subscription: {
          type: 'free',
          expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days free trial
        },
        settings: {
          theme: 'system',
          notifications: true,
          emailPreferences: {
            marketing: true,
            updates: true
          }
        }
      })
    }
    
    return { id: userId, ...userData }
  } catch (error) {
    console.error('Error initializing user:', error)
    throw error
  }
}

export async function getUserProfile() {
  try {
    const userId = getCurrentUserId()
    const userRef = getUserDocRef(userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    } else {
      throw new Error('User profile not found')
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

export async function updateUserProfile(data: Partial<UserProfile>) {
  try {
    const userId = getCurrentUserId()
    const userRef = getUserDocRef(userId)
    
    await updateDoc(userRef, {
      ...data,
      updatedAt: Date.now()
    })
    
    return { id: userId, ...data }
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

// Project Management Functions
export async function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
  try {
    const userId = getCurrentUserId()
    const projectsRef = getUserProjectsRef(userId)
    
    const docRef = await addDoc(projectsRef, {
      ...projectData,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'active',
      sharedWith: [],
      permissions: {}
    })
    
    return { id: docRef.id, ...projectData, userId }
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export async function getProjects() {
  try {
    const userId = getCurrentUserId()
    const projectsRef = getUserProjectsRef(userId)
    const q = query(projectsRef, orderBy('createdAt', 'desc'))
    
    const querySnapshot = await getDocs(q)
    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[]
    
    // Also get shared projects
    const sharedProjects = await getSharedProjects()
    
    return [...projects, ...sharedProjects]
  } catch (error) {
    console.error('Error getting projects:', error)
    throw error
  }
}

export async function getProject(projectId: string, ownerUserId?: string) {
  try {
    const userId = getCurrentUserId()
    const targetUserId = ownerUserId || userId
    
    const projectRef = doc(getUserProjectsRef(targetUserId), projectId)
    const projectDoc = await getDoc(projectRef)
    
    if (projectDoc.exists()) {
      const project = { id: projectDoc.id, ...projectDoc.data() } as Project
      
      // Check access permissions
      if (project.userId !== userId && !hasProjectAccess(project, userId)) {
        throw new Error('Access denied to this project')
      }
      
      return project
    } else {
      throw new Error('Project not found')
    }
  } catch (error) {
    console.error('Error getting project:', error)
    throw error
  }
}

export async function updateProject(projectId: string, data: Partial<Project>, ownerUserId?: string) {
  try {
    const userId = getCurrentUserId()
    const targetUserId = ownerUserId || userId
    
    const projectRef = doc(getUserProjectsRef(targetUserId), projectId)
    const project = await getProject(projectId, targetUserId)
    
    // Check write permissions
    if (project.userId !== userId && !hasProjectWriteAccess(project, userId)) {
      throw new Error('Write access denied to this project')
    }
    
    await updateDoc(projectRef, {
      ...data,
      updatedAt: Date.now()
    })
    
    return { id: projectId, ...data }
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export async function deleteProject(projectId: string) {
  try {
    const userId = getCurrentUserId()
    const projectRef = doc(getUserProjectsRef(userId), projectId)
    const project = await getProject(projectId)
    
    // Only owner can delete
    if (project.userId !== userId) {
      throw new Error('Only project owner can delete the project')
    }
    
    // Use batch to delete project and all its subcollections
    const batch = writeBatch(db)
    
    // Delete project document
    batch.delete(projectRef)
    
    // Delete all sprints (you might want to handle this differently for large datasets)
    const sprintsRef = getProjectSprintsRef(userId, projectId)
    const sprintsSnapshot = await getDocs(sprintsRef)
    sprintsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
    })
    
    await batch.commit()
    return { success: true }
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}

// Sprint Plan Management Functions (nested under projects)
export async function createSprintPlan(sprintPlanData: Omit<SprintPlan, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
  try {
    const userId = getCurrentUserId()
    const { projectId } = sprintPlanData
    
    // Verify project access
    await getProject(projectId)
    
    const sprintsRef = getProjectSprintsRef(userId, projectId)
    
    // Get current sprint count for numbering
    const existingSprintsSnapshot = await getDocs(sprintsRef)
    const sprintNumber = existingSprintsSnapshot.size + 1
    
    const docRef = await addDoc(sprintsRef, {
      ...sprintPlanData,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft',
      sprintNumber
    })
    
    return { id: docRef.id, ...sprintPlanData, userId }
  } catch (error) {
    console.error('Error creating sprint plan:', error)
    throw error
  }
}

export async function getSprintPlans(projectId: string, ownerUserId?: string) {
  try {
    const userId = getCurrentUserId()
    const targetUserId = ownerUserId || userId
    
    // Verify project access
    await getProject(projectId, targetUserId)
    
    const sprintsRef = getProjectSprintsRef(targetUserId, projectId)
    const q = query(sprintsRef, orderBy('createdAt', 'desc'))
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SprintPlan[]
  } catch (error) {
    console.error('Error getting sprint plans:', error)
    throw error
  }
}

export async function getSprintPlan(sprintPlanId: string, projectId: string, ownerUserId?: string) {
  try {
    const userId = getCurrentUserId()
    const targetUserId = ownerUserId || userId
    
    // Verify project access
    await getProject(projectId, targetUserId)
    
    const sprintRef = doc(getProjectSprintsRef(targetUserId, projectId), sprintPlanId)
    const sprintDoc = await getDoc(sprintRef)
    
    if (sprintDoc.exists()) {
      return { id: sprintDoc.id, ...sprintDoc.data() } as SprintPlan
    } else {
      throw new Error('Sprint plan not found')
    }
  } catch (error) {
    console.error('Error getting sprint plan:', error)
    throw error
  }
}

export async function updateSprintPlan(sprintPlanId: string, projectId: string, data: Partial<SprintPlan>, ownerUserId?: string) {
  try {
    const userId = getCurrentUserId()
    const targetUserId = ownerUserId || userId
    
    // Verify project write access
    const project = await getProject(projectId, targetUserId)
    if (project.userId !== userId && !hasProjectWriteAccess(project, userId)) {
      throw new Error('Write access denied to this project')
    }
    
    const sprintRef = doc(getProjectSprintsRef(targetUserId, projectId), sprintPlanId)
    await updateDoc(sprintRef, {
      ...data,
      updatedAt: Date.now()
    })
    
    return { id: sprintPlanId, ...data }
  } catch (error) {
    console.error('Error updating sprint plan:', error)
    throw error
  }
}

// Feature Plan Management Functions
export async function createFeaturePlan(featurePlanData: Omit<SingleFeaturePlan, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
  try {
    const userId = getCurrentUserId()
    const featuresRef = getUserFeaturesRef(userId)
    
    const docRef = await addDoc(featuresRef, {
      ...featurePlanData,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft'
    })
    
    return { id: docRef.id, ...featurePlanData, userId }
  } catch (error) {
    console.error('Error creating feature plan:', error)
    throw error
  }
}

export async function getFeaturePlans() {
  try {
    const userId = getCurrentUserId()
    const featuresRef = getUserFeaturesRef(userId)
    const q = query(featuresRef, orderBy('createdAt', 'desc'))
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SingleFeaturePlan[]
  } catch (error) {
    console.error('Error getting feature plans:', error)
    throw error
  }
}

export async function getFeaturePlan(featurePlanId: string) {
  try {
    const userId = getCurrentUserId()
    const featureRef = doc(getUserFeaturesRef(userId), featurePlanId)
    const featureDoc = await getDoc(featureRef)
    
    if (featureDoc.exists()) {
      return { id: featureDoc.id, ...featureDoc.data() } as SingleFeaturePlan
    } else {
      throw new Error('Feature plan not found')
    }
  } catch (error) {
    console.error('Error getting feature plan:', error)
    throw error
  }
}

export async function updateFeaturePlan(featurePlanId: string, data: Partial<SingleFeaturePlan>) {
  try {
    const userId = getCurrentUserId()
    const featureRef = doc(getUserFeaturesRef(userId), featurePlanId)
    
    await updateDoc(featureRef, {
      ...data,
      updatedAt: Date.now()
    })
    
    return { id: featurePlanId, ...data }
  } catch (error) {
    console.error('Error updating feature plan:', error)
    throw error
  }
}

export async function deleteFeaturePlan(featurePlanId: string) {
  try {
    const userId = getCurrentUserId()
    const featureRef = doc(getUserFeaturesRef(userId), featurePlanId)
    await deleteDoc(featureRef)
    return { success: true }
  } catch (error) {
    console.error('Error deleting feature plan:', error)
    throw error
  }
}

// Project Sharing Functions
export async function shareProject(projectId: string, targetUserEmail: string, permission: 'read' | 'write' | 'admin' = 'read') {
  try {
    const userId = getCurrentUserId()
    const project = await getProject(projectId)
    
    // Only owner and admins can share
    if (project.userId !== userId && !hasProjectAdminAccess(project, userId)) {
      throw new Error('Admin access required to share projects')
    }
    
    // Prevent admin permission sharing (only owner should have admin)
    if (permission === 'admin') {
      throw new Error('Cannot grant admin permissions. Only project owners have admin access.')
    }
    
    // Use the new invitation system
    const invitation = await createProjectInvitation(projectId, targetUserEmail, permission)
    
    return { 
      success: true, 
      invitation,
      message: `Invitation sent to ${targetUserEmail}. They will receive a notification to accept the project sharing.`
    }
  } catch (error) {
    console.error('Error sharing project:', error)
    throw error
  }
}

export async function removeProjectAccess(projectId: string, targetUserId: string) {
  try {
    const userId = getCurrentUserId()
    const projectRef = doc(getUserProjectsRef(userId), projectId)
    const project = await getProject(projectId)
    
    // Only owner and admins can remove access
    if (project.userId !== userId && !hasProjectAdminAccess(project, userId)) {
      throw new Error('Admin access required to remove project access')
    }
    
    const batch = writeBatch(db)
    
    batch.update(projectRef, {
      sharedWith: arrayRemove(targetUserId),
      updatedAt: Date.now()
    })
    
    // Remove permission field
    batch.update(projectRef, {
      [`permissions.${targetUserId}`]: null
    })
    
    await batch.commit()
    return { success: true }
  } catch (error) {
    console.error('Error removing project access:', error)
    throw error
  }
}

export async function getSharedProjects() {
  try {
    const userId = getCurrentUserId()
    
    // Query all projects where current user is in sharedWith array
    const q = query(
      collectionGroup(db, 'projects'),
      where('sharedWith', 'array-contains', userId)
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[]
  } catch (error) {
    console.error('Error getting shared projects:', error)
    return [] as Project[]
  }
}

// Permission helper functions
function hasProjectAccess(project: Project, userId: string): boolean {
  return project.userId === userId || 
         (project.sharedWith ? project.sharedWith.includes(userId) : false)
}

function hasProjectWriteAccess(project: Project, userId: string): boolean {
  if (project.userId === userId) return true
  if (!project.permissions || !project.permissions[userId]) return false
  return ['write', 'admin'].includes(project.permissions[userId])
}

function hasProjectAdminAccess(project: Project, userId: string): boolean {
  if (project.userId === userId) return true
  if (!project.permissions || !project.permissions[userId]) return false
  return project.permissions[userId] === 'admin'
}

// Database optimization functions
export async function getAllUserData(userId?: string) {
  try {
    const targetUserId = userId || getCurrentUserId()
    const userRef = getUserDocRef(targetUserId)
    
    // Get user profile
    const userDoc = await getDoc(userRef)
    if (!userDoc.exists()) {
      throw new Error('User not found')
    }
    
    const userData = userDoc.data() as UserProfile
    
    // Get all projects
    const projectsRef = getUserProjectsRef(targetUserId)
    const projectsSnapshot = await getDocs(query(projectsRef, orderBy('createdAt', 'desc')))
    const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[]
    
    // Get all features
    const featuresRef = getUserFeaturesRef(targetUserId)
    const featuresSnapshot = await getDocs(query(featuresRef, orderBy('createdAt', 'desc')))
    const features = featuresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SingleFeaturePlan[]
    
    return {
      user: userData,
      projects,
      features,
      totalProjects: projects.length,
      totalFeatures: features.length
    }
  } catch (error) {
    console.error('Error getting all user data:', error)
    throw error
  }
}

// Batch operations for better performance
export async function batchCreateProjects(projectsData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>[]) {
  try {
    const userId = getCurrentUserId()
    const batch = writeBatch(db)
    const projectsRef = getUserProjectsRef(userId)
    
    const createdProjects: Project[] = []
    
    projectsData.forEach(projectData => {
      const docRef = doc(projectsRef)
      const newProject = {
        ...projectData,
        userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active' as const,
        sharedWith: [],
        permissions: {}
      }
      
      batch.set(docRef, newProject)
      createdProjects.push({ id: docRef.id, ...newProject })
    })
    
    await batch.commit()
    return createdProjects
  } catch (error) {
    console.error('Error batch creating projects:', error)
    throw error
  }
}

// Enhanced User and Sharing Functions
export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    console.log('🔍 Looking for user with email:', normalizedEmail)
    
    // Query users collection by email
    const q = query(
      collection(db, USERS_COLLECTION),
      where('email', '==', normalizedEmail)
    )
    
    const querySnapshot = await getDocs(q)
    console.log('📊 Query result - Found documents:', querySnapshot.size)
    
    if (querySnapshot.empty) {
      console.log('❌ No user found with email:', normalizedEmail)
      
      // Debug: Let's check what users exist in the collection
      const allUsersQuery = query(collection(db, USERS_COLLECTION))
      const allUsersSnapshot = await getDocs(allUsersQuery)
      console.log('📋 Total users in collection:', allUsersSnapshot.size)
      
      if (allUsersSnapshot.size > 0) {
        console.log('👥 Existing users:')
        allUsersSnapshot.docs.forEach((doc, index) => {
          const userData = doc.data()
          console.log(`  ${index + 1}. ID: ${doc.id}, Email: "${userData.email}", Display: "${userData.displayName}"`)
        })
      }
      
      return null
    }
    
    const userDoc = querySnapshot.docs[0]
    const userData = { id: userDoc.id, ...userDoc.data() } as UserProfile
    console.log('✅ Found user:', userData.email, 'with ID:', userData.id)
    
    return userData
  } catch (error) {
    console.error('🚨 Error finding user by email:', error)
    return null
  }
}

export async function debugUserAccount(email: string): Promise<void> {
  try {
    console.log('🔧 DEBUG: Checking user account for:', email)
    
    // Check if user exists in our database
    const user = await getUserByEmail(email)
    if (user) {
      console.log('✅ User found in database:', user)
    } else {
      console.log('❌ User NOT found in database')
    }
    
    // Check current Firebase Auth user
    const currentUser = auth.currentUser
    if (currentUser) {
      console.log('🔐 Current Firebase Auth user:', {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName
      })
    }
  } catch (error) {
    console.error('🚨 Debug error:', error)
  }
}

export async function ensureUserInitialized(): Promise<UserProfile> {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('No authenticated user')
    }
    
    const userId = currentUser.uid
    const userRef = getUserDocRef(userId)
    
    // Check if user document exists
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      console.log('🏗️ Creating new user profile for:', currentUser.email)
      
      // Create user profile with proper email
      const newUserData = {
        id: userId,
        email: currentUser.email || '',
        displayName: currentUser.displayName || 'User',
        photoURL: currentUser.photoURL || '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        subscription: {
          type: 'free' as const,
          expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days free trial
        },
        settings: {
          theme: 'system' as const,
          notifications: true,
          emailPreferences: {
            marketing: true,
            updates: true
          }
        }
      }
      
      await setDoc(userRef, newUserData)
      console.log('✅ User profile created successfully')
      
      return newUserData as UserProfile
    } else {
      const userData = userDoc.data() as UserProfile
      
      // Check if email is missing or different and update if needed
      if (!userData.email || userData.email !== currentUser.email) {
        console.log('🔄 Updating user email from', userData.email, 'to', currentUser.email)
        
        await updateDoc(userRef, {
          email: currentUser.email || '',
          updatedAt: Date.now()
        })
        
        userData.email = currentUser.email || ''
      }
      
      return userData
    }
  } catch (error) {
    console.error('🚨 Error ensuring user initialization:', error)
    throw error
  }
}

export async function createProjectInvitation(
  projectId: string, 
  invitedEmail: string, 
  permission: 'read' | 'write'
): Promise<ProjectInvitation> {
  try {
    const userId = getCurrentUserId()
    const project = await getProject(projectId)
    const userProfile = await getUserProfile()
    
    // Only owner can create invitations
    if (project.userId !== userId) {
      throw new Error('Only project owners can invite users')
    }
    
    // Check if user exists on platform
    const invitedUser = await getUserByEmail(invitedEmail.toLowerCase())
    if (!invitedUser) {
      throw new Error('User not found on this platform. They must register first.')
    }
    
    // Check if user is already a member
    if (project.sharedWith?.includes(invitedUser.id)) {
      throw new Error('User already has access to this project.')
    }
    
    // Create invitation
    const invitationData: Omit<ProjectInvitation, 'id'> = {
      projectId,
      projectTitle: project.title,
      ownerUserId: userId,
      ownerEmail: userProfile.email,
      invitedEmail: invitedEmail.toLowerCase(),
      invitedUserId: invitedUser.id,
      permission,
      status: 'pending',
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    }
    
    const invitationsRef = collection(db, 'project_invitations')
    const docRef = await addDoc(invitationsRef, invitationData)
    
    // TODO: Send email notification to invited user
    console.log(`Invitation sent to ${invitedEmail} for project: ${project.title}`)
    
    return { id: docRef.id, ...invitationData }
  } catch (error) {
    console.error('Error creating project invitation:', error)
    throw error
  }
}

export async function acceptProjectInvitation(invitationId: string): Promise<void> {
  try {
    const userId = getCurrentUserId()
    const invitationRef = doc(db, 'project_invitations', invitationId)
    const invitationDoc = await getDoc(invitationRef)
    
    if (!invitationDoc.exists()) {
      throw new Error('Invitation not found')
    }
    
    const invitation = invitationDoc.data() as ProjectInvitation
    
    // Verify invitation is for current user
    if (invitation.invitedUserId !== userId) {
      throw new Error('This invitation is not for you')
    }
    
    // Check if invitation is still valid
    if (invitation.status !== 'pending') {
      throw new Error('Invitation is no longer valid')
    }
    
    if (invitation.expiresAt < Date.now()) {
      throw new Error('Invitation has expired')
    }
    
    // Add user to project
    const projectRef = doc(getUserProjectsRef(invitation.ownerUserId), invitation.projectId)
    await updateDoc(projectRef, {
      sharedWith: arrayUnion(userId),
      [`permissions.${userId}`]: invitation.permission,
      updatedAt: Date.now()
    })
    
    // Update invitation status
    await updateDoc(invitationRef, {
      status: 'accepted',
      acceptedAt: Date.now()
    })
  } catch (error) {
    console.error('Error accepting project invitation:', error)
    throw error
  }
}

export async function declineProjectInvitation(invitationId: string): Promise<void> {
  try {
    const userId = getCurrentUserId()
    const invitationRef = doc(db, 'project_invitations', invitationId)
    const invitationDoc = await getDoc(invitationRef)
    
    if (!invitationDoc.exists()) {
      throw new Error('Invitation not found')
    }
    
    const invitation = invitationDoc.data() as ProjectInvitation
    
    // Verify invitation is for current user
    if (invitation.invitedUserId !== userId) {
      throw new Error('This invitation is not for you')
    }
    
    // Update invitation status
    await updateDoc(invitationRef, {
      status: 'declined',
      declinedAt: Date.now()
    })
  } catch (error) {
    console.error('Error declining project invitation:', error)
    throw error
  }
}

export async function getUserProjectInvitations(): Promise<ProjectInvitation[]> {
  try {
    const userId = getCurrentUserId()
    const invitationsRef = collection(db, 'project_invitations')
    const q = query(
      invitationsRef,
      where('invitedUserId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ProjectInvitation[]
  } catch (error) {
    console.error('Error getting user project invitations:', error)
    throw error
  }
}

// Enhanced helper function for email validation in sharing context
export async function validateEmailForSharing(email: string): Promise<{
  isValid: boolean
  user?: UserProfile
  message: string
}> {
  try {
    const user = await getUserByEmail(email)
    
    if (!user) {
      return {
        isValid: false,
        message: `The user ${email} is not registered on this platform. Please ask them to sign up first.`
      }
    }
    
    return {
      isValid: true,
      user,
      message: `User found: ${user.displayName || user.email}`
    }
  } catch (error) {
    console.error('Error validating email for sharing:', error)
    return {
      isValid: false,
      message: 'Error validating email. Please try again.'
    }
  }
}

// ===========================================
// TASK STATE PERSISTENCE FUNCTIONS
// ===========================================

// Helper function to get sprint task states collection reference
function getSprintTaskStatesRef(userId: string, projectId: string) {
  return collection(getUserDocRef(userId), 'projects', projectId, 'sprintTaskStates')
}

// Helper function to get feature task states collection reference
function getFeatureTaskStatesRef(userId: string, featureId: string) {
  return collection(getUserDocRef(userId), 'features', featureId, 'taskStates')
}

/**
 * Save task states for a sprint
 */
export async function saveSprintTaskStates(
  projectId: string,
  sprintIndex: number,
  planType: 'developer' | 'ai',
  taskStates: TaskState[]
): Promise<void> {
  try {
    const userId = getCurrentUserId()
    const sprintTaskStatesRef = getSprintTaskStatesRef(userId, projectId)
    
    // Create unique ID for this sprint/plan combination
    const stateId = `sprint-${sprintIndex}-${planType}`
    
    const sprintTaskStatesDoc = doc(sprintTaskStatesRef, stateId)
    
    const data: SprintTaskStates = {
      projectId,
      sprintIndex,
      planType,
      taskStates,
      updatedAt: Date.now(),
      userId
    }
    
    await setDoc(sprintTaskStatesDoc, data)
    console.log(`✅ Saved task states for ${planType} sprint ${sprintIndex}`)
  } catch (error) {
    console.error('Error saving sprint task states:', error)
    throw error
  }
}

/**
 * Load task states for a sprint
 */
export async function loadSprintTaskStates(
  projectId: string,
  sprintIndex: number,
  planType: 'developer' | 'ai'
): Promise<TaskState[]> {
  try {
    const userId = getCurrentUserId()
    const sprintTaskStatesRef = getSprintTaskStatesRef(userId, projectId)
    
    // Create unique ID for this sprint/plan combination
    const stateId = `sprint-${sprintIndex}-${planType}`
    
    const sprintTaskStatesDoc = doc(sprintTaskStatesRef, stateId)
    const docSnap = await getDoc(sprintTaskStatesDoc)
    
    if (docSnap.exists()) {
      const data = docSnap.data() as SprintTaskStates
      console.log(`📋 Loaded task states for ${planType} sprint ${sprintIndex}:`, data.taskStates.length, 'tasks')
      return data.taskStates
    }
    
    console.log(`📋 No saved task states found for ${planType} sprint ${sprintIndex}`)
    return []
  } catch (error) {
    console.error('Error loading sprint task states:', error)
    return []
  }
}

/**
 * Save task states for a feature
 */
export async function saveFeatureTaskStates(
  featureId: string,
  planType: 'developer' | 'ai',
  taskStates: TaskState[]
): Promise<void> {
  try {
    const userId = getCurrentUserId()
    const featureTaskStatesRef = getFeatureTaskStatesRef(userId, featureId)
    
    const stateId = `feature-${planType}`
    const featureTaskStatesDoc = doc(featureTaskStatesRef, stateId)
    
    const data: FeatureTaskStates = {
      featureId,
      planType,
      taskStates,
      updatedAt: Date.now(),
      userId
    }
    
    await setDoc(featureTaskStatesDoc, data)
    console.log(`✅ Saved task states for ${planType} feature`)
  } catch (error) {
    console.error('Error saving feature task states:', error)
    throw error
  }
}

/**
 * Load task states for a feature
 */
export async function loadFeatureTaskStates(
  featureId: string,
  planType: 'developer' | 'ai'
): Promise<TaskState[]> {
  try {
    const userId = getCurrentUserId()
    const featureTaskStatesRef = getFeatureTaskStatesRef(userId, featureId)
    
    const stateId = `feature-${planType}`
    const featureTaskStatesDoc = doc(featureTaskStatesRef, stateId)
    const docSnap = await getDoc(featureTaskStatesDoc)
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FeatureTaskStates
      console.log(`📋 Loaded task states for ${planType} feature:`, data.taskStates.length, 'tasks')
      return data.taskStates
    }
    
    console.log(`📋 No saved task states found for ${planType} feature`)
    return []
  } catch (error) {
    console.error('Error loading feature task states:', error)
    return []
  }
}

/**
 * Update a single task state (status, comments, commit ID)
 */
export async function updateTaskState(
  taskId: string,
  updates: Partial<Omit<TaskState, 'id' | 'taskId' | 'updatedAt' | 'updatedBy'>>,
  context: {
    type: 'sprint' | 'feature'
    projectId?: string
    featureId?: string
    sprintIndex?: number
    planType: 'developer' | 'ai'
  }
): Promise<void> {
  try {
    const userId = getCurrentUserId()
    const userProfile = await getUserProfile()
    
    // Load current task states
    let currentTaskStates: TaskState[] = []
    
    if (context.type === 'sprint' && context.projectId !== undefined && context.sprintIndex !== undefined) {
      currentTaskStates = await loadSprintTaskStates(context.projectId, context.sprintIndex, context.planType)
    } else if (context.type === 'feature' && context.featureId) {
      currentTaskStates = await loadFeatureTaskStates(context.featureId, context.planType)
    }
    
    // Find and update the task state
    const taskStateIndex = currentTaskStates.findIndex(ts => ts.id === taskId)
    
    if (taskStateIndex >= 0) {
      // Update existing task state
      currentTaskStates[taskStateIndex] = {
        ...currentTaskStates[taskStateIndex],
        ...updates,
        updatedAt: Date.now(),
        updatedBy: userProfile.email
      }
    } else {
      // Create new task state
      const newTaskState: TaskState = {
        id: taskId,
        taskId: taskId, // This should be updated with proper display ID
        status: 'todo',
        comments: [],
        commitId: '',
        ...updates,
        updatedAt: Date.now(),
        updatedBy: userProfile.email
      }
      currentTaskStates.push(newTaskState)
    }
    
    // Save updated task states
    if (context.type === 'sprint' && context.projectId !== undefined && context.sprintIndex !== undefined) {
      await saveSprintTaskStates(context.projectId, context.sprintIndex, context.planType, currentTaskStates)
    } else if (context.type === 'feature' && context.featureId) {
      await saveFeatureTaskStates(context.featureId, context.planType, currentTaskStates)
    }
    
    console.log(`✅ Updated task state for ${taskId}`)
  } catch (error) {
    console.error('Error updating task state:', error)
    throw error
  }
} 