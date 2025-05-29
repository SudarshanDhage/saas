/**
 * Utility functions for handling JSON responses from AI models
 */

/**
 * Enhanced JSON repair with step-by-step logging and more robust error handling
 */
export function repairJson(jsonString: string): string {
  console.log("=== JSON REPAIR START ===");
  console.log("Original JSON excerpt:", jsonString.substring(0, 300) + "...");
  console.log("Original JSON length:", jsonString.length);
  
  try {
    // Try parsing directly first
    JSON.parse(jsonString);
    console.log("JSON is already valid, no repair needed");
    return jsonString;
  } catch (error: any) {
    console.log("JSON repair needed. Error:", error.message);
  }
  
  // Step 1: Extract clean JSON boundaries
  let cleaned = extractJsonBoundaries(jsonString);
  console.log("After boundary extraction:", cleaned.substring(0, 200) + "...");
  
  try {
    JSON.parse(cleaned);
    console.log("JSON valid after boundary extraction");
    return cleaned;
  } catch (error: any) {
    console.log("Still invalid after boundary extraction:", error.message);
  }
  
  // Step 2: Apply comprehensive repairs
  cleaned = applyComprehensiveRepairs(cleaned);
  console.log("After comprehensive repairs:", cleaned.substring(0, 200) + "...");
  
  try {
    JSON.parse(cleaned);
    console.log("JSON valid after comprehensive repairs");
    return cleaned;
  } catch (error: any) {
    console.log("Still invalid after comprehensive repairs:", error.message);
  }
  
  // Step 3: Character-by-character repair
  cleaned = characterByCharacterRepair(cleaned);
  console.log("After character-by-character repair:", cleaned.substring(0, 200) + "...");
  
  try {
    JSON.parse(cleaned);
    console.log("JSON valid after character-by-character repair");
    return cleaned;
  } catch (error: any) {
    console.log("Still invalid after character repair:", error.message);
  }
  
  // Step 4: Smart reconstruction
  const reconstructed = smartReconstruction(cleaned);
  console.log("After smart reconstruction:", reconstructed.substring(0, 200) + "...");
  
  try {
    JSON.parse(reconstructed);
    console.log("JSON valid after smart reconstruction");
    return reconstructed;
  } catch (error: any) {
    console.log("Still invalid after smart reconstruction:", error.message);
  }
  
  // Step 5: Last resort fallback
  console.log("All repair attempts failed, using fallback structure");
  return getFallbackStructure();
}

/**
 * Extract JSON from boundaries and remove markdown/extra content
 */
function extractJsonBoundaries(text: string): string {
  let jsonString = text.trim();
  
  // Remove markdown code blocks
  const markdownMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    jsonString = markdownMatch[1].trim();
  }
  
  // Find the first '{' and last '}'
  const firstBrace = jsonString.indexOf('{');
  const lastBrace = jsonString.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonString = jsonString.substring(firstBrace, lastBrace + 1);
  }
  
  // Remove any leading/trailing non-JSON content
  jsonString = jsonString.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
  
  return jsonString;
}

/**
 * Apply comprehensive JSON repairs
 */
