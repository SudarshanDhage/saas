/**
 * Migration Script: Flat Collections to User-Centric Nested Structure
 * 
 * This script migrates data from:
 * - projects collection → users/{userId}/projects/{projectId}
 * - sprintPlans collection → users/{userId}/projects/{projectId}/sprints/{sprintId}
 * - features collection → users/{userId}/features/{featureId}
 * 
 * Run this script once to migrate your existing data.
 */

const admin = require('firebase-admin')

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // You need to set up your service account key
  const serviceAccount = require('../firebase-service-account.json')
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://your-project-id.firebaseio.com'
  })
}

const db = admin.firestore()

// Migration Statistics
const stats = {
  users: 0,
  projects: 0,
  sprints: 0,
  features: 0,
  errors: 0
}

async function migrateData() {
  console.log('🚀 Starting migration to user-centric structure...')
  
  try {
    // Step 1: Create user documents and migrate projects
    await migrateProjects()
    
    // Step 2: Migrate sprint plans to nested structure under projects
    await migrateSprintPlans()
    
    // Step 3: Migrate feature plans to user collections
    await migrateFeaturePlans()
    
    // Step 4: Clean up old collections (optional)
    await cleanupOldCollections()
    
    console.log('\n✅ Migration completed successfully!')
    console.log('📊 Migration Statistics:')
    console.log(`   Users created: ${stats.users}`)
    console.log(`   Projects migrated: ${stats.projects}`)
    console.log(`   Sprints migrated: ${stats.sprints}`)
    console.log(`   Features migrated: ${stats.features}`)
    console.log(`   Errors encountered: ${stats.errors}`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

async function migrateProjects() {
  console.log('\n📁 Migrating projects...')
  
  const projectsSnapshot = await db.collection('projects').get()
  
  for (const projectDoc of projectsSnapshot.docs) {
    try {
      const projectData = projectDoc.data()
      const projectId = projectDoc.id
      
      // Determine userId (assuming you have this field in your old structure)
      const userId = projectData.userId || 'unknown-user'
      
      if (userId === 'unknown-user') {
        console.warn(`⚠️ Project ${projectId} has no userId, skipping...`)
        stats.errors++
        continue
      }
      
      // Create user document if it doesn't exist
      const userDocRef = db.collection('users').doc(userId)
      const userDoc = await userDocRef.get()
      
      if (!userDoc.exists) {
        await userDocRef.set({
          id: userId,
          email: projectData.userEmail || `user-${userId}@example.com`,
          displayName: projectData.userName || `User ${userId}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          subscription: {
            type: 'free',
            expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
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
        stats.users++
        console.log(`👤 Created user document for: ${userId}`)
      }
      
      // Migrate project to new structure
      const newProjectData = {
        ...projectData,
        userId,
        updatedAt: Date.now(),
        status: projectData.status || 'active',
        sharedWith: projectData.sharedWith || [],
        permissions: projectData.permissions || {}
      }
      
      await userDocRef
        .collection('projects')
        .doc(projectId)
        .set(newProjectData)
      
      stats.projects++
      console.log(`📂 Migrated project: ${projectData.title} (${projectId})`)
      
    } catch (error) {
      console.error(`❌ Error migrating project ${projectDoc.id}:`, error)
      stats.errors++
    }
  }
}

async function migrateSprintPlans() {
  console.log('\n🏃‍♂️ Migrating sprint plans...')
  
  const sprintsSnapshot = await db.collection('sprintPlans').get()
  
  for (const sprintDoc of sprintsSnapshot.docs) {
    try {
      const sprintData = sprintDoc.data()
      const sprintId = sprintDoc.id
      const projectId = sprintData.projectId
      
      // Find the project to determine userId
      const projectSnapshot = await db.collectionGroup('projects')
        .where(admin.firestore.FieldPath.documentId(), '==', projectId)
        .get()
      
      if (projectSnapshot.empty) {
        console.warn(`⚠️ Project ${projectId} not found for sprint ${sprintId}, skipping...`)
        stats.errors++
        continue
      }
      
      const projectDoc = projectSnapshot.docs[0]
      const projectData = projectDoc.data()
      const userId = projectData.userId
      
      if (!userId) {
        console.warn(`⚠️ No userId found for project ${projectId}, skipping sprint ${sprintId}...`)
        stats.errors++
        continue
      }
      
      // Migrate sprint to nested structure
      const newSprintData = {
        ...sprintData,
        userId,
        updatedAt: Date.now(),
        status: sprintData.status || 'draft',
        sprintNumber: sprintData.sprintNumber || 1
      }
      
      await db.collection('users')
        .doc(userId)
        .collection('projects')
        .doc(projectId)
        .collection('sprints')
        .doc(sprintId)
        .set(newSprintData)
      
      stats.sprints++
      console.log(`🏃‍♂️ Migrated sprint: ${sprintId} for project ${projectId}`)
      
    } catch (error) {
      console.error(`❌ Error migrating sprint ${sprintDoc.id}:`, error)
      stats.errors++
    }
  }
}

async function migrateFeaturePlans() {
  console.log('\n🎯 Migrating feature plans...')
  
  const featuresSnapshot = await db.collection('features').get()
  
  for (const featureDoc of featuresSnapshot.docs) {
    try {
      const featureData = featureDoc.data()
      const featureId = featureDoc.id
      
      // Determine userId (assuming you have this field)
      const userId = featureData.userId || 'unknown-user'
      
      if (userId === 'unknown-user') {
        console.warn(`⚠️ Feature ${featureId} has no userId, skipping...`)
        stats.errors++
        continue
      }
      
      // Migrate feature to user collection
      const newFeatureData = {
        ...featureData,
        userId,
        updatedAt: Date.now(),
        status: featureData.status || 'draft'
      }
      
      await db.collection('users')
        .doc(userId)
        .collection('features')
        .doc(featureId)
        .set(newFeatureData)
      
      stats.features++
      console.log(`🎯 Migrated feature: ${featureData.feature?.title || featureId}`)
      
    } catch (error) {
      console.error(`❌ Error migrating feature ${featureDoc.id}:`, error)
      stats.errors++
    }
  }
}

async function cleanupOldCollections() {
  console.log('\n🧹 Cleaning up old collections...')
  
  const shouldCleanup = process.argv.includes('--cleanup')
  
  if (!shouldCleanup) {
    console.log('⚠️ Skipping cleanup. Use --cleanup flag to remove old collections.')
    console.log('   Old collections are still available for rollback if needed.')
    return
  }
  
  console.log('🗑️ Deleting old collections...')
  
  try {
    // Delete old projects collection
    await deleteCollection('projects')
    
    // Delete old sprintPlans collection
    await deleteCollection('sprintPlans')
    
    // Delete old features collection
    await deleteCollection('features')
    
    console.log('✅ Old collections cleaned up successfully')
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  }
}

async function deleteCollection(collectionName) {
  const batchSize = 100
  const collectionRef = db.collection(collectionName)
  
  let deleted = 0
  
  while (true) {
    const snapshot = await collectionRef.limit(batchSize).get()
    
    if (snapshot.empty) {
      break
    }
    
    const batch = db.batch()
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
    })
    
    await batch.commit()
    deleted += snapshot.size
    
    console.log(`   Deleted ${deleted} documents from ${collectionName}...`)
  }
  
  console.log(`✅ Deleted collection: ${collectionName} (${deleted} documents)`)
}

// Add user lookup for sharing functionality
async function createUserLookup() {
  console.log('\n🔍 Creating user lookup table...')
  
  const usersSnapshot = await db.collection('users').get()
  const batch = db.batch()
  
  let count = 0
  
  for (const userDoc of usersSnapshot.docs) {
    const userData = userDoc.data()
    if (userData.email) {
      const lookupRef = db.collection('userLookup').doc(userData.email)
      batch.set(lookupRef, {
        userId: userDoc.id,
        displayName: userData.displayName,
        email: userData.email
      })
      count++
    }
  }
  
  if (count > 0) {
    await batch.commit()
    console.log(`✅ Created ${count} user lookup entries`)
  }
}

// Validation function
async function validateMigration() {
  console.log('\n🔍 Validating migration...')
  
  const users = await db.collection('users').get()
  console.log(`👥 Users in new structure: ${users.size}`)
  
  let totalProjects = 0
  let totalSprints = 0
  let totalFeatures = 0
  
  for (const userDoc of users.docs) {
    const projects = await userDoc.ref.collection('projects').get()
    totalProjects += projects.size
    
    for (const projectDoc of projects.docs) {
      const sprints = await projectDoc.ref.collection('sprints').get()
      totalSprints += sprints.size
    }
    
    const features = await userDoc.ref.collection('features').get()
    totalFeatures += features.size
  }
  
  console.log(`📊 Validation Results:`)
  console.log(`   Projects: ${totalProjects}`)
  console.log(`   Sprints: ${totalSprints}`)
  console.log(`   Features: ${totalFeatures}`)
}

// Enhanced sharing functions for user lookup
async function findUserByEmail(email) {
  const lookupDoc = await db.collection('userLookup').doc(email).get()
  
  if (lookupDoc.exists) {
    return lookupDoc.data()
  }
  
  return null
}

// Main execution
async function main() {
  if (process.argv.includes('--validate-only')) {
    await validateMigration()
    return
  }
  
  if (process.argv.includes('--create-lookup')) {
    await createUserLookup()
    return
  }
  
  await migrateData()
  await createUserLookup()
  await validateMigration()
}

// Export for testing
module.exports = {
  migrateData,
  validateMigration,
  createUserLookup,
  findUserByEmail
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
} 