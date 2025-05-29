# Implementation Guide: Firebase Database V2 Migration

## 🎯 Overview

This guide will help you migrate from the current flat collection structure to the new user-centric nested structure. Follow these steps carefully to ensure a smooth transition without data loss.

## 📋 Prerequisites

- [x] Firebase Admin SDK access
- [x] Database backup (recommended)
- [x] Development environment setup
- [x] Understanding of current data structure

## ⚠️ Current State Analysis

Based on your codebase, I found:

1. **Active Implementation**: Currently using `lib/firestore.ts` (flat structure)
2. **Available**: New `lib/firestore-v2.ts` (user-centric structure) 
3. **Issue**: Current projects **DO NOT have userId fields** in the database
4. **Migration Needed**: Existing data needs userId assignment

## 🚀 Step-by-Step Implementation

### Step 1: Backup Current Data (CRITICAL)

```bash
# Export current collections as backup
firebase firestore:export gs://your-bucket-name/backup-$(date +%Y%m%d)

# Or use the Firebase Console to export manually
```

### Step 2: Install Dependencies

```bash
# Install Firebase Admin SDK if not already installed
npm install firebase-admin
```

### Step 3: Setup Migration Environment

1. **Download your Firebase service account key:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key → Save as `firebase-service-account.json`

2. **Update the migration script:**
```javascript
// In scripts/migrate-to-v2-structure.js, line 16-20
const serviceAccount = require('../firebase-service-account.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://YOUR-PROJECT-ID.firebaseio.com' // Replace with your project
})
```

### Step 4: Add UserID to Existing Data

Since your current projects don't have userId fields, you need to assign them. Create this script:

```javascript
// scripts/add-userid-to-existing-data.js
const admin = require('firebase-admin')
const serviceAccount = require('../firebase-service-account.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

async function addUserIdToExistingData() {
  console.log('🔧 Adding userId to existing data...')
  
  // Get all projects
  const projectsSnapshot = await db.collection('projects').get()
  const batch = db.batch()
  
  // You need to determine how to assign userIds
  // Option 1: Assign all to a single user (for single user app)
  const defaultUserId = 'your-user-id-here' // Replace with actual user ID
  
  // Option 2: Use authentication records to match users to their data
  // This requires additional logic based on your auth setup
  
  let count = 0
  for (const projectDoc of projectsSnapshot.docs) {
    const projectData = projectDoc.data()
    
    if (!projectData.userId) {
      batch.update(projectDoc.ref, { 
        userId: defaultUserId,
        updatedAt: Date.now() 
      })
      count++
    }
  }
  
  // Update sprint plans
  const sprintsSnapshot = await db.collection('sprintPlans').get()
  for (const sprintDoc of sprintsSnapshot.docs) {
    const sprintData = sprintDoc.data()
    
    if (!sprintData.userId) {
      batch.update(sprintDoc.ref, { 
        userId: defaultUserId,
        updatedAt: Date.now() 
      })
      count++
    }
  }
  
  // Update features
  const featuresSnapshot = await db.collection('features').get()
  for (const featureDoc of featuresSnapshot.docs) {
    const featureData = featureDoc.data()
    
    if (!featureData.userId) {
      batch.update(featureDoc.ref, { 
        userId: defaultUserId,
        updatedAt: Date.now() 
      })
      count++
    }
  }
  
  await batch.commit()
  console.log(`✅ Added userId to ${count} documents`)
}

addUserIdToExistingData().catch(console.error)
```

### Step 5: Run Pre-Migration Preparation

```bash
# Add userId to existing data
node scripts/add-userid-to-existing-data.js
```

### Step 6: Test Migration (Dry Run)

```bash
# Validate what will be migrated
node scripts/migrate-to-v2-structure.js --validate-only
```

Expected output:
```
🔍 Validating migration...
👥 Users in new structure: 0
📊 Validation Results:
   Projects: X (your current project count)
   Sprints: X (your current sprint count)  
   Features: X (your current feature count)
```

### Step 7: Run Full Migration

```bash
# Perform the migration
node scripts/migrate-to-v2-structure.js
```

