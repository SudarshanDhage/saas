import { model } from './client';
import { extractJsonFromText, repairJson } from './json-utils';

/**
 * Generate project structure based on user idea
 */
export async function generateProjectStructure(idea: string) {
  try {
    // Safety check for the idea input
    if (!idea || typeof idea !== 'string' || idea.trim() === '') {
      console.error("Empty or invalid idea provided to generateProjectStructure");
      return buildMinimalStructure("Empty project", "");
    }

    console.log(`Generating project structure for idea: "${idea.substring(0, 50)}${idea.length > 50 ? '...' : ''}"`);

    const prompt = `
    You are a senior full-stack software architect with 20+ years of experience in enterprise software design, domain-driven development, and technical leadership. You specialize in translating business requirements into production-ready technical specifications with extraordinary precision and developer focus.
    
    Transform the following project idea into an implementation-ready project specification with exceptional technical detail:
    
    "${idea}"
    
    REQUIRED COMPREHENSIVE ANALYSIS:
    
    1. CORE FEATURES (Essential Functionality):
       - Identify 6-12 MUST-HAVE features that form the technical foundation of this project
       - Each feature must be modular, testable, and have precisely defined technical boundaries
       - Features must be sequenced by technical dependencies (what must be built first)
       - Each feature requires specific implementation details, including:
          * Exact data structures with field names and types
          * Component hierarchy with parent-child relationships
          * API endpoints with request/response contracts
          * State management approach with data flow patterns
          * Authentication/authorization requirements
          * Error handling and validation strategies
          * Performance considerations and optimization techniques
    
    2. SUGGESTED FEATURES (Enhancement Opportunities):
       - Identify 4-8 additional features that would significantly enhance the project's value
       - Each suggestion must include:
          * Specific technical integration points with core features
          * Data model extensions or modifications required
          * Potential technical challenges with mitigation strategies
          * Exact libraries or technologies for implementation
          * Performance impact considerations
          * Testing strategies particular to this feature
    
    3. PROJECT ARCHITECTURE (Technical Foundation):
       - Create an exceptionally detailed technical blueprint, including:
          * System boundaries and component interactions
          * Data flow diagrams expressed in text format
          * API surface specification with endpoint patterns
          * Authentication and authorization architecture
          * State management approach and data persistence strategy
          * Error handling and logging framework
          * Performance optimization strategy
          * Scalability considerations with specific thresholds
          * Security architecture with threat model considerations
    
    CRITICAL QUALITY REQUIREMENTS:
    
    Your output must be EXTRAORDINARILY PRECISE, TECHNICALLY DETAILED, and IMMEDIATELY IMPLEMENTABLE:
    - Every feature must include specific implementation patterns (not generic descriptions)
    - Each component must have clear responsibilities, interfaces, and data requirements
    - All data structures must have exact field definitions with types, validations, and relationships
    - Technical specifications must be concrete enough for developers to begin coding immediately
    - API endpoints must include exact routes, methods, request/response schemas, and error cases
    - Security considerations must be explicitly addressed for all data access points
    - Performance considerations must be included for data-intensive operations
    - Cross-cutting concerns (logging, error handling, validation) must be addressed consistently
    
    MANDATORY JSON FORMATTING:
    - Respond EXCLUSIVELY with a valid JSON object (no explanations or text outside the JSON)
    - Your response MUST begin with { and end with }
    - All strings MUST use double quotes, never single quotes
    - All property names MUST be in double quotes
    - Arrays and objects MUST have proper closing brackets
    - NO trailing commas in arrays or objects
    - NO markdown formatting, NO code blocks, NO additional explanations
    
    EXACT JSON STRUCTURE:
    {
      "title": "Project Title",
      "description": "Comprehensive technical description including architecture patterns, system boundaries, deployment model, scalability considerations, and security architecture",
      "coreFeatures": [
        {
          "id": "feature1", 
          "name": "Feature Name", 
          "description": "Exceptionally detailed technical specification including data structures, component architecture, API contracts, state management patterns, validation rules, error handling strategies, and performance considerations", 
          "implementation": {
            "dataModel": "Precise data model with field names, types, validations, and relationships",
            "apiEndpoints": "Specific API routes with request/response contracts",
            "uiComponents": "Component hierarchy with state management approach",
            "securityConsiderations": "Authentication/authorization requirements specific to this feature",
            "performanceConsiderations": "Optimization techniques for this feature"
          }
        }
      ],
      "suggestedFeatures": [
        {
          "id": "suggestion1", 
          "name": "Suggested Feature", 
          "description": "Detailed technical description with integration points, implementation approach, and enhancement value",
          "technicalConsiderations": {
            "implementationComplexity": "low/medium/high with specific challenges",
            "integrationPoints": "Exactly how this feature connects to existing components",
            "dataRequirements": "Additional data models or extensions needed",
            "recommendedLibraries": "Specific packages that would facilitate implementation"
          }
        }
      ]
    }
    
    IMPORTANT QUALITY CHECKS:
    - Ensure ALL features have concrete, implementable technical specifications (not abstract marketing descriptions)
    - Verify each feature is self-contained and achievable within a single development sprint
    - Confirm feature descriptions include actual implementation details (data models, API endpoints, component structures)
    - Avoid all generic, abstract descriptions - focus exclusively on technical specifics
    - Ensure consistent technical approach across all features (authentication, error handling, validation)
    - Verify that core features collectively form a cohesive, functional system
    - Ensure the technical architecture addresses scalability, security, and performance requirements
    
    IMPORTANT REMINDER: Your output MUST be a VALID JSON object. Do NOT include any text outside the JSON structure. The JSON should start with { and end with } with NO trailing commas.
    `;

    // Set a specific temperature for more structured output
    console.log("Sending request to AI model...");
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1, // Low temperature for precise, structured output
        maxOutputTokens: 4096, // Sufficient for detailed project structure
      }
    });
    
    const response = await result.response;
    const text = response.text();
    
    console.log("Received response from AI model, processing...");
    
    try {
      // First log a short preview of the response for debugging
      const previewLength = Math.min(100, text.length);
      console.log("Response preview:", text.substring(0, previewLength) + (text.length > previewLength ? "..." : ""));
      
      // Extract the JSON part from the text
      console.log("Extracting JSON from response...");
      let jsonString = extractJsonFromText(text);
      
      // Log the extracted JSON string length
      console.log(`Extracted JSON string length: ${jsonString.length}`);
      
      // Apply JSON repair if needed
      console.log("Applying JSON repair if needed...");
      jsonString = repairJson(jsonString);
      
      try {
        // Try to parse the repaired JSON
        console.log("Attempting to parse the JSON...");
        const parsedData = JSON.parse(jsonString);
        
        // Validate and fix the structure if needed
        const validatedData = validateAndFixProjectStructure(parsedData, idea, text);
        console.log("Successfully validated and processed project structure!");
        return validatedData;
      } catch (parsingError) {
        console.error("Error parsing repaired JSON:", parsingError instanceof Error ? parsingError.message : String(parsingError));
        return buildMinimalStructure(idea, text);
      }
    } catch (error) {
      console.error("Error extracting or processing JSON from AI response:", error instanceof Error ? error.message : String(error));
      return buildMinimalStructure(idea, text);
    }
  } catch (error) {
    console.error("Error generating project structure:", error instanceof Error ? error.message : String(error));
    return buildMinimalStructure(error instanceof Error ? error.message : String(error), "");
  }
}