function applyComprehensiveRepairs(jsonString: string): string {
  let repaired = jsonString;
  
  // Fix property names (ensure they're quoted)
  repaired = repaired.replace(/([{,]\s*)([a-zA-Z0-9_$]+)(\s*:)/g, '$1"$2"$3');
  
  // Fix single quotes to double quotes for property names
  repaired = repaired.replace(/([{,]\s*)'([^']+)'(\s*:)/g, '$1"$2"$3');
  
  // Fix single quotes to double quotes for string values
  repaired = repaired.replace(/:\s*'([^']*)'/g, ': "$1"');
  
  // Fix trailing commas
  repaired = repaired.replace(/,\s*([}\]])/g, '$1');
  
  // Fix missing commas between objects
  repaired = repaired.replace(/}(\s*){/g, '},\n$1{');
  
  // Fix missing commas between array items
  repaired = repaired.replace(/](\s*)\[/g, '],\n$1[');
  
  // Fix missing commas between object properties (most common issue)
  repaired = repaired.replace(/"(\s*)"\s*([a-zA-Z0-9_$]+)\s*:/g, '"$1","$2":');
  repaired = repaired.replace(/([^,\{\[]\s*)"\s*([a-zA-Z0-9_$]+)\s*:/g, '$1,"$2":');
  
  // Fix double commas
  repaired = repaired.replace(/,,+/g, ',');
  
  // Fix newlines in string values
  repaired = repaired.replace(/"\s*\n\s*([^"]*)\s*\n\s*"/g, '"$1"');
  
  // Remove comments
  repaired = repaired.replace(/\/\*[\s\S]*?\*\//g, '');
  repaired = repaired.replace(/\/\/.*$/gm, '');
  
  // Fix unescaped quotes in strings
  repaired = repaired.replace(/"([^"\\]*(?:\\.[^"\\]*)*?)\\?"([^"\\]*(?:\\.[^"\\]*)*?)"/g, '"$1\\"$2"');
  
  // Normalize whitespace
  repaired = repaired.replace(/\s+/g, ' ');
  
  return repaired;
}

/**
 * Character-by-character repair for specific syntax errors
 */
function characterByCharacterRepair(jsonString: string): string {
  let repaired = jsonString;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      JSON.parse(repaired);
      break; // Success!
    } catch (error: any) {
      attempts++;
      
      const errorMessage = error.message || '';
      console.log(`Repair attempt ${attempts}: ${errorMessage}`);
      
      // Extract position information
      const positionMatch = errorMessage.match(/position\s+(\d+)/);
      const lineColMatch = errorMessage.match(/line\s+(\d+)\s+column\s+(\d+)/);
      
      let position = -1;
      if (positionMatch) {
        position = parseInt(positionMatch[1], 10);
      } else if (lineColMatch) {
        const line = parseInt(lineColMatch[1], 10);
        const column = parseInt(lineColMatch[2], 10);
        const lines = repaired.split('\n');
        position = lines.slice(0, line - 1).join('\n').length + column - 1;
      }
      
      if (position >= 0 && position < repaired.length) {
        const char = repaired[position];
        const before = repaired.slice(Math.max(0, position - 20), position);
        const after = repaired.slice(position, Math.min(repaired.length, position + 20));
        
        console.log(`Error at position ${position}, character: '${char}'`);
        console.log(`Context: "${before}[${char}]${after}"`);
        
        if (errorMessage.includes("Expected ',' or '}'")) {
          // Insert comma before the problematic position
          repaired = repaired.slice(0, position) + ',' + repaired.slice(position);
        } else if (errorMessage.includes("Expected ':' after property name")) {
          // Insert colon
          repaired = repaired.slice(0, position) + ':' + repaired.slice(position);
        } else if (errorMessage.includes("Unexpected token")) {
          if (char === "'") {
            // Replace single quote with double quote
            repaired = repaired.slice(0, position) + '"' + repaired.slice(position + 1);
          } else if (char === '\n' || char === '\r') {
            // Remove newline
            repaired = repaired.slice(0, position) + ' ' + repaired.slice(position + 1);
          } else {
            // Remove the problematic character
            repaired = repaired.slice(0, position) + repaired.slice(position + 1);
          }
        } else if (errorMessage.includes("Unexpected end of JSON")) {
          // Add missing closing braces/brackets
          repaired = balanceBrackets(repaired);
          break;
        } else {
          // Generic fix: try removing the character
          repaired = repaired.slice(0, position) + repaired.slice(position + 1);
        }
      } else {
        // Can't find position, try generic fixes
        repaired = balanceBrackets(repaired);
        break;
      }
    }
  }
  
  return repaired;
}

/**
 * Balance brackets and braces
 */
function balanceBrackets(jsonString: string): string {
  let balanced = jsonString;
  
  const openBraces = (balanced.match(/\{/g) || []).length;
  const closeBraces = (balanced.match(/\}/g) || []).length;
  if (openBraces > closeBraces) {
    balanced += '}'.repeat(openBraces - closeBraces);
  }
  
  const openBrackets = (balanced.match(/\[/g) || []).length;
  const closeBrackets = (balanced.match(/\]/g) || []).length;
  if (openBrackets > closeBrackets) {
    balanced += ']'.repeat(openBrackets - closeBrackets);
  }
  
  return balanced;
}

/**
 * Smart reconstruction of JSON structure
 */
function smartReconstruction(jsonString: string): string {
  console.log("Attempting smart reconstruction...");
  
  try {
    // Try to extract key-value pairs and rebuild the structure
    const patterns = {
      title: /"title"\s*:\s*"([^"]*)"/,
      description: /"description"\s*:\s*"([^"]*)"/,
      coreFeatures: /"coreFeatures"\s*:\s*(\[[^\]]*\])/,
      suggestedFeatures: /"suggestedFeatures"\s*:\s*(\[[^\]]*\])/
    };
    
    const extracted: any = {};
    
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = jsonString.match(pattern);
      if (match) {
        if (key === 'coreFeatures' || key === 'suggestedFeatures') {
          try {
            extracted[key] = JSON.parse(match[1]);
          } catch {
            extracted[key] = [];
          }
        } else {
          extracted[key] = match[1];
        }
      }
    }
    
    // Build a valid structure
    const reconstructed = {
      title: extracted.title || "Generated Project",
      description: extracted.description || "A project generated from your idea",
      coreFeatures: extracted.coreFeatures || [
        {
          id: "core1",
          name: "Basic Functionality",
          description: "Core project functionality"
        }
      ],
      suggestedFeatures: extracted.suggestedFeatures || [
        {
          id: "suggested1",
          name: "Enhanced Features",
          description: "Additional project enhancements"
        }
      ]
    };
    
    return JSON.stringify(reconstructed, null, 2);
  } catch (error) {
    console.log("Smart reconstruction failed:", error);
    return getFallbackStructure();
  }
}

