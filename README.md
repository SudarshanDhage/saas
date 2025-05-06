# AI Project Planner

A modern web application for planning, managing, and executing projects with AI assistance. This application provides a streamlined interface for creating projects, managing features, and tracking progress.

## Features

- **User Authentication**: Secure sign-up, sign-in, and account management with Firebase
  - Email/password authentication
  - Google sign-in integration
  - User profile management
  
- **Theme Support**: Toggle between light and dark modes for better user experience
  - System preference detection
  - Manual toggle options
  - Persistent theme settings

- **Project Management**:
  - Create and manage projects
  - Generate project sprints with AI assistance
  - Feature planning and implementation tracking
  
- **User Experience**:
  - Responsive design that works across devices
  - Intuitive navigation
  - Modern UI with Tailwind CSS

## Technologies Used

- **Frontend**:
  - Next.js 15 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  
- **Authentication & Backend**:
  - Firebase Authentication
  - Firebase Firestore
  
- **State Management**:
  - React Context API
  - React Hooks

- **UI Libraries**:
  - Lucide Icons
  - Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-project-planner.git
   cd ai-project-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication (Email/Password and Google providers)
   - Create a `.env.local` file in the root directory and add your Firebase config:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                  # Next.js App Router structure
│   ├── project/          # Project management pages
│   ├── features/         # Feature management pages
│   ├── profile/          # User profile page
│   ├── settings/         # User settings page
│   ├── sign-in/          # Authentication pages
│   ├── sign-up/          # Authentication pages
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout component
├── components/           # Reusable React components
│   ├── ui/               # UI components (shadcn)
│   ├── JiraHeader.tsx    # Main header component
│   └── ...
├── contexts/             # React Context providers
│   ├── AuthContext.tsx   # Authentication context
│   ├── ThemeContext.tsx  # Theme context
│   └── ...
├── lib/                  # Utility functions and library setup
│   ├── firebase.ts       # Firebase configuration
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Firebase Setup

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore in your Firebase project
3. Create a web app and get the configuration settings
4. Copy the configuration values to your `.env.local` file following the `.env.example` format

### Deploying Firestore Security Rules

To deploy the Firestore security rules:

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init
   ```
   - Select Firestore when prompted for features
   - Choose your Firebase project
   - Accept the default file locations for Firestore rules

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

Alternatively, you can copy the rules from the `firestore.rules` file and paste them into the Firebase Console:
1. Go to the Firebase Console
2. Navigate to Firestore Database
3. Click on the "Rules" tab
4. Replace the existing rules with the content of `firestore.rules`
5. Click "Publish"

## Authentication Features

The application includes the following authentication features:
- Email/password sign-in
- Google authentication
- User profile management
- Protected routes for authenticated features

## Troubleshooting

### Firebase Permissions Error

If you encounter a "FirebaseError: Missing or insufficient permissions" error, you need to update your Firestore security rules to be more permissive for development and demo purposes.

#### Option 1: Simplified Development Rules (Recommended for demos)

For a quick fix in development environments, use these simplified rules that allow all operations:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Allow read/write access to all documents to anyone
      // WARNING: THIS IS ONLY FOR DEVELOPMENT! DO NOT USE IN PRODUCTION!
      allow read, write: if true;
    }
  }
}
```

To update your Firestore rules:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `saas-c06f4`
3. Navigate to Firestore Database → Rules
4. Replace the current rules with the rules above
5. Click "Publish" to apply the rules

#### Option 2: User-based Permissions (For production use)

If you want to maintain user-specific permissions, use these more restrictive rules:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // By default, deny access
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Projects collection - Allow public read, only owner can write
    match /projects/{projectId} {
      // Allow reading projects by anyone
      allow read: if true;
      
      // Allow creating projects when authenticated
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      
      // Allow update and delete if owner
      allow update, delete: if isOwner(resource.data.userId);
    }
    
    // Sprint Plans collection - same rules as projects
    match /sprintPlans/{planId} {
      allow read: if true;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }
    
    // Features collection - same rules as projects
    match /features/{featureId} {
      allow read: if true;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isOwner(resource.data.userId);
    }
  }
}
```

### Creating the Required Firestore Indexes

#### Documentation Collection Index Error

You're currently encountering an error that requires a specific composite index for querying documentation items:

```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/saas-c06f4/firestore/indexes?create_composite=ClFwcm9qZWN0cy9zYWFzLWMwNmY0L2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9kb2N1bWVudGF0aW9ucy9pbmRleGVzL18QARoNCglwcm9qZWN0SWQQARoPCgtnZW5lcmF0ZWRBdBACGgwKCF9fbmFtZV9fEAI
```

#### Option 1: Direct Link (Easiest)

To fix this issue:

1. Click on the link provided in the error message, which will take you directly to the Firebase Console with the correct index configuration pre-filled
2. Sign in to your Firebase account if necessary
3. Click "Create index" to create the index
4. Wait for the index to finish building (may take a few minutes)

#### Option 2: Firebase Console (Manual)

Alternatively, create the index manually through the Firebase Console:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `saas-c06f4`
3. Navigate to Firestore Database → Indexes → Composite
4. Click "Add index"
5. Enter the following configuration:
   - Collection ID: `documentations`
   - Fields:
     - `projectId` (Order: Ascending)
     - `generatedAt` (Order: Descending)
   - Query scope: Collection
6. Click "Create"

#### Option 3: Using Firebase CLI

If you have the Firebase CLI set up, you can deploy all indexes from the configuration file:

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy only indexes
firebase deploy --only firestore:indexes
```

The required index has been added to `firestore.indexes.json`, which includes:

