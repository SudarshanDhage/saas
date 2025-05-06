# Firestore Database Structure

This document outlines the database structure for our SaaS application, which uses a nested collection model to organize user data while maintaining strict data isolation.

## Overview

The database follows a user-centric approach, with each user's data stored in nested collections under their user document. This structure:

- Ensures data isolation and security
- Simplifies access control with Firestore Security Rules
- Groups related data logically
- Optimizes query performance for user-specific data

## Collection Structure

```
users/
  {userId}/
    projects/
      {projectId}/
        sprints/
          {sprintId}/
            ...
        features/
          {featureId}/
            ...
        documentation/
          main/
            ...
    features/
      {featureId}/
        ...
    account/
      profile/
        ...
```

## Collection Details

### Users Collection

The root collection that contains all user data.

- **Path**: `users/{userId}`
- **Fields**:
  - `id`: String - The user ID (same as the document ID)
  - `createdAt`: Number - Timestamp of when the user was created

### Projects Sub-collection

Stores all projects that belong to a user.

- **Path**: `users/{userId}/projects/{projectId}`
- **Fields**:
  - `id`: String - The project ID (same as the document ID)
  - `title`: String - Project title
  - `description`: String - Project description
  - `coreFeatures`: Array of Features - Core features of the project
  - `suggestedFeatures`: Array of Features - Suggested features for the project
  - `createdAt`: Number - Timestamp of when the project was created
  - `userId`: String - The user ID who owns this project
  - `techStack`: Object (optional) - Technology stack used in the project

#### Project Sprints

Stores sprint plans for a specific project.

- **Path**: `users/{userId}/projects/{projectId}/sprints/{sprintId}`
- **Fields**:
  - `projectId`: String - Reference to the parent project
  - `developerPlan`: Object - Developer-created sprint plan
  - `aiPlan`: Object - AI-generated sprint plan
  - `createdAt`: Number - Timestamp of when the sprint plan was created
  - `userId`: String - The user ID who owns this sprint plan

#### Project Features

Stores features linked to a specific project.

- **Path**: `users/{userId}/projects/{projectId}/features/{featureId}`
- **Fields**: Same as the features collection, but specifically linked to a project

#### Project Documentation

Stores documentation for a specific project.

- **Path**: `users/{userId}/projects/{projectId}/documentation/main`
- **Fields**:
  - `content`: String - The documentation content
  - `updatedAt`: Number - Timestamp of the last update
  - `userId`: String - The user ID who owns this documentation

### Features Sub-collection

Stores all feature plans that belong to a user, regardless of project association.

- **Path**: `users/{userId}/features/{featureId}`
- **Fields**:
  - `feature`: Object
    - `title`: String - Feature title
    - `description`: String - Feature description
  - `developerPlan`: Object - Developer-created feature plan
  - `aiPlan`: Object - AI-generated feature plan
  - `createdAt`: Number - Timestamp of when the feature plan was created
  - `userId`: String - The user ID who owns this feature plan
  - `projectId`: String (optional) - ID of the project this feature belongs to

### Account Sub-collection

Stores user account information and settings.

- **Path**: `users/{userId}/account/profile`
- **Fields**:
  - `displayName`: String - User's display name
  - `email`: String - User's email address
  - `photoURL`: String (optional) - URL to user's profile photo
  - `createdAt`: Number - Timestamp of when the account was created
  - `subscription`: Object
    - `type`: String ('free', 'pro', 'enterprise') - Subscription type
    - `expiresAt`: Number - Timestamp when the subscription expires
    - `paymentId`: String (optional) - Reference to payment information
  - `settings`: Object
    - `theme`: String ('light', 'dark', 'system') - UI theme preference
    - `notifications`: Boolean - Notification settings
    - `emailPreferences`: Object
      - `marketing`: Boolean - Marketing email preference
      - `updates`: Boolean - Product updates email preference

## Security Rules

With this structure, security rules become more straightforward. Here's an example of how to secure your data:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write only their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Usage Patterns

### Accessing User-Specific Data

All data access functions in the application already check for authentication and only return data that belongs to the current user.

### Creating New Data

When creating new data (projects, features, etc.), the data is automatically stored in the current user's sub-collections.

### Queries and Filtering

For optimal performance:

1. Always query within a user's sub-collection
2. Use composite indexes for complex queries
3. Use the `collectionGroup` query for searching across all user's data of a specific type

## Migration

If you're migrating from the old flat collection structure, use the provided migration script:

```
node scripts/migrateToNestedStructure.js
```

⚠️ **Important**: Make a backup of your data before running the migration script.

## Best Practices

1. **Always verify user authentication** before accessing or modifying data
2. **Use batch writes** for related operations to maintain data consistency
3. **Implement proper error handling** for database operations
4. **Keep document sizes small** to optimize performance
5. **Consider denormalization** for frequently accessed data
6. **Create indexes** for complex queries

## Schema Evolution

As the application evolves, you may need to add new fields or collections. When doing so:

1. Update your Firestore.ts module to include the new fields
2. Consider running a migration script for existing data
3. Update security rules to accommodate new data structures
4. Update your application code to handle both old and new data formats

---

For any questions or suggestions regarding the database structure, please contact the development team. 