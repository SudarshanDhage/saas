import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { initializeUserAccount } from './firestore';

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Initialize user account in Firestore with proper structure
    if (user) {
      await initializeUserAccount({
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || ''
      });
    }
    
    return { success: true, user };
  } catch (error) {
    console.error("Error signing in with Google", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Sign out
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error signing out", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Listen to auth state changes
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}

// Check if user is logged in
export function isLoggedIn() {
  return !!auth.currentUser;
}

// Helper to ensure user is authenticated before certain operations
export function checkAuth() {
  if (!auth.currentUser) {
    throw new Error('Authentication required');
  }
  return auth.currentUser;
} 