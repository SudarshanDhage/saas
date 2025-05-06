import { createFeatureTask, mergeTaskLists, createStandardTasks } from './sprint-models';

/**
 * Enhances a basic sprint plan with additional content
 */
export function enhanceSprintPlan(partialPlan: any, projectData: any, allFeatures: any[]) {
  console.log('Enhancing partial sprint plan');
  
  // Check if we have a valid partial plan to enhance
  const hasValidDevSprints = partialPlan?.developerSprintPlan?.sprints && 
    Array.isArray(partialPlan.developerSprintPlan.sprints) &&
    partialPlan.developerSprintPlan.sprints.length > 0;
    
  const hasValidAiSprints = partialPlan?.aiSprintPlan?.sprints && 
    Array.isArray(partialPlan.aiSprintPlan.sprints) &&
    partialPlan.aiSprintPlan.sprints.length > 0;
  
  // If both developer and AI sprints are already valid (but potentially missing features),
  // we'll augment them with additional content
  if (hasValidDevSprints && hasValidAiSprints) {
    return augmentExistingPlan(partialPlan, allFeatures);
  }
  
  // Otherwise, we'll create a new comprehensive plan
  return createComprehensiveSprintPlan(projectData, allFeatures);
}

/**
 * Augments an existing sprint plan with additional features that might be missing
 */
function augmentExistingPlan(partialPlan: any, allFeatures: any[]) {
  console.log('Augmenting existing sprint plan');
  
  const devSprints = partialPlan.developerSprintPlan.sprints;
  const aiSprints = partialPlan.aiSprintPlan.sprints;
  
  // Extract all features that are already covered in the plan
  const devTasks = devSprints.flatMap((sprint: any) => sprint.tasks || []);
  const aiTasks = aiSprints.flatMap((sprint: any) => sprint.tasks || []);
  
  const devFeatureText = devTasks
    .map((task: any) => `${task.feature || ''} ${task.title || ''} ${task.description || ''}`)
    .join(' ').toLowerCase();
    
  const aiFeatureText = aiTasks
    .map((task: any) => `${task.feature || ''} ${task.title || ''} ${task.description || ''}`)
    .join(' ').toLowerCase();
  
  // Find features that aren't covered yet
  const missingFeatures = allFeatures.filter(feature => {
    const name = feature.name.toLowerCase();
    return !devFeatureText.includes(name) || !aiFeatureText.includes(name);
  });
  
  console.log(`Found ${missingFeatures.length} features not fully covered in the plan`);
  
  if (missingFeatures.length === 0) {
    // If all features are covered, just return the original plan
    return partialPlan;
  }
  
  // Create new tasks for missing features
  const newDevTasks = missingFeatures.map((feature, index) => 
    createFeatureTask(feature, index, 0, 'dev')
  );
  
  const newAiTasks = missingFeatures.map((feature, index) => 
    createFeatureTask(feature, index, 0, 'ai')
  );
  
  // Check if we need to create additional sprints for the missing features
  // Aim for maximum 6-8 tasks per sprint for better manageability
  const maxTasksPerSprint = 6;
  
  // For developer sprints
  if (newDevTasks.length > 0) {
    // Distribute tasks across existing sprints first if they have capacity
    let remainingDevTasks = [...newDevTasks];
    
    for (const sprint of devSprints) {
      const currentTaskCount = sprint.tasks?.length || 0;
      const availableSlots = maxTasksPerSprint - currentTaskCount;
      
      if (availableSlots > 0 && remainingDevTasks.length > 0) {
        const tasksToAdd = remainingDevTasks.slice(0, availableSlots);
        remainingDevTasks = remainingDevTasks.slice(availableSlots);
        
        sprint.tasks = [...(sprint.tasks || []), ...tasksToAdd];
      }
    }
    
    // If we still have tasks remaining, create new sprints as needed
    while (remainingDevTasks.length > 0) {
      const sprintNumber = devSprints.length + 1;
      const tasksForSprint = remainingDevTasks.slice(0, maxTasksPerSprint);
      remainingDevTasks = remainingDevTasks.slice(maxTasksPerSprint);
      
      devSprints.push({
        name: `Sprint ${sprintNumber}: Additional Features`,
        duration: "2 weeks",
        focus: "Implementing remaining features and enhancements",
        tasks: tasksForSprint
      });
    }
  }
  
  // For AI sprints - do the same process
  if (newAiTasks.length > 0) {
    let remainingAiTasks = [...newAiTasks];
    
    for (const sprint of aiSprints) {
      const currentTaskCount = sprint.tasks?.length || 0;
      const availableSlots = maxTasksPerSprint - currentTaskCount;
      
      if (availableSlots > 0 && remainingAiTasks.length > 0) {
        const tasksToAdd = remainingAiTasks.slice(0, availableSlots);
        remainingAiTasks = remainingAiTasks.slice(availableSlots);
        
        sprint.tasks = [...(sprint.tasks || []), ...tasksToAdd];
      }
    }
    
    while (remainingAiTasks.length > 0) {
      const sprintNumber = aiSprints.length + 1;
      const tasksForSprint = remainingAiTasks.slice(0, maxTasksPerSprint);
      remainingAiTasks = remainingAiTasks.slice(maxTasksPerSprint);
      
      aiSprints.push({
        name: `Sprint ${sprintNumber}: Additional Features`,
        duration: "2 weeks",
        focus: "Implementing remaining features and AI-assisted development",
        tasks: tasksForSprint
      });
    }
  }
  
  return {
    developerSprintPlan: {
      sprints: devSprints
    },
    aiSprintPlan: {
      sprints: aiSprints
    }
  };
}

