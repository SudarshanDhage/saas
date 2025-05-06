import { model } from './client';
import { extractJsonFromText, repairJson } from './json-utils';

/**
 * Generates comprehensive project documentation based on project data and sprint plans.
 * This includes detailed technical documentation, user guides, API references, and more.
 * @param projectData The complete project data including title, description, features, tech stack and sprint plans
 * @returns Structured documentation in JSON format
 */
export async function generateDocumentation(projectData: any) {
  try {
    console.log('Starting documentation generation with Gemini API');
    
    // Extract relevant project information
    const projectTitle = projectData?.title || 'Project';
    const projectDescription = projectData?.description || '';
    const coreFeatures = projectData?.coreFeatures || [];
    const suggestedFeatures = projectData?.suggestedFeatures || [];
    const techStack = projectData?.techStack || {};
    const sprintPlan = projectData?.sprintPlan || {};
    
    // Create lists for features and tech stack
    const featuresList = [...coreFeatures, ...suggestedFeatures].map(feature => 
      `- ${feature.name}: ${feature.description}`
    ).join('\n');
    
    const techStackList = Object.entries(techStack).map(([category, technologies]) => {
      if (Array.isArray(technologies)) {
        return `- ${category}: ${technologies.join(', ')}`;
      } else {
        return `- ${category}: ${technologies}`;
      }
    }).join('\n');
    
    // Create the prompt for the Gemini API
    const prompt = `
    You are a distinguished technical documentation architect with 20+ years of experience in creating comprehensive software documentation for enterprise-grade applications. 
    You specialize in creating exceptionally detailed technical documentation that follows industry best practices and enables both developers and end-users to efficiently understand 
    and work with complex software systems. Your documentation is renowned for its precision, technical depth, and immediate usability in production environments.

    PROJECT CONTEXT:
    ${JSON.stringify({
      title: projectTitle,
      description: projectDescription,
      coreFeatures,
      suggestedFeatures,
      techStack
    }, null, 2)}
    
    SPRINT PLAN CONTEXT:
    ${JSON.stringify(sprintPlan, null, 2)}

    COMPREHENSIVE DOCUMENTATION REQUIREMENTS:

    1. ARCHITECTURE DOCUMENTATION REQUIREMENTS:
       - Create an exceptionally detailed technical architecture overview with precise component descriptions, exact data flows, and explicit relationship diagrams
       - Document all architectural decisions with specific technical rationales, concrete constraints addressed, and measurable benefits achieved
       - Include explicit system boundaries with specific interface definitions including payload structures, validation rules, and error handling patterns
       - Define precise integration specifications with external systems/APIs including authentication mechanisms, rate limits, and fallback procedures
       - Detail each component's exact responsibilities, technical implementation details, and internal data structures with field-level specifications
       - Document exact event flows, messaging patterns, and state transitions between components with explicit sequence diagrams
       - Specify precise performance characteristics for each component including throughput capacities, memory utilization patterns, and latency profiles
       - Detail all technical dependencies with exact version requirements, compatibility matrices, and upgrade implications
       - Document precise caching strategies, invalidation mechanisms, and data consistency patterns across distributed components
       - Include detailed deployment architecture diagrams with explicit networking configurations, service discovery mechanisms, and infrastructure dependencies

    2. DEVELOPER REFERENCE REQUIREMENTS:
       - Create comprehensive API documentation with complete endpoint specifications including precise URL paths, HTTP methods, and authentication requirements
       - Document all request parameters with exact validation rules, data types, constraints, and example values for each parameter
       - Include detailed response specifications with all possible status codes, header requirements, and response body structures
       - Document all data models with complete field descriptions, data types, validation constraints, and relationship mappings
       - Define concrete error handling patterns with complete error code catalog including unique error identifiers, error messages, and recovery actions
       - Include detailed database schema documentation with precise field definitions, index specifications, constraint definitions, and query optimization guidelines
       - Document explicit transaction boundaries, isolation levels, and concurrency control mechanisms for data modification operations
       - Provide complete code examples for all common API interactions with exact request/response cycles in multiple languages/frameworks
       - Include detailed performance optimization techniques specific to the documented APIs with query parameter usage guidelines and pagination implementation details
       - Document rate limiting policies, throttling behaviors, and batch processing capabilities for all resource-intensive operations

    3. USER GUIDE REQUIREMENTS:
       - Create detailed feature-by-feature documentation with step-by-step usage instructions and annotated screenshots for all user interfaces
       - Document complete user workflows with exact navigation paths, form completion guidelines, and expected system responses
       - Include comprehensive configuration options documentation with specific setting impacts, recommended values, and interdependency details
       - Define precise permission models with detailed role specifications, capability matrices, and authorization workflows
       - Document all system notifications, alerts, and messages with exact triggering conditions and recommended user actions
       - Include detailed troubleshooting guides with specific error messages, diagnostic procedures, and resolution steps
       - Document complete data import/export capabilities with file format specifications, validation rules, and size limitations
       - Define all keyboard shortcuts, accessibility features, and alternative interaction methods with explicit behavior descriptions
       - Include precise documentation for mobile/responsive behaviors with specific breakpoint behaviors and touch interaction patterns

    4. OPERATIONS DOCUMENTATION REQUIREMENTS:
       - Document detailed deployment processes with exact command sequences, environment preparation steps, and verification procedures
       - Include comprehensive monitoring specifications with exact metric definitions, recommended alert thresholds, and diagnostic procedures
       - Define precise scaling strategies with specific load indicators, resource allocation formulas, and capacity planning guidelines
       - Document complete backup and recovery procedures with exact commands, validation checks, and restoration workflows
       - Include detailed security hardening recommendations with specific configuration changes, service hardening steps, and vulnerability mitigation techniques
       - Define explicit maintenance procedures with upgrade paths, database migration steps, and rollback mechanisms
       - Document disaster recovery processes with specific recovery point objectives (RPO), recovery time objectives (RTO), and failover procedures
       - Include detailed log management guidelines with specific log formats, retention policies, and analysis procedures
       - Document infrastructure-as-code configurations with deployment pipeline integration details and environment-specific configuration management

    TECHNICAL QUALITY REQUIREMENTS:
    - Create EXTRAORDINARILY DETAILED technical documentation suitable for immediate use by both new and experienced developers
    - Ensure all documentation sections have PRECISE, TECHNICALLY SPECIFIC information with absolutely no placeholder text or generic descriptions
    - Include COMPLETE API documentation with EXACT request/response formats including all headers, status codes, and error representations
    - Document ALL error conditions with specific error codes, technical root causes, and EXACT resolution steps
    - Provide IMPLEMENTATION-READY code examples following the project's technology stack and coding standards
    - Ensure architecture documentation is HIGHLY TECHNICAL with explicit component responsibilities, data flows, and integration patterns
    - Include PRECISE technical specifications for all system components with concrete implementation details specific to the project's technology stack
    - Document performance characteristics with QUANTITATIVE metrics and specific optimization techniques for the project architecture
    - Ensure database documentation includes COMPLETE schema definitions, index recommendations, and query optimization techniques
    - Document ALL security considerations with specific implementation guidance, vulnerability mitigations, and compliance requirements
    - Include DETAILED deployment instructions with environment-specific configurations and orchestration requirements
    - Make all documentation IMMEDIATELY ACTIONABLE for developers with no additional research or clarification needed

    RESPONSE FORMAT REQUIREMENTS:
    - Your response MUST be a valid JSON object with NO explanations outside the JSON structure
    - Use DOUBLE QUOTES for all keys and string values
    - Include NO trailing commas in objects or arrays
    - Return the documentation in the following EXACT structure:

    {
      "documentation": {
        "projectOverview": {
          "title": "string",
          "description": "string",
          "businessObjectives": ["string"],
          "targetAudience": ["string"],
          "keyFeatures": [
            {
              "name": "string",
              "description": "string",
              "technicalHighlights": ["string"]
            }
          ]
        },
        "technicalArchitecture": {
          "overview": "string",
          "architecturalPatterns": ["string"],
          "components": [
            {
              "name": "string",
              "description": "string",
              "responsibilities": ["string"],
              "technologies": ["string"],
              "dependencies": ["string"],
              "apis": ["string"],
              "dataModel": "string",
              "performanceCharacteristics": "string"
            }
          ],
          "dataFlows": [
            {
              "source": "string",
              "destination": "string",
              "description": "string",
              "dataFormat": "string",
              "securityConsiderations": "string"
            }
          ],
          "deploymentArchitecture": {
            "description": "string",
            "environments": ["string"],
            "infrastructureRequirements": ["string"],
            "scalingStrategy": "string",
            "networkConfiguration": "string"
          },
          "securityArchitecture": {
            "authenticationMechanism": "string",
            "authorizationModel": "string",
            "dataProtection": "string",
            "securityControls": ["string"]
          }
        },
        "developerGuide": {
          "gettingStarted": {
            "requirementsAndPrerequisites": "string",
            "environmentSetup": "string",
            "buildAndRunInstructions": "string",
            "developmentWorkflow": "string"
          },
          "codeStructure": {
            "overview": "string",
            "keyDirectories": [
              {
                "path": "string",
                "purpose": "string",
                "keyFiles": ["string"]
              }
            ],
            "architecturalLayers": ["string"],
            "designPatterns": ["string"]
          },
          "apis": [
            {
              "name": "string",
              "description": "string",
              "endpoints": [
                {
                  "path": "string",
                  "method": "string",
                  "description": "string",
                  "requestParameters": [
                    {
                      "name": "string",
                      "type": "string",
                      "description": "string",
                      "required": "boolean",
                      "validationRules": "string",
                      "example": "string"
                    }
                  ],
                  "requestBody": "string",
                  "responseBody": "string",
                  "statusCodes": [
                    {
                      "code": "string",
                      "description": "string",
                      "example": "string"
                    }
                  ],
                  "authenticationRequirements": "string",
                  "rateLimiting": "string",
                  "example": "string"
                }
              ]
            }
          ],
          "databaseSchema": {
            "overview": "string",
            "tables": [
              {
                "name": "string",
                "description": "string",
                "fields": [
                  {
                    "name": "string",
                    "type": "string",
                    "description": "string",
                    "constraints": "string",
                    "indexes": "string"
                  }
                ],
                "relationships": ["string"],
                "queryPatterns": ["string"]
              }
            ],
            "migrations": "string",
            "performanceConsiderations": "string"
          },
          "commonDevelopmentTasks": [
            {
              "task": "string",
              "description": "string",
              "codeExample": "string",
              "notes": "string"
            }
          ],
          "troubleshooting": {
            "commonIssues": [
              {
                "problem": "string",
                "cause": "string",
                "solution": "string",
                "preventionTips": "string"
              }
            ],
            "debugging": "string",
            "logging": "string"
          }
        },
        "userGuide": {
          "gettingStarted": {
            "installation": "string",
            "registration": "string",
            "login": "string",
            "overview": "string"
          },
          "features": [
            {
              "name": "string",
              "description": "string",
              "userBenefits": ["string"],
              "stepByStepInstructions": "string",
              "tips": ["string"],
              "screenshots": ["string"]
            }
          ],
          "administration": {
            "userManagement": "string",
            "configurationOptions": "string",
            "systemMonitoring": "string",
            "backupAndRestore": "string"
          },
          "troubleshooting": {
            "commonIssues": [
              {
                "issue": "string",
                "symptoms": ["string"],
                "resolution": "string"
              }
            ],
            "contactSupport": "string"
          }
        },
        "operationsGuide": {
          "deployment": {
            "requirements": "string",
            "procedure": "string",
            "verification": "string",
            "rollback": "string"
          },
          "monitoring": {
            "metrics": [
              {
                "name": "string",
                "description": "string",
                "threshold": "string",
                "action": "string"
              }
            ],
            "alerting": "string",
            "dashboards": "string"
          },
          "scaling": {
            "horizontalScaling": "string",
            "verticalScaling": "string",
            "autoScaling": "string",
            "performanceTuning": "string"
          },
          "backup": {
            "dataBackup": "string",
            "configurationBackup": "string",
            "recovery": "string",
            "testingProcedure": "string"
          },
          "security": {
            "patchManagement": "string",
            "vulnerabilityScanning": "string",
            "incidentResponse": "string",
            "complianceRequirements": "string"
          },
          "maintenance": {
            "routineTasks": ["string"],
            "upgradeProcedures": "string",
            "downtime": "string",
            "offHoursSupport": "string"
          }
        },
        "apiReference": {
          "overview": "API overview",
          "authentication": "API authentication",
          "commonPatterns": "Common API patterns",
          "errorHandling": "API error handling",
          "endpoints": [
            {
              "group": "string",
              "endpoints": [
                {
                  "name": "string",
                  "description": "string",
                  "path": "string",
                  "method": "string",
                  "parameters": [
                    {
                      "name": "string",
                      "in": "string",
                      "type": "string",
                      "required": "boolean",
                      "description": "string"
                    }
                  ],
                  "requestBody": "string",
                  "responses": [
                    {
                      "statusCode": "string",
                      "description": "string",
                      "schema": "string",
                      "example": "string"
                    }
                  ],
                  "examples": [
                    {
                      "description": "string",
                      "request": "string",
                      "response": "string"
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }
    `;

    // Create a promise that rejects after a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Documentation generation timed out')), 120000); // 2 minutes timeout
    });

    // Race the API call against the timeout
    console.log('Sending documentation request to Gemini API');
    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more precise, factual output
          maxOutputTokens: 16384, // High token limit for comprehensive documentation
        }
      }),
      timeoutPromise
    ]) as any;

    console.log('Documentation generation completed successfully');

    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract and process the JSON response
      let jsonString = extractJsonFromText(text);
      jsonString = repairJson(jsonString);
      
      const documentation = JSON.parse(jsonString);
      
      // Validate that we have the required structure
      if (!documentation.documentation) {
        console.error('Invalid documentation structure received');
        throw new Error('Invalid documentation structure');
      }
      
      return documentation;
    } catch (error) {
      console.error("Error processing documentation JSON:", error);
      throw new Error('Failed to generate valid documentation: ' + (error instanceof Error ? error.message : String(error)));
    }
  } catch (error) {
    console.error("Error generating documentation:", error);
    
    // Return a basic fallback documentation if generation fails
    return {
      documentation: {
        projectOverview: {
          title: projectData?.title || "Project Title",
          description: projectData?.description || "Project Description",
          businessObjectives: ["Fulfill project business goals"],
          targetAudience: ["Primary target users"],
          keyFeatures: (projectData?.coreFeatures || []).map((feature: any) => ({
            name: feature.name,
            description: feature.description,
            technicalHighlights: ["Key technical aspects"]
          }))
        },
        technicalArchitecture: {
          overview: "System architecture overview",
          architecturalPatterns: ["Primary architectural patterns"],
          components: [],
          dataFlows: [],
          deploymentArchitecture: {
            description: "Deployment architecture overview",
            environments: ["Development", "Staging", "Production"],
            infrastructureRequirements: ["Required infrastructure components"],
            scalingStrategy: "Scaling approach overview",
            networkConfiguration: "Network configuration overview"
          },
          securityArchitecture: {
            authenticationMechanism: "Authentication approach",
            authorizationModel: "Authorization model overview",
            dataProtection: "Data protection strategy",
            securityControls: ["Security control measures"]
          }
        },
        developerGuide: {
          gettingStarted: {
            requirementsAndPrerequisites: "Requirements and prerequisites",
            environmentSetup: "Environment setup instructions",
            buildAndRunInstructions: "Build and run instructions",
            developmentWorkflow: "Development workflow overview"
          },
          codeStructure: {
            overview: "Code structure overview",
            keyDirectories: [],
            architecturalLayers: ["Key architectural layers"],
            designPatterns: ["Key design patterns"]
          },
          apis: [],
          databaseSchema: {
            overview: "Database schema overview",
            tables: [],
            migrations: "Database migration approach",
            performanceConsiderations: "Database performance considerations"
          },
          commonDevelopmentTasks: [],
          troubleshooting: {
            commonIssues: [],
            debugging: "Debugging approach",
            logging: "Logging strategy"
          }
        },
        userGuide: {
          gettingStarted: {
            installation: "Installation instructions",
            registration: "Registration process",
            login: "Login process",
            overview: "System overview for users"
          },
          features: (projectData?.coreFeatures || []).map((feature: any) => ({
            name: feature.name,
            description: feature.description,
            userBenefits: ["User benefit"],
            stepByStepInstructions: "How to use this feature",
            tips: ["Usage tip"],
            screenshots: ["Screenshot description"]
          })),
          administration: {
            userManagement: "User management approach",
            configurationOptions: "Configuration options overview",
            systemMonitoring: "System monitoring for administrators",
            backupAndRestore: "Backup and restore procedures"
          },
          troubleshooting: {
            commonIssues: [],
            contactSupport: "How to contact support"
          }
        },
        operationsGuide: {
          deployment: {
            requirements: "Deployment requirements",
            procedure: "Deployment procedure",
            verification: "Deployment verification",
            rollback: "Rollback procedure"
          },
          monitoring: {
            metrics: [],
            alerting: "Alerting strategy",
            dashboards: "Monitoring dashboards"
          },
          scaling: {
            horizontalScaling: "Horizontal scaling approach",
            verticalScaling: "Vertical scaling approach",
            autoScaling: "Auto-scaling strategy",
            performanceTuning: "Performance tuning guidelines"
          },
          backup: {
            dataBackup: "Data backup strategy",
            configurationBackup: "Configuration backup strategy",
            recovery: "Recovery procedures",
            testingProcedure: "Backup testing procedures"
          },
          security: {
            patchManagement: "Patch management strategy",
            vulnerabilityScanning: "Vulnerability scanning approach",
            incidentResponse: "Security incident response",
            complianceRequirements: "Compliance requirements"
          },
          maintenance: {
            routineTasks: ["Regular maintenance tasks"],
            upgradeProcedures: "Upgrade procedures",
            downtime: "Expected downtime for maintenance",
            offHoursSupport: "Off-hours support"
          }
        },
        apiReference: {
          overview: "API overview",
          authentication: "API authentication",
          commonPatterns: "Common API patterns",
          errorHandling: "API error handling",
          endpoints: []
        }
      }
    };
  }
}

