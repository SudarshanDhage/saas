import { model } from './client';
import { extractJsonFromText, repairJson } from './json-utils';

/**
 * Generates a comprehensive cost estimation for infrastructure and operations
 * based on the project requirements and tech stack.
 * 
 * The estimation includes scaling considerations at different user levels,
 * but does NOT include developer or personnel costs.
 */
export async function generateCostEstimation(projectData: any) {
  try {
    console.log('Starting cost estimation generation with Gemini API');
    
    // Extract the tech stack information
    const techStack = projectData?.techStack || {};
    
    // Extract features to understand infrastructure requirements
    const coreFeatures = projectData?.coreFeatures || [];
    const suggestedFeatures = projectData?.suggestedFeatures || [];
    const allFeatures = [...coreFeatures, ...suggestedFeatures];
    
    // Prepare a features list for the prompt
    const featuresList = allFeatures.map(feature => 
      `- ${feature.name}: ${feature.description}`
    ).join('\n');
    
    const prompt = `
    You are a distinguished DevOps architect and cloud financial analyst with 20+ years of experience in enterprise infrastructure design, cloud migration, and cost optimization at scale. You have successfully led infrastructure planning for Fortune 500 companies and high-growth startups across diverse industry verticals. Your expertise includes granular resource allocation, service-tier optimization, and implementation of advanced cost-efficiency patterns using modern cloud-native architectures.
    
    Create an extraordinarily detailed, implementation-ready infrastructure cost estimation document with exceptional precision and actionable specifications that can be immediately translated into a deployment plan.
    
    PROJECT CONTEXT:
    ${JSON.stringify(projectData, null, 2)}
    
    TECHNOLOGY STACK:
    ${JSON.stringify(techStack, null, 2)}
    
    INFRASTRUCTURE-IMPACTING FEATURES:
    ${featuresList}
    
    COMPREHENSIVE TECHNICAL COST ANALYSIS REQUIREMENTS:
    
    1. ADVANCED ARCHITECTURAL INFRASTRUCTURE ANALYSIS:
       - Conduct microservice-level resource mapping with precise infrastructure components required
       - Define exact compute, memory, storage, and networking specifications for each application component
       - Calculate precise request/response patterns with data processing workloads and throughput requirements
       - Map each feature to specific infrastructure services with implementation details
       - Model peak load characteristics with exact concurrency requirements
       - Determine resource utilization factors for CPU, memory, I/O, and network bandwidth with hourly/daily patterns
       - Analyze data locality requirements and regional distribution needs
       - Evaluate stateful vs. stateless components and their infrastructure implications
       - Model API request volumes and processing requirements
       - Calculate database transaction volumes, query patterns, and storage growth rates
    
    2. PRECISION COST MODELING WITH MARKET ACCURACY:
       - Generate comprehensive, market-accurate costs in Indian Rupees (₹) using current pricing
       - Include both one-time setup costs and recurring operational expenses
       - Develop multi-dimensional cost models for three distinct tiers with exact resource specifications:
         * STARTUP TIER: 0-1,000 concurrent users, 0-100K monthly active users, 0-500K monthly page views
         * GROWTH TIER: 1,000-10,000 concurrent users, 100K-1M monthly active users, 500K-5M monthly page views
         * SCALE TIER: 10,000+ concurrent users, 1M+ monthly active users, 5M+ monthly page views
       - For each tier, provide exact service names, instance types, resource configurations, and usage parameters
       - Include all infrastructure costs with precise specifications:
         * Compute: Exact instance types, vCPU count, memory allocation, provisioned capacity
         * Storage: Volume types, IOPS requirements, throughput specifications, retention periods
         * Database: Instance types, storage allocation, read/write capacity, replication configuration
         * Networking: Data transfer volumes, bandwidth requirements, VPC configuration, inter-service communication
         * CDN: Request volumes, cache hit ratios, data transfer expectations, edge location requirements
         * Security: WAF rules, vulnerability scanning frequency, security monitoring depth
       - Add detailed operational tooling costs with service tiers:
         * CI/CD: Build minutes, artifacts storage, deployment frequency, pipeline complexity
         * Monitoring: Metrics collection frequency, data retention, dashboard requirements
         * Logging: Log volume estimates, indexing requirements, retention policies
         * Alerting: Notification channels, integration complexity
       - Calculate third-party service expenses with exact usage tiers:
         * Authentication: Monthly active users, authentication operations per session
         * Email/SMS: Message volumes, delivery requirements, template complexity
         * Payment Processing: Transaction volumes, fee structures, integration complexity
         * APIs: Request volumes, data transfer sizes, rate limits, caching requirements
       - Include comprehensive provisioning for high availability:
         * Redundancy: Multi-AZ/multi-region deployment specifications
         * Backup: Frequency, retention periods, storage requirements
         * Disaster Recovery: RPO/RTO targets, failover mechanisms, cross-region capabilities
    
    3. IMPLEMENTATION-READY INFRASTRUCTURE SPECIFICATIONS:
       - Provide deployment-ready specifications for each service:
         * Exact service tiers with specific instance types (e.g., "AWS t4g.medium with 2vCPU, 4GB RAM, 8GB GP3 storage")
         * Complete resource requirements with numerically precise values
         * Exact request/processing limits with quantitative metrics
         * Data transfer allowances with bandwidth calculations
         * Storage specifications with IOPS and throughput guarantees
       - Include cloud provider region selection rationale with pricing differentials
       - Specify deployment architecture with high-fidelity diagrams in ASCII/text format
       - Document exact service limits and thresholds for each scaling tier
       - Include infrastructure-as-code configuration snippets where appropriate
       - Determine exact capacity planning thresholds with trigger points for scaling
       - Specify deployment topology with exact network configuration
       - Document multi-environment architecture with environment-specific optimizations
    
    4. ADVANCED COST OPTIMIZATION ENGINEERING:
       - Develop implementation-ready architectural optimization strategies with exact configuration details
       - Create resource rightsizing recommendations with specific instance type migrations
       - Define auto-scaling configurations with precise triggers, thresholds, and cooldown periods
       - Design cost-effective storage tiering strategies with lifecycle policies
       - Implement multi-level caching architectures with hit rate projections and cost impact
       - Design serverless/consumption-based alternatives with exact pricing comparisons and breakeven analysis
       - Calculate reservation/commitment discount strategies with ROI analysis and cashflow projections
       - Implement data transfer optimization techniques with bandwidth reduction estimates
       - Design multi-region traffic distribution models to optimize for cost and performance
       - Create resource scheduling recommendations for non-production environments
    
    CRITICAL IMPLEMENTATION REQUIREMENTS:
    1. EXCLUDE all developer/personnel costs - focus EXCLUSIVELY on infrastructure and third-party services
    2. Present all costs in Indian Rupees (₹) using current market rates with service-specific precision
    3. Include extraordinarily detailed breakdowns with line-item specificity for each service component
    4. Specify exact service tiers, instance types, and resource allocations with implementation-ready detail
    5. Provide complete multi-environment cost models (development, staging, production) with environment-specific optimizations
    6. Document all underlying assumptions with quantitative metrics and calculation methodologies
    7. Separate one-time setup/deployment costs from recurring operational expenses
    8. Consider reserved instance/commitment pricing options with ROI calculations
    9. Include cost impact of high availability, fault tolerance, and disaster recovery provisions
    10. Provide month-by-month cost projections for the first year of operation
    
    EXACT JSON STRUCTURE:
    {
      "overview": {
        "summary": "Extraordinarily detailed technical summary focusing on infrastructure architecture, implementation approach, and key cost drivers",
        "totalCostSmallScale": {
          "setupCost": "₹X,XXX one-time for initial deployment and configuration",
          "monthlyCost": "₹X,XXX/month for startup tier (0-1,000 concurrent users)",
          "annualCost": "₹XXX,XXX/year including reserved instances and commitments"
        },
        "totalCostMediumScale": {
          "setupCost": "₹XX,XXX one-time for infrastructure expansion and optimization",
          "monthlyCost": "₹XX,XXX/month for growth tier (1,000-10,000 concurrent users)",
          "annualCost": "₹X,XXX,XXX/year including reserved instances and commitments"
        },
        "totalCostLargeScale": {
          "setupCost": "₹XXX,XXX one-time for enterprise-grade infrastructure implementation",
          "monthlyCost": "₹XXX,XXX/month for scale tier (10,000+ concurrent users)",
          "annualCost": "₹XX,XXX,XXX/year including reserved instances and commitments"
        },
        "majorCostDrivers": [
          {
            "component": "Specific infrastructure component",
            "percentage": "XX.X% of total cost",
            "rationale": "Precise technical explanation of why this component drives significant cost",
            "optimizationPotential": "Specific optimization opportunities with expected savings"
          }
        ],
        "technicalAssumptions": [
          {
            "category": "Technical area (traffic, storage, processing, etc.)",
            "assumption": "Precise technical assumption with quantitative metrics",
            "impact": "How this assumption affects the cost model",
            "variabilityFactor": "How changes in this assumption would affect costs (+X% per unit change)"
          }
        ]
      },
      "costCategories": [
        {
          "name": "Compute Infrastructure",
          "description": "Servers, containers, serverless functions, and compute-related services",
          "smallScale": {
            "cost": {
              "setup": "₹X,XXX one-time",
              "monthly": "₹X,XXX/month",
              "annual": "₹XX,XXX/year"
            },
            "breakdown": [
              {
                "service": "Exact service name and specific tier (e.g., 'AWS EC2 t4g.medium')",
                "specification": {
                  "instanceType": "Precise instance type specification",
                  "cpu": "X vCPUs at X.X GHz",
                  "memory": "X GB RAM",
                  "storage": "X GB storage with specifications",
                  "network": "X Gbps network throughput"
                },
                "quantity": "Exact number of instances/units with scaling parameters",
                "unitCost": {
                  "onDemand": "₹X,XXX per instance/unit per month",
                  "reserved1Year": "₹X,XXX per instance/unit per month (X% savings)",
                  "reserved3Year": "₹X,XXX per instance/unit per month (X% savings)"
                },
                "selectedPricing": "on-demand/reserved with justification",
                "monthlyHours": "XXX estimated running hours per month",
                "monthlyCost": "₹X,XXX/month",
                "setupCost": "₹X,XXX one-time for initial deployment and configuration",
                "implementation": {
                  "deployment": "Specific deployment methodology",
                  "scaling": "Auto-scaling configuration with exact triggers and thresholds",
                  "monitoring": "Implementation-specific monitoring approach",
                  "maintenance": "Operational maintenance requirements"
                },
                "alternatives": [
                  {
                    "service": "Alternative service option with exact specification",
                    "monthlyCost": "₹X,XXX/month",
                    "setupCost": "₹X,XXX one-time",
                    "technicalTradeoffs": "Precise technical implications including performance, scalability, and operational considerations",
                    "implementationComplexity": "low/medium/high with specific technical considerations"
                  }
                ]
              }
            ],
            "architecture": "Detailed technical explanation of the specific architecture at this scale with implementation details",
            "performance": "Expected performance characteristics with quantitative metrics",
            "limitations": "Technical limitations and constraint considerations",
            "optimizations": "Scale-specific optimization techniques with implementation details"
          },
          "mediumScale": {
            "cost": {
              "setup": "₹XX,XXX one-time for upgrade and expansion",
              "monthly": "₹XX,XXX/month",
              "annual": "₹XXX,XXX/year with reserved instances"
            },
            "breakdown": [ 
              { /*... similar structure as smallScale with appropriate values ...*/ }
            ],
            "architecturalChanges": "Comprehensive explanation of specific architecture modifications required at this tier",
            "scalingStrategy": "Detailed implementation of specific scaling approach with exact metrics and thresholds",
            "performance": "Expected performance characteristics with quantitative metrics",
            "limitations": "Technical limitations and constraint considerations",
            "optimizations": "Scale-specific optimization techniques with implementation details"
          },
          "largeScale": {
            "cost": {
              "setup": "₹XXX,XXX one-time for enterprise implementation",
              "monthly": "₹XXX,XXX/month",
              "annual": "₹X,XXX,XXX/year with reserved instances"
            },
            "breakdown": [ 
              { /*... similar structure as smallScale with appropriate values ...*/ }
            ],
            "architecturalChanges": "Enterprise-grade architecture modifications with specific implementation details",
            "scalingStrategy": "Advanced horizontal/vertical scaling approach with exact metrics and thresholds",
            "performance": "Expected performance characteristics with quantitative metrics",
            "limitations": "Technical limitations and constraint considerations at scale",
            "optimizations": "Enterprise-grade optimization techniques with implementation details"
          }
        },
        { /*... similar structure for Database & Storage category ...*/ },
        { /*... similar structure for Network & CDN category ...*/ },
        { /*... similar structure for Security & Compliance category ...*/ },
        { /*... similar structure for DevOps & Monitoring category ...*/ },
        { /*... similar structure for Third-Party Services category ...*/ }
      ],
      "optimizationStrategies": [
        {
          "name": "Specific optimization strategy name",
          "description": "Extraordinarily detailed implementation instructions with exact configuration parameters",
          "applicableComponents": ["Specific infrastructure components this applies to"],
          "currentCost": "₹X,XXX/month without optimization",
          "optimizedCost": "₹X,XXX/month with optimization implemented",
          "potentialSavings": {
            "amount": "₹X,XXX/month",
            "percentage": "XX.X%",
            "paybackPeriod": "X months to recover implementation costs"
          },
          "implementationSteps": [
            "Detailed step 1 with specific commands or configuration changes",
            "Detailed step 2 with expected outcomes and verification methods"
          ],
          "implementationCost": {
            "amount": "₹X,XXX one-time",
            "effort": "X hours of engineering time"
          },
          "implementationComplexity": "low/medium/high with specific technical considerations",
          "technicalRisks": [
            "Specific technical risk with mitigation strategy",
            "Another technical risk with mitigation strategy"
          ],
          "tradeoffs": "Comprehensive technical implications including performance impact and operational considerations",
          "applicableScales": ["small", "medium", "large"],
          "monitoringRequirements": "Specific metrics to track for verifying optimization effectiveness"
        }
      ],
      "environmentCosts": {
        "development": {
          "cost": {
            "setup": "₹X,XXX one-time",
            "monthly": "₹X,XXX/month",
            "annual": "₹XX,XXX/year"
          },
          "specifications": "Precise configuration details with service tiers and resource allocations",
          "optimizations": "Development-specific cost optimizations (e.g., auto-shutdown during non-working hours)"
        },
        "staging": {
          "cost": {
            "setup": "₹X,XXX one-time",
            "monthly": "₹X,XXX/month",
            "annual": "₹XX,XXX/year"
          }, 
          "specifications": "Precise configuration details with service tiers and resource allocations",
          "optimizations": "Staging-specific cost optimizations"
        },
        "production": "Covered in scale breakdowns above",
        "cicdPipeline": {
          "cost": {
            "setup": "₹X,XXX one-time",
            "monthly": "₹X,XXX/month",
            "annual": "₹XX,XXX/year"
          },
          "specifications": "Build and deployment infrastructure details with capacity and throughput metrics"
        },
        "shared": {
          "cost": {
            "setup": "₹X,XXX one-time",
            "monthly": "₹X,XXX/month",
            "annual": "₹XX,XXX/year"
          },
          "specifications": "Shared infrastructure components that span multiple environments"
        }
      },
      "monthlyProjection": [
        {
          "month": 1,
          "scale": "small",
          "totalCost": "₹X,XXX",
          "keyMilestones": ["Initial deployment", "Basic monitoring setup"],
          "costDrivers": ["Initial setup", "Base infrastructure"]
        },
        { /*... similarly for months 2-12 with appropriate growth projections ...*/ }
      ],
      "technicalAssumptions": [
        {
          "category": "Technical domain (traffic, data, processing, etc.)",
          "assumption": "Precise technical assumption with exact quantitative metrics",
          "rationale": "Technical justification for this assumption based on project requirements",
          "costSensitivity": "How changes in this assumption affect overall costs (+X% per unit change)",
          "monitoringMetric": "Specific metric to track for validating this assumption"
        }
      ],
      "implementationRecommendations": [
        {
          "focus": "Technical area of focus (architecture, service selection, etc.)",
          "recommendation": "Implementation-ready technical recommendation with exact configuration parameters",
          "priority": "high/medium/low with justification",
          "impact": "Expected cost and performance impact with quantitative metrics",
          "implementation": "Detailed implementation guidance with specific steps and verification methods"
        }
      ]
    }
    
    TECHNICAL QUALITY REQUIREMENTS:
    - Create an EXTRAORDINARILY DETAILED and IMPLEMENTATION-READY cost model suitable for immediate deployment
    - Include EXTREMELY SPECIFIC service specifications with exact instance types, storage volumes, and configuration parameters
    - Base all pricing on CURRENT MARKET RATES with service-specific pricing for Indian region deployments
    - Provide COMPREHENSIVE configuration details that developers can immediately implement
    - Ensure mathematical PRECISION across all calculations with properly summing cost categories
    - Include at least 5-7 DETAILED line items in each category breakdown with exact specifications
    - Provide at least 7-10 ADVANCED optimization strategies with implementation-specific details
    - Focus on TECHNICAL ACCURACY with industry best practices for each infrastructure component
    - Document ALL capacity planning assumptions with QUANTITATIVE METRICS and verification methods
    - Ensure all recommendations are IMMEDIATELY ACTIONABLE by infrastructure engineers
    `;

    // Create a promise that rejects after a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Cost estimation generation timed out')), 120000); // 2 minutes timeout
    });

    // Race the API call against the timeout
    console.log('Sending cost estimation request to Gemini API');
    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more precise, factual output
          maxOutputTokens: 16384, // Sufficient token limit for detailed output
        }
      }),
      timeoutPromise
    ]) as any;

    const response = await result.response;
    const text = response.text();
    
    console.log('Cost estimation generation completed successfully');
    
    try {
      // Extract and process the JSON response
      let jsonString = extractJsonFromText(text);
      jsonString = repairJson(jsonString);
      
      const costEstimation = JSON.parse(jsonString);
      
      // Validate that we have the required fields
      if (!costEstimation.overview || !costEstimation.costCategories || !Array.isArray(costEstimation.costCategories)) {
        console.error('Invalid cost estimation structure received');
        throw new Error('Invalid cost estimation structure');
      }
      
      return costEstimation;
    } catch (error) {
      console.error("Error processing cost estimation JSON:", error);
      throw new Error('Failed to generate valid cost estimation');
    }
  } catch (error) {
    console.error("Error generating cost estimation:", error);
    
    // Return a basic fallback cost estimation if generation fails
    return {
      overview: {
        summary: "Basic infrastructure costs for a web application",
        totalCostSmallScale: "₹5,000/month for up to 100 users",
        totalCostMediumScale: "₹25,000/month for up to 5,000 users",
        totalCostLargeScale: "₹100,000/month for 10,000+ users",
        majorCostDrivers: ["Compute resources", "Database services"]
      },
      costCategories: [
        {
          name: "Compute & Hosting",
          description: "Web servers and application hosting",
          smallScale: {
            cost: "₹2,000/month",
            breakdown: [
              {
                service: "Basic cloud VM",
                tier: "Shared CPU, 2GB RAM",
                cost: "₹2,000/month",
                description: "Basic server for development and testing"
              }
            ],
            reasoning: "Minimal resources for early development"
          },
          mediumScale: {
            cost: "₹10,000/month",
            breakdown: [
              {
                service: "Standard cloud VMs",
                tier: "2vCPU, 4GB RAM",
                cost: "₹10,000/month",
                description: "Multiple servers with load balancing"
              }
            ],
            reasoning: "Increased resources for higher traffic"
          },
          largeScale: {
            cost: "₹40,000/month",
            breakdown: [
              {
                service: "High-performance cloud VMs",
                tier: "4vCPU, 8GB RAM",
                cost: "₹40,000/month",
                description: "Multiple servers with auto-scaling"
              }
            ],
            reasoning: "Scaled resources for high traffic"
          }
        },
        {
          name: "Database",
          description: "Database services",
          smallScale: {
            cost: "₹1,500/month",
            breakdown: [
              {
                service: "Managed database service",
                tier: "Basic tier",
                cost: "₹1,500/month",
                description: "Shared database resources"
              }
            ],
            reasoning: "Basic database for early development"
          },
          mediumScale: {
            cost: "₹8,000/month",
            breakdown: [
              {
                service: "Managed database service",
                tier: "Standard tier",
                cost: "₹8,000/month",
                description: "Dedicated database with backup"
              }
            ],
            reasoning: "Dedicated resources for higher load"
          },
          largeScale: {
            cost: "₹35,000/month",
            breakdown: [
              {
                service: "Managed database service",
                tier: "Premium tier",
                cost: "₹35,000/month",
                description: "High-performance database with replication"
              }
            ],
            reasoning: "Highly available database for scale"
          }
        },
        {
          name: "Monitoring & DevOps",
          description: "Monitoring, logging, and deployment tools",
          smallScale: {
            cost: "₹1,000/month",
            breakdown: [
              {
                service: "Basic monitoring service",
                tier: "Free tier",
                cost: "₹0/month",
                description: "Basic monitoring and alerts"
              },
              {
                service: "Log management",
                tier: "Basic tier",
                cost: "₹1,000/month",
                description: "Basic log collection and storage"
              }
            ],
            reasoning: "Minimal monitoring setup"
          },
          mediumScale: {
            cost: "₹3,500/month",
            breakdown: [
              {
                service: "Advanced monitoring",
                tier: "Standard tier",
                cost: "₹2,000/month",
                description: "Comprehensive monitoring with dashboards"
              },
              {
                service: "Log management",
                tier: "Standard tier",
                cost: "₹1,500/month",
                description: "Enhanced logging with retention"
              }
            ],
            reasoning: "Improved visibility and alerting"
          },
          largeScale: {
            cost: "₹12,000/month",
            breakdown: [
              {
                service: "Enterprise monitoring solution",
                tier: "Premium tier",
                cost: "₹7,000/month",
                description: "Full-stack monitoring with advanced analytics"
              },
              {
                service: "Log management",
                tier: "Premium tier",
                cost: "₹5,000/month",
                description: "Advanced log analytics and long-term storage"
              }
            ],
            reasoning: "Enterprise-grade observability"
          }
        }
      ],
      optimizationStrategies: [
        {
          name: "Reserved Instances",
          description: "Pre-purchase compute resources for 1-3 year terms",
          potentialSavings: "Up to 30% on compute costs",
          tradeoffs: "Requires upfront commitment",
          applicableScales: ["medium", "large"]
        },
        {
          name: "Auto-scaling",
          description: "Automatically adjust resources based on demand",
          potentialSavings: "15-20% on compute costs",
          tradeoffs: "Requires proper configuration and monitoring",
          applicableScales: ["medium", "large"]
        }
      ],
      environmentCosts: {
        development: "₹2,000/month",
        staging: "₹3,000/month", 
        production: "Covered in scale breakdowns above"
      },
      assumptions: [
        "Average request size of 50KB",
        "Average database transaction size of 10KB",
        "8 hours of active use per day",
        "Standard regional pricing"
      ],
      recommendations: [
        "Start with minimal resources and scale as needed",
        "Implement monitoring early to track resource usage",
        "Use reserved instances for predictable workloads",
        "Implement caching to reduce database load"
      ]
    };
  }
} 