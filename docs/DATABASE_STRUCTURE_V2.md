# Firebase Database Structure V2 - User-Centric Architecture

## Overview

This document outlines the new user-centric Firebase Firestore database structure designed for maximum security, scalability, and sharing capabilities. The architecture ensures complete data isolation between users while enabling secure collaboration.

## Key Features

✅ **Complete User Data Isolation** - Each user's data is stored in their own nested collections  
✅ **Secure Sharing** - Granular permission system for project collaboration  
✅ **Scalable Architecture** - Optimized for high load and concurrent access  
✅ **Sprint Plans Nested Under Projects** - Logical data organization  
✅ **Offline Support** - Firebase's built-in offline capabilities  
✅ **Real-time Updates** - Live collaboration features  
✅ **Security Rules** - Comprehensive row-level security  

## Database Structure

```
users/
  {userId}/                           # User's root document
    - id: string
    - email: string  
    - displayName: string
    - photoURL?: string
    - createdAt: number
    - updatedAt: number
    - subscription: object
    - settings: object
    
    projects/                         # User's projects collection
      {projectId}/
        - id: string
        - title: string
        - description: string
        - coreFeatures: Feature[]
        - suggestedFeatures: Feature[]
        - createdAt: number
        - updatedAt: number
        - userId: string
        - techStack?: object
        - status: 'active' | 'completed' | 'archived'
        - sharedWith: string[]          # Array of user IDs
        - permissions: {               # Granular permissions
            [userId]: 'read' | 'write' | 'admin'
          }
        
        sprints/                      # Project's sprint plans
          {sprintId}/
            - id: string
            - projectId: string
            - userId: string
            - developerPlan: object
            - aiPlan: object
            - createdAt: number
            - updatedAt: number
            - status: 'draft' | 'active' | 'completed'
            - sprintNumber: number
            - estimatedDuration?: string
        
        documentation/                # Project documentation
          {docId}/
            - content: string
            - updatedAt: number
            - userId: string
            - version?: number
        
        features/                     # Project-specific features
          {featureId}/
            - (similar to global features but project-scoped)
    
    features/                         # User's standalone features
      {featureId}/
        - id: string
        - feature: {
            title: string
            description: string
          }
        - developerPlan: object
        - aiPlan: object
        - createdAt: number
        - updatedAt: number
        - userId: string
        - projectId?: string          # Optional project association
        - status: 'draft' | 'in-progress' | 'completed'
    
    account/                          # User account settings
      profile/
        - (same as user root document)

userLookup/                           # Email to userId mapping
  {email}/
    - userId: string
    - displayName: string
    - email: string
```

## Security Model

### Authentication Requirements
- All operations require Firebase Authentication
- Users can only access their own data by default
- Shared access is explicitly granted through the `sharedWith` array and `permissions` object

### Permission Levels
- **read**: Can view project and all its data
- **write**: Can modify project data, create sprints, edit features
- **admin**: Can share project, manage permissions, cannot delete (only owner can delete)

### Security Rules Highlights
```javascript
// Users can only access their own data
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Project sharing with permission checks
match /users/{userId}/projects/{projectId} {
  allow read: if hasProjectAccess(resource.data, request.auth.uid);
  allow write: if hasProjectWriteAccess(resource.data, request.auth.uid);
}
```

## Migration from V1

### What Changed
1. **Flat Collections → Nested Collections**
   - `projects` → `users/{userId}/projects/{projectId}`
   - `sprintPlans` → `users/{userId}/projects/{projectId}/sprints/{sprintId}`
   - `features` → `users/{userId}/features/{featureId}`

2. **Enhanced Data Model**
   - Added `userId` to all documents
   - Added `updatedAt` timestamps
   - Added `status` fields for better state management
   - Added sharing capabilities (`sharedWith`, `permissions`)

3. **Improved Security**
   - User-centric access control
   - Granular permissions
   - No cross-user data access

### Migration Script
Use the provided migration script to safely move your data:
```bash
# Dry run (validation only)
node scripts/migrate-to-v2-structure.js --validate-only

# Full migration
node scripts/migrate-to-v2-structure.js

# With cleanup of old collections
node scripts/migrate-to-v2-structure.js --cleanup
```

## Performance Optimizations

### Composite Indexes
All necessary indexes are defined in `firestore-v2.indexes.json`:
- User-based queries: `userId + createdAt`
- Status filtering: `userId + status + updatedAt`
- Sharing queries: `sharedWith (array-contains) + createdAt`
- Project-specific queries: `projectId + userId + createdAt`

