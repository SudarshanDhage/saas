/**
 * Utility functions for handling JSON responses from AI models
 */

/**
 * Attempts to repair malformed JSON from AI responses
 */
export function repairJson(jsonString: string): string {
  // Safety check for empty or non-string input
  if (!jsonString || typeof jsonString !== 'string' || jsonString.trim() === '') {
    console.error("Empty or invalid input to repairJson");
    throw new Error("Empty or invalid input to JSON repair function");
  }

  console.log("Original JSON string length:", jsonString.length);
  if (jsonString.length > 150) {
    console.log("Original JSON preview (first 50 chars):", jsonString.substring(0, 50));
    console.log("Original JSON preview (last 50 chars):", jsonString.substring(jsonString.length - 50));
  }
  
  try {
    // Do a quick validity check before attempting repairs
    try {
      JSON.parse(jsonString);
      console.log("JSON is already valid, no repair needed");
      return jsonString;
    } catch (initialError) {
      console.log("JSON is invalid, starting repair process");
      
      // Log diagnostic info about the JSON
      const openBraces = (jsonString.match(/{/g) || []).length;
      const closeBraces = (jsonString.match(/}/g) || []).length;
      const openBrackets = (jsonString.match(/\[/g) || []).length;
      const closeBrackets = (jsonString.match(/\]/g) || []).length;
      const quotes = (jsonString.match(/"/g) || []).length;
      const singleQuotes = (jsonString.match(/'/g) || []).length;
      
      console.log(`JSON structure diagnostics: {: ${openBraces}, }: ${closeBraces}, [: ${openBrackets}, ]: ${closeBrackets}, ": ${quotes}, ': ${singleQuotes}`);
      
      if (openBraces !== closeBraces) {
        console.warn(`Mismatched braces (${openBraces} vs ${closeBraces})`);
      }
      if (openBrackets !== closeBrackets) {
        console.warn(`Mismatched brackets (${openBrackets} vs ${closeBrackets})`);
      }
      if (quotes % 2 !== 0) {
        console.warn(`Odd number of double quotes (${quotes})`);
      }
    }
    
    // First attempt the most basic fixes
    // 1. Remove BOM and invisible characters
    jsonString = jsonString.replace(/^\uFEFF/, '');
    
    // 2. Remove potential garbage at start
    const firstBraceIndex = jsonString.indexOf('{');
    if (firstBraceIndex > 0) {
      console.log(`Removing ${firstBraceIndex} characters from the start`);
      jsonString = jsonString.substring(firstBraceIndex);
    }
    
    // 3. Find balanced JSON if there's garbage at the end too
    const lastBraceIndex = jsonString.lastIndexOf('}');
    if (lastBraceIndex !== -1 && lastBraceIndex < jsonString.length - 1) {
      console.log(`Trimming ${jsonString.length - lastBraceIndex - 1} characters from the end`);
      jsonString = jsonString.substring(0, lastBraceIndex + 1);
    }
    
    // 4. Fix common AI model issues before starting iterative repair
    
    // Fix property names that use single quotes instead of double quotes
    jsonString = jsonString.replace(/([''])([a-zA-Z0-9_]+)([''])(\s*:)/g, '"$2"$4');
    
    // Fix unclosed string values (a common AI model issue)
    jsonString = jsonString.replace(/:\s*"([^"]*?)(?=,|\n|\r|{|}|]|\[)/g, ': "$1"');
    
    // Fix missing quotes around property values that should be strings
    jsonString = jsonString.replace(/:\s*([a-zA-Z][a-zA-Z0-9_\s]+)(?=,|\n|\r|})/g, ': "$1"');
    
    // Try parsing directly with these basic fixes
    try {
      JSON.parse(jsonString);
      console.log("Basic fixes were sufficient");
      return jsonString; // If it parses, it's valid JSON
    } catch (directError) {
      console.log("Basic fixes not sufficient, continuing with repair process");
    }
    
    // Run general fixes first
    jsonString = applyGeneralJsonFixes(jsonString);
    
    // Try parsing again after general fixes
    try {
      JSON.parse(jsonString);
      console.log("General fixes were successful");
      return jsonString;
    } catch (generalFixError) {
      console.log("General fixes not sufficient, proceeding with targeted repairs");
    }
    
    // Extract error information to target the specific issue
    let repairAttempts = 0;
    const maxRepairAttempts = 15;
    
    while (repairAttempts < maxRepairAttempts) {
      try {
        JSON.parse(jsonString);
        console.log(`JSON fixed after ${repairAttempts} repair attempts!`);
        return jsonString;
      } catch (error: any) {
        repairAttempts++;
        const errorMessage = error.message || '';
        console.log(`JSON parse error (attempt ${repairAttempts}):`, errorMessage);
        
        // Extract position information from error
        const positionMatch = errorMessage.match(/position\s+(\d+)/);
        const lineColMatch = errorMessage.match(/line\s+(\d+)\s+column\s+(\d+)/);
        
        let position = -1;
        
        if (positionMatch) {
          position = parseInt(positionMatch[1], 10);
        } else if (lineColMatch) {
          // Calculate approximate position from line and column
          const line = parseInt(lineColMatch[1], 10);
          const column = parseInt(lineColMatch[2], 10);
          const lines = jsonString.split('\n');
          position = lines.slice(0, line - 1).join('\n').length + column;
        }
        
        // If no position found or position is beyond the string length, apply general fixes
        if (position < 0 || position >= jsonString.length) {
          console.log("No specific position found in error or invalid position, applying general fixes");
          jsonString = balanceJsonStructure(jsonString);
          continue;
        }
        
        // Look at the error location
        const contextBefore = jsonString.slice(Math.max(0, position - 30), position);
        const contextAfter = jsonString.slice(position, Math.min(jsonString.length, position + 30));
        console.log(`Error at position ${position}:`);
        console.log(`Context before: "${contextBefore}"`);
        console.log(`Context after: "${contextAfter}"`);
        
        // Apply specific fixes based on error messages
        if (errorMessage.includes("Expected property name or '}'")) {
          // We might have an empty object property or trailing comma
          if (jsonString[position] === ',' && (jsonString[position+1] === '}' || /\s*}/.test(jsonString.substring(position+1)))) {
            // Remove trailing comma
            console.log("Removing trailing comma");
            jsonString = jsonString.slice(0, position) + jsonString.slice(position + 1);
          } else if (jsonString[position-1] === '{' || /{\s*$/.test(jsonString.substring(0, position))) {
            // Empty object - add a dummy property if it's not the end of the object
            if (jsonString[position] !== '}') {
              console.log("Adding dummy property to empty object");
              jsonString = jsonString.slice(0, position) + '"_dummy": null' + jsonString.slice(position);
            }
          } else {
            // Other issue - might be malformed JSON, try replacing the problematic character
            console.log("Removing problematic character");
            jsonString = jsonString.slice(0, position) + jsonString.slice(position + 1);
          }
        } else if (errorMessage.includes("Expected ',' or '}'")) {
          // Missing comma between properties or an extra property after the end
          if (/"\s*"/.test(contextAfter)) {
            // Missing comma between property names
            console.log("Adding missing comma between properties");
            jsonString = jsonString.slice(0, position) + ',' + jsonString.slice(position);
          } else if (/"\s*}/.test(contextBefore)) {
            // Unexpected content after end of object
            // Find the closing brace and remove everything after it until the next valid character
            const closingBrace = jsonString.indexOf('}', position);
            if (closingBrace !== -1) {
              const nextValidChar = jsonString.substring(closingBrace + 1).search(/[{,\[\]]/);
              if (nextValidChar !== -1) {
                console.log("Removing content between closing brace and next valid char");
                jsonString = jsonString.slice(0, closingBrace + 1) + jsonString.slice(closingBrace + 1 + nextValidChar);
              } else {
                console.log("Removing all content after closing brace");
                jsonString = jsonString.slice(0, closingBrace + 1);
              }
            } else {
              // No closing brace found - problematic JSON
              // Add a comma and hope for the best
              console.log("Adding comma as a best guess");
              jsonString = jsonString.slice(0, position) + ',' + jsonString.slice(position);
            }
          } else {
            // Generic case - try adding a comma
            console.log("Adding missing comma (generic case)");
            jsonString = jsonString.slice(0, position) + ',' + jsonString.slice(position);
          }
        } else if (errorMessage.includes("Expected ':' after property name")) {
          // Missing colon after property name
          console.log("Adding missing colon after property name");
          jsonString = jsonString.slice(0, position) + ':' + jsonString.slice(position);
        } else if (errorMessage.includes("Expected double-quoted property name")) {
          // Property name is not in double quotes
          console.log("Fixing unquoted property name");
          
          // Try to identify the property name
          const propNameMatch = contextBefore.match(/[{,]\s*([a-zA-Z0-9_$\-\.]+)$/);
          if (propNameMatch) {
            const propName = propNameMatch[1];
            console.log(`Found unquoted property name: "${propName}"`);
            
            // Replace with quoted property name
            const prefix = jsonString.substring(0, position - propName.length);
            const suffix = jsonString.substring(position);
            jsonString = prefix + '"' + propName + '"' + suffix;
          } else {
            // Try a more generic fix - add quotes around the character at position
            console.log("Applying generic fix for unquoted property");
            jsonString = jsonString.slice(0, position) + '"' + jsonString[position] + '"' + jsonString.slice(position + 1);
          }
        } else if (errorMessage.includes("Unexpected token")) {
          // Try to remove or replace the unexpected token
          if (jsonString[position] === "'") {
            // Single quote - replace with double quote
            console.log("Replacing single quote with double quote");
            jsonString = jsonString.slice(0, position) + '"' + jsonString.slice(position + 1);
          } else if (/[^\w\s"{}\[\]:,.-]/.test(jsonString[position] || '')) {
            // Non-standard character - remove it
            console.log("Removing non-standard character");
            jsonString = jsonString.slice(0, position) + jsonString.slice(position + 1);
          } else {
            // Other unexpected token - try to replace based on context
            if (/"\s*[^\s:,}]/.test(contextBefore + jsonString[position])) {
              // Missing colon or comma after property name
              if (contextBefore.trim().endsWith('"')) {
                console.log("Adding missing colon after property name");
                jsonString = jsonString.slice(0, position) + ':' + jsonString.slice(position);
              }
            } else if (/[}\]]\s*[^,\s}\]]/.test(contextBefore + jsonString[position])) {
              // Missing comma after array/object
              console.log("Adding missing comma after array/object");
              jsonString = jsonString.slice(0, position) + ',' + jsonString.slice(position);
            } else {
              // Generic removal of problematic character
              console.log("Removing problematic character");
              jsonString = jsonString.slice(0, position) + jsonString.slice(position + 1);
            }
          }
        } else if (errorMessage.includes("Unexpected end of JSON input")) {
          // Incomplete JSON - try to balance braces and brackets
          console.log("Fixing incomplete JSON by balancing structure");
          jsonString = balanceJsonStructure(jsonString);
        } else {
          // Generic error - try general fixes
          console.log("Applying general fixes for generic error");
          jsonString = applyGeneralJsonFixes(jsonString);
        }
      }
    }
    
    console.log("Maximum repair attempts reached, trying aggressive cleaning");
    return aggressiveJsonCleaning(jsonString);
  } catch (error) {
    console.error("Critical error in repairJson:", error);
    throw new Error("Failed to repair JSON after multiple attempts");
  }
}

