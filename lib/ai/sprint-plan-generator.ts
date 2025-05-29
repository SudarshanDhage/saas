import { model } from './client';
import { repairJson } from './json-utils';
import { enhanceSprintPlan, createComprehensiveSprintPlan } from './sprint-plan-helpers';

/**
 * Analyzes project complexity to determine appropriate sprint count
 */
function analyzeProjectComplexity(projectData: any, allFeatures: any[]): {
  suggestedSprintCount: number;
  complexityLevel: string;
  reasoningPoints: string[];
} {
  let complexityScore = 0;
  const reasoningPoints: string[] = [];

  // Feature count complexity
  const featureCount = allFeatures.length;
  if (featureCount > 25) {
    complexityScore += 4;
    reasoningPoints.push(`High feature count (${featureCount} features) requires extensive development time`);
  } else if (featureCount > 15) {
    complexityScore += 3;
    reasoningPoints.push(`Moderate feature count (${featureCount} features) requires careful planning`);
  } else if (featureCount > 8) {
    complexityScore += 2;
    reasoningPoints.push(`Standard feature count (${featureCount} features) for typical project`);
  } else {
    complexityScore += 1;
    reasoningPoints.push(`Simple feature count (${featureCount} features) for basic project`);
  }

  // Feature complexity analysis
  const featureText = allFeatures.map(f => `${f.name} ${f.description}`).join(' ').toLowerCase();
  
  const complexityIndicators = [
    { pattern: /payment|billing|subscription|transaction/, weight: 2, description: "Payment processing complexity" },
    { pattern: /real.?time|websocket|live|chat/, weight: 2, description: "Real-time communication complexity" },
    { pattern: /ai|machine learning|ml|artificial intelligence/, weight: 3, description: "AI/ML integration complexity" },
    { pattern: /blockchain|crypto|web3|nft/, weight: 3, description: "Blockchain/Web3 complexity" },
    { pattern: /video|streaming|upload|media/, weight: 2, description: "Media processing complexity" },
    { pattern: /analytics|reporting|dashboard/, weight: 1, description: "Analytics and reporting features" },
    { pattern: /multi.?tenant|enterprise|saas/, weight: 2, description: "Multi-tenancy/Enterprise features" },
    { pattern: /mobile|ios|android|react native/, weight: 2, description: "Multi-platform development" },
    { pattern: /integration|api|webhook|third.?party/, weight: 1, description: "Third-party integrations" },
    { pattern: /notification|email|sms|push/, weight: 1, description: "Notification systems" },
    { pattern: /search|elasticsearch|algolia|filter/, weight: 2, description: "Advanced search capabilities" },
    { pattern: /admin|management|moderation/, weight: 1, description: "Administrative interfaces" },
    { pattern: /security|authentication|authorization|rbac/, weight: 1, description: "Security implementations" },
    { pattern: /workflow|approval|process/, weight: 2, description: "Complex workflow systems" }
  ];

  complexityIndicators.forEach(indicator => {
    if (indicator.pattern.test(featureText)) {
      complexityScore += indicator.weight;
      reasoningPoints.push(indicator.description);
    }
  });

  // Determine sprint count and complexity level
  let suggestedSprintCount: number;
  let complexityLevel: string;

  if (complexityScore >= 15) {
    suggestedSprintCount = Math.max(8, Math.ceil(featureCount / 3));
    complexityLevel = "Enterprise-level";
    reasoningPoints.push("Enterprise-level complexity requires extended development timeline");
  } else if (complexityScore >= 10) {
    suggestedSprintCount = Math.max(6, Math.ceil(featureCount / 4));
    complexityLevel = "High";
    reasoningPoints.push("High complexity requires careful sprint planning");
  } else if (complexityScore >= 6) {
    suggestedSprintCount = Math.max(4, Math.ceil(featureCount / 5));
    complexityLevel = "Moderate";
    reasoningPoints.push("Moderate complexity suitable for standard development approach");
  } else {
    suggestedSprintCount = Math.max(2, Math.ceil(featureCount / 6));
    complexityLevel = "Simple";
    reasoningPoints.push("Simple project can be completed in fewer sprints");
  }

  return { suggestedSprintCount, complexityLevel, reasoningPoints };
}

/**
 * Generates comprehensive sprint plan based on project data and selected tech stack
 */