/**
 * Enhances the documentation HTML with better formatting and structure
 */
function enhanceDocumentation(html: string, projectTitle: string): string {
  let enhancedHtml = html;
  
  // 1. Add language classes to code blocks for syntax highlighting
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)```bash/g, '<pre><code class="language-bash">$1');
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)\$ /g, '<pre><code class="language-bash">$1');
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)```javascript/g, '<pre><code class="language-javascript">$1');
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)```typescript/g, '<pre><code class="language-typescript">$1');
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)```json/g, '<pre><code class="language-json">$1');
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)```html/g, '<pre><code class="language-html">$1');
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)```css/g, '<pre><code class="language-css">$1');
  
  // 2. Add classes to tables for styling
  enhancedHtml = enhancedHtml.replace(/<table>/g, '<table class="data-table">');
  
  // 3. Check if we have headings, if not, ensure we at least have the project title
  if (!/<h[1-6]/.test(enhancedHtml)) {
    enhancedHtml = `<h1>${projectTitle || 'Project Documentation'}</h1>${enhancedHtml}`;
  }
  
  // 4. Add IDs to headings for navigation
  enhancedHtml = enhancedHtml.replace(/<h([1-6])>(.*?)<\/h\1>/g, (match, level, text) => {
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  // 5. Remove any hyperlinks but keep their text
  enhancedHtml = enhancedHtml.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])[^"']*\1[^>]*>(.*?)<\/a>/g, '$2');
  
  // 6. Ensure each section has a proper ID and wrap existing headings in section tags if not already
  const headingMatches = enhancedHtml.matchAll(/<h([2-6])\s+id="([^"]+)">(.*?)<\/h\1>/g);
  const sections = Array.from(headingMatches);
  
  if (sections.length > 0) {
    // Process each h2-h6 section
    for (let i = 0; i < sections.length; i++) {
      const currentHeadingMatch = sections[i];
      const nextHeadingMatch = sections[i + 1];
      
      // Get the indices of the current and next heading
      const currentIndex = currentHeadingMatch.index || 0;
      
      // Compute the end index for the current section
      let endIndex = enhancedHtml.length;
      if (nextHeadingMatch && nextHeadingMatch.index !== undefined) {
        endIndex = nextHeadingMatch.index;
      }
      
      // Extract the heading level and id
      const level = currentHeadingMatch[1]; // The heading level (2-6)
      const id = currentHeadingMatch[2];    // The heading ID
      
      // If the heading is not already in a section with this ID
      const sectionStartTag = `<section id="${id}">`;
      const sectionEndTag = '</section>';
      
      // Check if it's already in a section
      const beforeHeading = enhancedHtml.substring(0, currentIndex);
      const isInSection = beforeHeading.lastIndexOf('<section') > beforeHeading.lastIndexOf('</section>');
      
      if (!isInSection) {
        // Extract the section content
        const sectionContent = enhancedHtml.substring(currentIndex, endIndex);
        
        // Replace the content with the wrapped version
        enhancedHtml = 
          enhancedHtml.substring(0, currentIndex) + 
          sectionStartTag + 
          sectionContent + 
          sectionEndTag + 
          enhancedHtml.substring(endIndex);
        
        // Adjust the indices of subsequent headings to account for the added tags
        const adjustment = sectionStartTag.length + sectionEndTag.length;
        for (let j = i + 1; j < sections.length; j++) {
          if (sections[j].index !== undefined) {
            sections[j].index! += adjustment;
          }
        }
      }
    }
  }
  
  return enhancedHtml;
}

