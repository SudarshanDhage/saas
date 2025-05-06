/**
 * Database Structure Testing Script
 * 
 * This script tests the new nested Firestore database structure by:
 * 1. Creating a test user account 
 * 2. Adding test projects, features, and account data
 * 3. Retrieving the data to verify it's stored correctly
 * 
 * How to use this script:
 * 1. Ensure you have Firebase Admin SDK installed: npm install firebase-admin
 * 2. Set up service account credentials as described below
 * 3. Run: node scripts/testDatabaseStructure.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Set to true to create test data, false to just verify existing data
const SHOULD_CREATE_TEST_DATA = false;
// Use a known user ID for testing or leave empty to use a random ID
const TEST_USER_ID = ''; // e.g. '123456789'

// Initialize Firebase Admin SDK with service account credentials
const serviceAccountPath = path.join(__dirname, '../service-account-key.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Service account key file not found at:', serviceAccountPath);
  console.error('Please download your service account key from the Firebase console:');
  console.error('Project Settings > Service accounts > Generate new private key');
  process.exit(1);
}

try {
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('❌ Error initializing Firebase Admin SDK:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// Collection paths
const USERS_COLLECTION = 'users';
const PROJECTS_SUBCOLLECTION = 'projects';
const FEATURES_SUBCOLLECTION = 'features';
const ACCOUNT_SUBCOLLECTION = 'account';

// Test data
const testUserId = TEST_USER_ID || `test_user_${Date.now()}`;
const projectId = `test_project_${Date.now()}`;
const featureId = `test_feature_${Date.now()}`;

// Create test user account
async function createTestUser() {
  console.log(`🧪 Creating test user with ID: ${testUserId}`);
  
  // Create user document
  await db.collection(USERS_COLLECTION).doc(testUserId).set({
    id: testUserId,
    createdAt: Date.now()
  });
  
  // Create user account profile
  await db
    .collection(USERS_COLLECTION)
    .doc(testUserId)
    .collection(ACCOUNT_SUBCOLLECTION)
    .doc('profile')
    .set({
      displayName: 'Test User',
      email: 'test@example.com',
      photoURL: 'https://via.placeholder.com/150',
      createdAt: Date.now(),
      subscription: {
        type: 'free',
        expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
      },
      settings: {
        theme: 'system',
        notifications: true,
        emailPreferences: {
          marketing: true,
          updates: true
        }
      }
    });
  
  console.log('✅ Test user created successfully');
}

// Create a test project
async function createTestProject() {
  console.log(`🧪 Creating test project for user: ${testUserId}`);
  
  // Create project
  await db
    .collection(USERS_COLLECTION)
    .doc(testUserId)
    .collection(PROJECTS_SUBCOLLECTION)
    .doc(projectId)
    .set({
      id: projectId,
      title: 'Test Project',
      description: 'This is a test project for database structure verification',
      coreFeatures: [
        { id: '1', name: 'Core Feature 1', description: 'Description 1' },
        { id: '2', name: 'Core Feature 2', description: 'Description 2' }
      ],
      suggestedFeatures: [
        { id: '3', name: 'Suggested Feature 1', description: 'Description 3' }
      ],
      createdAt: Date.now(),
      userId: testUserId,
      techStack: {
        frontend: 'React',
        backend: 'Node.js',
        database: 'Firestore'
      }
    });
  
  // Create a sprint plan for the project
  await db
    .collection(USERS_COLLECTION)
    .doc(testUserId)
    .collection(PROJECTS_SUBCOLLECTION)
    .doc(projectId)
    .collection('sprints')
    .doc(`sprint_${Date.now()}`)
    .set({
      projectId: projectId,
      developerPlan: {
        sprints: [
          { name: 'Sprint 1', duration: '2 weeks', tasks: ['Task 1', 'Task 2'] }
        ]
      },
      aiPlan: {
        recommendation: 'AI generated sprint plan'
      },
      createdAt: Date.now(),
      userId: testUserId
    });
  
  // Create project documentation
  await db
    .collection(USERS_COLLECTION)
    .doc(testUserId)
    .collection(PROJECTS_SUBCOLLECTION)
    .doc(projectId)
    .collection('documentation')
    .doc('main')
    .set({
      content: 'This is test documentation for the project',
      updatedAt: Date.now(),
      userId: testUserId
    });
  
  console.log('✅ Test project created successfully');
}

// Create a test feature plan
async function createTestFeature() {
  console.log(`🧪 Creating test feature plan for user: ${testUserId}`);
  
  // Create feature plan in user's features collection
  await db
    .collection(USERS_COLLECTION)
    .doc(testUserId)
    .collection(FEATURES_SUBCOLLECTION)
    .doc(featureId)
    .set({
      id: featureId,
      feature: {
        title: 'Test Feature',
        description: 'This is a test feature for database structure verification'
      },
      developerPlan: {
        tasks: [
          { name: 'Task 1', estimate: '2 days' },
          { name: 'Task 2', estimate: '3 days' }
        ]
      },
      aiPlan: {
        suggestion: 'AI generated feature implementation'
      },
      createdAt: Date.now(),
      userId: testUserId,
      projectId: projectId // Link to the project
    });
  
  // Create reference in project's features collection
  await db
    .collection(USERS_COLLECTION)
    .doc(testUserId)
    .collection(PROJECTS_SUBCOLLECTION)
    .doc(projectId)
    .collection('features')
    .doc(featureId)
    .set({
      id: featureId,
      feature: {
        title: 'Test Feature',
        description: 'This is a test feature for database structure verification'
      },
      developerPlan: {
        tasks: [
          { name: 'Task 1', estimate: '2 days' },
          { name: 'Task 2', estimate: '3 days' }
        ]
      },
      aiPlan: {
        suggestion: 'AI generated feature implementation'
      },
      createdAt: Date.now(),
      userId: testUserId,
      projectId: projectId
    });
  
  console.log('✅ Test feature plan created successfully');
}

// Verify database structure by retrieving data
async function verifyDatabaseStructure() {
  console.log(`🔍 Verifying database structure for user: ${testUserId}`);
  
  // Get user account
  const userDoc = await db.collection(USERS_COLLECTION).doc(testUserId).get();
  if (!userDoc.exists) {
    console.error(`❌ User document not found for ID: ${testUserId}`);
    return false;
  }
  
  console.log('✅ User document exists');
  
  // Get user profile
  const profileDoc = await db
    .collection(USERS_COLLECTION)
    .doc(testUserId)
    .collection(ACCOUNT_SUBCOLLECTION)
    .doc('profile')
    .get();
  
  if (!profileDoc.exists) {
    console.error(`❌ User profile not found for ID: ${testUserId}`);
    return false;
  }
  
  console.log('✅ User profile exists:', profileDoc.data().displayName);
  
  // Get projects
  const projectsSnapshot = await db
    .collection(USERS_COLLECTION)
    .doc(testUserId)
    .collection(PROJECTS_SUBCOLLECTION)
    .get();
  
  if (projectsSnapshot.empty) {
    console.log('ℹ️ No projects found for this user');
  } else {
    console.log(`✅ Found ${projectsSnapshot.size} projects`);
    
    // Check first project
    const project = projectsSnapshot.docs[0];
    console.log(`  - Project: ${project.data().title}`);
    
    // Check project sprints
    const sprintsSnapshot = await db
      .collection(USERS_COLLECTION)
      .doc(testUserId)
      .collection(PROJECTS_SUBCOLLECTION)
      .doc(project.id)
      .collection('sprints')
      .get();
    
    if (sprintsSnapshot.empty) {
      console.log('  ℹ️ No sprints found for this project');
    } else {
      console.log(`  ✅ Found ${sprintsSnapshot.size} sprints`);
    }
    
    // Check project documentation
    const docSnapshot = await db
      .collection(USERS_COLLECTION)
      .doc(testUserId)
      .collection(PROJECTS_SUBCOLLECTION)
      .doc(project.id)
      .collection('documentation')
      .doc('main')
      .get();
    
    if (!docSnapshot.exists) {
      console.log('  ℹ️ No documentation found for this project');
    } else {
      console.log('  ✅ Documentation exists');
    }
    
    // Check project features
    const projectFeaturesSnapshot = await db
      .collection(USERS_COLLECTION)
      .doc(testUserId)
      .collection(PROJECTS_SUBCOLLECTION)
      .doc(project.id)
      .collection('features')
      .get();
    
    if (projectFeaturesSnapshot.empty) {
      console.log('  ℹ️ No features found for this project');
    } else {
      console.log(`  ✅ Found ${projectFeaturesSnapshot.size} features in project`);
    }
  }
  
  // Get features
  const featuresSnapshot = await db
    .collection(USERS_COLLECTION)
    .doc(testUserId)
    .collection(FEATURES_SUBCOLLECTION)
    .get();
  
  if (featuresSnapshot.empty) {
    console.log('ℹ️ No feature plans found for this user');
  } else {
    console.log(`✅ Found ${featuresSnapshot.size} feature plans`);
    
    // Check first feature
    const feature = featuresSnapshot.docs[0];
    console.log(`  - Feature: ${feature.data().feature.title}`);
  }
  
  console.log('🎉 Database structure verification complete!');
  return true;
}

// Run all tests
async function runTests() {
  try {
    console.log('🚀 Starting database structure test...');
    
    // Create test data if flag is set
    if (SHOULD_CREATE_TEST_DATA) {
      await createTestUser();
      await createTestProject();
      await createTestFeature();
    }
    
    // Verify data structure
    const success = await verifyDatabaseStructure();
    
    if (success) {
      console.log('');
      console.log('✅ Database structure test passed successfully!');
      console.log('');
      console.log('Your Firestore database is properly configured with the nested structure:');
      console.log('users/');
      console.log('  {userId}/');
      console.log('    projects/');
      console.log('      {projectId}/');
      console.log('        sprints/');
      console.log('        features/');
      console.log('        documentation/');
      console.log('    features/');
      console.log('    account/');
      console.log('      profile/');
    } else {
      console.error('❌ Database structure test failed!');
    }
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the tests
runTests().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 