/**
 * Get a valid fallback JSON structure
 */
function getFallbackStructure(): string {
  return JSON.stringify({
    title: "Generated Project",
    description: "A comprehensive project structure generated from your idea",
    coreFeatures: [
      {
        id: "user_management",
        name: "User Management",
        description: "Complete user registration, authentication, and profile management"
      },
      {
        id: "core_functionality",
        name: "Core Business Logic",
        description: "Primary functionality that solves the main problem"
      },
      {
        id: "data_management",
        name: "Data Management",
        description: "Secure data storage and management systems"
      },
      {
        id: "user_interface",
        name: "User Interface",
        description: "Intuitive and responsive user interface design"
      }
    ],
    suggestedFeatures: [
      {
        id: "admin_dashboard",
        name: "Admin Dashboard",
        description: "Administrative interface for system management"
      },
      {
        id: "analytics",
        name: "Analytics & Reporting",
        description: "Data analytics and reporting capabilities"
      },
      {
        id: "notifications",
        name: "Notification System",
        description: "Multi-channel notification system"
      },
      {
        id: "mobile_support",
        name: "Mobile Support",
        description: "Mobile-responsive design and functionality"
      },
      {
        id: "api_integration",
        name: "API Integration",
        description: "Integration with external services and APIs"
      }
    ]
  }, null, 2);
}

/**
 * Enhanced JSON extraction with better error handling
 */
export function extractJsonFromText(text: string): string {
  console.log("=== JSON EXTRACTION START ===");
  console.log("Input text length:", text.length);
  console.log("Input text excerpt:", text.substring(0, 300) + "...");
  
  let extracted = extractJsonBoundaries(text);
  console.log("Extracted JSON:", extracted.substring(0, 300) + "...");
  
  // Apply the repair function
  return repairJson(extracted);
} 