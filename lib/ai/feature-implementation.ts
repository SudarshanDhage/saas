import { model } from './client';

/**
 * Robust JSON extraction from text that may contain malformed JSON
 */
function extractAndParseJson(text: string): any {
  console.log("Raw AI response:", text.substring(0, 300) + "...");
  
  // First, try to find JSON boundaries
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error("No JSON object found in response");
  }
  
  let jsonString = text.substring(jsonStart, jsonEnd + 1);
  console.log("Extracted JSON:", jsonString.substring(0, 200) + "...");
  
  // Try direct parsing first
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.log("Direct parsing failed, attempting repair...");
  }
  
  // Robust JSON cleaning and repair
  try {
    // Clean common issues
    jsonString = jsonString
      // Remove any markdown code blocks
      .replace(/```json|```/g, '')
      // Fix unquoted property names
      .replace(/([{,]\s*)([a-zA-Z0-9_$]+)(\s*:)/g, '$1"$2"$3')
      // Fix trailing commas
      .replace(/,\s*([}\]])/g, '$1')
      // Fix missing commas between objects
      .replace(/}(\s*){/g, '},\n$1{')
      // Fix missing commas between array items
      .replace(/](\s*)\[/g, '],\n$1[')
      // Replace single quotes with double quotes
      .replace(/'/g, '"')
      // Fix double commas
      .replace(/,,/g, ',')
      // Fix spaces around colons
      .replace(/"\s*:\s*/g, '":')
      // Fix newlines in strings
      .replace(/"\s*\n\s*/g, '"')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
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
    
    console.log("Cleaned JSON:", jsonString.substring(0, 200) + "...");
    return JSON.parse(jsonString);
    
  } catch (repairError) {
    console.error("JSON repair failed:", repairError);
    throw new Error("Unable to parse AI response as valid JSON");
  }
}

/**
 * Create a fallback feature implementation structure
 */
function createFallbackImplementation(feature: string) {
  const title = feature.length > 50 ? feature.substring(0, 50) + "..." : feature;
  
  return {
    feature: {
      title: title,
      description: `Implementation plan for: ${feature}`
    },
    developerPlan: {
      tasks: [
        {
          id: "dev-1",
          title: "Research and Planning",
          description: "Research requirements and create implementation plan",
          type: "planning",
          priority: "high",
          estimatedHours: 2
        },
        {
          id: "dev-2",
          title: "Frontend Implementation",
          description: `Implement the frontend components for: ${feature}`,
          type: "frontend",
          priority: "high",
          estimatedHours: 6
        },
        {
          id: "dev-3",
          title: "Backend Implementation",
          description: `Implement the backend logic for: ${feature}`,
          type: "backend",
          priority: "high",
          estimatedHours: 4
        },
        {
          id: "dev-4",
          title: "Testing and Integration",
          description: "Test the feature and integrate with existing system",
          type: "testing",
          priority: "medium",
          estimatedHours: 3
        }
      ]
    },
    aiPlan: {
      tasks: [
        {
          id: "ai-1",
          title: "Setup Development Environment",
          description: "Set up the development environment and project structure for implementing the feature",
          priority: "high"
        },
        {
          id: "ai-2",
          title: "Generate Implementation Code",
          description: `Generate the complete implementation code for: ${feature}. Include all necessary components, functions, and styling.`,
          priority: "high"
        },
        {
          id: "ai-3",
          title: "Create Tests",
          description: "Generate comprehensive tests for the implemented feature including unit tests and integration tests",
          priority: "medium"
        },
        {
          id: "ai-4",
          title: "Documentation",
          description: "Generate documentation for the feature including usage examples and API documentation",
          priority: "low"
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
Generate a detailed implementation plan for this feature: "${feature}"

Respond with ONLY valid JSON in this exact structure:

{
  "feature": {
    "title": "Clear feature title",
    "description": "Detailed feature description"
  },
  "developerPlan": {
    "tasks": [
      {
        "id": "task1",
        "title": "Task title",
        "description": "Detailed task description",
        "type": "frontend",
        "priority": "high",
        "estimatedHours": 4
      }
    ]
  },
  "aiPlan": {
    "tasks": [
      {
        "id": "task1",
        "title": "Task title", 
        "description": "Detailed AI implementation instructions",
        "priority": "high"
      }
    ]
  }
}

Requirements:
- Include 3-6 tasks for developerPlan
- Include 3-5 tasks for aiPlan
- Use task types: frontend, backend, design, testing, planning
- Use priorities: high, medium, low
- Estimate hours realistically (1-8 hours per task)
- NO explanations outside JSON
- NO markdown formatting
- Start response with { and end with }
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsedData = extractAndParseJson(text);
      
      // Validate the structure
      if (!parsedData.feature || !parsedData.developerPlan || !parsedData.aiPlan) {
        console.warn("Invalid structure in AI response, using fallback");
        return createFallbackImplementation(feature);
      }
      
      // Ensure tasks arrays exist
      if (!Array.isArray(parsedData.developerPlan.tasks)) {
        parsedData.developerPlan.tasks = [];
      }
      if (!Array.isArray(parsedData.aiPlan.tasks)) {
        parsedData.aiPlan.tasks = [];
      }
      
      // If we have empty task lists, use fallback
      if (parsedData.developerPlan.tasks.length === 0 && parsedData.aiPlan.tasks.length === 0) {
        console.warn("Empty task lists in AI response, using fallback");
        return createFallbackImplementation(feature);
      }
      
      console.log("Successfully parsed feature implementation from AI");
      return parsedData;
      
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.log("Using fallback implementation structure");
      return createFallbackImplementation(feature);
    }
    
  } catch (error) {
    console.error("Error generating feature implementation:", error);
    console.log("Using fallback implementation structure due to generation error");
    return createFallbackImplementation(feature);
  }
} 