/**
 * Creates a comprehensive sprint plan from scratch based on the project's needs
 */
export function createComprehensiveSprintPlan(projectData: any, allFeatures: any[]) {
  console.log('Creating comprehensive sprint plan from scratch');
  
  // Determine the optimal number of sprints based on feature count
  // Instead of a fixed number, adapt to the complexity of the project
  const featureCount = allFeatures.length;
  
  // Guidelines for sprint planning:
  // - Target 5-7 tasks per sprint for optimal team performance
  // - Setup/infrastructure sprint is always needed
  // - Final sprint for testing/deployment is always needed
  // - Middle sprints should focus on core implementation
  
  // Calculate how many implementation sprints we need beyond setup and finishing sprints
  const tasksPerSprint = 6; // Target 6 tasks per sprint
  const baseSprintCount = 2; // Setup sprint + Finishing sprint
  
  // Estimate the number of tasks based on feature count
  // Each feature typically requires 1-3 tasks based on complexity
  const estimatedTaskCount = featureCount * 1.5; // Average 1.5 tasks per feature
  
  // Calculate implementation sprints needed
  const implementationSprintCount = Math.ceil(estimatedTaskCount / tasksPerSprint);
  
  // Total sprint count (minimum 3 sprints, maximum based on features)
  const totalSprintCount = Math.max(3, baseSprintCount + implementationSprintCount);
  
  console.log(`Planning for ${totalSprintCount} sprints based on ${featureCount} features`);
  
  // Create basic sprint structures
  const devSprints = createBasicSprints(totalSprintCount, 'dev');
  const aiSprints = createBasicSprints(totalSprintCount, 'ai');
  
  // Distribute features across the sprints
  distributeFeatures(devSprints, allFeatures, 'dev');
  distributeFeatures(aiSprints, allFeatures, 'ai');
  
  // Add standard tasks to each sprint
  addStandardTasks(devSprints, projectData, 'dev');
  addStandardTasks(aiSprints, projectData, 'ai');
  
  return {
    developerSprintPlan: {
      sprints: devSprints
    },
    aiSprintPlan: {
      sprints: aiSprints
    }
  };
}

/**
 * Creates basic sprint structures based on the determined sprint count
 */