Expected output:
```
🚀 Starting migration to user-centric structure...
📁 Migrating projects...
👤 Created user document for: your-user-id
📂 Migrated project: Project Name (project-id)
🏃‍♂️ Migrating sprint plans...
🏃‍♂️ Migrated sprint: sprint-id for project project-id
🎯 Migrating feature plans...
🎯 Migrated feature: Feature Name
✅ Migration completed successfully!
```

### Step 8: Update Application Code

Replace imports in your application:

1. **Update all imports** from old to new firestore file:

```typescript
// OLD - Replace these imports
import { 
  createProject, 
  getProjects, 
  getProject,
  createSprintPlan,
  getSprintPlans,
  // ... etc
} from '@/lib/firestore'

// NEW - With these imports  
import { 
  createProject, 
  getProjects, 
  getProject,
  createSprintPlan,
  getSprintPlans,
  // ... etc
} from '@/lib/firestore-v2'
```

2. **Update component files that use Firestore:**

```bash
# Find files that import the old firestore
grep -r "from '@/lib/firestore'" --include="*.tsx" --include="*.ts" .

# These files need updating:
# - app/projects/create/page.tsx
# - components/projects/ProjectDetailClient.tsx  
# - Any other components using Firestore functions
```

### Step 9: Update Security Rules

Replace your current Firestore rules:

```bash
# Deploy new security rules
firebase deploy --only firestore:rules
```

Use the rules from `firestore-v2.rules` file.

### Step 10: Deploy New Indexes

```bash
# Deploy new indexes  
firebase deploy --only firestore:indexes
```

Use the indexes from `firestore-v2.indexes.json` file.

### Step 11: Update Authentication Initialization

Ensure user initialization happens on login:

```typescript
// In your authentication logic
import { initializeUser } from '@/lib/firestore-v2'

// After successful login/signup
await initializeUser({
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL
})
```

### Step 12: Test All Functionality

1. **Test Project Creation:**
   - Create a new project
   - Verify it appears in `users/{userId}/projects/`

2. **Test Sprint Plans:**
   - Generate sprint plans for a project
   - Verify they appear in `users/{userId}/projects/{projectId}/sprints/`

3. **Test Features:**
   - Create feature plans
   - Verify they appear in `users/{userId}/features/`

4. **Test Sharing (Optional):**
   - Share a project with another user
   - Test different permission levels

### Step 13: Cleanup (Optional)

After confirming everything works:

```bash
# Remove old collections (DANGEROUS - only after full testing)
node scripts/migrate-to-v2-structure.js --cleanup
```

## 🔧 Code Changes Required

### Update These Files:

1. **`app/projects/create/page.tsx`**
   ```typescript
   // Line 14: Change import
   - import { createProject, createSprintPlan, Feature, Project } from '@/lib/firestore'
   + import { createProject, createSprintPlan, Feature, Project } from '@/lib/firestore-v2'
   ```

2. **`components/projects/ProjectDetailClient.tsx`**
   ```typescript
   // Update import to use firestore-v2
   ```

3. **Any other components using Firestore functions**

### Add User Initialization:

```typescript
// components/auth/AuthWrapper.tsx (or your auth component)
import { initializeUser } from '@/lib/firestore-v2'

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user) {
      // Initialize user in new structure
      await initializeUser({
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || ''
      })
    }
  })
  
  return unsubscribe
}, [])
```

## 🚨 Critical Notes

1. **Single User App**: If this is a single-user application, assign all data to one userId
2. **Multi User App**: You need a strategy to map existing data to correct users
3. **No Going Back**: Once you cleanup old collections, the migration is irreversible
4. **Test Thoroughly**: Test all functionality before cleanup

## 🎯 Benefits After Migration

✅ **Complete Data Isolation** - Each user's data is fully separated  
✅ **Better Security** - Row-level security with Firestore rules  
✅ **Sharing Support** - Built-in project collaboration features  
✅ **Better Performance** - Optimized queries and indexes  
✅ **Scalability** - Handles thousands of users efficiently  

## 📞 Support

If you encounter issues:

1. **Check logs** for specific error messages
2. **Validate data** using the validation script
3. **Rollback** using your backup if needed
4. **Test incrementally** rather than migrating all at once

The migration is designed to be safe and reversible until you run the cleanup step.