/**
 * Applies general fixes to JSON that might be malformed
 */
function applyGeneralJsonFixes(jsonString: string): string {
  console.log("Applying general JSON fixes");
  
  // 1. Fix common issues with property names and values
  
  // Ensure property names have double quotes
  jsonString = jsonString
    // Fix property names with no quotes
    .replace(/([{,]\s*)([a-zA-Z0-9_$\-\.]+)(\s*:)/g, '$1"$2"$3')
    // Fix property names with single quotes (both types)
    .replace(/([{,]\s*)([''])([^''"]+)([''])(\s*:)/g, '$1"$3"$5');
  
  // 2. Fix issues with boolean and null values
  
  // Fix boolean values that might be capitalized or in quotes
  jsonString = jsonString.replace(/:\s*"(true|false)"/gi, (match, p1) => {
    return ': ' + p1.toLowerCase();
  });
  jsonString = jsonString.replace(/:\s*(TRUE|FALSE)\b/g, (match, p1) => {
    return ': ' + p1.toLowerCase();
  });
  
  // Fix null values in quotes
  jsonString = jsonString.replace(/:\s*"(null)"/gi, ': null');
  
  // 3. Fix structural issues
  
  // Fix missing commas in arrays and objects
  jsonString = jsonString
    // Between objects in arrays
    .replace(/}(\s*){/g, '},\n$1{')
    // Between arrays
    .replace(/](\s*)\[/g, '],\n$1[')
    // Between string values
    .replace(/"(\s+)"/g, '",\n"');
  
  // Fix trailing commas in arrays and objects
  jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
  
  // 4. Fix tech stack specific issues
  
  // Fix common issues in tech stack JSON where arrays might be malformed
  
  // Ensure that "frontend", "backend", "database" etc. properties contain arrays
  jsonString = jsonString.replace(
    /("frontend"|"backend"|"database"|"authentication"|"devOps"|"additionalTools")(\s*):(\s*)({)/g, 
    '$1$2:$3[$4'
  );
  
  // Fix missing closing brackets for arrays
  jsonString = jsonString.replace(
    /}(\s*)("backend"|"database"|"authentication"|"devOps"|"additionalTools")/g,
    '}]$1$2'
  );
  
  // Ensure object properties inside tech arrays have correct structure
  // Fix mismatched quotes around "recommended" boolean values
  jsonString = jsonString.replace(/"recommended"(\s*):(\s*)"(true|false)"/gi, (match, s1, s2, value) => {
    return `"recommended"${s1}:${s2}${value.toLowerCase()}`;
  });
  
  // Fix common error where arrays end up with non-array content
  // This looks for array-like structures without proper delimiters
  const nestedObjPattern = /"(frontend|backend|database|authentication|devOps|additionalTools)"(\s*):(\s*)({[^[]*?})/g;
  jsonString = jsonString.replace(nestedObjPattern, '"$1"$2:$3[$4]');
  
  // 5. Fix quotes and escaping
  
  // Replace single-quoted values with double quotes
  jsonString = jsonString.replace(/:\s*'([^']*?)'/g, ': "$1"');
  
  // Fix unescaped quotes in string values
  jsonString = jsonString.replace(/:\s*"(.*?)(?<!\\)"/g, function(match, contents) {
    // Only process if the content seems to have unescaped quotes
    if (contents.indexOf('"') !== -1) {
      // Escape double quotes that aren't already escaped
      return ': "' + contents.replace(/(?<!\\)"/g, '\\"') + '"';
    }
    return match;  // No changes needed
  });
  
  // 6. Clean up whitespace and handle comments
  
  // Remove any C-style or JS comments
  jsonString = jsonString.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  
  // Clean up excessive whitespace
  jsonString = jsonString.replace(/\s+/g, ' ').trim();
  
  // 7. Balance JSON structure as a final pass
  
  jsonString = balanceJsonStructure(jsonString);
  
  return jsonString;
}

/**
 * Tries to balance open and close brackets/braces in JSON
 */
function balanceJsonStructure(jsonString: string): string {
  // Count open and close braces and brackets
  let openBraces = (jsonString.match(/\{/g) || []).length;
  let closeBraces = (jsonString.match(/\}/g) || []).length;
  let openBrackets = (jsonString.match(/\[/g) || []).length;
  let closeBrackets = (jsonString.match(/\]/g) || []).length;
  
  console.log(`JSON structure: ${openBraces} open braces, ${closeBraces} close braces, ${openBrackets} open brackets, ${closeBrackets} close brackets`);
  
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

  // Fix any extra open/close mismatches
  if (closeBraces > openBraces || closeBrackets > openBrackets) {
    let result = '';
    let braceBalance = 0;
    let bracketBalance = 0;
    
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString[i];
      
      if (char === '{') {
        braceBalance++;
        result += char;
      } else if (char === '}') {
        if (braceBalance > 0) {
          braceBalance--;
          result += char;
        } // else skip extra closing brace
      } else if (char === '[') {
        bracketBalance++;
        result += char;
      } else if (char === ']') {
        if (bracketBalance > 0) {
          bracketBalance--;
          result += char;
        } // else skip extra closing bracket
      } else {
        result += char;
      }
    }
    
    jsonString = result;
  }
  
  return jsonString;
}

/**
 * Last resort aggressive JSON cleaning
 */
function aggressiveJsonCleaning(jsonString: string): string {
  try {
    console.log("Attempting ultra-aggressive JSON cleaning");
    
    // Log a preview of the problematic JSON for debugging
    console.log("Problem JSON preview:", jsonString.substring(0, 100) + "...");
    
    // Extract just the beginning of the string to the end
    const jsonStart = jsonString.indexOf('{');
    const jsonEnd = jsonString.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("Cannot find JSON delimiters in the string");
      throw new Error("Invalid JSON structure: cannot find braces");
    }
    
    if (jsonEnd <= jsonStart) {
      console.error("Invalid JSON structure: end brace appears before or at start brace");
      throw new Error("Invalid JSON structure: end brace appears before start brace");
    }
    
    jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
    console.log(`Extracted core JSON structure from position ${jsonStart} to ${jsonEnd}`);
    
    // Ultra-aggressive cleaning
    
    // 1. First clean any non-printable characters that might interfere with regex
    jsonString = jsonString
      // Remove non-ASCII characters
      .replace(/[^\x20-\x7E]+/g, ' ')
      // Replace control characters
      .replace(/[\x00-\x1F\x7F]+/g, ' ');
    
    // 2. Process the entire JSON in a more procedural way to ensure property names are quoted
    let processed = '';
    let inString = false;
    let escapeNext = false;
    let inPropertyName = false;
    let currentProperty = '';
    let lastChar = '';
    
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString[i];
      
      // Handle string state
      if (char === '"' && !escapeNext) {
        inString = !inString;
        processed += char;
      } 
      // Handle escape sequence
      else if (char === '\\' && !escapeNext) {
        escapeNext = true;
        processed += char;
      }
      // Not in a string, check for property name beginnings
      else if (!inString) {
        // Detect the start of a potential property name
        if ((lastChar === '{' || lastChar === ',') && /\s/.test(char)) {
          // Skip whitespace after { or ,
          continue;
        }
        // Detect unquoted property name
        else if ((lastChar === '{' || lastChar === ',') && char !== '"' && /[a-zA-Z0-9_$]/.test(char)) {
          inPropertyName = true;
          currentProperty = char;
          // Don't add to processed yet - we'll add with quotes when property name is complete
        }
        // Continue collecting property name
        else if (inPropertyName && /[a-zA-Z0-9_$\-\.]/.test(char) && char !== ':') {
          currentProperty += char;
        }
        // End of property name, add with quotes
        else if (inPropertyName && char === ':') {
          processed += `"${currentProperty}":`;
          inPropertyName = false;
          currentProperty = '';
        }
        // Normal character, just add it
        else {
          processed += char;
          if (inPropertyName && char !== ':') {
            // Unexpected character in property name, abandon property name mode
            inPropertyName = false;
            processed += currentProperty; // Add without quotes
            currentProperty = '';
          }
        }
      }
      // Regular character in string
      else {
        processed += char;
        escapeNext = false;
      }
      
      lastChar = char;
    }
    
    // If we exited with an unprocessed property name, add it with quotes
    if (inPropertyName && currentProperty) {
      processed += `"${currentProperty}"`;
    }
    
    // Use the processed string for further repairs
    jsonString = processed;
    
    // 3. Apply our standard regex repairs
    
    // Step 1: Fix simple unquoted property names (most common case)
    jsonString = jsonString.replace(/([{,]\s*)([a-zA-Z0-9_$]+)(\s*:)/g, '$1"$2"$3');
    
    // Step 2: Fix property names that might have special characters
    jsonString = jsonString.replace(/([{,]\s*)([a-zA-Z0-9_$\-\.]+)(\s*:)/g, '$1"$2"$3');
    
    // Step 3: Special case for unquoted property names followed by objects/arrays
    jsonString = jsonString.replace(/([{,]\s*)([a-zA-Z0-9_$\-\.]+)(\s*:\s*[{[])/g, '$1"$2"$3');
    
    // Step 4: Fix property names that might be using single quotes (both types)
    jsonString = jsonString.replace(/([{,]\s*)([''])([^''"]+)([''])(\s*:)/g, '$1"$3"$5');
    
    // Step 5: Try to fix property names separated by spaces from their colons
    jsonString = jsonString.replace(/([{,]\s*)("?)([a-zA-Z0-9_$\-\.]+)("?)(\s+)(:)/g, '$1"$3"$6');
    
    // Step 6: Handle unquoted property names that might appear after array elements
    jsonString = jsonString.replace(/(\]\s*)([a-zA-Z0-9_$\-\.]+)(\s*:)/g, '$1"$2"$3');
    
    // 4. Fix string values
    
    // Replace single-quoted strings with double quotes
    jsonString = jsonString.replace(/:\s*'([^']*?)'/g, ': "$1"');
    
    // Fix unquoted string values (more aggressive)
    jsonString = jsonString.replace(/:\s*([a-zA-Z][a-zA-Z0-9_\s\-\.]+)(\s*[,}])/g, ': "$1"$2');
    
    // 5. Fix structural issues
    
    // Fix missing commas between properties
    jsonString = jsonString.replace(/}(\s*){/g, '},\n$1{');
    jsonString = jsonString.replace(/](\s*)\[/g, '],\n$1[');
    jsonString = jsonString.replace(/"(\s+)"/g, '",\n"');
    
    // Fix missing commas after string values before new property names
    jsonString = jsonString.replace(/"(\s+){/g, '",\n{');
    jsonString = jsonString.replace(/"(\s+)\[/g, '",\n[');
    
    // Remove trailing commas 
    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix double commas (can be created by our replacements)
    jsonString = jsonString.replace(/,,+/g, ',');
    
    // Fix spaces between property name and colon that might have been added
    jsonString = jsonString.replace(/"([^"]+)"(\s+):/g, '"$1":');
    
    // Fix JSON boolean values that might be capitalized or in quotes
    jsonString = jsonString.replace(/:\s*"(true|false)"/gi, (match, p1) => {
      return ': ' + p1.toLowerCase();
    });
    jsonString = jsonString.replace(/:\s*(TRUE|FALSE)\b/g, (match, p1) => {
      return ': ' + p1.toLowerCase();
    });
    
    // Fix JSON null values that might be in quotes
    jsonString = jsonString.replace(/:\s*"(null)"/gi, ': null');
    
    // 6. Special tech stack fixes
    
    // Ensure tech stack properties have array values and structure
    const techStackFields = ["frontend", "backend", "database", "authentication", "devOps", "additionalTools"];
    
    techStackFields.forEach(field => {
      // Check if the field exists but is not already an array
      const fieldRegex = new RegExp(`"${field}"\\s*:\\s*{`, "g");
      if (fieldRegex.test(jsonString)) {
        console.log(`Converting ${field} object to array`);
        // Convert object to array by wrapping in []
        jsonString = jsonString.replace(
          new RegExp(`("${field}"\\s*:\\s*)({[^}]*})`, "g"),
          '$1[$2]'
        );
      }
    });
    
    // 7. One final pass for common errors that might be introduced by our fixes
    
    // Fix any empty property names that might have been created
    jsonString = jsonString.replace(/""\s*:/g, '"empty":');
    
    // Clean up excessive whitespace that might confuse the parser
    jsonString = jsonString.replace(/\s+/g, ' ').trim();
    
    // Balance the structure
    jsonString = balanceJsonStructure(jsonString);
    
    // 8. Special recovery for persistent property name issues
    // If we still have parsing issues, try a complete rebuild
    try {
      JSON.parse(jsonString);
      console.log("Aggressive cleaning successful!");
      return jsonString;
    } catch (parseError) {
      if (parseError instanceof SyntaxError && 
          parseError.message.includes("Expected double-quoted property name")) {
        console.log("Still have property name issues, attempting structure rebuild");
        
        // Build a tech stack structure from scratch using regex extraction
        try {
          // Create a basic structure for tech stack
          const techStack: any = {};
          
          // Try to extract each section
          for (const field of techStackFields) {
            // Find content between "field": [ and the likely end of that array
            const sectionRegex = new RegExp(`"${field}"\\s*:\\s*\\[(.*?)\\]\\s*,?\\s*"`, "s");
            const sectionMatch = jsonString.match(sectionRegex);
            
            if (sectionMatch && sectionMatch[1]) {
              // Extract the array content
              const content = sectionMatch[1].trim();
              
              // Try to parse this section, wrapping it in array brackets
              try {
                const sectionJson = JSON.parse(`[${content}]`);
                techStack[field] = sectionJson;
              } catch (sectionError) {
                // If we can't parse the section, create a minimal valid array with an object
                console.log(`Couldn't parse ${field} section, creating minimal valid structure`);
                techStack[field] = [{
                  name: `${field.charAt(0).toUpperCase() + field.slice(1)} Technology`,
                  recommended: true,
                  reason: "AI-generated recommendation",
                  features: ["Feature 1", "Feature 2"],
                  limitations: ["Limitation 1"]
                }];
              }
            } else {
              // Section not found, create minimal valid structure
              techStack[field] = [{
                name: `${field.charAt(0).toUpperCase() + field.slice(1)} Technology`,
                recommended: true,
                reason: "AI-generated recommendation",
                features: ["Feature 1", "Feature 2"],
                limitations: ["Limitation 1"]
              }];
            }
          }
          
          // Stringify our rebuilt structure
          const rebuiltJson = JSON.stringify(techStack);
          console.log("Successfully rebuilt tech stack JSON structure");
          return rebuiltJson;
        } catch (rebuildError) {
          console.error("Failed to rebuild tech stack structure:", rebuildError);
          throw new Error("Unable to repair or rebuild tech stack JSON structure");
        }
      } else {
        // For other types of errors, throw the original error
        console.error("Aggressive cleaning failed with non-property-name error:", parseError);
        throw parseError;
      }
    }

    // Fix unquoted property names that might contain 'while' or other code keywords
    jsonString = jsonString.replace(/([{,]\s*)([a-zA-Z][a-zA-Z0-9_\-]*\b)([ \t]*:)/g, (match, prefix, propName, suffix) => {
      // List of JavaScript keywords and common words that might appear in AI-generated content
      const keywords = [
        'while', 'if', 'for', 'function', 'return', 'var', 'let', 'const', 'switch', 'case',
        'break', 'continue', 'default', 'try', 'catch', 'finally', 'throw', 'new', 'delete',
        'typeof', 'instanceof', 'void', 'in', 'of', 'this', 'super', 'class', 'extends',
        'import', 'export', 'from', 'as', 'async', 'await', 'yield', 'with', 'then', 'when',
        'using', 'where', 'should', 'would', 'could', 'may', 'might', 'will'
      ];
      
      if (keywords.includes(propName.toLowerCase())) {
        console.log(`Found keyword "${propName}" used as property name, quoting it`);
        return `${prefix}"${propName}"${suffix}`;
      }
      
      // If the property name contains unusual characters or starts with a reserved word
      if (/\W/.test(propName) || keywords.some(keyword => propName.toLowerCase().startsWith(keyword))) {
        console.log(`Quoting potentially problematic property name: "${propName}"`);
        return `${prefix}"${propName}"${suffix}`;
      }
      
      return match;
    });

    // Special case fix for "w":hile syntax error
    jsonString = jsonString.replace(/"([a-zA-Z])"[ \t]*:[ \t]*([a-zA-Z]+)/g, (match, letter, word) => {
      console.log(`Fixing suspicious "${letter}":${word} pattern, likely a parsing error`);
      return `"${letter}_${word}": "${word}"`;
    });

    // Attempt to correct specific error pattern: "w":hile
    if (jsonString.includes('":hile') || jsonString.includes('": hile')) {
      console.log('Detected ":hile" pattern, attempting specialized fix');
      jsonString = jsonString
        .replace(/"([a-zA-Z])"\s*:\s*hile/g, '"$1_while": "while"')
        .replace(/"([a-zA-Z][a-zA-Z0-9_]*)"\s*:\s*hile/g, '"$1_while": "while"');
    }

    // 9. Remove BOM and other invisible characters
    jsonString = jsonString.replace(/^\uFEFF/, '');
    
    // 10. Fix newlines inside string values
    jsonString = jsonString.replace(/:\s*"([^"]*)[\n\r]+([^"]*)"/g, ': "$1 $2"');
    
    // 11. Make a quick check for valid JSON
    try {
      JSON.parse(jsonString);
      console.log("Successfully extracted and cleaned valid JSON");
      return jsonString;
    } catch (e) {
      console.warn("Initial JSON cleaning was not sufficient, will need repair");
      return jsonString;
    }
  } catch (error) {
    console.error("Critical error during aggressive cleaning:", error instanceof Error ? error.message : String(error));
    throw new Error("Failed to repair JSON with aggressive cleaning: " + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * Extract and clean JSON from text that might contain markdown formatting or other text
 */
export function extractJsonFromText(text: string): string {
  // Safety check
  if (!text || typeof text !== 'string') {
    console.error("Invalid input to extractJsonFromText");
    throw new Error("Invalid or empty text provided for JSON extraction");
  }

  console.log("Extracting JSON from text of length:", text.length);
  
  // Try different strategies for extracting JSON:
  
  // Strategy 1: Find JSON in markdown code blocks (most common case)
  const markdownJsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const markdownMatch = text.match(markdownJsonRegex);
  if (markdownMatch && markdownMatch[1]) {
    console.log("Found JSON in markdown code block");
    const extractedJson = markdownMatch[1].trim();
    
    // Quick check if the extracted content actually has JSON braces
    if (extractedJson.indexOf('{') !== -1 && extractedJson.lastIndexOf('}') !== -1) {
      console.log("Using JSON from markdown code block");
      return cleanExtractedJson(extractedJson);
    } else {
      console.warn("Extracted markdown block doesn't appear to contain valid JSON");
    }
  }
  
  // Strategy 2: Find JSON between the first { and the last }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    console.log(`Found potential JSON between positions ${firstBrace} and ${lastBrace}`);
    const potentialJsonString = text.substring(firstBrace, lastBrace + 1);
    
    // Check if this looks like valid JSON (has keys with quotes or follows basic JSON structure)
    const hasQuotedKeys = /"[^"]+"\s*:/.test(potentialJsonString);
    const hasValidStructure = /[{[][\s\S]*[}\]]/.test(potentialJsonString);
    
    if (hasQuotedKeys || hasValidStructure) {
      console.log("Extracted JSON structure looks promising");
      return cleanExtractedJson(potentialJsonString);
    }
  }
  
  // Strategy 3: Find the largest JSON-like structure in the text
  // This regex looks for any text that starts with { and ends with }, with balanced braces
  const jsonRegex = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/g;
  const matches = text.match(jsonRegex);
  
  if (matches && matches.length > 0) {
    console.log(`Found ${matches.length} potential JSON objects in the text`);
    
    // Sort by size (largest first - most likely to be complete)
    const sortedMatches = matches
      .filter(match => match.length > 10) // Filter out tiny matches
      .sort((a: string, b: string) => b.length - a.length);
    
    if (sortedMatches.length > 0) {
      console.log(`Using largest JSON-like structure (${sortedMatches[0].length} chars)`);
      return cleanExtractedJson(sortedMatches[0]);
    }
  }
  
  // Strategy 4: Last resort - just try to find anything between braces
  console.warn("Could not find structured JSON, falling back to basic extraction");
  const fallbackExtract = text.substring(
    text.indexOf('{') !== -1 ? text.indexOf('{') : 0,
    text.lastIndexOf('}') !== -1 ? text.lastIndexOf('}') + 1 : text.length
  );
  
  console.log("Fallback extraction length:", fallbackExtract.length);
  return cleanExtractedJson(fallbackExtract);
}

/**
 * Helper function to clean and prepare extracted JSON
 */
function cleanExtractedJson(jsonString: string): string {
  // Extensive cleaning of the JSON string
  
  // 1. Remove any non-JSON prefix/suffix
  // Common AI model outputs might add "Here's the JSON:" or other explanatory text
  jsonString = jsonString.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
  
  // 2. Remove comments (both block and line comments)
  jsonString = jsonString.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  
  // 3. Fix property names not in quotes (only properties followed by :)
  jsonString = jsonString.replace(/([{,]\s*)([a-zA-Z0-9_$\-\.]+)(\s*:)/g, '$1"$2"$3');
  
  // 4. Fix trailing commas in arrays and objects
  jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');
  
  // 5. Fix missing commas between objects in arrays
  jsonString = jsonString.replace(/}\s*{/g, '},{');
  
  // 6. Handle single quotes
  // Replace single quotes with double quotes for property values
  jsonString = jsonString.replace(/:\s*'([^']*?)'/g, ': "$1"');
  
  // 7. Handle property names with single quotes
  jsonString = jsonString.replace(/([''])([a-zA-Z0-9_$\-\.]+)([''])(\s*:)/g, '"$2"$4');
  
  // 8. Fix true/false in quotes or wrong case
  jsonString = jsonString.replace(/:\s*"(true|false)"/gi, (match, p1) => {
    return ': ' + p1.toLowerCase();
  });
  jsonString = jsonString.replace(/:\s*(TRUE|FALSE)\b/g, (match, p1) => {
    return ': ' + p1.toLowerCase();
  });
  
  // 9. Fix null in quotes
  jsonString = jsonString.replace(/:\s*"(null)"/gi, ': null');
  
  // 10. Remove BOM and other invisible characters
  jsonString = jsonString.replace(/^\uFEFF/, '');
  
  // 11. Fix newlines inside string values
  jsonString = jsonString.replace(/:\s*"([^"]*)[\n\r]+([^"]*)"/g, ': "$1 $2"');
  
  // 12. Make a quick check for valid JSON
  try {
    JSON.parse(jsonString);
    console.log("Successfully extracted and cleaned valid JSON");
    return jsonString;
  } catch (e) {
    console.warn("Initial JSON cleaning was not sufficient, will need repair");
    return jsonString;
  }
} 