export async function generateSprintPlan(projectData: any, techStack: any) {
  try {
    console.log('Starting comprehensive sprint plan generation with Gemini API');
    
    // Extract all features to ensure they are covered in the plan
    const coreFeatures = projectData?.coreFeatures || [];
    const suggestedFeatures = projectData?.suggestedFeatures || [];
    const allFeatures = [...coreFeatures, ...suggestedFeatures];
    
    // Analyze project complexity to determine appropriate sprint count
    const complexityAnalysis = analyzeProjectComplexity(projectData, allFeatures);
    
    console.log(`Project complexity analysis: ${complexityAnalysis.complexityLevel} complexity, suggesting ${complexityAnalysis.suggestedSprintCount} sprints`);
    
    // Create a feature list to explicitly include in the prompt
    const featuresList = allFeatures.map(feature => 
      `- ${feature.name}: ${feature.description}`
    ).join('\n');

    // Extract tech stack information for context
    const techStackSummary = Object.entries(techStack || {}).map(([category, selections]) => {
      if (Array.isArray(selections)) {
        const recommended = selections.find((s: any) => s.recommended);
        return `${category}: ${recommended?.name || 'Not specified'}`;
      }
      return `${category}: ${(selections as any)?.name || 'Not specified'}`;
    }).join('\n');
    
    const prompt = `
    DYNAMIC COMPREHENSIVE SPRINT PLAN GENERATION

    PROJECT COMPLEXITY ANALYSIS:
    - Complexity Level: ${complexityAnalysis.complexityLevel}
    - Suggested Sprint Count: ${complexityAnalysis.suggestedSprintCount}
    - Reasoning: ${complexityAnalysis.reasoningPoints.join('; ')}

    PROJECT DETAILS:
    Title: ${projectData?.title || 'Unknown Project'}
    Description: ${projectData?.description || 'No description provided'}
    
    SELECTED TECHNOLOGY STACK:
    ${techStackSummary}
    
    ALL FEATURES THAT MUST BE IMPLEMENTED (${allFeatures.length} total features):
    ${featuresList}
    
    Your task is to create COMPREHENSIVE and REALISTIC sprint plans that cover EVERY SINGLE FEATURE listed above.

    DYNAMIC SPRINT PLANNING REQUIREMENTS:
    1. SPRINT COUNT FLEXIBILITY:
       - Use the suggested ${complexityAnalysis.suggestedSprintCount} sprints as a baseline
       - Adjust based on logical feature grouping and dependencies
       - If project needs more sprints for proper implementation, ADD MORE
       - If project can be done in fewer sprints efficiently, REDUCE COUNT
       - NEVER force features into inappropriate sprints just to meet a number

    2. COMPREHENSIVE FEATURE COVERAGE:
       - EVERY feature from the list above MUST appear in at least one task
       - Group related features logically in the same sprint
       - Consider feature dependencies and implementation order
       - Include infrastructure, setup, testing, and deployment tasks

    3. REALISTIC SPRINT PLANNING:
       - Each sprint should be 2 weeks duration
       - Include 6-12 tasks per sprint (based on complexity)
       - Provide accurate hour estimates based on feature complexity
       - Consider team velocity and realistic development timelines
       - Include time for testing, code review, and bug fixes

    4. TASK COMPLEXITY ANALYSIS:
       For each task, consider:
       - Implementation complexity (simple/moderate/complex/very complex)
       - Dependencies on other tasks or external services
       - Required expertise level
       - Testing requirements
       - Integration complexity

    5. SPRINT FOCUS AREAS:
       Organize sprints around logical themes:
       - Sprint 1: Project foundation, setup, basic infrastructure
       - Early sprints: Core functionality that other features depend on
       - Middle sprints: Main business logic and user-facing features
       - Later sprints: Advanced features, optimization, polish
       - Final sprint(s): Testing, deployment, documentation

    Create TWO DISTINCT sprint plans optimized for different implementation approaches:

    DEVELOPER SPRINT PLAN (Human Development Teams):
    - Separate frontend, backend, and infrastructure tasks clearly
    - Include detailed technical specifications and file structures
    - Provide step-by-step implementation guides
    - Include code review and testing checkpoints
    - Consider team coordination and knowledge sharing
    - Include time for learning new technologies if needed

    AI ASSISTANT SPRINT PLAN (AI-Powered Development):
    - Create end-to-end implementation tasks that AI can complete
    - Write comprehensive prompts that include full context
    - Combine related frontend/backend work into single tasks
    - Include specific file paths, component structures, and expected outcomes
    - Provide detailed error handling and edge case requirements
    - Make each task self-contained with all necessary information

    CRITICAL REQUIREMENTS:
    - Cover ALL ${allFeatures.length} features without exception
    - Use realistic time estimates (don't underestimate complexity)
    - Include proper testing, deployment, and documentation tasks
    - Consider the selected tech stack in task planning
    - Provide clear acceptance criteria for each task
    - Include proper dependency management between tasks

    JSON FORMATTING REQUIREMENTS:
    - Output ONLY valid JSON, no explanations before/after
    - Start with { and end with }
    - Use double quotes for all keys and strings
    - No trailing commas or comments
    - Proper array/object closure

    Required JSON structure:
    {
      "projectAnalysis": {
        "complexityLevel": "${complexityAnalysis.complexityLevel}",
        "totalFeatures": ${allFeatures.length},
        "suggestedSprints": ${complexityAnalysis.suggestedSprintCount},
        "actualSprints": "Number of sprints you're creating",
        "reasoning": "Why you chose this specific number of sprints and how you organized them"
      },
      "developerSprintPlan": {
        "sprints": [
          {
            "name": "Sprint N: Clear Focus Description",
            "duration": "2 weeks",
            "sprintNumber": 1,
            "focus": "Detailed description of what this sprint accomplishes",
            "featuresImplemented": ["List of specific features from the requirements that this sprint covers"],
            "objectives": ["Clear objectives for this sprint"],
            "tasks": [
              {
                "id": "dev-s1-t1",
                "title": "Specific, actionable task title",
                "feature": "Which feature(s) this implements from the requirements list",
                "description": "Extremely detailed description of what needs to be implemented",
                "implementation": "Step-by-step implementation guide with file paths, component structure, database schemas, API endpoints, etc.",
                "type": "frontend/backend/database/testing/devops/design/integration",
                "complexity": "simple/moderate/complex/very-complex",
                "priority": "critical/high/medium/low",
                "estimatedHours": "Realistic hour estimate (4-40 hours)",
                "dependencies": ["List of task IDs that must be completed first"],
                "acceptanceCriteria": ["Detailed, testable criteria for completion"],
                "technicalConsiderations": "Important technical details, gotchas, or considerations",
                "testingRequirements": "What testing is required for this task"
              }
            ]
          }
        ]
      },
      "aiSprintPlan": {
        "sprints": [
          {
            "name": "Sprint N: AI-Optimized Focus",
            "duration": "2 weeks", 
            "sprintNumber": 1,
            "focus": "What this sprint accomplishes in AI development context",
            "featuresImplemented": ["Features covered in this sprint"],
            "objectives": ["Sprint objectives"],
            "tasks": [
              {
                "id": "ai-s1-t1",
                "title": "AI-optimized task title",
                "feature": "Which feature(s) this implements",
                "description": "Comprehensive task description for AI implementation",
                "implementation": "High-level technical implementation details",
                "type": "full-stack/frontend/backend/integration/testing",
                "complexity": "simple/moderate/complex/very-complex",
                "priority": "critical/high/medium/low",
                "estimatedHours": "Realistic estimate for AI implementation",
                "dependencies": ["Dependencies"],
                "aiPrompt": "EXTREMELY DETAILED prompt that an AI coding assistant can use to implement this feature completely. Include: exact file paths, component structures, expected behaviors, error handling, edge cases, styling requirements, data flow, API specifications, database schemas, security considerations, and any other details needed for complete implementation. The prompt should be copy-pasteable and result in working code.",
                "expectedOutputs": ["List of files/components that should be created or modified"],
                "validationCriteria": ["How to verify the AI implementation worked correctly"]
              }
            ]
          }
        ]
      }
    }
    `;

    // Create a promise that rejects after a timeout (increased for comprehensive analysis)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Sprint plan generation timed out')), 300000); // 5 minutes for complex projects
    });

    // Race the API call against the timeout
    console.log('Sending comprehensive sprint plan request to Gemini API');
    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more consistent, structured output
          maxOutputTokens: 32768, // Maximum tokens for comprehensive output
        }
      }),
      timeoutPromise
    ]) as any;

    const response = await result.response;
    const text = response.text();
    
    console.log('Sprint plan generation completed successfully');
    console.log('Raw response length:', text.length);
    console.log('Raw response excerpt:', text.substring(0, 300) + '...');
    
    try {
      // More robust JSON extraction and sanitization
      let jsonString = text;
      
      // Find the first occurrence of '{' and the last occurrence of '}'
      const firstBrace = jsonString.indexOf('{');
      const lastBrace = jsonString.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        // Extract just the JSON part
        jsonString = jsonString.substring(firstBrace, lastBrace + 1);
      }
      
      // Check if the response is wrapped in markdown code blocks
      const markdownJsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/;
      const markdownMatch = text.match(markdownJsonRegex);
      if (markdownMatch && markdownMatch[1]) {
        jsonString = markdownMatch[1];
      }
      
      // Apply our enhanced JSON repair function
      jsonString = repairJson(jsonString);
      
      // Log the processed JSON length for debugging
      console.log('Processed JSON length:', jsonString.length);
      
      // Try to parse the cleaned JSON
      try {
        // Log the first characters for debugging
        console.log('First 100 chars of final JSON:', jsonString.substring(0, 100));
        
        const parsedData = JSON.parse(jsonString);
        
        // Enhanced validation for comprehensive sprint plans
        const devSprints = parsedData.developerSprintPlan?.sprints || [];
        const aiSprints = parsedData.aiSprintPlan?.sprints || [];
        
        // Validate sprint structure and feature coverage
        const isValidSprintPlan = (
          devSprints.length >= 2 && 
          aiSprints.length >= 2 &&
          devSprints.every((sprint: any) => sprint.tasks?.length >= 3) &&
          aiSprints.every((sprint: any) => sprint.tasks?.length >= 3)
        );
        
        // Verify comprehensive feature coverage
        const devTasks = devSprints.flatMap((sprint: any) => sprint.tasks || []);
        const aiTasks = aiSprints.flatMap((sprint: any) => sprint.tasks || []);
        
        // Extract all feature mentions from task descriptions and features
        const devFeatureText = devTasks.map((task: any) => 
          `${task.feature || ''} ${task.title || ''} ${task.description || ''}`
        ).join(' ').toLowerCase();
        
        const aiFeatureText = aiTasks.map((task: any) => 
          `${task.feature || ''} ${task.title || ''} ${task.description || ''}`
        ).join(' ').toLowerCase();
        
        // Check if most features are mentioned (allowing for some flexibility in naming)
        const coverageThreshold = 0.8; // 80% of features should be covered
        const devCoveredFeatures = allFeatures.filter(feature => {
          const name = feature.name.toLowerCase();
          const words = name.split(' ');
          return words.some((word: string) => word.length > 3 && devFeatureText.includes(word));
        });
        
        const aiCoveredFeatures = allFeatures.filter(feature => {
          const name = feature.name.toLowerCase();
          const words = name.split(' ');
          return words.some((word: string) => word.length > 3 && aiFeatureText.includes(word));
        });
        
        const devCoverage = devCoveredFeatures.length / allFeatures.length;
        const aiCoverage = aiCoveredFeatures.length / allFeatures.length;
        const sufficientCoverage = devCoverage >= coverageThreshold && aiCoverage >= coverageThreshold;
        
        console.log(`Sprint plan validation: Valid structure: ${isValidSprintPlan}, Feature coverage: Dev ${Math.round(devCoverage * 100)}%, AI ${Math.round(aiCoverage * 100)}%`);
        
        if (!isValidSprintPlan || !sufficientCoverage) {
          console.warn('Sprint plan is incomplete or missing features, enhancing with additional content');
          
          // Build a more comprehensive plan by merging the AI-generated plan with our supplementary tasks
          const enhancedPlan = enhanceSprintPlan(parsedData, projectData, allFeatures);
          return enhancedPlan;
        }
        
        // Add project analysis if missing
        if (!parsedData.projectAnalysis) {
          parsedData.projectAnalysis = {
            complexityLevel: complexityAnalysis.complexityLevel,
            totalFeatures: allFeatures.length,
            suggestedSprints: complexityAnalysis.suggestedSprintCount,
            actualSprints: devSprints.length,
            reasoning: `Generated ${devSprints.length} sprints based on ${complexityAnalysis.complexityLevel} complexity and ${allFeatures.length} features`
          };
        }
        
        return parsedData;
      } catch (parsingError) {
        console.error("Error parsing cleaned JSON:", parsingError);
        
        // Create a comprehensive plan from scratch using our complexity analysis
        return createComprehensiveSprintPlan(projectData, allFeatures);
      }
    } catch (error) {
      console.error("Error extracting JSON from Gemini response:", error);
      console.log("Raw response excerpt:", text.substring(0, 500) + '...');
      
      // Create a comprehensive plan from scratch using our complexity analysis
      return createComprehensiveSprintPlan(projectData, allFeatures);
    }
  } catch (error) {
    console.error("Error generating sprint plans:", error);
    // Create a comprehensive plan from scratch with basic complexity assumption
    const basicComplexity = analyzeProjectComplexity(projectData, projectData?.coreFeatures || []);
    return createComprehensiveSprintPlan(projectData, projectData?.coreFeatures || []);
  }
} 