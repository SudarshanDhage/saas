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
  collectionGroup
} from 'firebase/firestore';
import { db, auth } from './firebase';

// Collection Paths - Updated for new nested structure
const USERS_COLLECTION = 'users';
// Sub-collections under user
const PROJECTS_SUBCOLLECTION = 'projects';
const FEATURES_SUBCOLLECTION = 'features';
const ACCOUNT_SUBCOLLECTION = 'account';

// Types
export interface Project {
  id?: string;
  title: string;
  description: string;
  coreFeatures: Feature[];
  suggestedFeatures: Feature[];
  createdAt: number;
  userId: string;
  techStack?: any;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
}

export interface SprintPlan {
  id?: string;
  projectId: string;
  developerPlan: any;
  aiPlan: any;
  createdAt: number;
  userId: string;
}

export interface SingleFeaturePlan {
  id?: string;
  feature: {
    title: string;
    description: string;
  };
  developerPlan: any;
  aiPlan: any;
  createdAt: number;
  userId: string;
  projectId?: string; // Optional reference to the parent project
}

export interface UserAccount {
  id?: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: number;
  subscription?: {
    type: 'free' | 'pro' | 'enterprise';
    expiresAt: number;
    paymentId?: string;
  };
  settings?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    emailPreferences: {
      marketing: boolean;
      updates: boolean;
    };
  };
}

// Define types for new entities
export interface CostEstimation {
  id?: string;
  projectId: string;
  overview: {
    summary: string;
    totalCostSmallScale: string;
    totalCostMediumScale: string;
    totalCostLargeScale: string;
    majorCostDrivers: string[];
  };
  costCategories: any[];
  optimizationStrategies: any[];
  environmentCosts: any;
  assumptions: string[];
  recommendations: string[];
  createdAt: number;
  userId: string;
}

// Helper function to check authentication - now required for all operations
function getCurrentUserId(): string {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required');
  }
  return user.uid;
}

// Path helpers for the nested structure
function getUserDocRef(userId: string) {
  return doc(db, USERS_COLLECTION, userId);
}

function getProjectsCollectionRef(userId: string) {
  return collection(db, USERS_COLLECTION, userId, PROJECTS_SUBCOLLECTION);
}

function getProjectDocRef(userId: string, projectId: string) {
  return doc(db, USERS_COLLECTION, userId, PROJECTS_SUBCOLLECTION, projectId);
}

function getFeaturesCollectionRef(userId: string) {
  return collection(db, USERS_COLLECTION, userId, FEATURES_SUBCOLLECTION);
}

function getFeatureDocRef(userId: string, featureId: string) {
  return doc(db, USERS_COLLECTION, userId, FEATURES_SUBCOLLECTION, featureId);
}

function getAccountDocRef(userId: string) {
  return doc(db, USERS_COLLECTION, userId, ACCOUNT_SUBCOLLECTION, 'profile');
}

// Helper functions for database design and cost estimation
function getProjectCostEstimationDocRef(userId: string, projectId: string) {
  return doc(db, USERS_COLLECTION, userId, PROJECTS_SUBCOLLECTION, projectId, 'cost-estimation', 'latest');
}