/**
 * Helper function to convert Markdown to HTML
 */
function convertMarkdownToHTML(markdown: string, projectTitle: string): string {
  // Simple markdown to HTML conversion
  let html = markdown;
  
  // Make sure we have a title
  if (!html.startsWith('# ')) {
    html = `# ${projectTitle || 'Project Documentation'}\n\n${html}`;
  }
  
  // Process headings
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // Process code blocks with language specification
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gm, (match, language, code) => {
    const languageClass = language ? `language-${language}` : '';
    return `<pre><code class="${languageClass}">${escapeHtml(code.trim())}</code></pre>`;
  });
  
  // Process inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Process lists
  // Unordered lists
  html = html.replace(/^[ \t]*[-*+][ \t]+(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>\n)+/g, '<ul>$&</ul>');
  
  // Ordered lists
  html = html.replace(/^[ \t]*\d+\.[ \t]+(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>\n)+/g, (match) => {
    // Only wrap in <ol> if not already wrapped in <ul>
    if (!match.startsWith('<ul>')) {
      return '<ol>' + match + '</ol>';
    }
    return match;
  });
  
  // Remove links but keep the text
  html = html.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Process emphasis
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Process horizontal rules
  html = html.replace(/^---$/gm, '<hr/>');
  
  // Process tables (basic support)
  const tableRegex = /^\|(.+)\|\r?\n\|(?:[-:]+\|)+\r?\n((?:\|.+\|\r?\n)+)/gm;
  html = html.replace(tableRegex, (match) => {
    const lines = match.split('\n');
    const headers = lines[0].split('|').filter(cell => cell.trim().length > 0).map(cell => `<th>${cell.trim()}</th>`).join('');
    
    let tableRows = '';
    for (let i = 2; i < lines.length; i++) {
      if (lines[i].trim().length > 0) {
        const cells = lines[i].split('|').filter(cell => cell.trim().length > 0).map(cell => `<td>${cell.trim()}</td>`).join('');
        tableRows += `<tr>${cells}</tr>`;
      }
    }
    
    return `<table class="data-table">
      <thead><tr>${headers}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>`;
  });
  
  // Process paragraphs
  // First, remove empty lines at the start of the content
  html = html.replace(/^\s*\n/, '');
  
  // Then process paragraphs, being careful not to wrap existing HTML elements
  const paragraphSplit = html.split(/\n\s*\n/);
  html = paragraphSplit.map(block => {
    // Skip if the block is, or begins with, an HTML tag
    if (/^\s*<\/?[a-z][\s\S]*>/i.test(block)) {
      return block;
    }
    // Skip if this is a heading or list
    if (/^<(h[1-6]|ul|ol|li|table|pre)[\s>]/i.test(block)) {
      return block;
    }
    return `<p>${block}</p>`;
  }).join('\n\n');
  
  // Process ASCII diagrams if they exist
  html = html.replace(/<pre><code>([\s\S]*?(?:\+---|--+\+|---+\>|<---+|\|[\s\S]*?\|)[\s\S]*?)<\/code><\/pre>/g, 
    '<pre class="ascii-diagram">$1</pre>');
  
  return html;
}

/**
 * Helper function to escape HTML entities in code blocks
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
} 