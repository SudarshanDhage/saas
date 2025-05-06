import { model } from './client';
import { repairJson, extractJsonFromText } from './json-utils';
import { createFeatureTask, createStandardTasks, mergeTaskLists } from './sprint-models';

/**
 * Generates a comprehensive sprint plan based on the project data and selected tech stack.
 * The plan includes both a developer sprint plan and an AI assistant sprint plan.
 */
export async function generateSprintPlan(projectData: any) {
  try {
    console.log('Starting sprint plan generation with Gemini API');

    // Safety check for projectData
    if (!projectData || typeof projectData !== 'object') {
      throw new Error('Invalid project data provided');
    }

    // Extract the tech stack information from project data
    const techStack = projectData?.techStack || {};
    
    // Extract core and suggested features
    const coreFeatures = projectData?.coreFeatures || [];
    const suggestedFeatures = projectData?.suggestedFeatures || [];
    
    // Prepare feature lists for the prompt
    const coreFeaturesText = coreFeatures.map((feature: any, index: number) => 
      `${index + 1}. ${feature.name}: ${feature.description}`
    ).join('\n');
    
    const suggestedFeaturesText = suggestedFeatures.map((feature: any, index: number) => 
      `${index + 1}. ${feature.name}: ${feature.description}`
    ).join('\n');

    // Create the prompt for the Gemini API
    const prompt = `
    You are a software engineering director with 25+ years of experience in leading technical teams through hundreds of successful product launches. You have deep expertise in agile methodologies, modern development practices, architecture planning, and technical leadership. Your planning approach emphasizes architectural soundness, developer productivity, systematic progression, and measurable outcomes.
    
    COMPREHENSIVE PLANNING OBJECTIVE:
    Create an extraordinarily detailed, implementation-ready sprint plan for the following software project. Your plan must include two parallel development paths: (1) a developer-focused sprint plan optimized for human implementation and (2) an AI-accelerated sprint plan leveraging AI tools to expedite development. This plan must be exceptionally precise, technically detailed, and immediately actionable by a development team.
    
    PROJECT DETAILS:
    ${JSON.stringify(projectData, null, 2)}
    
    TECHNOLOGY STACK:
    ${JSON.stringify(techStack, null, 2)}
    
    CORE FEATURES (Priority implementation):
    ${coreFeaturesText}
    
    SUGGESTED FEATURES (Secondary priority):
    ${suggestedFeaturesText}
    
    ADVANCED TECHNICAL PLANNING REQUIREMENTS:
    
    1. ARCHITECTURAL FOUNDATION PLANNING:
       - Construct a comprehensive technical dependency graph with precise implementation order
       - Identify shared abstractions, core services, and foundation libraries required across features
       - Establish clear technical boundaries between domains with interface definitions
       - Define exact data models and schema evolution strategy across sprints
       - Create precise build sequence with minimal refactoring between sprints
       - Design explicit API contracts and interface boundaries at the beginning
       - Map features to specific architectural components with ownership boundaries
       - Incorporate systematic technical debt management with explicit remediation windows
       - Define clear architectural guardrails and patterns to ensure consistency
       - Plan for progressive enhancement with incremental capability delivery
    
    2. METHODICAL FEATURE SEQUENCING:
       - Decompose features into granular, implementation-ready technical tasks (4-8 hours each)
       - Sequence features based on both value delivery and technical dependencies
       - Establish critical path and identify parallel work streams for maximum efficiency
       - Group technically cohesive tasks to minimize context switching overhead
       - Identify specialized technical tasks requiring specific domain expertise
       - Map frontend-backend dependencies with explicit integration points
       - Structure database evolution and API implementation to support incremental feature development
       - Define clear feature flags strategy for safe, incremental deployment
       - Establish exact versioning strategy for APIs and data models
       - Create explicit integration strategy between components and services
    
    3. REALISTIC CAPACITY PLANNING:
       - Develop exactly 4 sprints of 14 calendar days each (10 working days)
       - Balance sprint workloads based on complexity and dependencies, not just time
       - Incorporate all technical foundation tasks (environment setup, CI/CD, testing frameworks) with exact time allocations
       - Allocate precise time for code reviews (30% of implementation time)
       - Reserve exactly 20% capacity per sprint for unexpected technical challenges
       - Schedule specific user feedback collection points after key feature deliveries
       - Create explicit integration and testing windows within each sprint
       - Include preparation work for upcoming sprints in each timeline
       - Define developer specialization requirements and knowledge transfer points
       - Account for complexity escalation in later sprints as the codebase grows
    
    4. IMPLEMENTATION-SPECIFIC TASK DEFINITION:
       - Define each task with explicit implementation patterns and technology-specific details
       - Include specific libraries, components, and services to use with version constraints
       - Provide exact technical acceptance criteria with testable outcomes
       - Estimate task complexity using Fibonacci scale (1, 2, 3, 5, 8, 13) with justification
       - Include framework-specific implementation patterns and architectural approaches
       - Specify exact configuration details, security requirements, and performance considerations
       - Define interface contracts and API specifications for each component
       - Include data model evolution and migration requirements where applicable
       - Specify exact testing strategy with coverage expectations for each component
       - Define specific documentation requirements for APIs and components
    
    5. AI-ACCELERATED DEVELOPMENT PLANNING:
       - Identify specific technical tasks where AI can provide maximum acceleration
       - Create detailed, highly effective prompting strategies tailored to each task type
       - Define exact context requirements the developer must provide to the AI
       - Establish validation and verification protocols for AI-generated code
       - Provide integration guidelines for combining AI-generated code with human-written components
       - Include AI-assisted refactoring strategies for evolving code
       - Define AI-powered testing strategies with specific test generation approaches
       - Create AI-accelerated documentation generation methods with precise inputs
       - Specify AI-assisted code review techniques to improve quality
       - Include AI pair-programming workflows for complex implementation tasks
    
    EXACT JSON STRUCTURE:
    {
      "sprintPlan": {
        "overview": {
          "projectName": "Exact project name from requirements",
          "duration": "Precise project timeline in weeks and days",
          "sprintStructure": "Detailed sprint cadence description",
          "teamComposition": {
            "requiredRoles": [
              {
                "role": "Specific technical role (e.g., 'Frontend Developer')",
                "responsibilities": ["Detailed technical responsibility 1", "Detailed technical responsibility 2"],
                "requiredSkills": ["Specific technical skill 1", "Specific technical skill 2"],
                "allocation": "Full-time/part-time with exact percentage"
              }
            ],
            "specializationRequirements": ["Any specialized knowledge areas required"]
          },
          "developmentMethodology": {
            "approach": "Specific methodology name and implementation approach",
            "ceremonies": [
              {
                "name": "Specific ceremony name",
                "frequency": "Exact timing and duration",
                "purpose": "Specific objective and outcomes",
                "participants": ["Required roles"]
              }
            ],
            "artifactManagement": ["Specific development artifacts and their management approach"]
          },
          "technicalArchitecture": {
            "overview": "Concise architecture description",
            "keyComponents": [
              {
                "name": "Specific component name",
                "purpose": "Technical purpose and responsibility",
                "technologies": ["Specific technologies used"],
                "interfaces": ["Key interfaces exposed"],
                "dependencies": ["Components this depends on"]
              }
            ],
            "dataModel": {
              "primaryEntities": ["Core data entities"],
              "relationships": ["Key entity relationships"],
              "evolutionStrategy": "How the data model will evolve across sprints"
            }
          },
          "keyTechnicalMilestones": [
            {
              "name": "Specific technical milestone with implementation details",
              "targetSprint": "Exact sprint number for completion",
              "dependencies": ["Specific prerequisite milestones"],
              "technicalSuccessCriteria": ["Precise technical verification methods"],
              "businessValue": "Specific value delivered to stakeholders"
            }
          ],
          "technicalRisks": [
            {
              "risk": "Detailed technical risk description with specific impact areas",
              "likelihood": "high/medium/low with justification",
              "impact": "Precise technical consequences if risk materializes",
              "mitigationStrategy": "Specific technical approach to prevent or minimize risk",
              "contingencyPlan": "Detailed technical alternative if primary approach fails",
              "earlyWarningIndicators": ["Specific signs that would indicate risk is materializing"],
              "ownerRole": "Technical role responsible for monitoring and addressing this risk"
            }
          ],
          "qualityAssurance": {
            "testingStrategy": "Overall approach to quality assurance",
            "automationApproach": "Specific test automation implementation",
            "coverageTargets": "Explicit code coverage goals with metrics",
            "performanceCriteria": "Specific performance requirements and testing approach"
          },
          "deploymentStrategy": {
            "pipeline": "Specific CI/CD implementation details",
            "environments": ["Development, staging, production specifications"],
            "releaseFrequency": "Planned deployment schedule",
            "rollbackProcedures": "Detailed recovery approach for failed deployments"
          }
        },
        "sprints": [
          {
            "sprintNumber": 1,
            "theme": "Focused technical objective of this sprint",
            "objectives": [
              "Extremely specific technical objective with measurable outcome",
              "Another specific technical objective with measurable outcome"
            ],
            "developmentFocus": {
              "frontend": "Precise frontend implementation focus with specific components and patterns",
              "backend": "Exact backend development focus with specific APIs and services",
              "database": "Specific database implementation work with schema details",
              "devops": "Explicit infrastructure and pipeline work to be completed"
            },
            "developerTasks": [
              {
                "id": "TASK-1.1", 
                "title": "Implement specific feature using specific technology",
                "feature": "Parent feature name from requirements",
                "type": "Exact task type (UI Component/API/Database Schema/Authentication/State Management)",
                "description": "Extraordinarily detailed technical task description including exact implementation approach",
                "complexity": 5,
                "complexityJustification": "Specific reasons for complexity assessment",
                "assignedTo": "Required technical role (not specific people)",
                "dependencies": ["Specific prerequisite tasks with exact IDs"],
                "acceptanceCriteria": [
                  "Extremely specific testable criteria with exact verification method",
                  "Another specific testable criteria with exact verification method"
                ],
                "implementation": {
                  "approach": "Step-by-step implementation strategy with architectural patterns",
                  "technologies": ["Specific technologies with versions"],
                  "libraries": ["Specific libraries with versions and purposes"],
                  "patterns": ["Design patterns to apply with justification"],
                  "interfaces": ["Interfaces to implement or consume"],
                  "dataStructures": ["Specific data structures with schemas"],
                  "apis": ["API endpoints to implement or consume"],
                  "securityConsiderations": ["Specific security requirements"],
                  "performanceConsiderations": ["Specific performance requirements"]
                },
                "estimatedHours": 8,
                "testingRequirements": {
                  "unitTests": "Specific unit test approach with coverage targets",
                  "integrationTests": "Specific integration test approach",
                  "automationStrategy": "How this task's implementation will be verified in automation"
                },
                "documentationRequirements": ["Specific documentation deliverables"]
              }
            ],
            "aiAssistedTasks": [
              {
                "id": "AI-TASK-1.1",
                "title": "Generate specific component or implementation using AI",
                "feature": "Parent feature name from requirements",
                "type": "Specific AI assistance type (Code Generation/API Design/Testing/Documentation/UI Implementation)",
                "description": "Extremely detailed description of what the AI should generate and how",
                "relatedDeveloperTask": "TASK-1.1",
                "promptStrategy": {
                  "promptTemplate": "Detailed and effective prompt template with placeholders",
                  "requiredPlaceholders": ["Specific values the developer must provide"],
                  "promptFormatting": "How to structure the prompt for best results",
                  "examplePrompt": "Complete example of an effective prompt for this task"
                },
                "requiredContextForAI": [
                  "Extremely specific technical context element the developer must provide",
                  "Another specific technical context element the developer must provide"
                ],
                "integrationApproach": {
                  "verificationSteps": ["Specific steps to verify AI output quality"],
                  "adaptationRequirements": ["Specific modifications typically needed after generation"],
                  "integrationSteps": ["Exact process to integrate with existing codebase"]
                },
                "successCriteria": [
                  "Extremely specific criteria for successful AI generation",
                  "Another specific criteria for successful AI generation"
                ],
                "potentialChallenges": ["Specific challenges the developer might face with AI generation"],
                "estimatedTimeSaving": 3,
                "timeSavingJustification": "Specific explanation of how this saves development time"
              }
            ],
            "technicalDebt": [
              {
                "description": "Extremely specific technical debt item with code areas affected",
                "rationale": "Precise technical reason for accepting this debt in this sprint",
                "impact": "Specific technical impact of this debt on the codebase",
                "remediationPlan": {
                  "approach": "Specific technical approach to address this debt",
                  "targetSprint": "Exact sprint when this will be addressed",
                  "estimatedEffort": "Hours required to address this debt",
                  "preventionStrategy": "How to prevent similar debt in future"
                }
              }
            ],
            "deliverables": [
              {
                "name": "Extremely specific deliverable name",
                "type": "Exact deliverable type (Code/API/Component/Configuration/Schema)",
                "description": "Detailed description of the deliverable",
                "technicalSpecification": "Precise technical details of implementation",
                "verificationMethod": "Specific approach to verify completeness and correctness",
                "componentName": "Exact name in the architecture where this fits",
                "downstreamDependencies": ["Specific components that depend on this deliverable"],
                "acceptanceCriteria": ["Specific criteria for accepting this deliverable"]
              }
            ],
            "integrationPoints": [
              {
                "components": ["Component A", "Component B"],
                "interfaceMethod": "Specific method of integration (API/Event/Shared Data)",
                "contractDefinition": "Specific definition of the integration contract",
                "integrationRisks": ["Specific risks in this integration"],
                "testingApproach": "Specific approach to test this integration"
              }
            ],
            "endOfSprintCriteria": ["Specific criteria that must be met to consider this sprint successful"]
          }
        ],
        "developerSprintPlan": {
          "sprint1": {
            "focus": "Extremely specific technical focus areas for developers",
            "keyDeliverables": ["Specific technical deliverables for human implementation"],
            "tasks": [
              {
                "id": "DEV-S1-T1",
                "title": "Implement specific feature using specific technology",
                "feature": "Parent feature name from requirements",
                "type": "Implementation type (UI/API/Database/Auth/etc.)",
                "description": "Extremely detailed implementation task with technical approach",
                "complexity": 5,
                "implementation": "Step-by-step implementation guidance with specific technical details",
                "acceptanceCriteria": ["Specific testable criteria for this implementation"],
                "estimatedHours": 8,
                "dependencies": ["Any prerequisite tasks"]
              }
            ]
          },
          "sprint2": {
            "focus": "Extremely specific technical focus areas for sprint 2",
            "keyDeliverables": ["Specific technical deliverables for human implementation"],
            "tasks": [/* Similar structure to sprint 1 */]
          },
          "sprint3": {
            "focus": "Extremely specific technical focus areas for sprint 3",
            "keyDeliverables": ["Specific technical deliverables for human implementation"],
            "tasks": [/* Similar structure to sprint 1 */]
          },
          "sprint4": {
            "focus": "Extremely specific technical focus areas for sprint 4",
            "keyDeliverables": ["Specific technical deliverables for human implementation"],
            "tasks": [/* Similar structure to sprint 1 */]
          }
      },
      "aiSprintPlan": {
          "sprint1": {
            "focus": "Extremely specific AI-assisted technical focus areas",
            "keyDeliverables": ["Specific technical deliverables for AI-accelerated implementation"],
            "tasks": [
              {
                "id": "AI-S1-T1",
                "title": "Generate specific component using AI",
                "feature": "Parent feature name from requirements",
                "type": "AI task type (Generation/Testing/Documentation/etc.)",
                "description": "Extremely detailed AI task description with technical specifications",
                "complexity": 3,
                "aiPrompt": "Specific detailed prompt template for this AI generation task",
                "acceptanceCriteria": ["Specific criteria for AI-generated output"],
                "estimatedHours": 2,
                "dependencies": ["Any prerequisite tasks"]
              }
            ]
          },
          "sprint2": {
            "focus": "Extremely specific AI-assisted technical focus areas for sprint 2",
            "keyDeliverables": ["Specific technical deliverables for AI-accelerated implementation"],
            "tasks": [/* Similar structure to sprint 1 */]
          },
          "sprint3": {
            "focus": "Extremely specific AI-assisted technical focus areas for sprint 3",
            "keyDeliverables": ["Specific technical deliverables for AI-accelerated implementation"],
            "tasks": [/* Similar structure to sprint 1 */]
          },
          "sprint4": {
            "focus": "Extremely specific AI-assisted technical focus areas for sprint 4",
            "keyDeliverables": ["Specific technical deliverables for AI-accelerated implementation"],
            "tasks": [/* Similar structure to sprint 1 */]
          }
        }
      }
    }
    
    CRITICAL QUALITY REQUIREMENTS:
    - Create an EXTRAORDINARILY DETAILED and IMMEDIATELY IMPLEMENTABLE sprint plan
    - Include PRECISE technical specifications that developers can act on without further clarification
    - Ensure all tasks are properly sequenced with explicit dependencies and integration points
    - Provide COMPREHENSIVE acceptance criteria for all deliverables
    - Ensure AI tasks have EXTREMELY EFFECTIVE prompt templates that will produce high-quality results
    - Create a balanced workload across sprints with realistic capacity planning
    - Include explicit technical debt management with clear remediation plans
    - Provide detailed testing and quality assurance specifications for all components
    - Ensure consistent naming conventions and task reference IDs throughout the plan
    - Consider the specific technologies in the tech stack when defining implementation approaches
    `;

    // Create a promise that rejects after a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Sprint plan generation timed out')), 120000); // 2 minutes timeout
    });

    // Race the API call against the timeout
    console.log('Sending sprint plan request to Gemini API');
    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more precise, factual output
          maxOutputTokens: 16384, // High token limit for the detailed sprint plan
        }
      }),
      timeoutPromise
    ]) as any;

    console.log('Sprint plan generation completed successfully');

    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract and repair the JSON
      let jsonString = extractJsonFromText(text);
      jsonString = repairJson(jsonString);
      
      // Parse the JSON
      const sprintPlan = JSON.parse(jsonString);
      
      // Validate we have the expected top-level keys
      if (!sprintPlan.sprintPlan || !sprintPlan.sprintPlan.developerSprintPlan || !sprintPlan.sprintPlan.aiSprintPlan) {
        console.error('Invalid sprint plan structure received');
        throw new Error('Invalid sprint plan structure');
      }
      
      // Process the sprint plans
      const processedSprintPlan = await processSprintPlan(sprintPlan.sprintPlan, coreFeatures, suggestedFeatures);
      
      return processedSprintPlan;
    } catch (error) {
      console.error("Error processing sprint plan JSON:", error);
      throw new Error('Failed to generate valid sprint plan');
    }
  } catch (error) {
    console.error("Error generating sprint plan:", error);
    throw new Error('Sprint plan generation failed: ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * Processes the generated sprint plan to enhance it with additional data and structure.
 */
async function processSprintPlan(sprintPlan: any, coreFeatures: any[], suggestedFeatures: any[]) {
  try {
    const allFeatures = [...coreFeatures, ...suggestedFeatures];
    
    // Process developer sprint plan
    const devSprint1 = processSprintTasks(sprintPlan.developerSprintPlan.sprint1, 1, "developer", allFeatures);
    const devSprint2 = processSprintTasks(sprintPlan.developerSprintPlan.sprint2, 2, "developer", allFeatures);
    const devSprint3 = processSprintTasks(sprintPlan.developerSprintPlan.sprint3, 3, "developer", allFeatures);
    const devSprint4 = processSprintTasks(sprintPlan.developerSprintPlan.sprint4, 4, "developer", allFeatures);
    
    // Process AI sprint plan
    const aiSprint1 = processSprintTasks(sprintPlan.aiSprintPlan.sprint1, 1, "ai", allFeatures);
    const aiSprint2 = processSprintTasks(sprintPlan.aiSprintPlan.sprint2, 2, "ai", allFeatures);
    const aiSprint3 = processSprintTasks(sprintPlan.aiSprintPlan.sprint3, 3, "ai", allFeatures);
    const aiSprint4 = processSprintTasks(sprintPlan.aiSprintPlan.sprint4, 4, "ai", allFeatures);
    
    // Define the task types array for standard tasks
    const frontendTypes = ["frontend", "ui", "component", "design"];
    const backendTypes = ["backend", "api", "database", "server"];
    const devOpsTypes = ["devops", "testing", "deployment", "infrastructure"];
    
    // Create standard tasks for each sprint and merge them with the generated tasks
    const standardDevTasks1 = createStandardTasks(0, frontendTypes, "developer");
    const standardDevTasks2 = createStandardTasks(1, backendTypes, "developer");
    const standardDevTasks3 = createStandardTasks(2, devOpsTypes, "developer");
    const standardDevTasks4 = createStandardTasks(3, frontendTypes, "developer");
    
    const standardAiTasks1 = createStandardTasks(0, frontendTypes, "ai");
    const standardAiTasks2 = createStandardTasks(1, backendTypes, "ai");
    const standardAiTasks3 = createStandardTasks(2, devOpsTypes, "ai");
    const standardAiTasks4 = createStandardTasks(3, frontendTypes, "ai");
    
    // Merge the generated tasks with the standard tasks
    const devSprint1Tasks = mergeTaskLists(devSprint1.tasks, standardDevTasks1);
    const devSprint2Tasks = mergeTaskLists(devSprint2.tasks, standardDevTasks2);
    const devSprint3Tasks = mergeTaskLists(devSprint3.tasks, standardDevTasks3);
    const devSprint4Tasks = mergeTaskLists(devSprint4.tasks, standardDevTasks4);
    
    const aiSprint1Tasks = mergeTaskLists(aiSprint1.tasks, standardAiTasks1);
    const aiSprint2Tasks = mergeTaskLists(aiSprint2.tasks, standardAiTasks2);
    const aiSprint3Tasks = mergeTaskLists(aiSprint3.tasks, standardAiTasks3);
    const aiSprint4Tasks = mergeTaskLists(aiSprint4.tasks, standardAiTasks4);
    
    // Enhance the sprint data with names and additional info
    const enhancedDevSprint1 = { ...devSprint1, tasks: devSprint1Tasks, name: "Sprint 1", sprintNumber: 1, duration: "2 weeks" };
    const enhancedDevSprint2 = { ...devSprint2, tasks: devSprint2Tasks, name: "Sprint 2", sprintNumber: 2, duration: "2 weeks" };
    const enhancedDevSprint3 = { ...devSprint3, tasks: devSprint3Tasks, name: "Sprint 3", sprintNumber: 3, duration: "2 weeks" };
    const enhancedDevSprint4 = { ...devSprint4, tasks: devSprint4Tasks, name: "Sprint 4", sprintNumber: 4, duration: "2 weeks" };
    
    const enhancedAiSprint1 = { ...aiSprint1, tasks: aiSprint1Tasks, name: "Sprint 1", sprintNumber: 1, duration: "2 weeks" };
    const enhancedAiSprint2 = { ...aiSprint2, tasks: aiSprint2Tasks, name: "Sprint 2", sprintNumber: 2, duration: "2 weeks" };
    const enhancedAiSprint3 = { ...aiSprint3, tasks: aiSprint3Tasks, name: "Sprint 3", sprintNumber: 3, duration: "2 weeks" };
    const enhancedAiSprint4 = { ...aiSprint4, tasks: aiSprint4Tasks, name: "Sprint 4", sprintNumber: 4, duration: "2 weeks" };
    
    // Transform the structure to match what SprintPlanView component expects:
    // Instead of individual sprint properties, create arrays of sprints
    const processedSprintPlan = {
      developerSprintPlan: {
        sprints: [
          enhancedDevSprint1,
          enhancedDevSprint2,
          enhancedDevSprint3, 
          enhancedDevSprint4
        ],
        // Preserve any other top-level properties
        ...Object.keys(sprintPlan.developerSprintPlan)
          .filter(key => !key.startsWith('sprint'))
          .reduce<Record<string, any>>((obj, key) => {
            obj[key] = sprintPlan.developerSprintPlan[key];
            return obj;
          }, {})
      },
      aiSprintPlan: {
        sprints: [
          enhancedAiSprint1,
          enhancedAiSprint2,
          enhancedAiSprint3,
          enhancedAiSprint4
        ],
        // Preserve any other top-level properties
        ...Object.keys(sprintPlan.aiSprintPlan)
          .filter(key => !key.startsWith('sprint'))
          .reduce<Record<string, any>>((obj, key) => {
            obj[key] = sprintPlan.aiSprintPlan[key];
            return obj;
          }, {})
      },
      // Preserve any other top-level properties from the original plan
      ...Object.keys(sprintPlan)
        .filter(key => key !== 'developerSprintPlan' && key !== 'aiSprintPlan')
        .reduce<Record<string, any>>((obj, key) => {
          obj[key] = sprintPlan[key];
          return obj;
        }, {})
    };
    
    console.log('Processed sprint plan with array structure:', {
      devSprintsCount: processedSprintPlan.developerSprintPlan.sprints.length,
      aiSprintsCount: processedSprintPlan.aiSprintPlan.sprints.length
    });
    
    return processedSprintPlan;
  } catch (error: unknown) {
    console.error("Error processing sprint plan:", error);
    throw error;
  }
}

/**
 * Processes the tasks for a single sprint, enhancing them with additional data.
 */
function processSprintTasks(sprint: any, sprintIndex: number, type: 'developer' | 'ai', allFeatures: any[]) {
  if (!sprint || !sprint.tasks) {
    // Return a default sprint structure if the sprint or tasks are missing
    return {
      focus: `Sprint ${sprintIndex} focus`,
      keyDeliverables: [`Sprint ${sprintIndex} deliverables`],
      tasks: []
    };
  }
  
  // Map over the tasks and enhance them
  const enhancedTasks = sprint.tasks.map((task: any, taskIndex: number) => {
    const featureName = task.feature;
    const feature = allFeatures.find((f: any) => f.name === featureName);
    
    return {
      ...task,
      // If the task doesn't have an id, create one
      id: task.id || `${type.toUpperCase()}-${sprintIndex}.${Math.floor(Math.random() * 1000)}`,
      // Create a feature-specific task if we found a matching feature
      ...(feature ? createFeatureTask(feature, taskIndex, sprintIndex, type) : {})
    };
  });
  
  return {
    ...sprint,
    tasks: enhancedTasks
  };
} 