```json
{
  "indexes": [
    {
      "collectionGroup": "documentations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "projectId", "order": "ASCENDING" },
        { "fieldPath": "generatedAt", "order": "DESCENDING" }
      ]
    },
    // Other indexes...
  ]
}
```

### Why You Need This Index

This index is required because your application is querying the `documentations` collection with both:
1. A filter on `projectId` (equality filter)
2. Sorting by `generatedAt` in descending order

Firestore requires a composite index whenever you use both filtering and ordering in a query, except for simple queries that filter and sort on the same field.

### Firestore Index Error

If you encounter an error about requiring an index, click the link in the error message to create the necessary index in the Firebase Console.

For example, if you see:
```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/...
```

Follow these steps:
1. Click on the link in the error message
2. Sign in to your Firebase account if necessary
3. Click "Create index" to create the recommended index
4. Wait for the index to finish building (may take a few minutes)

Common indexes needed for this application:
1. projects collection: userId (Ascending), createdAt (Descending)
2. features collection: userId (Ascending), createdAt (Descending) 
3. sprintPlans collection: projectId (Ascending), userId (Ascending)

### User Data Isolation

For development and demo purposes, the application has been configured to allow access to all data. In a production environment, you should enforce user data isolation by:

1. Using the more restrictive security rules (Option 2 above)
2. Ensuring the Firestore access functions properly check user authentication
3. Implementing proper error handling for permission denials

# SaaS Project Management Platform

A modern project management platform with AI-powered sprint planning and feature implementation assistance.

## Authentication and Access Control

This application implements full user authentication and access control to protect user data. Here's how it works:

### User Authentication
- Firebase Authentication is used to register and authenticate users
- All routes requiring authentication are protected with the `AuthCheck` component
- The login status is checked before performing any data operations

### User-Specific Data Access
- Each project and feature is tied to a specific user account via the `userId` field
- Firestore database operations enforce strict ownership verification
- Users can only see and modify their own projects and features
- The sidebar project selector only displays projects owned by the current user

### Security Features
- Server-side validation ensures all requests include proper authentication
- Strict permission checks are performed before any read, update or delete operations
- Helpful error messages guide users when authentication is required
- The application provides clear UI feedback when authentication is needed

### Data Separation
- Projects created by a user are only visible to that user
- Features and sprint plans respect the same user-specific access controls
- Even when accessing direct URLs, users cannot view projects they don't own

## Firestore Security Model
The application implements a strict ownership-based security model where:
1. Each document includes a `userId` field that matches the authenticated user
2. All queries filter by the current user's ID
3. Ownership verification is performed before operations on specific documents
4. Authentication is enforced for all data operations

This ensures complete data isolation between different users of the application, maintaining privacy and security.

## Database Structure and Optimization

The application uses a nested Firestore database structure organized under user accounts to ensure complete data isolation:

```
/users/{userId}/
  - id
  - createdAt
  
  /projects/{projectId}/
    - title
    - description
    - coreFeatures []
    - suggestedFeatures []
    - createdAt
    - userId
    - techStack {}
    
    /sprints/{sprintId}/
      - projectId
      - developerPlan {}
      - aiPlan {}
      - createdAt
      - userId
    
    /documentation/{docId}/
      - content
      - createdAt
      - userId
  
  /features/{featureId}/
    - feature {}
    - developerPlan {}
    - aiPlan {}
    - createdAt
    - userId
    - projectId (optional)
  
  /account/profile
    - displayName
    - email
    - photoURL
    - createdAt
    - subscription {}
    - settings {}
```

### Optimization Recommendations

#### Database Optimization

1. **Indexing**:
   - Add composite indexes for frequently queried fields (e.g., `userId + createdAt`)
   - Create indexes for fields used in where clauses and ordering

2. **Denormalization**:
   - Store essential project metadata with sprint plans to reduce lookups
   - Include user info in project documents for quick access

3. **Batch Operations**:
   - Use batch writes for related operations to maintain consistency
   - Implement transaction-based updates for critical operations

4. **Pagination**:
   - Implement cursor-based pagination for large collections
   - Limit query results to improve performance

#### Data Validation

1. **Schema Validation**:
   - Validate all data objects before storing in Firestore
   - Implement TypeScript interfaces for strict typing

2. **Default Values**:
   - Provide default values for all critical fields
   - Check for array existence before accessing length
   - Initialize empty objects for nested properties

3. **Error Handling**:
   - Add specific error messages for each database operation
   - Implement consistent error handling patterns

### Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Function to check if the user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Function to check if the document belongs to the current user
    function isOwner() {
      return request.auth.uid == resource.data.userId;
    }
    
    // Root users collection
    match /users/{userId} {
      // Allow users to read and write their own documents
      allow read, write: if request.auth.uid == userId;
      
      // Projects subcollection
      match /projects/{projectId} {
        allow read, write: if request.auth.uid == userId;
        
        // Nested collections under projects
        match /{subCollection}/{docId} {
          allow read, write: if request.auth.uid == userId;
        }
      }
      
      // Features subcollection
      match /features/{featureId} {
        allow read, write: if request.auth.uid == userId;
      }
      
      // Account subcollection
      match /account/{docId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

## Pending Optimizations

1. **Caching**: Implement client-side caching for frequent lookups
2. **Data Pruning**: Implement automatic cleanup for unused documents
3. **Backup Strategy**: Regular exports of user data for disaster recovery
4. **Migration Path**: Plan for future schema upgrades with minimal disruption

## Usage Statistics

1. **Document Reads**: Track and optimize document reads to minimize Firestore costs
2. **Write Operations**: Monitor write operations to stay within quotas
3. **Data Size**: Keep document size small for optimal performance
