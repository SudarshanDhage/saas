// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';
import { getAuth, connectAuthEmulator, GoogleAuthProvider, Auth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if all required Firebase config values exist
if (!firebaseConfig.apiKey || 
    !firebaseConfig.authDomain || 
    !firebaseConfig.projectId || 
    !firebaseConfig.storageBucket || 
    !firebaseConfig.messagingSenderId || 
    !firebaseConfig.appId) {
  console.error('Firebase config is missing required fields. Check your environment variables.');
}

// Initialize Firebase with proper types
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
  
  // Connect to emulators in development mode
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
    if (typeof window !== 'undefined') {
      // Only connect to emulators in client-side code
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('Connected to Firebase emulators');
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  
  // Initialize with empty objects as fallbacks to prevent app crashes
  if (typeof window !== 'undefined') {
    // Only log detailed errors in client-side code
    console.error('Firebase initialization error. Check your Firebase configuration and connectivity.');
  }
}

export { 
  app, 
  auth, 
  db, 
  storage, 
  googleProvider 
}; 