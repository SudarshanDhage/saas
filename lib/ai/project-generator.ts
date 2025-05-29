import { model } from './client';
import { extractJsonFromText } from './json-utils';

/**
 * Generate project structure based on user idea
 */
export async function generateProjectStructure(idea: string) {
  try {
    const prompt = `
    COMPREHENSIVE PROJECT ANALYSIS AND FEATURE EXTRACTION

    User's Project Idea: "${idea}"
    
    Your task is to perform an EXHAUSTIVE analysis of this idea and extract ALL possible features, requirements, and considerations. Think like a senior product manager, software architect, and business analyst combined.

    ANALYSIS FRAMEWORK:
    1. DEEP REQUIREMENT ANALYSIS:
       - What is the core problem this project solves?
       - Who are the target users/personas?
       - What are the critical user journeys?
       - What business logic is required?
       - What data needs to be stored and managed?
       - What integrations might be needed?
       - What scalability considerations exist?
       - What security requirements are implied?
       - What compliance or regulatory aspects might apply?

    2. FEATURE CATEGORIZATION:
       Analyze and categorize features across ALL these domains (not just basic frontend/backend):
       - User Management & Authentication
       - Core Business Logic Features
       - Data Management & Processing
       - User Interface & Experience
       - Communication & Notifications
       - Search & Discovery
       - Analytics & Reporting
       - Administrative & Management
       - Integration & API Features
       - Payment & Monetization (if applicable)
       - Content Management
       - Security & Privacy
       - Performance & Optimization
       - Mobile & Cross-platform
       - AI/ML & Automation (if applicable)
       - Real-time Features
       - Workflow & Process Management
       - Collaboration Features
       - Customization & Configuration
       - Backup & Recovery
       - Monitoring & Logging
       - Testing & Quality Assurance
       - Documentation & Help
       - Accessibility & Internationalization

    3. CORE vs SUGGESTED FEATURES:
       - Core Features: Absolutely essential for MVP, without which the project cannot function
       - Suggested Features: Important enhancements, nice-to-haves, future iterations, advanced features

    4. FEATURE DEPTH REQUIREMENTS:
       For each feature, provide:
       - Clear, specific name
       - Detailed description explaining WHAT it does
       - WHY it's important for this specific project
       - HOW it relates to the user's idea
       - Any technical considerations or complexities

    COMPREHENSIVE FEATURE EXTRACTION RULES:
    - Generate 8-15 core features minimum (don't limit yourself)
    - Generate 10-20 suggested features minimum
    - Think beyond obvious features - consider edge cases, admin needs, maintenance, monitoring
    - Consider different user roles and their specific needs
    - Think about the complete user lifecycle (onboarding, usage, offboarding)
    - Consider business requirements (analytics, reporting, compliance)
    - Think about technical requirements (security, performance, scalability)
    - Consider future growth and expansion possibilities

    EXAMPLES OF COMPREHENSIVE THINKING:
    If the idea mentions "user accounts" → think: registration, verification, profiles, preferences, privacy settings, account recovery, deactivation, data export, security settings, multi-factor auth, social login, etc.

    If the idea involves "content" → think: content creation, editing, versioning, publishing, moderation, search, categorization, tagging, sharing, comments, likes, reporting, archiving, etc.

    If it's a "marketplace" → think: buyer/seller registration, product listings, search/filters, reviews, messaging, payments, disputes, analytics, commission tracking, seller tools, buyer protection, etc.

    CRITICAL JSON FORMATTING REQUIREMENTS:
    - Response must be ONLY valid JSON, no explanations before or after
    - Start with { and end with }
    - Use DOUBLE quotes for all keys and string values
    - NO trailing commas, NO comments
    - Ensure proper array/object closure
    - DO NOT include markdown code blocks
    - DO NOT include any text outside the JSON structure
    - Every property name MUST be in double quotes
    - Every string value MUST be in double quotes
    - Arrays must have proper comma separation between elements
    - Objects must have proper comma separation between properties
    - The last property in an object should NOT have a trailing comma
    - The last element in an array should NOT have a trailing comma

    EXAMPLE OF CORRECT JSON FORMAT:
    {
      "title": "Example Project",
      "description": "This is a description",
      "coreFeatures": [
        {
          "id": "feature1",
          "name": "Feature Name",
          "description": "Feature description"
        },
        {
          "id": "feature2", 
          "name": "Another Feature",
          "description": "Another description"
        }
      ],
      "suggestedFeatures": [
        {
          "id": "suggestion1",
          "name": "Suggested Feature",
          "description": "Suggestion description"
        }
      ]
    }

    Required JSON structure:
    {
      "title": "Clear, specific project title based on the idea",
      "description": "Comprehensive 2-3 sentence description capturing the full scope and value proposition",
      "coreFeatures": [
        {
          "id": "unique_feature_id",
          "name": "Specific Feature Name",
          "description": "Detailed description explaining what this feature does, why it's essential for this project, and how users will benefit from it"
        }
      ],
      "suggestedFeatures": [
        {
          "id": "unique_suggestion_id",
          "name": "Enhancement Feature Name", 
          "description": "Detailed description explaining what this feature adds, why it would be valuable, when it might be implemented, and how it enhances the core functionality"
        }
      ]
    }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3, // Slightly higher for creative feature thinking
        maxOutputTokens: 8192, // Increased for comprehensive output
      }
    });
    
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract and clean the JSON from the response
      let jsonString = extractJsonFromText(text);
      
      console.log("=== PROJECT GENERATOR JSON PARSING ===");
      console.log("Raw AI response length:", text.length);
      console.log("Raw AI response start:", text.substring(0, 500));
      console.log("Extracted JSON length:", jsonString.length);
      console.log("Extracted JSON start:", jsonString.substring(0, 500));
      
      // Try to parse the cleaned JSON
      try {
        const parsedData = JSON.parse(jsonString);
        
        console.log("Successfully parsed project structure JSON");
        console.log("Parsed data keys:", Object.keys(parsedData));
        
        // Enhanced validation for comprehensive feature lists
        if (!parsedData.title || !parsedData.description || !parsedData.coreFeatures) {
          console.warn('Parsed JSON is missing required project structure fields');
          console.log('Available fields:', Object.keys(parsedData));
          throw new Error('Parsed JSON is missing required project structure fields');
        }

        // Ensure we have comprehensive feature lists
        const coreCount = parsedData.coreFeatures?.length || 0;
        const suggestedCount = parsedData.suggestedFeatures?.length || 0;
        
        console.log(`Feature counts: ${coreCount} core, ${suggestedCount} suggested`);
        
        if (coreCount < 3 || suggestedCount < 5) {
          console.warn(`Feature count below threshold: ${coreCount} core, ${suggestedCount} suggested. Still usable but not comprehensive.`);
        }
        
        return parsedData;
      } catch (parsingError) {
        console.error("Error parsing cleaned JSON:", parsingError);
        console.log("Failed JSON string (first 1000 chars):", jsonString.substring(0, 1000));
        
        // Try to extract at least some data from the malformed JSON
        try {
          console.log("Attempting partial data extraction...");
          
          // Try to extract basic fields using regex patterns
          const titleMatch = text.match(/"title"\s*:\s*"([^"]*)"/);
          const descMatch = text.match(/"description"\s*:\s*"([^"]*)"/);
          
          if (titleMatch || descMatch) {
            console.log("Found some extractable data, building minimal structure");
            
            const partialData = {
              title: titleMatch ? titleMatch[1] : idea.split(' ').slice(0, 5).join(' '),
              description: descMatch ? descMatch[1] : `A comprehensive solution for ${idea}`,
              coreFeatures: [
                {
                  id: "extracted_core_1",
                  name: "Primary Functionality",
                  description: "Core functionality extracted from the project idea"
                },
                {
                  id: "extracted_core_2", 
                  name: "User Interface",
                  description: "User interface and interaction components"
                },
                {
                  id: "extracted_core_3",
                  name: "Data Management", 
                  description: "Data storage and management systems"
                }
              ],
              suggestedFeatures: [
                {
                  id: "extracted_suggested_1",
                  name: "Enhanced Features",
                  description: "Additional functionality to enhance the core experience"
                },
                {
                  id: "extracted_suggested_2",
                  name: "Administrative Tools",
                  description: "Management and administrative capabilities"
                },
                {
                  id: "extracted_suggested_3",
                  name: "Analytics & Reporting",
                  description: "Data analysis and reporting features"
                },
                {
                  id: "extracted_suggested_4",
                  name: "Integration Capabilities",
                  description: "Integration with external services and APIs"
                },
                {
                  id: "extracted_suggested_5",
                  name: "Performance Optimization",
                  description: "Performance improvements and optimization features"
                }
              ]
            };
            
            console.log("Successfully created partial data structure");
            return partialData;
          }
        } catch (extractionError) {
          console.error("Partial extraction also failed:", extractionError);
        }
        
        // Enhanced fallback structure with more comprehensive features
        console.warn("Using enhanced fallback project structure due to parsing failures");
        return {
          title: idea.split(' ').slice(0, 5).join(' '), 
          description: `A comprehensive solution for ${idea}`,
          coreFeatures: [
            {
              id: "user_management", 
              name: "User Management System", 
              description: "Complete user registration, authentication, and profile management system"
            },
            {
              id: "core_functionality", 
              name: "Core Business Logic", 
              description: "Implement the primary functionality that solves the main problem described in the project idea"
            },
            {
              id: "data_management", 
              name: "Data Management", 
              description: "Secure data storage, retrieval, and management systems for all project data"
            },
            {
              id: "user_interface", 
              name: "User Interface & Navigation", 
              description: "Intuitive and responsive user interface with clear navigation and user experience"
            },
            {
              id: "security_privacy", 
              name: "Security & Privacy", 
              description: "Comprehensive security measures and privacy protection for user data and system integrity"
            }
          ],
          suggestedFeatures: [
            {
              id: "admin_dashboard", 
              name: "Administrative Dashboard", 
              description: "Comprehensive admin panel for system management, user oversight, and analytics"
            },
            {
              id: "analytics_reporting", 
              name: "Analytics & Reporting", 
              description: "Detailed analytics and reporting capabilities for tracking usage and performance metrics"
            },
            {
              id: "notifications", 
              name: "Notification System", 
              description: "Multi-channel notification system for email, SMS, and in-app alerts"
            },
            {
              id: "search_discovery", 
              name: "Search & Discovery", 
              description: "Advanced search functionality with filters, sorting, and discovery features"
            },
            {
              id: "mobile_optimization", 
              name: "Mobile Optimization", 
              description: "Mobile-responsive design and potential native mobile app development"
            },
            {
              id: "api_integration", 
              name: "Third-party Integrations", 
              description: "Integration capabilities with external services and APIs for enhanced functionality"
            },
            {
              id: "backup_recovery", 
              name: "Backup & Recovery", 
              description: "Automated backup systems and disaster recovery procedures"
            },
            {
              id: "performance_optimization", 
              name: "Performance Optimization", 
              description: "System performance monitoring and optimization for scalability and speed"
            }
          ]
        };
      }
    } catch (error) {
      console.error("Error extracting JSON from Gemini response:", error);
      console.log("Raw response excerpt:", text.substring(0, 1000));
      throw new Error("Failed to parse project structure from AI response");
    }
  } catch (error) {
    console.error("Error generating project structure:", error);
    throw error;
  }
} 