export function createBasicSprints(sprintCount: number, sprintType: 'dev' | 'ai') {
  const sprints = [];
  
  // Always have a setup sprint
  sprints.push({
    name: `Sprint 1: ${sprintType === 'dev' ? 'Project Setup and Foundation' : 'Initial Setup and Environment Configuration'}`,
    duration: "2 weeks",
    focus: `${sprintType === 'dev' ? 'Setting up the development environment and core infrastructure' : 'Establishing the project foundation with AI assistance'}`,
    tasks: []
  });
  
  // Middle implementation sprints
  for (let i = 1; i < sprintCount - 1; i++) {
    sprints.push({
      name: `Sprint ${i + 1}: ${sprintType === 'dev' ? `Core Implementation Phase ${i}` : `Feature Development Phase ${i}`}`,
      duration: "2 weeks",
      focus: `${sprintType === 'dev' 
        ? `Implementing key features and functionality for the project` 
        : `Building primary features with AI-assisted development`}`,
      tasks: []
    });
  }
  
  // Always have a finishing sprint
  sprints.push({
    name: `Sprint ${sprintCount}: ${sprintType === 'dev' ? 'Testing, Refinement, and Deployment' : 'Final Integration and Deployment'}`,
    duration: "2 weeks",
    focus: `${sprintType === 'dev' 
      ? 'Finalizing, testing, and preparing the project for deployment' 
      : 'Final testing, integration, and deployment with AI assistance'}`,
    tasks: []
  });
  
  return sprints;
}

/**
 * Distributes features across sprints intelligently
 */
function distributeFeatures(sprints: any[], features: any[], sprintType: 'dev' | 'ai') {
  if (features.length === 0 || sprints.length === 0) return;
  
  // First pass: categorize features by complexity
  const complexityMap: Record<string, number> = {};
  
  features.forEach(feature => {
    // Estimate complexity based on description length and keyword analysis
    const description = feature.description || '';
    const name = feature.name || '';
    
    // Keywords that suggest complexity
    const complexityKeywords = [
      'authentication', 'authorization', 'scalable', 'real-time', 'sync',
      'complex', 'difficult', 'challenging', 'subscription', 'payment',
      'integration', 'third-party', 'analytics', 'performance', 'optimization',
      'security'
    ];
    
    const nameAndDesc = `${name} ${description}`.toLowerCase();
    const keywordMatches = complexityKeywords.filter(keyword => 
      nameAndDesc.includes(keyword)
    ).length;
    
    const descriptionLength = description.length;
    
    // Calculate a complexity score (0-10)
    let complexityScore = Math.min(10, Math.floor(descriptionLength / 50) + keywordMatches);
    
    // Store the complexity score
    complexityMap[feature.id] = complexityScore;
  });
  
  // Sort features by complexity (highest first)
  const sortedFeatures = [...features].sort((a, b) => 
    (complexityMap[b.id] || 0) - (complexityMap[a.id] || 0)
  );
  
  // Distribution strategy:
  // 1. Complex features go into earlier sprints (after setup)
  // 2. Medium complexity features go into middle sprints
  // 3. Simpler features go into later sprints
  const implementationSprints = sprints.slice(1, -1); // Exclude setup and finishing sprints
  
  // If we have enough implementation sprints, categorize features
  if (implementationSprints.length > 0) {
    const featureGroups = [];
    const groupCount = Math.min(implementationSprints.length, 3); // Max 3 groups
    
    // Split sorted features into groups
    const featuresPerGroup = Math.ceil(sortedFeatures.length / groupCount);
    
    for (let i = 0; i < groupCount; i++) {
      const startIdx = i * featuresPerGroup;
      const endIdx = Math.min(startIdx + featuresPerGroup, sortedFeatures.length);
      featureGroups.push(sortedFeatures.slice(startIdx, endIdx));
    }
    
    // Distribute feature groups across implementation sprints
    const sprintsPerGroup = Math.ceil(implementationSprints.length / groupCount);
    
    for (let i = 0; i < groupCount; i++) {
      const startSprintIdx = i * sprintsPerGroup;
      const endSprintIdx = Math.min(startSprintIdx + sprintsPerGroup, implementationSprints.length);
      const targetSprints = implementationSprints.slice(startSprintIdx, endSprintIdx);
      
      if (targetSprints.length === 0) continue;
      
      // Distribute features across these sprints
      const features = featureGroups[i] || [];
      const featuresPerSprint = Math.ceil(features.length / targetSprints.length);
      
      for (let j = 0; j < targetSprints.length; j++) {
        const startFeatureIdx = j * featuresPerSprint;
        const endFeatureIdx = Math.min(startFeatureIdx + featuresPerSprint, features.length);
        const targetFeatures = features.slice(startFeatureIdx, endFeatureIdx);
        
        // Create tasks for these features
        targetSprints[j].tasks = [
          ...(targetSprints[j].tasks || []),
          ...targetFeatures.map((feature, idx) => 
            createFeatureTask(feature, idx, j, sprintType)
          )
        ];
      }
    }
  } else {
    // If we only have setup and finishing sprints, put most features in the setup sprint
    const setupSprint = sprints[0];
    const finishingSprint = sprints[sprints.length - 1];
    
    // 80% to setup, 20% to finishing
    const splitIndex = Math.floor(sortedFeatures.length * 0.8);
    const setupFeatures = sortedFeatures.slice(0, splitIndex);
    const finishingFeatures = sortedFeatures.slice(splitIndex);
    
    setupSprint.tasks = [
      ...(setupSprint.tasks || []),
      ...setupFeatures.map((feature, idx) => 
        createFeatureTask(feature, idx, 0, sprintType)
      )
    ];
    
    finishingSprint.tasks = [
      ...(finishingSprint.tasks || []),
      ...finishingFeatures.map((feature, idx) => 
        createFeatureTask(feature, idx, sprints.length - 1, sprintType)
      )
    ];
  }
}

