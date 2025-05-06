import { model } from './client';
import { extractJsonFromText, repairJson } from './json-utils';

/**
 * Generates tech stack recommendations based on project data
 */
export async function generateTechStack(projectData: any) {
  try {
    console.log('Starting tech stack generation with Gemini API');
    
    // Safety check for project data
    if (!projectData || typeof projectData !== 'object') {
      console.error("Empty or invalid project data provided to generateTechStack");
      throw new Error("Valid project data is required for tech stack generation");
    }
    
    const prompt = `
    You are a distinguished software architect with over 15 years of experience in full-stack development, cloud infrastructure, and technical leadership at enterprise scale. You have successfully led the architecture and implementation of 50+ production systems across diverse business domains using modern technology stacks. Your expertise spans frontend frameworks, backend systems, database optimization, security architecture, and DevOps practices.
    
    VERY IMPORTANT: You MUST respond with a valid JSON object ONLY. Do not include any text, explanation, or markdown outside the JSON structure. The JSON must start with a curly brace { and end with a curly brace }. All property names must be in double quotes and followed by a colon. String values must be in double quotes. Boolean values must be lowercase true or false without quotes.
    
    Analyze the provided project requirements with extraordinary depth and recommend the optimal technology stack with precise, implementation-ready specifications.

    PROJECT REQUIREMENTS:
    ${JSON.stringify(projectData, null, 2)}
    
    COMPREHENSIVE TECHNOLOGY SELECTION CRITERIA:
    
    1. ARCHITECTURAL FIT:
       - Evaluate technologies against specific project domain, scale requirements, and complexity
       - Consider architectural patterns (microservices, monolithic, serverless, event-driven)
       - Assess technologies against non-functional requirements (latency, throughput, availability)
       - Analyze technology maturity, community support, and long-term viability
       - Consider deployment model implications (cloud-native, hybrid, on-premise)
    
    2. DEVELOPER PRODUCTIVITY:
       - Assess learning curve against the expected team skill profile
       - Evaluate development velocity potential with specific metrics
       - Consider debugging, testing, and maintenance efficiency
       - Evaluate quality of documentation, examples, and community resources
       - Assess integrated development experience and available tooling
       - Consider type safety and compiler/linter support for error prevention
    
    3. PERFORMANCE CHARACTERISTICS:
       - Analyze critical rendering path optimization potential for frontend choices
       - Evaluate runtime performance metrics (request latency, throughput, memory usage)
       - Consider cold start implications for serverless technologies
       - Evaluate database query performance for expected data volumes and access patterns
       - Assess caching strategy effectiveness with proposed technology
       - Consider response time degradation under load
    
    4. SCALABILITY REQUIREMENTS:
       - Evaluate horizontal and vertical scaling capabilities with specific thresholds
       - Consider infrastructure scaling automation options
       - Assess database scaling patterns (sharding, partitioning, read replicas)
       - Evaluate connection pooling and resource management
       - Consider stateless design facilitation
       - Assess distributed systems capabilities if applicable
    
    5. SECURITY IMPLICATIONS:
       - Evaluate authentication and authorization capabilities
       - Assess common vulnerability protection (XSS, CSRF, SQL injection, etc.)
       - Consider data encryption options at rest and in transit
       - Evaluate security patch frequency and vulnerability response track record
       - Assess compliance capabilities for relevant regulations (GDPR, HIPAA, etc.)
       - Consider security testing and scanning integration
    
    6. MAINTAINABILITY FACTORS:
       - Evaluate versioning and dependency management approach
       - Assess code organization patterns and modularity support
       - Consider technical debt accumulation patterns with each technology
       - Evaluate refactoring and code evolution capabilities
       - Assess monitoring, logging, and observability integration
       - Consider exception handling and resilience patterns
    
    7. INTEGRATION CAPABILITIES:
       - Analyze API design and implementation options (REST, GraphQL, gRPC)
       - Evaluate message queue and event streaming options if needed
       - Consider third-party service integration capabilities
       - Assess data import/export capabilities
       - Evaluate external authentication provider integration
       - Consider mobile/desktop application integration if relevant
    
    8. DEPLOYMENT CONSIDERATIONS:
       - Evaluate containerization and orchestration options
       - Assess CI/CD pipeline integration capabilities
       - Consider environment management (dev, staging, production)
       - Evaluate infrastructure-as-code support
       - Assess blue/green deployment and zero-downtime update support
       - Consider rollback capabilities and deployment safety
    
    REQUIRED TECHNOLOGY RECOMMENDATIONS:
    
    1. FRONTEND FRAMEWORK:
       - Select the definitive best frontend framework for this specific project with detailed justification
       - Include multiple component library recommendations with specific component quality assessment
       - Specify exact state management approach with data flow patterns
       - Recommend precise data fetching strategy with caching and synchronization patterns
       - Detail styling methodology with responsive design approach
       - Specify form handling and validation strategy
       - Include routing approach with code-splitting strategy
       - Recommend specific performance optimization techniques
       - Specify internationalization approach if needed
       - Detail accessibility implementation approach with WCAG compliance level
    
    2. BACKEND TECHNOLOGY:
       - Select the optimal backend framework and runtime with specific version
       - Provide detailed architectural approach (monolithic, microservices, serverless)
       - Specify exact API design pattern (REST, GraphQL, tRPC) with implementation details
       - Detail server-side validation strategy with exact libraries
       - Include error handling and logging strategy with specific structured format
       - Recommend authentication flow with token management approach
       - Specify authorization strategy with role/permission model
       - Detail rate limiting and API security measures
       - Include caching strategy with invalidation patterns
       - Specify background job processing approach if needed
    
    3. DATABASE SOLUTION:
       - Determine the optimal primary database with specific version
       - Recommend additional data stores for specific use cases if needed (caching, search, analytics)
       - Detail schema design approach with specific modeling practices
       - Specify exact ORM/query builder with implementation patterns
       - Include migration strategy with versioning approach
       - Detail query optimization techniques for high-traffic patterns
       - Specify connection pooling and resource management approach
       - Include data backup and recovery strategy
       - Detail data encryption approach for sensitive information
       - Specify scaling strategy with specific thresholds
    
    4. AUTHENTICATION METHOD:
       - Select the most appropriate authentication system with specific implementation
       - Detail user registration and login flows with security measures
       - Specify password policy and storage approach
       - Include multi-factor authentication approach if needed
       - Detail social/third-party authentication integration if applicable
       - Specify exact token management (JWT, session, etc.) with lifetime and refresh strategy
       - Include authorization model with role-based and/or attribute-based access control
       - Detail session management and concurrent login handling
       - Specify account recovery and email verification processes
       - Include audit logging approach for security events
    
    5. DEVOPS INFRASTRUCTURE:
       - Recommend specific cloud provider(s) with service tier specifications
       - Detail containerization strategy with orchestration approach
       - Specify CI/CD pipeline with exact tools and workflow
       - Include infrastructure-as-code approach with specific technology
       - Detail environment management strategy (development, staging, production)
       - Specify monitoring and alerting strategy with specific metrics
       - Include logging and tracing approach with retention policy
       - Detail backup and disaster recovery approach with RPO/RTO targets
       - Specify security scanning and compliance monitoring approach
       - Include cost optimization strategy with specific recommendations
    
    6. ADDITIONAL TOOLS AND SERVICES:
       - Recommend specific testing frameworks for unit, integration, and end-to-end testing
       - Detail documentation approach and tools
       - Specify analytics and user tracking approach if needed
       - Include performance monitoring and profiling tools
       - Detail internal communication and notification services
       - Specify file storage and CDN approach if applicable
       - Include search functionality implementation if needed
       - Detail payment processing integration if applicable
       - Specify email/SMS/push notification services if needed
       - Include any other specialized services required by project features
    
    STRICT OUTPUT FORMAT REQUIREMENTS:
    - Respond with ONLY a valid JSON object - no explanations or text outside the JSON
    - The response MUST start with { and end with }
    - Use double quotes for all keys and string values
    - Ensure each property name is followed by a colon
    - Do NOT use single quotes for keys or values
    - Do NOT use trailing commas in arrays or objects
    - Do NOT include code blocks, markdown formatting, or non-JSON text
    
    EXACT JSON STRUCTURE:
    {
      "frontend": [
        {
          "name": "Exact Technology Name and Version",
          "recommended": true/false,
          "reason": "Exceptionally detailed technical justification with specific references to project requirements",
          "features": ["Specific beneficial feature 1", "Specific beneficial feature 2"],
          "limitations": ["Specific limitation or challenge 1", "Specific limitation or challenge 2"],
          "libraryEcosystem": {
            "uiComponents": ["Specific library name and version", "Alternative option with tradeoffs"],
            "stateManagement": ["Specific approach with implementation pattern", "Alternative option with tradeoffs"],
            "dataFetching": ["Specific library with caching strategy", "Alternative option with tradeoffs"],
            "styling": ["Specific approach with responsive strategy", "Alternative option with tradeoffs"],
            "formHandling": ["Specific library with validation approach", "Alternative option with tradeoffs"],
            "routing": ["Specific approach with code-splitting strategy", "Alternative option with tradeoffs"],
            "testing": ["Specific framework with implementation approach", "Alternative option with tradeoffs"]
          },
          "implementationConsiderations": "Extremely detailed developer guidance with specific architectural patterns, performance optimization techniques, and best practices"
        }
      ],
      "backend": [
        {
          "name": "Exact Technology Name and Version",
          "recommended": true/false,
          "reason": "Exceptionally detailed technical justification with specific references to project requirements",
          "features": ["Specific beneficial feature 1", "Specific beneficial feature 2"],
          "limitations": ["Specific limitation or challenge 1", "Specific limitation or challenge 2"],
          "apiDesign": "Specific API architecture with detailed implementation approach",
          "authentication": "Detailed authentication flow with token management strategy",
          "authorization": "Specific role/permission model with implementation approach",
          "validation": "Detailed validation strategy with error handling pattern",
          "errorHandling": "Comprehensive error management strategy with logging approach",
          "scalingStrategy": "Detailed horizontal/vertical scaling approach with specific thresholds",
          "implementationConsiderations": "Extremely detailed developer guidance with specific architectural patterns, performance optimization techniques, and best practices"
        }
      ],
      "database": [
        {
          "name": "Exact Technology Name and Version",
          "recommended": true/false,
          "reason": "Exceptionally detailed technical justification with specific references to project requirements",
          "features": ["Specific beneficial feature 1", "Specific beneficial feature 2"],
          "limitations": ["Specific limitation or challenge 1", "Specific limitation or challenge 2"],
          "schemaDesign": "Detailed database schema approach with modeling patterns specific to this project",
          "queryOptimization": "Specific query optimization techniques for high-traffic patterns",
          "dataAccess": "Detailed ORM/query builder approach with implementation patterns",
          "migrations": "Specific migration strategy with versioning approach",
          "backupStrategy": "Detailed backup and recovery approach with RPO/RTO targets",
          "scalingStrategy": "Comprehensive scaling strategy with specific thresholds and implementation details",
          "securityMeasures": "Detailed data security approach for sensitive information",
          "implementationConsiderations": "Extremely detailed developer guidance with specific architectural patterns, performance optimization techniques, and best practices"
        }
      ],
      "authentication": [
        {
          "name": "Exact Technology Name and Version",
          "recommended": true/false,
          "reason": "Exceptionally detailed technical justification with specific references to project requirements",
          "features": ["Specific beneficial feature 1", "Specific beneficial feature 2"],
          "limitations": ["Specific limitation or challenge 1", "Specific limitation or challenge 2"],
          "userFlows": "Detailed registration, login, and recovery flows with security measures",
          "tokenStrategy": "Specific token management approach with lifetime and refresh strategy",
          "multiFactorAuth": "Detailed MFA implementation approach if needed",
          "socialAuth": "Specific third-party authentication integration if applicable",
          "sessionManagement": "Detailed session handling approach with concurrent login strategy",
          "securityConsiderations": "Comprehensive security measures with specific implementation details",
          "implementationConsiderations": "Extremely detailed developer guidance with specific architectural patterns, security best practices, and implementation approach"
        }
      ],
      "devOps": [
        {
          "name": "Exact Technology Name and Version",
          "recommended": true/false,
          "reason": "Exceptionally detailed technical justification with specific references to project requirements",
          "features": ["Specific beneficial feature 1", "Specific beneficial feature 2"],
          "limitations": ["Specific limitation or challenge 1", "Specific limitation or challenge 2"],
          "cloudInfrastructure": "Specific cloud provider(s) with service tier recommendations",
          "cicdPipeline": "Detailed CI/CD workflow with specific tools and implementation",
          "containerization": "Specific containerization and orchestration approach",
          "monitoring": "Comprehensive monitoring strategy with specific metrics and tools",
          "disasterRecovery": "Detailed backup and recovery approach with specific procedures",
          "securityMeasures": "Specific security scanning and compliance monitoring approach",
          "implementationConsiderations": "Extremely detailed developer guidance with specific architectural patterns, automation strategies, and implementation approach"
        }
      ],
      "additionalTools": [
        {
          "name": "Exact Technology Name and Version",
          "recommended": true/false,
          "reason": "Exceptionally detailed technical justification with specific references to project requirements",
          "features": ["Specific beneficial feature 1", "Specific beneficial feature 2"],
          "limitations": ["Specific limitation or challenge 1", "Specific limitation or challenge 2"],
          "implementationConsiderations": "Detailed developer guidance for integration and implementation"
        }
      ]
    }
    
    ESSENTIAL QUALITY STANDARDS:
    - Be EXTRAORDINARILY SPECIFIC to THIS project's exact requirements (not generic recommendations)
    - Prioritize modern, actively maintained technologies with proven production reliability
    - Include EXTREMELY DETAILED implementation guidance with specific architectural patterns
    - Highlight specific technical challenges with precise mitigation strategies
    - Address performance, security, and scalability requirements with implementation-specific details
    - Ensure all recommendations form a cohesive, integrated technology ecosystem
    - Consider both immediate implementation needs and long-term maintenance/evolution
    - Provide specific version recommendations for all suggested technologies
    
    IMPORTANT JSON FORMATTING REMINDER:
    - Every property name must be in double quotes: "name"
    - Every property name must be followed by a colon: "name":
    - String values must be in double quotes: "value"
    - Boolean values must be lowercase without quotes: true or false
    - Arrays must use square brackets with comma-separated items: ["item1", "item2"]
    - Objects must use curly braces with comma-separated properties: {"prop1": "value1", "prop2": "value2"}
    - Last item in arrays or objects must NOT have a trailing comma
    
    FINAL REMINDER: RESPOND ONLY WITH THE VALID JSON OBJECT. DO NOT include any text, explanation, code blocks, or markdown outside the JSON structure. The first character of your response must be { and the last character must be }.
    `;

    console.log('Sending request to Gemini API for tech stack recommendations...');

    // Create a promise that rejects after a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Tech stack generation timed out')), 120000); // 2 minutes timeout
    });

    // Race the API call against the timeout
    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more precise recommendations
          maxOutputTokens: 16384, // Increased for more detailed responses
        }
      }),
      timeoutPromise
    ]) as any;

    const response = await result.response;
    const text = response.text();
    
    console.log('Tech stack generation completed, processing response...');
    
    // Create a recovery function for handling persistent JSON errors
    const recoverTechStackJson = (error: Error, rawText: string) => {
      console.warn("Attempting last-resort tech stack JSON recovery after error:", error.message);
      
      // Create a minimal valid tech stack structure
      const techStackFields = ["frontend", "backend", "database", "authentication", "devOps", "additionalTools"];
      const techStack: any = {};
      
      // Extract sections directly from text using regex for each field
      for (const field of techStackFields) {
        try {
          // Find any objects relevant to this field - looking for the field name followed by content
          const sectionRegex = new RegExp(`"?${field}"?\\s*:?\\s*\\[?\\s*{(.*?)}\\s*\\]?`, "is");
          const sectionMatch = rawText.match(sectionRegex);
          
          if (sectionMatch && sectionMatch[1]) {
            // Try to reconstruct a valid object for this field
            const objText = "{" + sectionMatch[1] + "}";
            
            // Clean up the extracted object
            const cleanedObj = objText
              // Quote unquoted property names
              .replace(/([{,]\s*)([a-zA-Z0-9_\-]+)(\s*:)/g, '$1"$2"$3')
              // Fix missing quotes around string values
              .replace(/:\s*([a-zA-Z0-9_\-\s]+)(\s*[},])/g, ':"$1"$2')
              // Remove trailing commas
              .replace(/,\s*([}\]])/g, '$1');
            
            try {
              // Attempt to parse this individual object
              const obj = JSON.parse(cleanedObj);
              // If successful, create an array with this object
              techStack[field] = [obj];
              console.log(`Successfully extracted ${field} from raw text`);
              continue;
            } catch (parseError) {
              console.warn(`Couldn't parse extracted ${field} object, using fallback`);
            }
          }
        } catch (regexError) {
          console.warn(`Error in regex extraction for ${field}:`, regexError);
        }
        
        // If we get here, we couldn't extract a valid object for this field
        // Create a minimal valid structure for this field
        techStack[field] = [{
          name: `${field.charAt(0).toUpperCase() + field.slice(1)} Technology`,
          recommended: true,
          reason: "AI-recommended technology based on project requirements",
          features: ["AI-determined feature 1", "AI-determined feature 2"],
          limitations: ["Consider specific project requirements for best fit"]
        }];
      }
      
      // Add special fields for each section
      if (techStack.frontend && techStack.frontend[0]) {
        techStack.frontend[0].libraryEcosystem = {
          uiComponents: ["UI component library"],
          stateManagement: ["State management solution"],
          dataFetching: ["Data fetching library"],
          styling: ["Styling approach"],
          formHandling: ["Form handling library"],
          routing: ["Routing solution"],
          testing: ["Testing framework"]
        };
      }
      
      if (techStack.backend && techStack.backend[0]) {
        techStack.backend[0].apiDesign = "API architecture";
        techStack.backend[0].authentication = "Authentication strategy";
        techStack.backend[0].authorization = "Authorization approach";
        techStack.backend[0].validation = "Validation strategy";
        techStack.backend[0].errorHandling = "Error handling approach";
        techStack.backend[0].scalingStrategy = "Scaling approach";
      }
      
      if (techStack.database && techStack.database[0]) {
        techStack.database[0].schemaDesign = "Database schema approach";
        techStack.database[0].queryOptimization = "Query optimization strategy";
        techStack.database[0].dataAccess = "Data access layer";
        techStack.database[0].migrations = "Migration strategy";
        techStack.database[0].backupStrategy = "Backup and recovery approach";
        techStack.database[0].scalingStrategy = "Database scaling strategy";
        techStack.database[0].securityMeasures = "Database security approach";
      }
      
      return techStack;
    };
    
    try {
      // Log a small preview of the original response for debugging
      console.log(`Original response preview: ${text.substring(0, 100)}...`);
      
      // Extract and clean the JSON from the response
      console.log("Extracting and cleaning JSON from response...");
      let jsonString = extractJsonFromText(text);
      
      // Try a direct parse first to see if it's already valid
      try {
        console.log("Trying direct JSON parse first...");
        const directParsedData = JSON.parse(jsonString);
        console.log("Direct parse successful!");
        return directParsedData;
      } catch (directParseError) {
        console.log("Direct parse failed, applying JSON repair...");
      }
      
      // Apply enhanced JSON repair techniques
      console.log("Applying advanced JSON repair to tech stack response...");
      
      try {
        jsonString = repairJson(jsonString);
      } catch (repairError) {
        console.error("JSON repair process failed:", repairError);
        console.log("Attempting recovery from original text...");
        return recoverTechStackJson(repairError instanceof Error ? repairError : new Error(String(repairError)), text);
      }
      
      // Try to parse the cleaned and repaired JSON
      try {
        console.log("Attempting to parse repaired tech stack JSON...");
        const parsedData = JSON.parse(jsonString);
        console.log("Successfully parsed JSON after standard repair!");
        return parsedData;
      } catch (parsingError) {
        console.error("All JSON repair attempts failed:", parsingError);
        
        // Use our recovery function as a last resort
        return recoverTechStackJson(parsingError instanceof Error ? parsingError : new Error(String(parsingError)), text);
      }
    } catch (error) {
      console.error("Error processing AI response:", error);
      throw new Error("Failed to process AI response for tech stack recommendations");
    }
  } catch (error) {
    console.error("Error in tech stack generation:", error);
    throw error;
  }
} 