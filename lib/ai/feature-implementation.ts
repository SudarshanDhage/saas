import { model } from './client';

/**
 * Robust JSON extraction from text that may contain malformed JSON
 */
function extractAndParseJson(text: string): any {
  console.log("Raw AI response length:", text.length);
  console.log("Raw AI response:", text.substring(0, 500) + "...");
  
  // Find the first complete JSON object
  let jsonStart = -1;
  let jsonEnd = -1;
  let braceCount = 0;
  let inString = false;
  let escapeNext = false;
  
  // Find the start of JSON
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') {
      jsonStart = i;
      break;
    }
  }
  
  if (jsonStart === -1) {
    throw new Error("No JSON object found in response");
  }
  
  // Find the end of JSON by counting braces
  for (let i = jsonStart; i < text.length; i++) {
    const char = text[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          jsonEnd = i;
          break;
        }
      }
    }
  }
  
  if (jsonEnd === -1) {
    console.log("JSON appears to be truncated, trying to find partial structure...");
    // If we can't find the end, try to use the last closing brace we can find
    jsonEnd = text.lastIndexOf('}');
    if (jsonEnd <= jsonStart) {
      throw new Error("Malformed JSON: cannot find proper end");
    }
  }
  
  let jsonString = text.substring(jsonStart, jsonEnd + 1);
  console.log("Extracted JSON length:", jsonString.length);
  console.log("Extracted JSON:", jsonString.substring(0, 500) + "...");
  
  // Try direct parsing first
  try {
    const parsed = JSON.parse(jsonString);
    console.log("JSON parsed successfully");
    return parsed;
  } catch (error) {
    console.log("Direct parsing failed, attempting repair...");
  }
  
  // Enhanced JSON cleaning and repair
  try {
    // Clean common issues
    jsonString = jsonString
      // Remove any markdown code blocks
      .replace(/```json|```/g, '')
      // Fix unquoted property names
      .replace(/([{,]\s*)([a-zA-Z0-9_$]+)(\s*:)/g, '$1"$2"$3')
      // Fix trailing commas
      .replace(/,\s*([}\]])/g, '$1')
      // Fix missing commas between objects (but be careful not to break strings)
      .replace(/}(\s*){/g, '},\n$1{')
      // Fix missing commas between array items
      .replace(/](\s*)\[/g, '],\n$1[')
      // Replace single quotes with double quotes (but be careful in strings)
      .replace(/'/g, '"')
      // Fix double commas
      .replace(/,,+/g, ',')
      // Fix spaces around colons
      .replace(/"\s*:\s*/g, '": ')
      // Remove extra whitespace but preserve structure
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    // Balance brackets
    const openBraces = (jsonString.match(/\{/g) || []).length;
    const closeBraces = (jsonString.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      jsonString += '}'.repeat(openBraces - closeBraces);
    }
    
    const openBrackets = (jsonString.match(/\[/g) || []).length;
    const closeBrackets = (jsonString.match(/\]/g) || []).length;
    if (openBrackets > closeBrackets) {
      jsonString += ']'.repeat(openBrackets - closeBrackets);
    }
    
    // Try parsing again
    const parsed = JSON.parse(jsonString);
    console.log("JSON repair successful");
    return parsed;
    
  } catch (repairError) {
    console.error("JSON repair failed:", repairError);
    console.log("Cleaned JSON sample:", jsonString.substring(0, 1000));
    throw new Error("Unable to parse AI response as valid JSON");
  }
}

/**
 * Create a simple fallback with just one task and try again message
 */
function createSimpleFallback(feature: string) {
  return {
    feature: {
      title: feature,
      description: "Feature generation failed due to parsing issues. Please try again.",
      complexity: "unknown",
      estimatedTotalHours: "Unknown"
    },
    developerPlan: {
      totalEstimatedHours: "Unknown",
      skillLevel: "unknown",
      tasks: [
        {
          id: "retry-task-1",
          title: "Try Again",
          description: "The AI response couldn't be parsed properly. Please try generating this feature again.",
          type: "retry",
          complexity: "unknown",
          priority: "high",
          estimatedHours: "Unknown",
          implementation: "Please try again with the same or modified feature description."
        }
      ]
    },
    aiPlan: {
      totalEstimatedHours: "Unknown", 
      approach: "retry",
      tasks: [
        {
          id: "ai-retry-task-1",
          title: "Try Again",
          description: "The AI response couldn't be parsed properly. Please try generating this feature again.",
          type: "retry",
          complexity: "unknown",
          priority: "high",
          estimatedHours: "Unknown",
          aiPrompt: "Please try again with the same or modified feature description."
        }
      ]
    }
  };
}

/**
 * Create a comprehensive fallback feature implementation structure
 */
function createFallbackImplementation(feature: string) {
  const title = feature.length > 50 ? feature.substring(0, 50) + "..." : feature;
  const featureName = feature.split(' ').slice(0, 3).join('');
  const kebabCase = feature.toLowerCase().replace(/\s+/g, '-').substring(0, 30);
  
  return {
    feature: {
      title: title,
      description: `Complete end-to-end implementation of ${feature}. This comprehensive solution includes full database design, backend API development, frontend component implementation, state management, authentication, validation, testing, deployment, and documentation. The implementation covers all user interactions, edge cases, error handling, performance optimization, security measures, and scalability considerations.`,
      complexity: "moderate",
      estimatedTotalHours: "40-60 hours",
      prerequisites: [
        "Node.js and npm/yarn installed",
        "Database setup (PostgreSQL/MongoDB)",
        "React/Next.js development environment",
        "TypeScript knowledge",
        "Git version control setup",
        "Code editor with extensions",
        "Testing framework setup",
        "Deployment platform access"
      ],
      userStories: [
        `As a user, I want to access ${feature} so that I can accomplish my primary goals efficiently and intuitively`,
        `As a user, I want the ${feature} to validate my input and provide clear feedback when errors occur`,
        `As a user, I want the ${feature} to work seamlessly across all devices and browsers`,
        `As an admin, I want to manage ${feature} data and monitor usage patterns`,
        `As a developer, I want the ${feature} to be maintainable, testable, and scalable`
      ],
      technicalRequirements: [
        "Responsive design for mobile, tablet, and desktop",
        "Real-time data validation and error handling",
        "Performance optimization for large datasets",
        "Accessibility compliance (WCAG 2.1)",
        "Cross-browser compatibility",
        "API rate limiting and security",
        "Database optimization and indexing",
        "Comprehensive error logging and monitoring"
      ],
      businessRequirements: [
        "User-friendly interface with intuitive navigation",
        "Fast response times and minimal loading delays",
        "Data integrity and consistency",
        "Audit trails for all user actions",
        "Scalable architecture for future growth",
        "Integration capabilities with existing systems"
      ],
      integrationRequirements: [
        "Authentication system integration",
        "Database connectivity and ORM setup",
        "Email/notification service integration",
        "File storage and CDN integration",
        "Analytics and monitoring tools",
        "Third-party API integrations as needed"
      ],
      performanceRequirements: [
        "Page load times under 2 seconds",
        "API response times under 500ms",
        "Support for 1000+ concurrent users",
        "Efficient database queries with proper indexing",
        "Optimized bundle sizes and code splitting",
        "Caching strategies for frequently accessed data"
      ],
      securityRequirements: [
        "Input validation and sanitization",
        "XSS and CSRF protection",
        "SQL injection prevention",
        "Secure authentication and authorization",
        "Data encryption for sensitive information",
        "Regular security audits and updates"
      ],
      scalabilityConsiderations: [
        "Horizontal scaling capability",
        "Database sharding and replication",
        "CDN and caching strategies",
        "Microservices architecture readiness",
        "Load balancing and auto-scaling",
        "Monitoring and alerting systems"
      ]
    },
    developerPlan: {
      totalEstimatedHours: "48 hours",
      skillLevel: "intermediate",
      architecture: {
        databaseSchema: `Complete database design with tables for ${kebabCase}, users, audit_logs, and related entities. Include proper relationships, indexes, and constraints for optimal performance and data integrity.`,
        apiEndpoints: `RESTful API design with endpoints for CRUD operations, authentication, validation, and data retrieval. Include proper HTTP methods, status codes, and response schemas.`,
        componentHierarchy: `React component structure with main component, form components, display components, modal components, and utility components organized in a logical hierarchy.`,
        stateManagement: `Centralized state management using Context API or Zustand with actions for data fetching, form handling, error management, and UI state control.`,
        authenticationFlow: `Complete authentication implementation with login, logout, token management, protected routes, and role-based access control.`,
        deploymentArchitecture: `Production-ready deployment with Docker containers, CI/CD pipelines, environment management, and monitoring setup.`
      },
      environment: {
        technologies: ["React 18+", "TypeScript", "Next.js", "Node.js", "Express/Fastify", "PostgreSQL/MongoDB", "Tailwind CSS", "Jest", "Playwright"],
        dependencies: ["react", "next", "typescript", "@types/react", "tailwindcss", "prisma", "zod", "react-hook-form", "tanstack/react-query", "jest", "playwright"],
        environmentVariables: ["DATABASE_URL", "JWT_SECRET", "API_BASE_URL", "NEXT_PUBLIC_APP_URL", "REDIS_URL", "EMAIL_SERVICE_API_KEY"],
        setupCommands: ["npm install", "npx prisma generate", "npx prisma db push", "npm run dev"],
        databaseSetup: ["Install PostgreSQL", "Create database", "Run migrations", "Seed initial data"],
        deploymentRequirements: ["Docker", "CI/CD pipeline", "Environment variables", "SSL certificates", "Monitoring tools"]
      },
      tasks: [
        {
          id: "dev-task-1",
          title: "Database Schema Design and Setup",
          description: `Design and implement the complete database schema for ${feature} including all tables, relationships, indexes, and constraints. Set up database migrations and seed data for development and testing.`,
          type: "database",
          complexity: "moderate",
          priority: "critical",
          estimatedHours: "8 hours",
          prerequisites: ["Database server installed", "ORM/migration tool setup"],
          technicalSpecs: {
            files: [
              `prisma/schema.prisma - Main database schema`,
              `prisma/migrations/ - Database migration files`,
              `prisma/seed.ts - Seed data for development`,
              `src/lib/database.ts - Database connection and utility functions`
            ],
            components: ["Database models", "Migration scripts", "Seed data", "Database utilities"],
            apis: ["Database connection interface", "Model validation schemas"],
            database: [
              `CREATE TABLE ${kebabCase} (id, user_id, data, created_at, updated_at)`,
              `CREATE INDEX idx_${kebabCase}_user_id ON ${kebabCase}(user_id)`,
              `CREATE INDEX idx_${kebabCase}_created_at ON ${kebabCase}(created_at)`
            ],
            libraries: ["prisma", "@prisma/client", "bcrypt", "uuid"],
            configurations: ["Database connection string", "Migration settings", "Backup configurations"]
          },
          detailedImplementation: {
            step1: "Design database schema with proper normalization and relationships",
            step2: "Create Prisma schema file with all models and relationships",
            step3: "Generate migration files and apply to development database",
            step4: "Create seed data for testing and development",
            step5: "Set up database utilities and connection management",
            step6: "Test database operations and performance",
            codeExamples: [
              "Prisma schema definitions",
              "Migration scripts",
              "Seed data examples",
              "Database utility functions"
            ],
            fileContents: ["Complete Prisma schema", "Migration SQL files", "Seed data scripts"],
            commands: ["npx prisma migrate dev", "npx prisma db seed", "npx prisma generate"],
            configurations: ["DATABASE_URL configuration", "Prisma client settings"]
          },
          testingProcedures: {
            unitTests: ["Database model validation tests", "Migration rollback tests"],
            integrationTests: ["Database connection tests", "CRUD operation tests"],
            e2eTests: ["Full database workflow tests"],
            manualTesting: ["Database performance testing", "Data integrity checks"],
            performanceTesting: ["Query performance benchmarks", "Index effectiveness tests"]
          },
          acceptanceCriteria: [
            "All database tables created successfully",
            "All relationships and constraints working",
            "Migrations can be applied and rolled back",
            "Seed data loads without errors",
            "Database queries perform within acceptable limits"
          ],
          validationSteps: ["Run migration", "Execute seed script", "Test all CRUD operations", "Verify data integrity"],
          troubleshooting: ["Connection issues", "Migration failures", "Performance problems", "Data consistency issues"],
          documentation: ["Database schema documentation", "Migration guide", "Performance optimization guide"]
        },
        {
          id: "dev-task-2",
          title: "Backend API Development",
          description: `Develop complete REST API for ${feature} with all CRUD operations, authentication, validation, error handling, and documentation. Include middleware for security, logging, and performance monitoring.`,
          type: "backend",
          complexity: "complex",
          priority: "critical",
          estimatedHours: "12 hours",
          prerequisites: ["Database schema completed", "Node.js environment setup"],
          technicalSpecs: {
            files: [
              `src/pages/api/${kebabCase}/index.ts - Main API endpoints`,
              `src/pages/api/${kebabCase}/[id].ts - Individual item operations`,
              `src/lib/api/${kebabCase}Service.ts - Business logic`,
              `src/lib/middleware/auth.ts - Authentication middleware`,
              `src/lib/middleware/validation.ts - Request validation`,
              `src/lib/utils/apiResponse.ts - Standardized API responses`
            ],
            components: ["API controllers", "Service layer", "Middleware", "Validation schemas", "Error handlers"],
            apis: [
              `GET /api/${kebabCase} - List all items with pagination`,
              `POST /api/${kebabCase} - Create new item`,
              `GET /api/${kebabCase}/[id] - Get specific item`,
              `PUT /api/${kebabCase}/[id] - Update item`,
              `DELETE /api/${kebabCase}/[id] - Delete item`
            ],
            database: ["Database queries with proper joins and indexes"],
            libraries: ["zod", "jose", "cors", "helmet", "express-rate-limit"],
            configurations: ["API rate limiting", "CORS settings", "Security headers"]
          },
          detailedImplementation: {
            step1: "Create API route structure and basic endpoints",
            step2: "Implement authentication and authorization middleware",
            step3: "Add request validation using Zod schemas",
            step4: "Implement business logic in service layer",
            step5: "Add comprehensive error handling and logging",
            step6: "Create API documentation and testing endpoints",
            codeExamples: [
              "Complete API endpoint implementations",
              "Middleware functions",
              "Validation schemas",
              "Error handling utilities"
            ],
            fileContents: ["Full API route files", "Middleware implementations", "Service layer code"],
            commands: ["npm run dev", "npm run test:api", "npm run docs:generate"],
            configurations: ["Environment variables", "API settings", "Security configurations"]
          },
          testingProcedures: {
            unitTests: ["Service function tests", "Validation schema tests", "Middleware tests"],
            integrationTests: ["API endpoint tests", "Database integration tests", "Authentication flow tests"],
            e2eTests: ["Complete API workflow tests", "Error handling tests"],
            manualTesting: ["Postman/Insomnia API testing", "Performance testing", "Security testing"],
            performanceTesting: ["Load testing", "Response time testing", "Concurrent user testing"]
          },
          acceptanceCriteria: [
            "All API endpoints return correct responses",
            "Authentication and authorization working",
            "Request validation prevents invalid data",
            "Error handling provides meaningful messages",
            "API documentation is complete and accurate",
            "Performance meets specified requirements"
          ],
          validationSteps: ["Test all endpoints", "Verify authentication", "Check error responses", "Review API documentation"],
          troubleshooting: ["Authentication issues", "Validation errors", "Performance problems", "Database connection issues"],
          documentation: ["API documentation", "Authentication guide", "Error code reference", "Performance benchmarks"]
        },
        {
          id: "dev-task-3",
          title: "Frontend Component Development",
          description: `Create comprehensive React components for ${feature} with TypeScript, responsive design, accessibility, form handling, state management, and user experience optimizations.`,
          type: "frontend",
          complexity: "complex",
          priority: "high",
          estimatedHours: "14 hours",
          prerequisites: ["API endpoints available", "Design system setup", "React environment configured"],
          technicalSpecs: {
            files: [
              `src/components/${featureName}/index.tsx - Main component export`,
              `src/components/${featureName}/${featureName}Main.tsx - Primary component`,
              `src/components/${featureName}/${featureName}Form.tsx - Form component`,
              `src/components/${featureName}/${featureName}List.tsx - List display component`,
              `src/components/${featureName}/${featureName}Item.tsx - Individual item component`,
              `src/components/${featureName}/${featureName}Modal.tsx - Modal component`,
              `src/components/${featureName}/${featureName}.types.ts - TypeScript types`,
              `src/hooks/use${featureName}.ts - Custom hook for data management`,
              `src/styles/${featureName}.module.css - Component-specific styles`
            ],
            components: ["Main container", "Form components", "List components", "Modal components", "Loading states", "Error boundaries"],
            apis: ["API integration hooks", "Data fetching utilities", "State management"],
            database: ["N/A"],
            libraries: ["react-hook-form", "react-query", "framer-motion", "react-hot-toast", "headlessui"],
            configurations: ["Tailwind CSS classes", "Responsive breakpoints", "Animation settings"]
          },
          detailedImplementation: {
            step1: "Create component structure and TypeScript interfaces",
            step2: "Implement main container component with layout",
            step3: "Build form components with validation and submission",
            step4: "Create list and item display components",
            step5: "Add modal and overlay components",
            step6: "Implement responsive design and mobile optimization",
            step7: "Add accessibility features and keyboard navigation",
            step8: "Integrate with API and state management",
            codeExamples: [
              "Complete React component implementations",
              "TypeScript interface definitions",
              "Custom hook implementations",
              "Responsive design patterns"
            ],
            fileContents: ["Full component code", "TypeScript types", "Custom hooks", "Styling implementations"],
            commands: ["npm run dev", "npm run build", "npm run test:components"],
            configurations: ["Component props", "State management setup", "Styling configurations"]
          },
          testingProcedures: {
            unitTests: ["Component rendering tests", "User interaction tests", "Props validation tests"],
            integrationTests: ["API integration tests", "State management tests", "Form submission tests"],
            e2eTests: ["User workflow tests", "Cross-browser tests", "Mobile device tests"],
            manualTesting: ["Accessibility testing", "User experience testing", "Visual regression testing"],
            performanceTesting: ["Component performance tests", "Bundle size optimization", "Rendering performance"]
          },
          acceptanceCriteria: [
            "All components render without errors",
            "Forms validate input and submit correctly",
            "List components display data properly",
            "Modal interactions work smoothly",
            "Responsive design works on all devices",
            "Accessibility requirements are met",
            "Performance is optimized"
          ],
          validationSteps: ["Test component rendering", "Verify form functionality", "Check responsive design", "Test accessibility features"],
          troubleshooting: ["Rendering issues", "State management problems", "Styling conflicts", "Performance bottlenecks"],
          documentation: ["Component usage guide", "Props documentation", "Styling guide", "Accessibility features"]
        },
        {
          id: "dev-task-4",
          title: "State Management and Data Flow",
          description: `Implement comprehensive state management for ${feature} using Context API or Zustand, including data fetching, caching, optimistic updates, and error handling.`,
          type: "frontend",
          complexity: "moderate",
          priority: "high",
          estimatedHours: "6 hours",
          prerequisites: ["Components created", "API endpoints available"],
          technicalSpecs: {
            files: [
              `src/store/${kebabCase}Store.ts - Main state store`,
              `src/hooks/use${featureName}Data.ts - Data fetching hook`,
              `src/utils/${kebabCase}Utils.ts - Utility functions`,
              `src/types/${kebabCase}Types.ts - Type definitions`
            ],
            components: ["State store", "Data fetching utilities", "Action creators", "Selectors"],
            apis: ["API integration layer", "Data synchronization"],
            database: ["N/A"],
            libraries: ["zustand", "@tanstack/react-query", "immer"],
            configurations: ["Store configuration", "Cache settings", "Error handling"]
          },
          detailedImplementation: {
            step1: "Set up state management store structure",
            step2: "Implement data fetching and caching logic",
            step3: "Add optimistic updates for better UX",
            step4: "Implement error handling and retry logic",
            step5: "Create utility functions for data manipulation",
            step6: "Add state persistence if needed",
            codeExamples: ["State store implementation", "Data fetching hooks", "Utility functions"],
            fileContents: ["Complete store code", "Hook implementations", "Utility functions"],
            commands: ["npm run test:store", "npm run dev"],
            configurations: ["Store settings", "Cache configuration", "Persistence settings"]
          },
          testingProcedures: {
            unitTests: ["Store action tests", "Selector tests", "Utility function tests"],
            integrationTests: ["Data flow tests", "API integration tests", "State persistence tests"],
            e2eTests: ["Complete workflow tests", "Error scenario tests"],
            manualTesting: ["User interaction testing", "Performance testing"],
            performanceTesting: ["State update performance", "Memory usage optimization"]
          },
          acceptanceCriteria: [
            "State updates work correctly",
            "Data fetching and caching implemented",
            "Error handling provides user feedback",
            "Optimistic updates improve UX",
            "State persistence works if applicable"
          ],
          validationSteps: ["Test state operations", "Verify data fetching", "Check error handling", "Test performance"],
          troubleshooting: ["State synchronization issues", "Memory leaks", "Performance problems"],
          documentation: ["State management guide", "Data flow documentation", "API integration guide"]
        },
        {
          id: "dev-task-5",
          title: "Testing and Quality Assurance",
          description: `Implement comprehensive testing suite for ${feature} including unit tests, integration tests, end-to-end tests, accessibility tests, and performance tests.`,
          type: "testing",
          complexity: "moderate",
          priority: "medium",
          estimatedHours: "8 hours",
          prerequisites: ["All components and API completed", "Testing framework setup"],
          technicalSpecs: {
            files: [
              `__tests__/${kebabCase}.test.tsx - Component tests`,
              `__tests__/api/${kebabCase}.test.ts - API tests`,
              `e2e/${kebabCase}.spec.ts - End-to-end tests`,
              `__tests__/utils.ts - Test utilities`,
              `__tests__/setup.ts - Test setup configuration`
            ],
            components: ["Test suites", "Mock utilities", "Test fixtures", "Assertion helpers"],
            apis: ["API mocking", "Test data generation"],
            database: ["Test database setup", "Data seeding for tests"],
            libraries: ["jest", "@testing-library/react", "playwright", "@axe-core/playwright", "msw"],
            configurations: ["Jest configuration", "Playwright setup", "Test environment variables"]
          },
          detailedImplementation: {
            step1: "Set up testing framework and configuration",
            step2: "Write unit tests for all components and functions",
            step3: "Create integration tests for API endpoints",
            step4: "Implement end-to-end tests for user workflows",
            step5: "Add accessibility tests using axe-core",
            step6: "Create performance tests and benchmarks",
            codeExamples: ["Test implementations", "Mock setups", "Test utilities"],
            fileContents: ["Complete test files", "Configuration files", "Test utilities"],
            commands: ["npm run test", "npm run test:e2e", "npm run test:coverage"],
            configurations: ["Test settings", "Mock configurations", "Coverage thresholds"]
          },
          testingProcedures: {
            unitTests: ["Component rendering", "Function logic", "Error handling"],
            integrationTests: ["API integration", "Database operations", "State management"],
            e2eTests: ["User workflows", "Cross-browser testing", "Mobile testing"],
            manualTesting: ["Accessibility testing", "Usability testing", "Performance testing"],
            performanceTesting: ["Load testing", "Memory usage", "Bundle size analysis"]
          },
          acceptanceCriteria: [
            "All tests pass consistently",
            "Code coverage above 80%",
            "E2E tests cover main user flows",
            "Accessibility tests pass",
            "Performance benchmarks met"
          ],
          validationSteps: ["Run all test suites", "Check coverage reports", "Verify E2E tests", "Review performance metrics"],
          troubleshooting: ["Flaky tests", "Test environment issues", "Performance bottlenecks"],
          documentation: ["Testing guide", "Test coverage reports", "Performance benchmarks"]
        }
      ]
    },
    aiPlan: {
      totalEstimatedHours: "24 hours",
      approach: "end-to-end",
      tasks: [
        {
          id: "ai-task-1",
          title: "Complete Full-Stack Implementation",
          description: `Generate complete end-to-end implementation of ${feature} with database, backend API, frontend components, and testing.`,
          type: "full-stack",
          complexity: "complex",
          priority: "critical",
          estimatedHours: "12 hours",
          aiPrompt: `Create a complete, production-ready implementation of "${feature}". This should be a comprehensive solution that includes every aspect of the feature from database to user interface.

**COMPLETE FILE STRUCTURE TO CREATE:**

1. **Database Layer:**
   - \`prisma/schema.prisma\` - Complete database schema with proper relationships, indexes, and constraints
   - \`prisma/seed.ts\` - Comprehensive seed data for development and testing scenarios
   - \`src/lib/database.ts\` - Database connection utilities and error handling

2. **Backend API Layer:**
   - \`src/pages/api/${kebabCase}/index.ts\` - Main CRUD endpoints (GET with pagination/filtering, POST with validation)
   - \`src/pages/api/${kebabCase}/[id].ts\` - Individual item operations (GET, PUT, DELETE with authorization)
   - \`src/lib/services/${kebabCase}Service.ts\` - Complete business logic and data operations
   - \`src/lib/middleware/auth.ts\` - JWT authentication and authorization middleware
   - \`src/lib/middleware/validation.ts\` - Request validation using Zod schemas
   - \`src/lib/utils/apiResponse.ts\` - Standardized API response utilities with error handling

3. **Frontend Components:**
   - \`src/components/${featureName}/index.tsx\` - Main component export and re-exports
   - \`src/components/${featureName}/${featureName}Main.tsx\` - Primary container component with layout
   - \`src/components/${featureName}/${featureName}Form.tsx\` - Comprehensive form with validation and submission
   - \`src/components/${featureName}/${featureName}List.tsx\` - Paginated list with search and filtering
   - \`src/components/${featureName}/${featureName}Item.tsx\` - Individual item display with actions
   - \`src/components/${featureName}/${featureName}Modal.tsx\` - Modal for create/edit/delete operations
   - \`src/components/${featureName}/${featureName}.types.ts\` - Complete TypeScript type definitions

4. **State Management:**
   - \`src/hooks/use${featureName}.ts\` - Custom hook for data fetching and state management
   - \`src/store/${kebabCase}Store.ts\` - Zustand store for global state with actions
   - \`src/utils/${kebabCase}Utils.ts\` - Utility functions and helpers

5. **Styling and Testing:**
   - \`src/styles/${featureName}.module.css\` - Component-specific styles
   - \`__tests__/${kebabCase}.test.tsx\` - Comprehensive test suite

**EXTREMELY DETAILED IMPLEMENTATION REQUIREMENTS:**

**1. DATABASE SCHEMA (Prisma) - Complete Implementation:**
\`\`\`prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String          @id @default(cuid())
  email         String          @unique
  name          String?
  avatar        String?
  role          Role            @default(USER)
  ${kebabCase}s ${featureName}[] @relation("User${featureName}s")
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  
  @@map("users")
}

model ${featureName} {
  id          String       @id @default(cuid())
  title       String       @db.VarChar(255)
  description String?      @db.Text
  status      Status       @default(ACTIVE)
  priority    Priority     @default(MEDIUM)
  tags        String[]     @default([])
  metadata    Json?
  userId      String
  user        User         @relation("User${featureName}s", fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@index([title])
  @@map("${kebabCase}")
}

enum Status {
  ACTIVE
  INACTIVE
  PENDING
  COMPLETED
  ARCHIVED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
\`\`\`

**2. API ENDPOINTS - Complete Implementation with Error Handling:**

**GET /api/${kebabCase} - List with Advanced Features:**
\`\`\`typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/database';
import { authOptions } from '@/lib/auth';

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'COMPLETED', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  sortBy: z.enum(['title', 'createdAt', 'updatedAt', 'priority']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { page, limit, search, status, priority, sortBy, sortOrder } = querySchema.parse(req.query);
      
      const where = {
        userId: session.user.id,
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(status && { status }),
        ...(priority && { priority }),
      };

      const [items, total] = await Promise.all([
        prisma.${kebabCase}.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        }),
        prisma.${kebabCase}.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      res.status(200).json({
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error('Error fetching ${kebabCase}:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    // POST implementation here...
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: \`Method \${req.method} not allowed\` });
  }
}
\`\`\`

**3. REACT COMPONENTS - Complete Implementation:**

**Main Component with State Management:**
\`\`\`typescript
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ${featureName}Form } from './${featureName}Form';
import { ${featureName}List } from './${featureName}List';
import { ${featureName}Modal } from './${featureName}Modal';
import { use${featureName} } from '@/hooks/use${featureName}';
import { ${featureName}Data, ${featureName}FormData } from './${featureName}.types';

interface ${featureName}MainProps {
  className?: string;
}

export const ${featureName}Main: React.FC<${featureName}MainProps> = ({ className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<${featureName}Data | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();
  
  const {
    data,
    isLoading,
    error,
    refetch,
  } = use${featureName}({
    page: currentPage,
    search: searchTerm,
    status: statusFilter,
  });

  const createMutation = useMutation({
    mutationFn: (formData: ${featureName}FormData) => 
      fetch('/api/${kebabCase}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${kebabCase}'] });
      toast.success('${featureName} created successfully!');
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create ${featureName}');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ${featureName}FormData }) =>
      fetch(\`/api/${kebabCase}/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${kebabCase}'] });
      toast.success('${featureName} updated successfully!');
      setIsModalOpen(false);
      setEditingItem(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update ${featureName}');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(\`/api/${kebabCase}/\${id}\`, { method: 'DELETE' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${kebabCase}'] });
      toast.success('${featureName} deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete ${featureName}');
    },
  });

  const handleCreate = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((item: ${featureName}Data) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this ${featureName}?')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  const handleSubmit = useCallback((formData: ${featureName}FormData) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }, [editingItem, createMutation, updateMutation]);

  const filteredAndSortedData = useMemo(() => {
    if (!data?.items) return [];
    return data.items;
  }, [data?.items]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Error loading ${featureName}s</h3>
        <p className="text-red-600 mt-1">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={\`space-y-6 \${className}\`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">${featureName}s</h1>
          <p className="text-gray-600">Manage your ${featureName.toLowerCase()}s</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create ${featureName}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search ${featureName.toLowerCase()}s..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* List */}
      <${featureName}List
        items={filteredAndSortedData}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={data?.pagination}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      <${featureName}Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingItem}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};
\`\`\`

**4. COMPREHENSIVE FORM COMPONENT:**
\`\`\`typescript
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ${featureName}FormData } from './${featureName}.types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'COMPLETED', 'ARCHIVED']).default('ACTIVE'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  tags: z.array(z.string()).default([]),
});

interface ${featureName}FormProps {
  onSubmit: (data: ${featureName}FormData) => void;
  initialData?: Partial<${featureName}FormData>;
  isLoading?: boolean;
}

export const ${featureName}Form: React.FC<${featureName}FormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<${featureName}FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'ACTIVE',
      priority: initialData?.priority || 'MEDIUM',
      tags: initialData?.tags || [],
    },
  });

  const isFormLoading = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className={\`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 \${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }\`}
          placeholder="Enter ${featureName.toLowerCase()} title"
          disabled={isFormLoading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          className={\`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 \${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }\`}
          placeholder="Enter description (optional)"
          disabled={isFormLoading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            {...register('status')}
            id="status"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isFormLoading}
          >
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            {...register('priority')}
            id="priority"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isFormLoading}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={isFormLoading}
          className={\`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed \${
            isFormLoading ? 'opacity-50 cursor-not-allowed' : ''
          }\`}
        >
          {isFormLoading ? (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </div>
          ) : (
            \`\${initialData ? 'Update' : 'Create'} ${featureName}\`
          )}
        </button>
      </div>
    </form>
  );
};
\`\`\`

**5. CUSTOM HOOK FOR DATA MANAGEMENT:**
\`\`\`typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ${featureName}Data, ${featureName}FormData } from '@/components/${featureName}/${featureName}.types';

interface Use${featureName}Params {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
}

export const use${featureName} = (params: Use${featureName}Params = {}) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['${kebabCase}', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.search) searchParams.set('search', params.search);
      if (params.status) searchParams.set('status', params.status);
      if (params.priority) searchParams.set('priority', params.priority);

      const response = await fetch(\`/api/${kebabCase}?\${searchParams}\`);
      if (!response.ok) {
        throw new Error('Failed to fetch ${kebabCase}');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return query;
};
\`\`\`

**6. COMPREHENSIVE TESTING:**
\`\`\`typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ${featureName}Main } from '../${featureName}Main';

// Mock fetch
global.fetch = jest.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('${featureName}Main', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders the ${featureName} list', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            id: '1',
            title: 'Test ${featureName}',
            description: 'Test description',
            status: 'ACTIVE',
            priority: 'MEDIUM',
          },
        ],
        pagination: { page: 1, totalPages: 1, total: 1 },
      }),
    });

    render(<${featureName}Main />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test ${featureName}')).toBeInTheDocument();
    });
  });

  it('opens create modal when create button is clicked', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [], pagination: { page: 1, totalPages: 0, total: 0 } }),
    });

    render(<${featureName}Main />, { wrapper: createWrapper() });

    const createButton = screen.getByText('Create ${featureName}');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
\`\`\`

**COMPLETE DEPLOYMENT CONFIGURATION:**

**Docker Configuration:**
\`\`\`dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \\
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \\
  elif [ -f package-lock.json ]; then npm ci; \\
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \\
  else echo "Lockfile not found." && exit 1; \\
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
\`\`\`

**Environment Variables:**
\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# API Configuration
API_BASE_URL="http://localhost:3000/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# External Services
REDIS_URL="redis://localhost:6379"
EMAIL_SERVICE_API_KEY="your-email-service-key"
\`\`\`

This implementation provides a complete, production-ready solution that includes every aspect of building ${feature} from A to Z. All code is fully functional, follows best practices, and includes comprehensive error handling, testing, and deployment configurations.`,
          expectedOutputs: {
            files: [
              "Complete database schema with relationships",
              "Full API implementation with all endpoints",
              "React components with TypeScript",
              "State management with hooks and stores",
              "Styling with Tailwind CSS",
              "Testing suite with comprehensive coverage",
              "Documentation and type definitions"
            ],
            components: [
              "Database models and migrations",
              "RESTful API with validation",
              "React component library",
              "State management system",
              "Authentication and authorization",
              "Error handling and logging",
              "Performance optimization features"
            ],
            features: [
              "Complete CRUD operations",
              "Real-time data synchronization",
              "Responsive design across all devices",
              "Search and filtering",
              "Pagination and sorting",
              "Modal interactions",
              "Form submission and validation",
              "Error states and loading indicators"
            ],
            tests: [
              "All test files and test cases implemented",
              "Unit tests for all components and functions",
              "Integration tests for API endpoints",
              "End-to-end tests for user workflows",
              "Accessibility compliance tests",
              "Performance benchmark tests"
            ],
            documentation: [
              "All documentation files and API specs created",
              "Complete API documentation with examples",
              "Component usage guides with props",
              "Setup and deployment instructions",
              "Database schema documentation",
              "Styling guides with actual CSS/Tailwind code"
            ],
            configurations: [
              "All configuration files and environment setup",
              "Docker configurations for development and production",
              "CI/CD pipeline configurations",
              "Environment variable templates",
              "Database connection settings",
              "API endpoint specifications",
              "React component structure",
              "State management patterns",
              "Authentication and authorization",
              "Error handling and logging",
              "Performance optimization strategies",
              "Security implementations",
              "Database schema design",
              "API response schemas",
              "React component validation",
              "State persistence",
              "API integration points",
              "Performance benchmarks",
              "Security checks",
              "Documentation templates",
              "Setup and deployment steps",
              "Database connection strings",
              "API endpoint URLs",
              "React component props",
              "State management flow",
              "Authentication implementation",
              "Error handling strategies",
              "Performance optimization",
              "Security measures",
              "Database schema relationships",
              "API response status codes",
              "React component validation",
              "State persistence",
              "API integration points",
              "Performance benchmarks",
              "Security checks",
              "Documentation templates",
              "Setup and deployment steps",
              "Database connection strings",
              "API endpoint URLs",
              "React component props",
              "State management flow",
              "Authentication implementation",
              "Error handling strategies",
              "Performance optimization",
              "Security measures"
            ]
          },
          validationCriteria: [
            "All components render without errors in development and production",
            "All API endpoints return proper HTTP status codes and responses",
            "All forms validate input correctly and handle errors gracefully",
            "All tests pass successfully with >90% code coverage",
            "Application is fully responsive across mobile, tablet, and desktop",
            "All accessibility requirements are met (WCAG 2.1 compliance)",
            "Performance benchmarks are satisfied (load times, API response times)",
            "Security checks pass validation (input sanitization, authentication)",
            "Documentation is complete, accurate, and up-to-date",
            "All integration steps are followed correctly",
            "All validation steps are completed successfully",
            "All common issues are addressed with specific solutions",
            "All code examples are working and complete",
            "All command executions are successful",
            "All configuration files are complete and accurate",
            "All environment variables are set correctly",
            "All dependencies are installed and configured",
            "All external services are integrated correctly",
            "All user stories are covered",
            "All technical requirements are met",
            "All business requirements are satisfied",
            "All integration requirements are fulfilled",
            "All performance requirements are achieved",
            "All security requirements are implemented",
            "All scalability requirements are considered",
            "All validation requirements are met"
          ],
          integrationSteps: [
            "1. Install ALL required dependencies with exact commands",
            "2. Configure environment variables with complete examples",
            "3. Run database migrations and seed data with verification",
            "4. Start development server and verify all endpoints",
            "5. Run complete test suite and verify all tests pass",
            "6. Build for production and verify optimizations",
            "7. Deploy to staging environment and run integration tests",
            "8. Perform comprehensive end-to-end testing",
            "9. Deploy to production with monitoring and alerts",
            "10. Verify production deployment and all functionality",
            "11. Include ALL integration and deployment steps"
          ]
        }
      ]
    }
  };
}

/**
 * Generates a feature implementation plan based on a feature description
 */
export async function generateFeatureImplementation(feature: string) {
  try {
    const prompt = `
    🚀 ULTRA-COMPREHENSIVE FEATURE IMPLEMENTATION BLUEPRINT GENERATION 🚀

    FEATURE TO IMPLEMENT: "${feature}"

    ⚠️ CRITICAL REQUIREMENT: You MUST provide EXTREMELY DETAILED, COMPLETE implementation guidance that covers EVERY SINGLE ASPECT from A to Z. This is NOT a basic overview - this is a COMPLETE BLUEPRINT for building a production-ready feature.

    🎯 MANDATORY DETAIL LEVEL:
    - Include COMPLETE CODE EXAMPLES for every component
    - Provide EXACT FILE CONTENTS with full implementations
    - Include ALL necessary imports, dependencies, and configurations
    - Specify EVERY COMMAND needed to set up and run the feature
    - Cover ALL edge cases, error scenarios, and user interactions
    - Include COMPREHENSIVE testing strategies and actual test code
    - Provide COMPLETE deployment and monitoring setup

    📋 COMPREHENSIVE ANALYSIS REQUIREMENTS:
    1. COMPLETE FEATURE BREAKDOWN:
       - Analyze EVERY possible user interaction with this feature
       - Map out ALL data flows, inputs, outputs, and transformations
       - Identify ALL edge cases, error scenarios, and validation requirements
       - Define ALL business rules, constraints, and requirements
       - Identify ALL integration points and dependencies
       - Consider ALL performance, security, and scalability implications

    2. COMPLETE TECHNICAL ARCHITECTURE:
       - FULL database schema design with tables, relationships, indexes, constraints
       - COMPLETE API endpoint specifications with request/response schemas
       - DETAILED frontend component hierarchy and data flow
       - COMPREHENSIVE state management patterns and data structures
       - COMPLETE authentication and authorization requirements
       - DETAILED caching strategies and performance optimizations
       - COMPREHENSIVE error handling and logging mechanisms
       - COMPLETE testing strategies at all levels

    3. COMPLETE IMPLEMENTATION COVERAGE:
       - EVERY file that needs to be created or modified with FULL CONTENT
       - EVERY function, component, and module with COMPLETE IMPLEMENTATIONS
       - ALL external libraries and dependencies with installation commands
       - ALL environment variables and configuration requirements
       - COMPLETE database migrations and seed data
       - DETAILED API documentation and testing procedures
       - COMPREHENSIVE frontend styling and responsive design
       - COMPLETE security implementations and validation rules

    💡 TASK GENERATION REQUIREMENTS:

    🔧 DEVELOPER IMPLEMENTATION PLAN:
    - Create 8-15 EXTREMELY detailed tasks covering every aspect
    - Each task MUST include COMPLETE technical specifications
    - Provide EXACT file paths, folder structures, and naming conventions
    - Include DETAILED step-by-step implementation with CODE EXAMPLES
    - Specify ALL dependencies, prerequisites, and setup requirements
    - Include COMPREHENSIVE testing procedures with actual test code
    - Provide EXACT commands, configurations, and deployment steps

    🤖 AI IMPLEMENTATION PLAN:
    - Create 5-10 COMPREHENSIVE AI-ready tasks
    - Each AI prompt MUST be EXTREMELY detailed and self-contained
    - Include COMPLETE context, requirements, and expected outcomes
    - Specify EXACT file contents, component structures, and styling
    - Include COMPREHENSIVE error handling and edge case management
    - Provide COMPLETE testing scenarios and validation criteria
    - Include DETAILED deployment and integration instructions

    ⭐ EXTREME DETAIL REQUIREMENTS (MANDATORY):
    - Include COMPLETE file contents for every file mentioned
    - Provide FULL code examples and working implementations
    - Specify ALL environment setup and configuration steps
    - Include ALL necessary imports, dependencies, and package installations
    - Provide COMPLETE database schemas with actual SQL/Prisma code
    - Include COMPREHENSIVE styling guides with actual CSS/Tailwind code
    - Specify COMPLETE testing procedures with actual test code
    - Include DETAILED troubleshooting guides with common solutions

    🔍 COMPREHENSIVE COVERAGE AREAS (ALL REQUIRED):
    1. Database Design & Complete Schema Implementation
    2. Backend API Development with Full Code
    3. Frontend Component Development with Complete Code
    4. State Management & Data Flow Implementation
    5. Authentication & Authorization Complete Setup
    6. Validation & Error Handling with Full Code
    7. Testing & Quality Assurance with Test Code
    8. Performance Optimization Implementation
    9. Security Implementation with Code Examples
    10. Deployment & DevOps Complete Configuration
    11. Monitoring & Logging Setup
    12. Documentation & Maintenance Guides
    13. User Experience & Design Implementation
    14. Integration & Communication Setup
    15. Scalability & Future-proofing Implementation

    📊 JSON FORMATTING REQUIREMENTS:
    - Output ONLY valid JSON (no explanations before/after)
    - Start with { and end with }
    - Use double quotes for ALL keys and strings
    - NO trailing commas or comments
    - Proper array/object closure

    🏗️ REQUIRED JSON STRUCTURE WITH COMPLETE DETAILS:
{
  "feature": {
        "title": "Comprehensive feature title that clearly describes the functionality",
        "description": "EXTREMELY detailed feature description (300+ words) covering all aspects: user interactions, business value, technical considerations, user flows, data requirements, integration points, performance expectations, security needs, and scalability considerations",
        "complexity": "simple/moderate/complex/very-complex",
        "estimatedTotalHours": "Realistic total implementation time (e.g., '60-80 hours')",
        "prerequisites": [
          "COMPLETE list of technologies, skills, and setup requirements",
          "Node.js 18+, TypeScript, React, Next.js, Prisma, PostgreSQL",
          "Understanding of RESTful APIs, state management, and testing",
          "Development environment with code editor and Git",
          "And ALL other specific requirements..."
        ],
        "userStories": [
          "COMPREHENSIVE user stories covering ALL user types and scenarios",
          "As a user, I want to [specific action] so that [specific benefit]",
          "As an admin, I want to [management capability] so that [control outcome]",
          "Include stories for ALL user roles and edge cases..."
        ],
        "technicalRequirements": [
          "DETAILED technical requirements with specific metrics",
          "Responsive design supporting mobile, tablet, desktop (320px to 1920px+)",
          "API response times under 200ms for 95% of requests",
          "Database query optimization with proper indexing",
          "Include ALL performance, scalability, and technical specs..."
        ],
        "businessRequirements": [
          "COMPLETE business logic and rules with examples",
          "User authentication and role-based access control",
          "Data validation and integrity requirements",
          "Audit logging for compliance and tracking",
          "Include ALL business rules and constraints..."
        ],
        "integrationRequirements": [
          "ALL external services and API integrations needed",
          "Authentication service integration (Auth0, Firebase, custom)",
          "Email service for notifications (SendGrid, Mailgun, etc.)",
          "File storage integration (AWS S3, Cloudinary, etc.)",
          "Include ALL integration points and dependencies..."
        ],
        "performanceRequirements": [
          "SPECIFIC performance metrics and optimization needs",
          "Page load times under 1.5 seconds on 3G networks",
          "Bundle size optimization (< 300KB initial load)",
          "Database query optimization with sub-100ms response times",
          "Include ALL performance targets and optimization strategies..."
        ],
        "securityRequirements": [
          "COMPLETE security considerations and implementations",
          "Input validation and sanitization for all user inputs",
          "XSS and CSRF protection with proper headers and tokens",
          "SQL injection prevention with parameterized queries",
          "Authentication token security and refresh mechanisms",
          "Include ALL security measures and implementation details..."
        ],
        "scalabilityConsiderations": [
          "DETAILED future growth and scaling requirements",
          "Horizontal scaling capability with load balancing",
          "Database optimization for millions of records",
          "Caching strategies for high-traffic scenarios",
          "Microservices architecture readiness",
          "Include ALL scalability planning and implementation..."
        ]
  },
  "developerPlan": {
        "totalEstimatedHours": "Sum of all task hours (e.g., '75 hours')",
        "skillLevel": "intermediate",
        "architecture": {
          "databaseSchema": "COMPLETE database design with exact table structures, relationships, indexes, constraints, and sample data. Include full Prisma schema or SQL DDL statements.",
          "apiEndpoints": "ALL REST/GraphQL endpoints with FULL specifications: HTTP methods, request/response schemas, authentication requirements, error codes, rate limiting, and example requests/responses.",
          "componentHierarchy": "DETAILED frontend component structure with component tree, props interfaces, state management flow, and component interaction patterns.",
          "stateManagement": "COMPREHENSIVE state management implementation with store structure, action creators, reducers, selectors, and data flow diagrams.",
          "authenticationFlow": "COMPLETE auth implementation with login/logout flows, token management, protected routes, role-based access, and security considerations.",
          "deploymentArchitecture": "FULL deployment structure with Docker configurations, CI/CD pipelines, environment management, monitoring setup, and infrastructure requirements."
        },
        "environment": {
          "technologies": [
            "COMPLETE list with versions",
            "React 18.2+, Next.js 13+, TypeScript 5+, Tailwind CSS 3+",
            "Node.js 18+, Express 4+, Prisma 5+, PostgreSQL 15+",
            "Jest 29+, Playwright 1.30+, Docker 20+",
            "Include ALL technologies with specific versions..."
          ],
          "dependencies": [
            "ALL package dependencies with exact versions",
            "react@18.2.0, next@13.4.0, typescript@5.0.0",
            "prisma@5.0.0, @prisma/client@5.0.0, zod@3.21.0",
            "react-hook-form@7.44.0, @tanstack/react-query@4.29.0",
            "Include ALL dependencies with installation commands..."
          ],
          "environmentVariables": [
            "ALL environment variables with descriptions and examples",
            "DATABASE_URL - PostgreSQL connection string (postgresql://user:pass@host:port/db)",
            "NEXTAUTH_SECRET - Secret key for NextAuth (32+ character random string)",
            "API_BASE_URL - Base URL for API calls (http://localhost:3000/api)",
            "Include ALL env vars with detailed descriptions..."
          ],
          "setupCommands": [
            "EXACT commands to set up the development environment",
            "npm install or yarn install",
            "npx prisma generate && npx prisma db push",
            "npm run dev",
            "Include ALL setup steps with explanations..."
          ],
          "databaseSetup": [
            "COMPLETE database installation and configuration steps",
            "Install PostgreSQL 15+ locally or use Docker",
            "Create database and user with proper permissions",
            "Configure connection strings and environment variables",
            "Include ALL database setup requirements..."
          ],
          "deploymentRequirements": [
            "COMPLETE production deployment requirements",
            "Docker container with multi-stage build",
            "CI/CD pipeline with automated testing and deployment",
            "Environment variable management and secrets",
            "SSL certificates and domain configuration",
            "Include ALL deployment considerations..."
          ]
        },
    "tasks": [
      {
            "id": "dev-task-1",
            "title": "EXTREMELY specific task title describing exact deliverable",
            "description": "COMPREHENSIVE description (200+ words) of exactly what needs to be implemented, including all sub-components, functionality, edge cases, and integration requirements",
            "type": "database/backend/frontend/testing/integration/deployment/documentation",
            "complexity": "simple/moderate/complex",
            "priority": "critical/high/medium/low",
            "estimatedHours": "Realistic hour estimate (e.g., '8 hours')",
            "prerequisites": [
              "SPECIFIC dependencies and prior tasks that must be completed",
              "Database server installed and configured",
              "Development environment set up with all dependencies",
              "Include ALL prerequisites..."
            ],
            "technicalSpecs": {
              "files": [
                "EXACT file paths with COMPLETE file content descriptions",
                "src/lib/database.ts - Database connection utilities with error handling",
                "prisma/schema.prisma - Complete database schema with all models",
                "Include ALL files with detailed descriptions..."
              ],
              "components": [
                "ALL components/modules with COMPLETE specifications",
                "Database connection manager with retry logic",
                "Model validation schemas with Zod",
                "Include ALL components with full specs..."
              ],
              "apis": [
                "COMPLETE API endpoint specifications with full examples",
                "GET /api/items - List items with pagination, filtering, sorting",
                "POST /api/items - Create new item with validation",
                "Include ALL endpoints with request/response examples..."
              ],
              "database": [
                "EXACT database changes with full DDL statements",
                "CREATE TABLE items (id UUID PRIMARY KEY, title VARCHAR(255) NOT NULL, ...)",
                "CREATE INDEX idx_items_user_id ON items(user_id)",
                "Include ALL database modifications..."
              ],
              "libraries": [
                "COMPLETE external dependencies with installation commands",
                "npm install prisma @prisma/client zod bcrypt jsonwebtoken",
                "npm install --save-dev @types/bcrypt @types/jsonwebtoken",
                "Include ALL library requirements..."
              ],
              "configurations": [
                "ALL configuration files with COMPLETE content",
                "Environment variable configurations",
                "Database connection settings",
                "Include ALL configuration requirements..."
              ]
            },
            "detailedImplementation": {
              "step1": "EXTREMELY detailed first step with exact commands, code examples, and explanations",
              "step2": "Second step with COMPLETE implementation details, code snippets, and configuration",
              "step3": "Continue with ALL necessary steps including error handling and edge cases",
              "codeExamples": [
                "COMPLETE, working code snippets with full context",
                "Example: Full React component with TypeScript interfaces",
                "Example: Complete API endpoint with validation and error handling",
                "Include ALL code examples needed..."
              ],
              "fileContents": [
                "EXACT file contents where applicable",
                "Complete Prisma schema file",
                "Full React component implementation",
                "Include ALL file contents..."
              ],
              "commands": [
                "ALL terminal commands needed with explanations",
                "npx prisma migrate dev --name init",
                "npm run test -- --coverage",
                "Include ALL commands with context..."
              ],
              "configurations": [
                "COMPLETE configuration file contents",
                "Full environment variable setup",
                "Complete Docker configuration",
                "Include ALL configuration details..."
              ]
            },
            "testingProcedures": {
              "unitTests": [
                "SPECIFIC unit tests with COMPLETE code examples",
                "Test database connection and error handling",
                "Test model validation with edge cases",
                "Include ALL unit tests with full implementations..."
              ],
              "integrationTests": [
                "COMPLETE integration test scenarios with code",
                "Test API endpoints with various inputs",
                "Test database operations with real data",
                "Include ALL integration tests..."
              ],
              "e2eTests": [
                "FULL end-to-end test cases with automation code",
                "Test complete user workflows",
                "Test error scenarios and recovery",
                "Include ALL e2e tests..."
              ],
              "manualTesting": [
                "DETAILED manual testing procedures with checklists",
                "User interface testing across devices",
                "Performance testing under load",
                "Include ALL manual testing steps..."
              ],
              "performanceTesting": [
                "SPECIFIC performance testing requirements with tools",
                "Load testing with specific metrics",
                "Memory usage and optimization testing",
                "Include ALL performance testing..."
              ]
            },
            "acceptanceCriteria": [
              "EXTREMELY specific, measurable completion criteria",
              "All database tables created with proper relationships",
              "All API endpoints return correct HTTP status codes",
              "All forms validate input correctly",
              "Include ALL acceptance criteria..."
            ],
            "validationSteps": [
              "DETAILED step-by-step validation procedures",
              "Run database migrations and verify schema",
              "Test all API endpoints with Postman/Insomnia",
              "Verify all components render without errors",
              "Include ALL validation steps..."
            ],
            "troubleshooting": [
              "COMPREHENSIVE common issues with specific solutions",
              "Database connection issues: Check credentials and network",
              "Build errors: Verify all dependencies are installed",
              "Performance issues: Check database indexes and queries",
              "Include ALL troubleshooting scenarios..."
            ],
            "documentation": [
              "EXACT documentation to create with templates and examples",
              "API documentation with OpenAPI/Swagger specs",
              "Component usage guide with props",
              "Database schema documentation",
              "Include ALL documentation requirements..."
            ]
      }
    ]
  },
  "aiPlan": {
        "totalEstimatedHours": "Sum of all AI task hours (e.g., '35 hours')",
        "approach": "end-to-end",
    "tasks": [
      {
            "id": "ai-task-1",
            "title": "COMPREHENSIVE AI task title with specific deliverables",
            "description": "COMPLETE description (300+ words) of what the AI should implement, including all components, features, testing, and deployment considerations",
            "type": "full-stack/frontend/backend/testing/integration",
            "complexity": "simple/moderate/complex",
            "priority": "critical/high/medium/low", 
            "estimatedHours": "Time estimate for AI implementation (e.g., '15 hours')",
            "aiPrompt": "ULTRA-COMPREHENSIVE AI PROMPT with COMPLETE implementation details, code examples, file structures, testing requirements, and deployment configurations. This prompt should be copy-pasteable and result in a fully working, production-ready implementation.",
            "expectedOutputs": {
              "files": [
                "COMPREHENSIVE list of ALL files with detailed descriptions",
                "Complete database schema and migration files",
                "Full API implementation with all endpoints",
                "Complete React component library with TypeScript",
                "Comprehensive testing suite with full coverage",
                "Include ALL expected outputs..."
              ],
              "components": [
                "ALL React components with complete functionality",
                "Main container component with state management",
                "Form components with validation and submission",
                "List components with pagination and filtering",
                "Include ALL component specifications..."
              ],
              "features": [
                "COMPLETE list of implemented features and capabilities",
                "Full CRUD operations with validation",
                "Real-time data synchronization",
                "Responsive design across all devices",
                "Include ALL feature implementations..."
              ],
              "tests": [
                "ALL test files and test cases implemented",
                "Unit tests for all components and functions",
    🏗️ REQUIRED JSON STRUCTURE WITH COMPLETE DETAILS:`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1, // Very low temperature for maximum consistency and detail
        maxOutputTokens: 16384, // Reduced from 32768 to prevent truncation issues
      }
    });
    
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsedData = extractAndParseJson(text);
      
      // Enhanced validation for comprehensive implementation plans
      if (!parsedData.feature || !parsedData.developerPlan || !parsedData.aiPlan) {
        console.warn("Invalid structure in AI response, using simple fallback");
        return createSimpleFallback(feature);
      }
      
      // Validate that we have comprehensive task lists
      const devTasks = parsedData.developerPlan.tasks || [];
      const aiTasks = parsedData.aiPlan.tasks || [];
      
      if (devTasks.length === 0 && aiTasks.length === 0) {
        console.warn("Empty task lists in AI response, using simple fallback");
        return createSimpleFallback(feature);
      }
      
      // Ensure tasks have required detail for comprehensive implementation
      const validateTaskDetail = (tasks: any[], type: string) => {
        return tasks.every((task: any) => 
          task.title && 
          task.description && 
          task.type && 
          task.priority &&
          (type === 'ai' ? task.aiPrompt : task.implementation)
        );
      };

      const devTasksValid = validateTaskDetail(devTasks, 'dev');
      const aiTasksValid = validateTaskDetail(aiTasks, 'ai');

      if (!devTasksValid || !aiTasksValid) {
        console.warn("Tasks missing required detail, using simple fallback");
        return createSimpleFallback(feature);
      }
      
      console.log("Successfully parsed comprehensive feature implementation from AI");
      return parsedData;
      
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.log("Using simple fallback due to parsing error");
      return createSimpleFallback(feature);
    }
    
  } catch (error) {
    console.error("Error generating feature implementation:", error);
    console.log("Using simple fallback due to generation error");
    return createSimpleFallback(feature);
  }
} 