/**
 * Adds missing features to existing sprints
 */
function addMissingFeaturesToSprints(sprints: any[], features: any[], type: string): any[] {
  // Extract all existing task texts to check for feature coverage
  const allTaskText = sprints.flatMap((sprint: any) => 
    (sprint.tasks || []).map((task: any) => 
      `${task.feature || ''} ${task.title || ''} ${task.description || ''}`
    )
  ).join(' ').toLowerCase();
  
  // Find features that aren't covered
  const missingFeatures = features.filter(feature => 
    !allTaskText.includes(feature.name.toLowerCase())
  );
  
  // If no missing features, return the sprints unchanged
  if (missingFeatures.length === 0) {
    return sprints;
  }
  
  console.log(`Adding ${missingFeatures.length} missing features to sprints`);
  
  // Distribute missing features across later sprints (core in earlier, advanced in later)
  const updatedSprints = [...sprints];
  
  missingFeatures.forEach((feature, index) => {
    // Determine which sprint to add this feature to
    // Core features go to sprint 2, others to later sprints
    const targetSprintIndex = Math.min(
      1 + (index % (updatedSprints.length - 1)), 
      updatedSprints.length - 1
    );
    
    // Create a task for this feature
    const newTask = createFeatureTask(feature, updatedSprints[targetSprintIndex].tasks.length, targetSprintIndex, type);
    
    // Add the task to the sprint
    updatedSprints[targetSprintIndex].tasks.push(newTask);
  });
  
  return updatedSprints;
}

/**
 * Adds standard tasks to each sprint
 */
function addStandardTasks(sprints: any[], projectData: any, sprintType: string) {
  sprints.forEach((sprint, index) => {
    // Define task types based on sprint index
    const taskTypes = index === 0 ? 
      ['setup', 'configuration', 'infrastructure'] : 
      (index === sprints.length - 1 ? 
        ['testing', 'documentation', 'deployment'] : 
        ['feature', 'implementation', 'integration']);
    
    // Add standard tasks using existing helper
    const standardTasks = createStandardTasks(index, taskTypes, sprintType);
    
    // Add these tasks to the beginning of the sprint's tasks
    sprint.tasks = [...standardTasks, ...(sprint.tasks || [])];
  });
} 