### Query Patterns
```javascript
// Get user's projects (optimized)
const projects = await getUserProjectsRef(userId)
  .orderBy('createdAt', 'desc')
  .limit(10)
  .get()

// Get shared projects (uses collection group)
const sharedProjects = await collectionGroup(db, 'projects')
  .where('sharedWith', 'array-contains', userId)
  .get()

// Get project sprints (nested query)
const sprints = await getProjectSprintsRef(userId, projectId)
  .orderBy('sprintNumber', 'asc')
  .get()
```

### Batch Operations
The new structure supports efficient batch operations:
```javascript
// Batch create multiple projects
await batchCreateProjects(projectsData)

// Batch delete project with all subcollections
const batch = writeBatch(db)
batch.delete(projectRef)
// Delete all nested sprints, docs, etc.
await batch.commit()
```

## Sharing and Collaboration

### Share a Project
```javascript
await shareProject(projectId, 'user@example.com', 'write')
```

### Permission Levels
- **Owner**: Full control (create, read, update, delete, share)
- **Admin**: All except delete (can share with others)
- **Write**: Can modify project data and create sprints
- **Read**: View-only access

### User Lookup System
Email-based sharing is supported through the `userLookup` collection:
```javascript
// Find user by email
const user = await findUserByEmail('colleague@example.com')
if (user) {
  await shareProject(projectId, user.userId, 'read')
}
```

## Scalability Considerations

### Read Performance
- User-specific collections reduce query scope
- Proper indexing for all query patterns
- Collection group queries for cross-user data (shared projects)

### Write Performance
- Distributed writes across user collections
- Batch operations for related updates
- Minimal security rule evaluations

### Storage Efficiency
- Nested structure groups related data
- Efficient for user-specific queries
- Minimal data duplication

### Concurrent Access
- Firebase handles concurrent writes automatically
- User-specific collections reduce write conflicts
- Proper transaction usage for critical operations

## API Usage Examples

### Basic Operations
```typescript
// Create a new project
const project = await createProject({
  title: 'My New Project',
  description: 'Project description',
  coreFeatures: [...],
  suggestedFeatures: [...]
})

// Get user's projects (includes shared)
const projects = await getProjects()

// Create sprint plan (nested under project)
const sprint = await createSprintPlan({
  projectId: project.id,
  developerPlan: {...},
  aiPlan: {...}
})
```

### Sharing Operations
```typescript
// Share project with read access
await shareProject(projectId, 'teammate@company.com', 'read')

// Remove access
await removeProjectAccess(projectId, userId)

// Get all shared projects
const sharedProjects = await getSharedProjects()
```

### Advanced Queries
```typescript
// Get all user data (for dashboard)
const userData = await getAllUserData()

// Get sprints for specific project
const sprints = await getSprintPlans(projectId)

// Update sprint with proper permission check
await updateSprintPlan(sprintId, projectId, { status: 'completed' })
```

## Security Best Practices

1. **Always Verify User Authentication**
   ```typescript
   function getCurrentUserId(): string {
     const user = auth.currentUser
     if (!user) throw new Error('User not authenticated')
     return user.uid
   }
   ```

2. **Check Permissions Before Operations**
   ```typescript
   const project = await getProject(projectId)
   if (!hasProjectWriteAccess(project, userId)) {
     throw new Error('Insufficient permissions')
   }
   ```

3. **Use Transactions for Critical Updates**
   ```typescript
   await db.runTransaction(async (transaction) => {
     // Ensure data consistency
   })
   ```

4. **Validate Input Data**
   ```typescript
   if (!isValidProjectData(projectData)) {
     throw new Error('Invalid project data')
   }
   ```

## Monitoring and Analytics

### Performance Metrics
- Query latency by collection
- Read/write operations per user
- Failed permission checks
- Large query operations

### Usage Analytics
- Projects created per user
- Sharing frequency
- Active collaboration sessions
- Feature adoption rates

### Error Tracking
- Authentication failures
- Permission denied errors
- Migration issues
- Data consistency problems

## Backup and Recovery

### Automated Backups
Firebase provides automatic daily backups, but consider:
- Custom backup scripts for critical data
- Export procedures for user data portability
- Point-in-time recovery procedures

### Data Export
```javascript
// Export all user data
const userData = await getAllUserData(userId)
// Can be used for GDPR compliance, data portability
```

## Conclusion

This user-centric database structure provides:
- **Maximum Security**: User data isolation with granular sharing
- **High Performance**: Optimized queries and indexing
- **Scalability**: Distributed data across user collections
- **Flexibility**: Support for various collaboration patterns
- **Maintainability**: Clear data organization and relationships

The migration from the flat structure to this nested approach significantly improves security, performance, and the ability to scale while maintaining all existing functionality. 