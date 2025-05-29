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
  setDoc
} from 'firebase/firestore';
import { db, auth } from './firebase';

// Collection Paths
const USERS_COLLECTION = 'users';
const ACCOUNT_SUBCOLLECTION = 'account';
// Project Collections
const PROJECTS_COLLECTION = 'projects';
const SPRINT_PLANS_COLLECTION = 'sprintPlans';
const FEATURES_COLLECTION = 'features';

// Types
export interface Project {
  id?: string;
  title: string;
  description: string;
  coreFeatures: Feature[];
  suggestedFeatures: Feature[];
  createdAt: number;
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
}

// Projects
export async function createProject(projectData: Omit<Project, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      ...projectData,
      createdAt: Date.now()
    });
    
    return { id: docRef.id, ...projectData };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function getProjects() {
  try {
    const projectsQuery = query(
      collection(db, PROJECTS_COLLECTION),
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
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Project;
    } else {
      throw new Error('Project not found');
    }
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
}

export async function updateProject(projectId: string, data: Partial<Project>) {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(docRef, data);
    return { id: projectId, ...data };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(projectId: string) {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Sprint Plans
export async function createSprintPlan(sprintPlanData: Omit<SprintPlan, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, SPRINT_PLANS_COLLECTION), {
      ...sprintPlanData,
      createdAt: Date.now()
    });
    
    return { id: docRef.id, ...sprintPlanData };
  } catch (error) {
    console.error('Error creating sprint plan:', error);
    throw error;
  }
}

export async function getSprintPlans(projectId: string) {
  try {
    // First get all sprint plans with the matching projectId
    const sprintPlansQuery = query(
      collection(db, SPRINT_PLANS_COLLECTION),
      where('projectId', '==', projectId)
    );
    
    const querySnapshot = await getDocs(sprintPlansQuery);
    
    // Then sort them in memory by createdAt
    const plans = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SprintPlan[];
    
    // Sort from newest to oldest
    return plans.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error getting sprint plans:', error);
    throw error;
  }
}

export async function getSprintPlan(sprintPlanId: string) {
  try {
    const docRef = doc(db, SPRINT_PLANS_COLLECTION, sprintPlanId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as SprintPlan;
    } else {
      throw new Error('Sprint plan not found');
    }
  } catch (error) {
    console.error('Error getting sprint plan:', error);
    throw error;
  }
}

// Single Feature Plans
export async function createFeaturePlan(featurePlanData: Omit<SingleFeaturePlan, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, FEATURES_COLLECTION), {
      ...featurePlanData,
      createdAt: Date.now()
    });
    
    return { id: docRef.id, ...featurePlanData };
  } catch (error) {
    console.error('Error creating feature plan:', error);
    throw error;
  }
}

export async function getFeaturePlans() {
  try {
    const featurePlansQuery = query(
      collection(db, FEATURES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(featurePlansQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SingleFeaturePlan[];
  } catch (error) {
    console.error('Error getting feature plans:', error);
    throw error;
  }
}

export async function getFeaturePlan(featurePlanId: string) {
  try {
    const docRef = doc(db, FEATURES_COLLECTION, featurePlanId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as SingleFeaturePlan;
    } else {
      throw new Error('Feature plan not found');
    }
  } catch (error) {
    console.error('Error getting feature plan:', error);
    throw error;
  }
} 

// Types
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

// Helper function to check authentication
function getCurrentUserId(): string {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required');
  }
  return user.uid;
}

// Path helpers
function getUserDocRef(userId: string) {
  return doc(db, USERS_COLLECTION, userId);
}

function getAccountDocRef(userId: string) {
  return doc(db, USERS_COLLECTION, userId, ACCOUNT_SUBCOLLECTION, 'profile');
}

// User Account Functions
export async function initializeUserAccount(userData: Partial<UserAccount>) {
  try {
    const userId = getCurrentUserId();
    
    const accountRef = getAccountDocRef(userId);
    
    const newAccount: UserAccount = {
      displayName: userData.displayName || auth.currentUser?.displayName || '',
      email: userData.email || auth.currentUser?.email || '',
      photoURL: userData.photoURL || auth.currentUser?.photoURL || '',
      createdAt: Date.now(),
      subscription: {
        type: 'free',
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      settings: {
        theme: 'system',
        notifications: true,
        emailPreferences: {
          marketing: false,
          updates: true,
        },
      },
      ...userData,
    };
    
    await setDoc(accountRef, newAccount);
    return { id: userId, ...newAccount };
  } catch (error) {
    console.error('Error initializing user account:', error);
    throw error;
  }
}

export async function getUserAccount() {
  try {
    const userId = getCurrentUserId();
    
    const accountRef = getAccountDocRef(userId);
    const accountSnap = await getDoc(accountRef);
    
    if (accountSnap.exists()) {
      return { id: accountSnap.id, ...accountSnap.data() } as UserAccount;
    } else {
      // Initialize account if it doesn't exist
      return await initializeUserAccount({});
    }
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
    
    return await getUserAccount();
  } catch (error) {
    console.error('Error updating user account:', error);
    throw error;
  }
} 