/**
 * Validates and fixes the project structure, ensuring all required fields exist
 */
function validateAndFixProjectStructure(data: any, idea: string, responseText: string): any {
  // Basic structure check
  if (!data || typeof data !== 'object') {
    console.error("Invalid project structure: not an object");
    return buildMinimalStructure(idea, responseText);
  }
  
  let modified = false;
  const validatedData = { ...data };
  
  // Validate title
  if (!validatedData.title || typeof validatedData.title !== 'string') {
    console.log("Adding missing title");
    validatedData.title = extractTitle(idea, responseText);
    modified = true;
  }
  
  // Validate description
  if (!validatedData.description || typeof validatedData.description !== 'string') {
    console.log("Adding missing description");
    validatedData.description = idea;
    modified = true;
  }
  
  // Validate coreFeatures
  if (!Array.isArray(validatedData.coreFeatures) || validatedData.coreFeatures.length === 0) {
    console.log("Adding missing coreFeatures");
    validatedData.coreFeatures = extractFeaturesFromText(responseText) || [
      {
        id: "feature1", 
        name: "Basic Functionality", 
        description: "Implement core functionality for the project",
        implementation: {
          dataModel: "Basic data model for the project",
          apiEndpoints: "Essential API routes for core functionality",
          uiComponents: "Core UI components needed",
          securityConsiderations: "Basic authentication and authorization",
          performanceConsiderations: "Initial performance optimizations"
        }
      }
    ];
    modified = true;
  } else {
    // Validate each core feature
    validatedData.coreFeatures = validatedData.coreFeatures.map((feature: any, index: number) => {
      if (!feature || typeof feature !== 'object') {
        console.log(`Replacing invalid core feature at index ${index}`);
        modified = true;
        return {
          id: `feature${index + 1}`,
          name: `Core Feature ${index + 1}`,
          description: "Essential functionality for the project",
          implementation: {
            dataModel: "Basic data model",
            apiEndpoints: "Required API endpoints",
            uiComponents: "Core UI components",
            securityConsiderations: "Security requirements",
            performanceConsiderations: "Performance optimizations"
          }
        };
      }
      
      const validatedFeature = { ...feature };
      
      // Ensure ID exists
      if (!validatedFeature.id) {
        validatedFeature.id = `feature${index + 1}`;
        modified = true;
      }
      
      // Ensure name exists
      if (!validatedFeature.name) {
        validatedFeature.name = `Core Feature ${index + 1}`;
        modified = true;
      }
      
      // Ensure description exists
      if (!validatedFeature.description) {
        validatedFeature.description = "Essential functionality for the project";
        modified = true;
      }
      
      // Ensure implementation exists and is an object
      if (!validatedFeature.implementation || typeof validatedFeature.implementation !== 'object') {
        validatedFeature.implementation = {
          dataModel: "Basic data model",
          apiEndpoints: "Required API endpoints",
          uiComponents: "Core UI components",
          securityConsiderations: "Security requirements",
          performanceConsiderations: "Performance optimizations"
        };
        modified = true;
      } else {
        // Ensure implementation fields exist
        const implFields = [
          "dataModel", "apiEndpoints", "uiComponents", 
          "securityConsiderations", "performanceConsiderations"
        ];
        
        for (const field of implFields) {
          if (!validatedFeature.implementation[field]) {
            validatedFeature.implementation[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} for this feature`;
            modified = true;
          }
        }
      }
      
      return validatedFeature;
    });
  }
  
  // Validate suggestedFeatures
  if (!Array.isArray(validatedData.suggestedFeatures)) {
    console.log("Adding missing suggestedFeatures");
    validatedData.suggestedFeatures = [{
      id: "suggestion1",
      name: "Enhanced User Experience",
      description: "Improve the user interface and experience",
      technicalConsiderations: {
        implementationComplexity: "medium",
        integrationPoints: "Connects with core UI components",
        dataRequirements: "Extends user preference data model",
        recommendedLibraries: "UI component libraries for improved experience"
      }
    }];
    modified = true;
  } else if (validatedData.suggestedFeatures.length === 0) {
    // Add a default suggestion if array is empty
    validatedData.suggestedFeatures.push({
      id: "suggestion1",
      name: "Enhanced User Experience",
      description: "Improve the user interface and experience",
      technicalConsiderations: {
        implementationComplexity: "medium",
        integrationPoints: "Connects with core UI components",
        dataRequirements: "Extends user preference data model",
        recommendedLibraries: "UI component libraries for improved experience"
      }
    });
    modified = true;
  } else {
    // Validate each suggested feature
    validatedData.suggestedFeatures = validatedData.suggestedFeatures.map((feature: any, index: number) => {
      if (!feature || typeof feature !== 'object') {
        console.log(`Replacing invalid suggested feature at index ${index}`);
        modified = true;
        return {
          id: `suggestion${index + 1}`,
          name: `Enhancement ${index + 1}`,
          description: "Additional feature to enhance the project",
          technicalConsiderations: {
            implementationComplexity: "medium",
            integrationPoints: "Integration with core features",
            dataRequirements: "Data model extensions",
            recommendedLibraries: "Recommended libraries"
          }
        };
      }
      
      const validatedFeature = { ...feature };
      
      // Ensure ID exists
      if (!validatedFeature.id) {
        validatedFeature.id = `suggestion${index + 1}`;
        modified = true;
      }
      
      // Ensure name exists
      if (!validatedFeature.name) {
        validatedFeature.name = `Enhancement ${index + 1}`;
        modified = true;
      }
      
      // Ensure description exists
      if (!validatedFeature.description) {
        validatedFeature.description = "Additional feature to enhance the project";
        modified = true;
      }
      
      // Ensure technicalConsiderations exists and is an object
      if (!validatedFeature.technicalConsiderations || typeof validatedFeature.technicalConsiderations !== 'object') {
        validatedFeature.technicalConsiderations = {
          implementationComplexity: "medium",
          integrationPoints: "Integration with core features",
          dataRequirements: "Data model extensions",
          recommendedLibraries: "Recommended libraries"
        };
        modified = true;
      } else {
        // Ensure technicalConsiderations fields exist
        const techFields = [
          "implementationComplexity", "integrationPoints", 
          "dataRequirements", "recommendedLibraries"
        ];
        
        for (const field of techFields) {
          if (!validatedFeature.technicalConsiderations[field]) {
            validatedFeature.technicalConsiderations[field] = field === "implementationComplexity" ? 
              "medium" : 
              `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} for this feature`;
            modified = true;
          }
        }
      }
      
      return validatedFeature;
    });
  }
  
  if (modified) {
    console.log("Modified project structure to ensure all required fields exist");
  } else {
    console.log("Project structure was already valid, no modifications needed");
  }
  
  return validatedData;
}

/**
 * Builds a minimal valid structure from the idea and response
 */
function buildMinimalStructure(idea: string, responseText: string) {
  console.warn("Using fallback project structure due to parsing failures");
  
  // Extract potential titles and descriptions from the text
  let title = extractTitle(idea, responseText);
  let description = idea; // Default description
  
  // Try to extract a better description from the response
  try {
    const descMatch = responseText.match(/"description":\s*"([^"]+)"/);
    if (descMatch && descMatch[1]) {
      description = descMatch[1];
    }
  } catch (extractError) {
    console.log("Error extracting description from response:", extractError);
  }
  
  // Create a minimal valid structure
  return {
    title: title,
    description: description,
    coreFeatures: extractFeaturesFromText(responseText) || [
      {
        id: "feature1", 
        name: "Basic Functionality", 
        description: "Implement core functionality for the project",
        implementation: {
          dataModel: "Basic data model for the project",
          apiEndpoints: "Essential API routes for core functionality",
          uiComponents: "Core UI components needed",
          securityConsiderations: "Basic authentication and authorization",
          performanceConsiderations: "Initial performance optimizations"
        }
      }
    ],
    suggestedFeatures: [
      {
        id: "suggestion1", 
        name: "Enhanced User Experience", 
        description: "Improve the user interface and experience",
        technicalConsiderations: {
          implementationComplexity: "medium",
          integrationPoints: "Connects with core UI components",
          dataRequirements: "Extends user preference data model",
          recommendedLibraries: "UI component libraries for improved experience"
        }
      }
    ]
  };
}

/**
 * Extract a good title from idea or response text
 */
function extractTitle(idea: string, responseText: string): string {
  // Default title based on idea
  let title = idea.split(' ').slice(0, 5).join(' ');
  if (title.length < 10) {
    title += " Project"; // Add "Project" suffix if title is very short
  }
  
  // Try to extract a better title from the response
  try {
    const titleMatch = responseText.match(/"title":\s*"([^"]+)"/);
    if (titleMatch && titleMatch[1]) {
      const extractedTitle = titleMatch[1].trim();
      if (extractedTitle.length > 3) { // Ensure we got a meaningful title
        title = extractedTitle;
      }
    }
  } catch (e) {
    console.log("Error extracting title from response");
  }
  
  return title;
}

/**
 * Attempt to extract features from malformed response
 */
function extractFeaturesFromText(text: string): any[] | null {
  try {
    // Try to find feature blocks in the text
    const featureMatches = text.match(/"name":\s*"([^"]+)"[^}]*"description":\s*"([^"]+)"/g);
    
    if (featureMatches && featureMatches.length > 0) {
      return featureMatches.slice(0, 3).map((match, index) => {
        const nameMatch = match.match(/"name":\s*"([^"]+)"/);
        const descMatch = match.match(/"description":\s*"([^"]+)"/);
        
        const name = nameMatch ? nameMatch[1] : `Feature ${index + 1}`;
        const description = descMatch ? descMatch[1] : `Important project feature`;
        
        return {
          id: `feature${index + 1}`,
          name: name,
          description: description,
          implementation: {
            dataModel: "Data model extracted from response",
            apiEndpoints: "API endpoints for this feature",
            uiComponents: "UI components needed",
            securityConsiderations: "Security considerations",
            performanceConsiderations: "Performance optimizations"
          }
        };
      });
    }
    
    return null;
  } catch (e) {
    console.log("Error extracting features from text");
    return null;
  }
}

/**
 * Attempts to repair nested JSON structures
 */
function repairNestedJson(jsonString: string): string {
  // Balance missing brackets and braces
  let openBraces = (jsonString.match(/{/g) || []).length;
  let closeBraces = (jsonString.match(/}/g) || []).length;
  let openBrackets = (jsonString.match(/\[/g) || []).length;
  let closeBrackets = (jsonString.match(/\]/g) || []).length;
  
  // Add missing closing braces
  while (closeBraces < openBraces) {
    jsonString += '}';
    closeBraces++;
  }
  
  // Add missing closing brackets
  while (closeBrackets < openBrackets) {
    jsonString += ']';
    closeBrackets++;
  }
  
  // Remove any extra closing braces or brackets
  if (closeBraces > openBraces || closeBrackets > openBrackets) {
    let balance = 0;
    let bracketBalance = 0;
    let cleaned = '';
    
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString[i];
      
      if (char === '{') {
        balance++;
        cleaned += char;
      } else if (char === '}') {
        if (balance > 0) {
          balance--;
          cleaned += char;
        }
      } else if (char === '[') {
        bracketBalance++;
        cleaned += char;
      } else if (char === ']') {
        if (bracketBalance > 0) {
          bracketBalance--;
          cleaned += char;
        }
      } else {
        cleaned += char;
      }
    }
    
    jsonString = cleaned;
  }
  
  // Fix quotes around property names
  jsonString = jsonString.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
  
  return jsonString;
} 