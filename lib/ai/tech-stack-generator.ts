import { model } from './client';
import { extractJsonFromText } from './json-utils';

/**
 * Generates tech stack recommendations based on project data
 */
export async function generateTechStack(projectData: any) {
  try {
    console.log('Starting tech stack generation with Gemini API');
    
    // Extract features for analysis
    const coreFeatures = projectData?.coreFeatures || [];
    const suggestedFeatures = projectData?.suggestedFeatures || [];
    const allFeatures = [...coreFeatures, ...suggestedFeatures];
    
    const featuresList = allFeatures.map(feature => 
      `- ${feature.name}: ${feature.description}`
    ).join('\n');
    
    const prompt = `
    COMPREHENSIVE TECHNOLOGY STACK ANALYSIS AND RECOMMENDATIONS

    PROJECT DETAILS:
    Title: ${projectData?.title || 'Unknown Project'}
    Description: ${projectData?.description || 'No description provided'}
    
    ALL PROJECT FEATURES TO CONSIDER:
    ${featuresList}

    Your task is to perform DEEP TECHNICAL ANALYSIS and provide COMPREHENSIVE technology recommendations that perfectly match this project's specific requirements.

    ANALYSIS FRAMEWORK:

    1. FEATURE-DRIVEN ANALYSIS:
    Analyze each feature and determine:
    - What technical capabilities are required?
    - What performance characteristics are needed?
    - What scalability requirements exist?
    - What security considerations apply?
    - What integration points are needed?
    - What data patterns and storage needs exist?
    - What real-time capabilities are required?
    - What complexity levels are involved?

    2. DYNAMIC CATEGORIZATION:
    Based on the analyzed features, determine which technology categories are relevant:
    - Frontend Framework/Library (always required)
    - Backend Framework/Technology (always required)  
    - Database Solutions (always required)
    - Authentication & Authorization (always required)
    - State Management (if complex UI)
    - Real-time Communication (if real-time features detected)
    - File Storage & CDN (if file handling detected)
    - Payment Processing (if e-commerce/payments detected)
    - Search Engine (if search functionality detected)
    - Message Queue/Job Processing (if async processing needed)
    - Caching Solutions (if performance critical)
    - API Gateway/Management (if multiple APIs)
    - Monitoring & Analytics (if data tracking needed)
    - AI/ML Services (if AI features detected)
    - Email/SMS Services (if notifications detected)
    - Containerization & Orchestration (for deployment)
    - CI/CD Pipeline Tools (for development)
    - Testing Frameworks (for quality assurance)
    - Documentation Tools (for maintenance)
    - Security Tools (for protection)
    - Performance Optimization (for speed)
    - Mobile Development (if mobile features)
    - Desktop Development (if desktop needed)
    - Browser Extensions (if extensions needed)
    - Blockchain/Web3 (if crypto features)
    - IoT Integration (if IoT features)
    - Video/Audio Processing (if media features)
    - Maps/Location Services (if location features)
    - Social Media Integration (if social features)
    - Content Management (if CMS features)
    - Backup & Recovery Solutions
    - Load Balancing & CDN
    - SSL/TLS & Security Certificates
    - Domain & DNS Management

    3. RECOMMENDATION CRITERIA:
    For each technology category, provide 2-4 options ranked by:
    - PERFECT FIT SCORE (0-100): How well it matches project requirements
    - LEARNING CURVE: beginner/intermediate/advanced
    - COMMUNITY SUPPORT: excellent/good/fair/poor
    - SCALABILITY: low/medium/high/enterprise
    - COST: free/low/medium/high/enterprise
    - MATURITY: experimental/stable/mature/legacy
    - DEPLOYMENT COMPLEXITY: simple/moderate/complex
    - PERFORMANCE: poor/good/excellent/exceptional

    4. INTELLIGENT ALTERNATIVES:
    When features require specific capabilities, provide intelligent alternatives:
    - If notification features → Firebase FCM, OneSignal, AWS SNS, Pusher, custom solutions
    - If real-time features → WebSockets, Socket.io, Firebase Realtime, Pusher, Ably
    - If search features → Elasticsearch, Algolia, Typesense, Solr, custom solutions
    - If file storage → AWS S3, Cloudinary, Firebase Storage, Supabase Storage
    - If payments → Stripe, PayPal, Razorpay, Square, custom solutions
    - And so on for every detected capability...

    5. INTEGRATION CONSIDERATIONS:
    - How well technologies work together
    - Potential conflicts or complications
    - Ecosystem synergies
    - Development efficiency implications

    COMPREHENSIVE OUTPUT REQUIREMENTS:
    - Analyze ALL features and determine ALL relevant tech categories
    - Provide 2-4 ranked alternatives for each category
    - Mark the BEST option as "recommended": true
    - Include detailed reasoning for each recommendation
    - Provide implementation complexity estimates
    - Suggest learning resources where helpful
    - Consider both MVP and scale-up scenarios

    CRITICAL JSON FORMATTING:
    - ONLY valid JSON output, no text before/after
    - Start with { and end with }
    - Double quotes for all keys/strings
    - No trailing commas or comments
    - Proper array/object closure

    Required JSON structure (dynamically include relevant categories):
    {
      "frontend": [
        {
          "name": "Technology Name",
          "recommended": true/false,
          "fitScore": 95,
          "learningCurve": "beginner/intermediate/advanced",
          "communitySupport": "excellent/good/fair/poor",
          "scalability": "low/medium/high/enterprise",
          "cost": "free/low/medium/high/enterprise",
          "maturity": "experimental/stable/mature/legacy",
          "deploymentComplexity": "simple/moderate/complex",
          "performance": "poor/good/excellent/exceptional",
          "reason": "Detailed explanation of why this technology fits this specific project, considering the exact features and requirements mentioned",
          "bestFor": "Specific use cases in this project",
          "considerations": "Important factors to consider for this project"
        }
      ],
      "backend": [...],
      "database": [...],
      "authentication": [...],
      // Include additional categories only if relevant to the project:
      "stateManagement": [...],
      "realTimeCommunication": [...],
      "fileStorage": [...],
      "paymentProcessing": [...],
      "searchEngine": [...],
      "messageQueue": [...],
      "caching": [...],
      "monitoring": [...],
      "emailServices": [...],
      "mobileFramework": [...],
      "testingFrameworks": [...],
      "containerization": [...],
      "cicd": [...],
      "security": [...],
      // ... and any other relevant categories based on features
      "additionalTools": [
        {
          "category": "Category Name",
          "name": "Tool Name", 
          "recommended": true/false,
          "reason": "Why this tool is important for this specific project",
          "priority": "critical/important/nice-to-have",
          "implementationPhase": "mvp/phase2/future"
        }
      ]
    }
    `;

    // Create a promise that rejects after a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Tech stack generation timed out')), 120000); // Increased timeout for comprehensive analysis
    });

    // Race the API call against the timeout
    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2, // Lower temperature for more consistent technical recommendations
          maxOutputTokens: 12288, // Increased for comprehensive recommendations
        }
      }),
      timeoutPromise
    ]) as any;

    const response = await result.response;
    const text = response.text();
    
    console.log('Tech stack generation completed successfully');
    
    try {
      // Extract and clean the JSON from the response
      let jsonString = extractJsonFromText(text);
      
      // Try to parse the cleaned JSON
      try {
        const parsedData = JSON.parse(jsonString);
        
        // Enhanced validation for comprehensive tech stack
        if (!parsedData.frontend || !parsedData.backend || !parsedData.database) {
          throw new Error('Parsed JSON is missing required tech stack fields');
        }

        // Validate that recommendations include fit scores and detailed analysis
        const validateCategory = (category: any[]) => {
          return category.every((item: any) => 
            item.name && 
            item.reason && 
            typeof item.fitScore === 'number' &&
            item.learningCurve &&
            item.scalability
          );
        };

        const isValidStructure = (
          validateCategory(parsedData.frontend || []) &&
          validateCategory(parsedData.backend || []) &&
          validateCategory(parsedData.database || [])
        );

        if (!isValidStructure) {
          console.warn('Tech stack structure validation failed, but using available data');
        }
        
        return parsedData;
      } catch (parsingError) {
        console.error("Error parsing cleaned JSON:", parsingError);
        
        // Fall back to a more direct extraction as a last resort
        try {
          const strictJsonRegex = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/g;
          const matches = jsonString.match(strictJsonRegex);
          if (matches && matches.length > 0) {
            // Try the largest match first (most likely the full response)
            const largestMatch = matches.reduce((a: string, b: string) => a.length > b.length ? a : b);
            const lastResortData = JSON.parse(largestMatch);
            return lastResortData;
          }
        } catch (lastResortError) {
          console.error("Last resort parsing failed:", lastResortError);
        }
        
        // Enhanced fallback with feature-based recommendations
        console.warn("Using enhanced fallback tech stack structure");
        const hasNotifications = featuresList.toLowerCase().includes('notification');
        const hasRealTime = featuresList.toLowerCase().includes('real-time') || featuresList.toLowerCase().includes('chat') || featuresList.toLowerCase().includes('live');
        const hasPayments = featuresList.toLowerCase().includes('payment') || featuresList.toLowerCase().includes('purchase') || featuresList.toLowerCase().includes('billing');
        const hasSearch = featuresList.toLowerCase().includes('search') || featuresList.toLowerCase().includes('filter');
        const hasFileUpload = featuresList.toLowerCase().includes('upload') || featuresList.toLowerCase().includes('file') || featuresList.toLowerCase().includes('image');

        const fallbackData: any = {
          frontend: [
            {name: "React", recommended: true, fitScore: 90, learningCurve: "intermediate", communitySupport: "excellent", scalability: "high", cost: "free", maturity: "mature", deploymentComplexity: "moderate", performance: "excellent", reason: "Excellent ecosystem and component reusability for complex UIs", bestFor: "Interactive user interfaces", considerations: "Requires state management for complex apps"},
            {name: "Next.js", recommended: false, fitScore: 85, learningCurve: "intermediate", communitySupport: "excellent", scalability: "high", cost: "free", maturity: "mature", deploymentComplexity: "simple", performance: "excellent", reason: "Full-stack React framework with SSR and API routes", bestFor: "SEO-critical applications", considerations: "Heavier than pure React"},
            {name: "Vue.js", recommended: false, fitScore: 80, learningCurve: "beginner", communitySupport: "good", scalability: "medium", cost: "free", maturity: "mature", deploymentComplexity: "simple", performance: "good", reason: "Gentle learning curve and progressive adoption", bestFor: "Smaller to medium projects", considerations: "Smaller ecosystem than React"}
          ],
          backend: [
            {name: "Node.js with Express", recommended: true, fitScore: 88, learningCurve: "intermediate", communitySupport: "excellent", scalability: "high", cost: "free", maturity: "mature", deploymentComplexity: "moderate", performance: "good", reason: "JavaScript everywhere, vast ecosystem, excellent for APIs", bestFor: "RESTful APIs and real-time applications", considerations: "Single-threaded, not ideal for CPU-intensive tasks"},
            {name: "Python with FastAPI", recommended: false, fitScore: 82, learningCurve: "intermediate", communitySupport: "excellent", scalability: "high", cost: "free", maturity: "stable", deploymentComplexity: "moderate", performance: "excellent", reason: "High performance, automatic API documentation, type hints", bestFor: "Data-heavy applications and APIs", considerations: "Different language from frontend"},
            {name: "Supabase", recommended: false, fitScore: 85, learningCurve: "beginner", communitySupport: "good", scalability: "high", cost: "low", maturity: "stable", deploymentComplexity: "simple", performance: "good", reason: "Backend-as-a-service with PostgreSQL, auth, and real-time", bestFor: "Rapid prototyping and MVP development", considerations: "Vendor lock-in potential"}
          ],
          database: [
            {name: "PostgreSQL", recommended: true, fitScore: 92, learningCurve: "intermediate", communitySupport: "excellent", scalability: "high", cost: "free", maturity: "mature", deploymentComplexity: "moderate", performance: "excellent", reason: "ACID compliance, advanced features, excellent for complex queries", bestFor: "Complex relational data and ACID transactions", considerations: "Requires proper indexing for performance"},
            {name: "MongoDB", recommended: false, fitScore: 78, learningCurve: "beginner", communitySupport: "excellent", scalability: "high", cost: "free", maturity: "mature", deploymentComplexity: "simple", performance: "good", reason: "Flexible schema, JSON-like documents, good for rapid development", bestFor: "Flexible data structures and rapid prototyping", considerations: "No ACID transactions across documents"},
            {name: "Firebase Firestore", recommended: false, fitScore: 75, learningCurve: "beginner", communitySupport: "good", scalability: "high", cost: "low", maturity: "mature", deploymentComplexity: "simple", performance: "good", reason: "Real-time database with offline support", bestFor: "Real-time applications with simple queries", considerations: "Limited query capabilities and vendor lock-in"}
          ],
          authentication: [
            {name: "NextAuth.js", recommended: true, fitScore: 88, learningCurve: "intermediate", communitySupport: "excellent", scalability: "high", cost: "free", maturity: "mature", deploymentComplexity: "moderate", performance: "good", reason: "Comprehensive auth solution for Next.js with multiple providers", bestFor: "Next.js applications with multiple login methods", considerations: "Tied to Next.js ecosystem"},
            {name: "Firebase Auth", recommended: false, fitScore: 82, learningCurve: "beginner", communitySupport: "excellent", scalability: "high", cost: "low", maturity: "mature", deploymentComplexity: "simple", performance: "good", reason: "Easy setup with multiple auth providers and mobile support", bestFor: "Quick authentication setup", considerations: "Vendor lock-in to Google ecosystem"},
            {name: "Supabase Auth", recommended: false, fitScore: 80, learningCurve: "beginner", communitySupport: "good", scalability: "high", cost: "low", maturity: "stable", deploymentComplexity: "simple", performance: "good", reason: "PostgreSQL-based auth with row-level security", bestFor: "When using Supabase as backend", considerations: "Newer ecosystem compared to Firebase"}
          ]
        };

        // Add conditional categories based on detected features
        if (hasNotifications) {
          fallbackData.notificationServices = [
            {name: "OneSignal", recommended: true, fitScore: 90, learningCurve: "beginner", communitySupport: "excellent", scalability: "high", cost: "free", maturity: "mature", deploymentComplexity: "simple", performance: "excellent", reason: "Comprehensive push notification service with multi-platform support", bestFor: "Multi-platform push notifications", considerations: "Free tier limitations for large scale"},
            {name: "Firebase Cloud Messaging", recommended: false, fitScore: 85, learningCurve: "intermediate", communitySupport: "excellent", scalability: "high", cost: "free", maturity: "mature", deploymentComplexity: "moderate", performance: "good", reason: "Google's push notification service", bestFor: "Android and web notifications", considerations: "Tied to Google ecosystem"}
          ];
        }

        if (hasRealTime) {
          fallbackData.realTimeCommunication = [
            {name: "Socket.io", recommended: true, fitScore: 92, learningCurve: "intermediate", communitySupport: "excellent", scalability: "high", cost: "free", maturity: "mature", deploymentComplexity: "moderate", performance: "excellent", reason: "Reliable WebSocket library with fallbacks", bestFor: "Real-time bidirectional communication", considerations: "Requires WebSocket server infrastructure"},
            {name: "Pusher", recommended: false, fitScore: 80, learningCurve: "beginner", communitySupport: "good", scalability: "high", cost: "medium", maturity: "mature", deploymentComplexity: "simple", performance: "good", reason: "Hosted real-time communication service", bestFor: "Quick real-time features without infrastructure", considerations: "Monthly cost for usage"}
          ];
        }

        if (hasPayments) {
          fallbackData.paymentProcessing = [
            {name: "Stripe", recommended: true, fitScore: 95, learningCurve: "intermediate", communitySupport: "excellent", scalability: "enterprise", cost: "medium", maturity: "mature", deploymentComplexity: "moderate", performance: "excellent", reason: "Most comprehensive payment platform with excellent API", bestFor: "Credit card processing and subscription billing", considerations: "Transaction fees and compliance requirements"},
            {name: "Razorpay", recommended: false, fitScore: 85, learningCurve: "intermediate", communitySupport: "good", scalability: "high", cost: "medium", maturity: "mature", deploymentComplexity: "moderate", performance: "good", reason: "Popular in India with local payment methods", bestFor: "Indian market with UPI and local payments", considerations: "Geographic limitations"}
          ];
        }

        if (hasSearch) {
          fallbackData.searchEngine = [
            {name: "Algolia", recommended: true, fitScore: 90, learningCurve: "beginner", communitySupport: "excellent", scalability: "high", cost: "medium", maturity: "mature", deploymentComplexity: "simple", performance: "exceptional", reason: "Hosted search with typo tolerance and instant results", bestFor: "Fast, typo-tolerant search experiences", considerations: "Cost scales with usage"},
            {name: "Elasticsearch", recommended: false, fitScore: 82, learningCurve: "advanced", communitySupport: "excellent", scalability: "enterprise", cost: "free", maturity: "mature", deploymentComplexity: "complex", performance: "excellent", reason: "Powerful full-text search engine", bestFor: "Complex search requirements and analytics", considerations: "Requires significant setup and maintenance"}
          ];
        }

        if (hasFileUpload) {
          fallbackData.fileStorage = [
            {name: "Cloudinary", recommended: true, fitScore: 88, learningCurve: "beginner", communitySupport: "excellent", scalability: "high", cost: "low", maturity: "mature", deploymentComplexity: "simple", performance: "excellent", reason: "Image and video management with automatic optimization", bestFor: "Media-heavy applications with image processing", considerations: "Cost increases with storage and transformations"},
            {name: "AWS S3", recommended: false, fitScore: 85, learningCurve: "intermediate", communitySupport: "excellent", scalability: "enterprise", cost: "low", maturity: "mature", deploymentComplexity: "moderate", performance: "excellent", reason: "Industry standard object storage", bestFor: "Large-scale file storage with global CDN", considerations: "Requires AWS knowledge and additional services for optimization"}
          ];
        }

        // Always include additional tools
        fallbackData.additionalTools = [
          {category: "Version Control", name: "Git with GitHub", recommended: true, reason: "Essential for code versioning and collaboration", priority: "critical", implementationPhase: "mvp"},
          {category: "Package Management", name: "npm/yarn", recommended: true, reason: "JavaScript dependency management", priority: "critical", implementationPhase: "mvp"},
          {category: "Code Quality", name: "ESLint + Prettier", recommended: true, reason: "Code linting and formatting", priority: "important", implementationPhase: "mvp"},
          {category: "Environment Management", name: "dotenv", recommended: true, reason: "Environment variable management", priority: "critical", implementationPhase: "mvp"},
          {category: "API Testing", name: "Postman", recommended: true, reason: "API development and testing", priority: "important", implementationPhase: "mvp"},
          {category: "Deployment", name: "Vercel", recommended: true, reason: "Easy deployment for Next.js applications", priority: "critical", implementationPhase: "mvp"},
          {category: "Monitoring", name: "Sentry", recommended: true, reason: "Error tracking and performance monitoring", priority: "important", implementationPhase: "phase2"},
          {category: "Documentation", name: "Notion/GitBook", recommended: true, reason: "Team collaboration and documentation", priority: "important", implementationPhase: "mvp"},
          {category: "Design System", name: "Tailwind CSS", recommended: true, reason: "Utility-first CSS framework", priority: "important", implementationPhase: "mvp"},
          {category: "UI Components", name: "Shadcn/ui", recommended: true, reason: "Pre-built accessible components", priority: "important", implementationPhase: "mvp"}
        ];

        return fallbackData;
      }
    } catch (error) {
      console.error("Error extracting JSON from Gemini response:", error);
      console.log("Raw response:", text);
      throw new Error("Failed to parse tech stack recommendations from AI response");
    }
  } catch (error) {
    console.error("Error generating tech stack recommendations:", error);
    throw error;
  }
} 