// Projects
export async function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'userId'>) {
  try {
    const userId = getCurrentUserId();
    
    // Generate a new document ID for the project
    const projectsRef = getProjectsCollectionRef(userId);
    const newProjectRef = doc(projectsRef);
    
    // Project data with user ID and timestamp
    const newProject = {
      ...projectData,
      createdAt: Date.now(),
      userId
    };
    
    // Set the document with the generated ID
    await setDoc(newProjectRef, newProject);
    
    return { id: newProjectRef.id, ...newProject };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function getProjects() {
  try {
    const userId = getCurrentUserId();
    
    // Reference to the user's projects collection
    const projectsRef = getProjectsCollectionRef(userId);
    
    // Query all projects, ordered by creation date
    const projectsQuery = query(
      projectsRef,
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(projectsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
}

export async function getProject(projectId: string) {
  try {
    const userId = getCurrentUserId();
    
    console.log(`Fetching project (ID: ${projectId}) for user (ID: ${userId})`);
    
    // Get reference to the specific project
    const projectRef = getProjectDocRef(userId, projectId);
    const docSnap = await getDoc(projectRef);
    
    if (!docSnap.exists()) {
      console.error(`Project not found. Project ID: ${projectId}, User ID: ${userId}`);
      throw new Error('Project not found');
    }
    
    // Get the raw data
    const projectData = docSnap.data();
    
    // Ensure projectData is not null/undefined
    if (!projectData) {
      console.error(`Project data is empty. Project ID: ${projectId}`);
      throw new Error('Project data is empty');
    }

    // Add validation and default values for critical fields
    const result = {
      id: docSnap.id,
      title: projectData.title || 'Untitled Project',
      description: projectData.description || '',
      coreFeatures: Array.isArray(projectData.coreFeatures) ? projectData.coreFeatures : [],
      suggestedFeatures: Array.isArray(projectData.suggestedFeatures) ? projectData.suggestedFeatures : [],
      createdAt: projectData.createdAt || Date.now(),
      userId: projectData.userId || userId,
      techStack: projectData.techStack || {}
    };
    
    console.log('Retrieved project data:', {
      id: result.id,
      title: result.title,
      coreFeatures: result.coreFeatures.length,
      suggestedFeatures: result.suggestedFeatures.length,
      techStack: Object.keys(result.techStack || {})
    });
    
    return result as Project;
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
}

export async function updateProject(projectId: string, data: Partial<Project>) {
  try {
    const userId = getCurrentUserId();
    const projectRef = getProjectDocRef(userId, projectId);
    
    // Verify the document exists
    const docSnap = await getDoc(projectRef);
    if (!docSnap.exists()) {
      throw new Error('Project not found');
    }
    
    await updateDoc(projectRef, data);
    return { id: projectId, ...data };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(projectId: string) {
  try {
    const userId = getCurrentUserId();
    const projectRef = getProjectDocRef(userId, projectId);
    
    // Verify the document exists
    const docSnap = await getDoc(projectRef);
    if (!docSnap.exists()) {
      throw new Error('Project not found');
    }
    
    await deleteDoc(projectRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Project details - Sub-collections under a project
function getProjectSprintsCollectionRef(userId: string, projectId: string) {
  return collection(db, USERS_COLLECTION, userId, PROJECTS_SUBCOLLECTION, projectId, 'sprints');
}

function getProjectSprintDocRef(userId: string, projectId: string, sprintId: string) {
  return doc(db, USERS_COLLECTION, userId, PROJECTS_SUBCOLLECTION, projectId, 'sprints', sprintId);
}

function getProjectDocumentationDocRef(userId: string, projectId: string) {
  return doc(db, USERS_COLLECTION, userId, PROJECTS_SUBCOLLECTION, projectId, 'documentation', 'main');
}

// Sprint Plans
export async function createSprintPlan(sprintPlanData: Omit<SprintPlan, 'id' | 'createdAt' | 'userId'>) {
  try {
    const userId = getCurrentUserId();
    
    // Ensure we have valid project ID
    if (!sprintPlanData.projectId) {
      throw new Error('Project ID is required');
    }
    
    // Verify the project exists
    const projectRef = getProjectDocRef(userId, sprintPlanData.projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) {
      throw new Error('Project not found');
    }
    
    // Ensure developerPlan and aiPlan are not undefined
    const developerPlan = sprintPlanData.developerPlan || { sprints: [] };
    const aiPlan = sprintPlanData.aiPlan || { sprints: [] };
    
    // Create a new sprint plan
    const sprintsRef = getProjectSprintsCollectionRef(userId, sprintPlanData.projectId);
    const newSprintRef = doc(sprintsRef);
    
    const newSprintPlan = {
      projectId: sprintPlanData.projectId,
      developerPlan,
      aiPlan,
      createdAt: Date.now(),
      userId
    };
    
    await setDoc(newSprintRef, newSprintPlan);
    
    return { id: newSprintRef.id, ...newSprintPlan };
  } catch (error) {
    console.error('Error creating sprint plan:', error);
    throw error;
  }
}

export async function getSprintPlans(projectId: string) {
  try {
    const userId = getCurrentUserId();
    
    // Verify the project exists and belongs to the user
    const projectRef = getProjectDocRef(userId, projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) {
      throw new Error('Project not found');
    }
    
    // Get all sprint plans for this project
    const sprintsRef = getProjectSprintsCollectionRef(userId, projectId);
    const sprintsQuery = query(sprintsRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(sprintsQuery);
    
    // Process and validate each document
    const plans = querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Validate the structure of developer and AI plans
      const developerPlan = data.developerPlan && typeof data.developerPlan === 'object' 
        ? data.developerPlan 
        : { sprints: [] };
      
      const aiPlan = data.aiPlan && typeof data.aiPlan === 'object'
        ? data.aiPlan
        : { sprints: [] };
      
      // Ensure the sprints array exists in both plans
      if (!Array.isArray(developerPlan.sprints)) {
        developerPlan.sprints = [];
      }
      
      if (!Array.isArray(aiPlan.sprints)) {
        aiPlan.sprints = [];
      }
      
      return {
        id: doc.id,
        projectId: data.projectId || projectId,
        developerPlan,
        aiPlan,
        createdAt: data.createdAt || Date.now(),
        userId: data.userId || userId
      };
    });
    
    console.log(`Retrieved ${plans.length} sprint plans for project ${projectId}`);
    
    return plans as SprintPlan[];
  } catch (error) {
    console.error('Error getting sprint plans:', error);
    throw error;
  }
}

export async function getSprintPlan(projectId: string, sprintId: string) {
  try {
    const userId = getCurrentUserId();
    
    // Get the specific sprint plan
    const sprintRef = getProjectSprintDocRef(userId, projectId, sprintId);
    const sprintSnap = await getDoc(sprintRef);
    
    if (!sprintSnap.exists()) {
      throw new Error('Sprint plan not found');
    }
    
    return {
      id: sprintSnap.id,
      ...sprintSnap.data()
    } as SprintPlan;
  } catch (error) {
    console.error('Error getting sprint plan:', error);
    throw error;
  }
}

// Feature Plans
export async function createFeaturePlan(featurePlanData: Omit<SingleFeaturePlan, 'id' | 'createdAt' | 'userId'>) {
  try {
    const userId = getCurrentUserId();
    
    // Reference to the features collection
    const featuresRef = getFeaturesCollectionRef(userId);
    const newFeatureRef = doc(featuresRef);
    
    const newFeaturePlan = {
      ...featurePlanData,
      createdAt: Date.now(),
      userId
    };
    
    // If this feature is linked to a project, verify the project exists
    if (featurePlanData.projectId) {
      const projectRef = getProjectDocRef(userId, featurePlanData.projectId);
      const projectSnap = await getDoc(projectRef);
      
      if (!projectSnap.exists()) {
        throw new Error('Project not found');
      }
    }
    
    await setDoc(newFeatureRef, newFeaturePlan);
    
    return { id: newFeatureRef.id, ...newFeaturePlan };
  } catch (error) {
    console.error('Error creating feature plan:', error);
    throw error;
  }
}

export async function getFeaturePlans() {
  try {
    const userId = getCurrentUserId();
    
    // Get all feature plans for the user
    const featuresRef = getFeaturesCollectionRef(userId);
    const featuresQuery = query(featuresRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(featuresQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SingleFeaturePlan[];
  } catch (error) {
    console.error('Error getting feature plans:', error);
    throw error;
  }
}

export async function getFeaturePlan(featureId: string) {
  try {
    const userId = getCurrentUserId();
    
    // Get the specific feature plan
    const featureRef = getFeatureDocRef(userId, featureId);
    const featureSnap = await getDoc(featureRef);
    
    if (!featureSnap.exists()) {
      throw new Error('Feature plan not found');
    }
    
    return {
      id: featureSnap.id,
      ...featureSnap.data()
    } as SingleFeaturePlan;
  } catch (error) {
    console.error('Error getting feature plan:', error);
    throw error;
  }
}

// User Account Management
export async function initializeUserAccount(userData: Partial<UserAccount>) {
  try {
    const userId = getCurrentUserId();
    
    // Create basic user document in users collection
    await setDoc(getUserDocRef(userId), {
      id: userId,
      createdAt: Date.now()
    }, { merge: true });
    
    // Create the account profile document
    const accountRef = getAccountDocRef(userId);
    
    const accountData = {
      displayName: userData.displayName || auth.currentUser?.displayName || '',
      email: userData.email || auth.currentUser?.email || '',
      photoURL: userData.photoURL || auth.currentUser?.photoURL || '',
      createdAt: Date.now(),
      subscription: {
        type: 'free',
        expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year free trial
      },
      settings: {
        theme: 'system',
        notifications: true,
        emailPreferences: {
          marketing: true,
          updates: true
        }
      },
      ...userData
    };
    
    await setDoc(accountRef, accountData);
    
    return { id: userId, ...accountData };
  } catch (error) {
    console.error('Error initializing user account:', error);
    throw error;
  }
}

export async function getUserAccount() {
  try {
    const userId = getCurrentUserId();
    
    // Get the user's account profile
    const accountRef = getAccountDocRef(userId);
    const accountSnap = await getDoc(accountRef);
    
    if (!accountSnap.exists()) {
      // If account doesn't exist yet, initialize it
      return initializeUserAccount({});
    }
    
    return {
      id: userId,
      ...accountSnap.data()
    } as UserAccount;
  } catch (error) {
    console.error('Error getting user account:', error);
    throw error;
  }
}

export async function updateUserAccount(data: Partial<UserAccount>) {
  try {
    const userId = getCurrentUserId();
    const accountRef = getAccountDocRef(userId);
    
    await updateDoc(accountRef, data);
    
    return { id: userId, ...data };
  } catch (error) {
    console.error('Error updating user account:', error);
    throw error;
  }
}

// Project Features - Sub-collection under a specific project
function getProjectFeaturesCollectionRef(userId: string, projectId: string) {
  return collection(db, USERS_COLLECTION, userId, PROJECTS_SUBCOLLECTION, projectId, 'features');
}

export async function getProjectFeatures(projectId: string) {
  try {
    const userId = getCurrentUserId();
    
    // Verify the project exists
    const projectRef = getProjectDocRef(userId, projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) {
      throw new Error('Project not found');
    }
    
    // Get all features for this project
    const featuresRef = getProjectFeaturesCollectionRef(userId, projectId);
    const featuresQuery = query(featuresRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(featuresQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SingleFeaturePlan[];
  } catch (error) {
    console.error('Error getting project features:', error);
    throw error;
  }
}

// Additional helper functions for more complex operations
export async function searchAllUserData(searchTerm: string) {
  try {
    const userId = getCurrentUserId();
    const results = {
      projects: [] as Project[],
      features: [] as SingleFeaturePlan[]
    };
    
    // Search projects
    const projectsRef = getProjectsCollectionRef(userId);
    const projectsSnapshot = await getDocs(projectsRef);
    
    results.projects = projectsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }) as Project)
      .filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Search features
    const featuresRef = getFeaturesCollectionRef(userId);
    const featuresSnapshot = await getDocs(featuresRef);
    
    results.features = featuresSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }) as SingleFeaturePlan)
      .filter(feature => 
        feature.feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.feature.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return results;
  } catch (error) {
    console.error('Error searching user data:', error);
    throw error;
  }
}

// Save cost estimation for a project
export async function saveCostEstimation(costEstimationData: Omit<CostEstimation, 'id' | 'createdAt' | 'userId'>) {
  try {
    const userId = getCurrentUserId();
    
    if (!costEstimationData.projectId) {
      throw new Error('Project ID is required');
    }
    
    // Verify project exists and belongs to user
    const projectRef = getProjectDocRef(userId, costEstimationData.projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (!projectDoc.exists()) {
      throw new Error('Project not found or access denied');
    }
    
    // Set up the document data
    const estimationData = {
      ...costEstimationData,
      createdAt: Date.now(),
      userId
    };
    
    // Save the cost estimation
    const costRef = getProjectCostEstimationDocRef(userId, costEstimationData.projectId);
    await setDoc(costRef, estimationData);
    
    return { id: costRef.id, ...estimationData };
  } catch (error) {
    console.error('Error saving cost estimation:', error);
    throw error;
  }
}

// Get cost estimation for a project
export async function getCostEstimation(projectId: string) {
  try {
    const userId = getCurrentUserId();
    
    // Get reference to the specific cost estimation
    const costRef = getProjectCostEstimationDocRef(userId, projectId);
    const docSnap = await getDoc(costRef);
    
    if (!docSnap.exists()) {
      return null; // No estimation exists yet
    }
    
    return { id: docSnap.id, ...docSnap.data() } as CostEstimation;
  } catch (error) {
    console.error('Error getting cost estimation:', error);
    throw error;
  }
} 