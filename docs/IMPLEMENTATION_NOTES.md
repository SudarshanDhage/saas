# Database Structure Implementation Notes

## Overview

We've implemented a user-centric nested database structure in Firestore that ensures strict data isolation and improves security. This structure organizes all user data under their user document, making it easier to manage permissions and access control.

## Changes Made

1. **Firestore Data Structure**
   - Restructured collections to follow a nested pattern:
     - Root: `users/{userId}`
     - User Projects: `users/{userId}/projects/{projectId}`
     - User Features: `users/{userId}/features/{featureId}`
     - User Account: `users/{userId}/account/profile`
   - Added additional sub-collections under projects:
     - Project Sprints: `users/{userId}/projects/{projectId}/sprints/{sprintId}`
     - Project Features: `users/{userId}/projects/{projectId}/features/{featureId}`
     - Project Documentation: `users/{userId}/projects/{projectId}/documentation/main`

2. **Firestore Access Logic**
   - Updated all firestore operations in `/lib/firestore.ts` to use the nested structure
   - Added helper functions for document references:
     - `getUserDocRef`
     - `getProjectsCollectionRef`
     - `getProjectDocRef`
     - `getFeaturesCollectionRef`
     - `getFeatureDocRef`
     - `getAccountDocRef`
     - ...and more for sub-collections
   - Modified CRUD operations for projects, features, and sprint plans
   - Added new account management functions: 
     - `initializeUserAccount`
     - `getUserAccount`
     - `updateUserAccount`

3. **Authentication Integration**
   - Updated `auth.ts` to initialize user account data in Firestore upon sign-up/sign-in
   - Added strong authentication checks across all data access operations

4. **Security Rules**
   - Implemented strict security rules in `firestore.rules` 
   - Rules now enforce that users can only access their own data
   - Added helper functions in rules for checking authentication and user ownership

5. **User Account Management**
   - Added a new `UserAccount` interface with:
     - Basic profile info (displayName, email, photoURL)
     - Subscription details (type, expiration)
     - User preferences (theme, notifications, email preferences)
   - Created a context provider for user account data (`UserAccountContext`)
   - Built a profile page for users to manage their account

6. **UI Components**
   - Added missing UI components for the profile page:
     - Switch component for toggling preferences
     - Label component for form fields
   - Added configuration for themes and styling

7. **Testing**
   - Created a test script `testDatabaseStructure.js` to verify the structure works correctly
   - The script can create test data and validate that the nested collections function as expected

## Database Structure

```
users/
  {userId}/                # User document with basic info
    projects/              # All projects belonging to the user
      {projectId}/         # Individual project
        sprints/           # Sprint plans for this project
          {sprintId}/      # Individual sprint plan
        features/          # Features linked to this project
          {featureId}/     # Individual feature
        documentation/     # Project documentation
          main/            # Main documentation document
    features/              # All feature plans for the user
      {featureId}/         # Individual feature plan
    account/               # User account information
      profile/             # Profile document with user details
```

## Security Benefits

1. **Simplified Security Rules**: Security rules are more straightforward since we can check ownership at the user level
2. **Data Isolation**: Each user's data is completely separated
3. **Hierarchy Enforcement**: The structure enforces logical relationships between data
4. **Performance**: Queries are optimized for user-specific data retrieval

## Migration

For a new installation, the structure is ready to use. The existing project's data was deleted and will be recreated in the new structure as users interact with the application.

## Testing

You can test the implementation by:

1. Running the test script: `node scripts/testDatabaseStructure.js`
2. Setting `SHOULD_CREATE_TEST_DATA = true` in the script to create sample data
3. Using the profile page to update user preferences
4. Creating new projects and features through the UI

## Next Steps

1. Add usage tracking in the user account (projects count, features count, AI generations)
2. Implement subscription management
3. Add user analytics and reports based on the nested structure 