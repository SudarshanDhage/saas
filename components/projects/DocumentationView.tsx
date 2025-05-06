"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Project, SprintPlan } from '@/lib/firestore'
import { Download, Copy, Check, FileText, ClipboardList, CheckSquare, RefreshCw, Loader2, Save, FileDown } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { generateDocumentation } from '@/lib/gemini'
import { db } from '@/lib/firebase'
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'

interface DocumentationViewProps {
  project: Project
  sprintPlan: SprintPlan | null
}

// Define a type for Sprint
interface Sprint {
  name: string;
  duration: string;
  focus: string;
  tasks: Task[];
}

// Define a type for Task
interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  estimatedHours: number;
  dependencies?: string[];
}

// Interface for AI-generated documentation
interface GeneratedDocumentation {
  id: string;
  html: string;
  title: string;
  projectId: string | null;
  generatedAt: string;
}

const DocumentationView: React.FC<DocumentationViewProps> = ({ project, sprintPlan }) => {
  const [activeTab, setActiveTab] = useState<string>('tasks')
  const [copying, setCopying] = useState(false)
  const [aiDocumentation, setAiDocumentation] = useState<GeneratedDocumentation | null>(null)
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPdfDownloading, setIsPdfDownloading] = useState(false)
  const docContentRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { toast } = useToast()

  // Fetch stored documentation when component mounts or project changes
  useEffect(() => {
    const fetchStoredDocumentation = async () => {
      if (!project?.id) return;
      
      setIsLoading(true);
      try {
        // Query for the most recent documentation for this project
        const docsRef = collection(db, "documentations");
        const q = query(
          docsRef, 
          where("projectId", "==", project.id),
          orderBy("generatedAt", "desc"),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data() as GeneratedDocumentation;
          setAiDocumentation(docData);
          
          // If we have documentation, make the AI docs tab available
          if (activeTab === 'ai-docs' || !activeTab) {
            setActiveTab('ai-docs');
          }
        }
      } catch (error) {
        console.error("Error fetching stored documentation:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStoredDocumentation();
  }, [project?.id]);

  // Function to copy task list to clipboard
  const copyTaskList = async () => {
    if (!project || !sprintPlan) return
    
    setCopying(true)
    try {
      // Create a formatted task list
      const developerTasks = sprintPlan.developerPlan?.sprints
        .flatMap((sprint: Sprint) => sprint.tasks.map((task: Task) => 
          `- ${task.title}: ${task.description} (${task.estimatedHours}h)`
        ))
        .join('\n') || 'No tasks available';
      
      await navigator.clipboard.writeText(
        `# ${project.title} - Task List\n\n${developerTasks}`
      );
      
      toast({
        title: "Copied to clipboard!",
        description: "Task list copied to your clipboard.",
        duration: 3000,
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy the task list to clipboard.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setCopying(false)
    }
  }

  // Create a simple CSV of tasks
  const downloadTasksCSV = () => {
    if (!project || !sprintPlan) return;
    
    const csvRows = [['Sprint', 'Task ID', 'Title', 'Description', 'Type', 'Priority', 'Hours']];
    
    sprintPlan.developerPlan?.sprints.forEach((sprint: Sprint) => {
      sprint.tasks.forEach((task: Task) => {
        csvRows.push([
          sprint.name,
          task.id,
          task.title,
          task.description.replace(/,/g, ';'),
          task.type,
          task.priority,
          task.estimatedHours.toString()
        ]);
      });
    });
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${project.title.replace(/\s+/g, '_')}_tasks.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Function to generate AI documentation
  const generateAIDocumentation = async () => {
    if (!project) return;
    
    setIsGeneratingDoc(true);
    try {
      const docs = await generateDocumentation(project, sprintPlan);
      setAiDocumentation(docs as GeneratedDocumentation);
      
      toast({
        title: "Documentation Generated",
        description: "AI documentation has been successfully generated.",
        duration: 3000,
      });
      
      // Switch to AI documentation tab
      setActiveTab('ai-docs');
    } catch (error) {
      console.error("Error generating documentation:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI documentation. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  // Function to save documentation to Firestore
  const saveDocumentation = async () => {
    if (!aiDocumentation || !project.id) return;
    
    setIsSaving(true);
    try {
      await setDoc(doc(db, "documentations", aiDocumentation.id), {
        ...aiDocumentation,
        projectId: project.id,
        savedAt: new Date().toISOString()
      });
      
      toast({
        title: "Documentation Saved",
        description: "AI documentation has been saved to the database.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving documentation:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save AI documentation to the database.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Function to download documentation as PDF
  const downloadDocumentationAsPdf = () => {
    if (!aiDocumentation || !iframeRef.current) return;
    
    setIsPdfDownloading(true);
    try {
      const iframe = iframeRef.current;
      const iframeWindow = iframe.contentWindow;
      
      if (!iframeWindow) {
        throw new Error("Could not access iframe content");
      }
      
      // Create a style for PDF
      const printCSS = `
        @page {
          size: A4;
          margin: 1cm;
        }
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 12pt;
          line-height: 1.6;
          color: #333;
        }
        h1 { font-size: 24pt; margin-top: 24pt; margin-bottom: 8pt; }
        h2 { font-size: 18pt; margin-top: 18pt; margin-bottom: 6pt; }
        h3 { font-size: 14pt; margin-top: 14pt; margin-bottom: 4pt; }
        pre, code { font-family: 'Courier New', monospace; font-size: 11pt; }
        pre { padding: 8pt; background-color: #f8f9fa; border: 1pt solid #eee; white-space: pre-wrap; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 16pt; }
        th, td { border: 1pt solid #ddd; padding: 8pt; text-align: left; }
        th { background-color: #f8f9fa; }
        img { max-width: 100%; height: auto; }
        a { color: #0066cc; text-decoration: none; }
        section { page-break-inside: avoid; }
        .ascii-diagram { font-family: monospace; line-height: 1.2; }
      `;
      
      // Add print styles to iframe
      const style = iframeWindow.document.createElement('style');
      style.textContent = printCSS;
      iframeWindow.document.head.appendChild(style);
      
      // Trigger print dialog
      setTimeout(() => {
        iframeWindow.focus();
        iframeWindow.print();
        setIsPdfDownloading(false);
        
        // Remove the print style after printing
        setTimeout(() => {
          iframeWindow.document.head.removeChild(style);
        }, 1000);
      }, 500);
      
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download documentation as PDF.",
        variant: "destructive",
        duration: 3000,
      });
      setIsPdfDownloading(false);
    }
  };

  if (!project || !sprintPlan) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-[#172B4D] dark:text-white mb-2">No Project Data</h3>
            <p className="text-[#6B778C] dark:text-gray-400">
              Project information is not available.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl">Project Summary: {project.title}</CardTitle>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={copyTaskList}
              disabled={copying}
            >
              {copying ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Tasks
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={generateAIDocumentation}
              disabled={isGeneratingDoc}
            >
              {isGeneratingDoc ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Generate Docs
                </>
              )}
            </Button>
            <Button
              variant="jira"
              className="flex items-center gap-2"
              onClick={downloadTasksCSV}
            >
              <Download size={16} />
              Download CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="sprints">Sprints</TabsTrigger>
            <TabsTrigger value="summary">Project Summary</TabsTrigger>
            <TabsTrigger value="ai-docs" disabled={!aiDocumentation && !isLoading}>
              {isLoading ? 'Loading Docs...' : 'AI Documentation'}
            </TabsTrigger>
          </TabsList>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks" className="mt-0">
            <div className="border rounded-lg bg-white dark:bg-gray-800 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-[#172B4D] dark:text-white">All Tasks</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {sprintPlan.developerPlan?.sprints.flatMap((s: Sprint) => s.tasks).length || 0} Tasks
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100vh-300px)]">
                {sprintPlan.developerPlan?.sprints.flatMap((sprint: Sprint, sprintIndex: number) => (
                  sprint.tasks.map((task: Task, taskIndex: number) => (
                    <div 
                      key={`${sprintIndex}-${taskIndex}-${task.id}`}
                      className="mb-3 p-4 border dark:border-gray-700 rounded-md hover:shadow-md dark:hover:shadow-gray-900 transition-shadow bg-white dark:bg-gray-800"
                    >
                      <div className="flex justify-between">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          task.priority === "high" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" :
                          task.priority === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        )}>
                          {task.priority}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{task.estimatedHours}h</span>
                      </div>
                      <h4 className="font-medium mt-2 mb-1 dark:text-white">{task.title}</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{task.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-xs">
                          {task.type}
                        </span>
                        <span className="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded text-xs">
                          {sprint.name}
                        </span>
                      </div>
                    </div>
                  ))
                ))}
              </ScrollArea>
            </div>
          </TabsContent>
          
          {/* Sprints Tab */}
          <TabsContent value="sprints" className="mt-0">
            <div className="border rounded-lg bg-white dark:bg-gray-800 p-4">
              <div className="grid gap-4">
                {sprintPlan.developerPlan?.sprints.map((sprint: Sprint, index: number) => (
                  <div key={index} className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-900 transition-shadow bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-lg dark:text-white">{sprint.name}</h3>
                      <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full dark:text-gray-300">
                        {sprint.duration}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{sprint.focus}</p>
                    
                    <div className="mt-3">
                      <h4 className="font-medium mb-2 flex items-center text-sm dark:text-white">
                        <ClipboardList size={16} className="mr-2" />
                        Tasks ({sprint.tasks.length})
                      </h4>
                      <div className="pl-5 border-l-2 border-gray-200 dark:border-gray-700">
                        {sprint.tasks.map((task: Task, taskIndex: number) => (
                          <div key={taskIndex} className="mb-2 flex items-start">
                            <CheckSquare size={14} className="mr-2 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium dark:text-white">{task.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{task.type} • {task.estimatedHours}h</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Project Summary Tab */}
          <TabsContent value="summary" className="mt-0">
            <div className="border rounded-lg bg-white dark:bg-gray-800 p-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 dark:text-white">Project Overview</h3>
                <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
              </div>
              
              {project.coreFeatures && project.coreFeatures.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2 dark:text-white">Core Features</h3>
                  <div className="grid gap-3">
                    {project.coreFeatures.map((feature, index) => (
                      <div key={index} className="p-3 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800">
                        <h4 className="font-medium mb-1 dark:text-white">{feature.name}</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {project.suggestedFeatures && project.suggestedFeatures.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2 dark:text-white">Suggested Features</h3>
                  <div className="grid gap-3">
                    {project.suggestedFeatures.map((feature, index) => (
                      <div key={index} className="p-3 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800">
                        <h4 className="font-medium mb-1 dark:text-white">{feature.name}</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* AI Documentation Tab */}
          <TabsContent value="ai-docs" className="mt-0">
            {isLoading ? (
              <div className="border rounded-lg bg-white dark:bg-gray-800 p-8 text-center">
                <Loader2 size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-700 animate-spin" />
                <h3 className="text-lg font-medium mb-2 dark:text-white">Loading Documentation</h3>
                <p className="text-[#6B778C] dark:text-gray-400 mb-4">
                  Retrieving your saved documentation...
                </p>
              </div>
            ) : aiDocumentation ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium dark:text-white">AI-Generated Documentation</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={downloadDocumentationAsPdf}
                      disabled={isPdfDownloading}
                    >
                      {isPdfDownloading ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" />
                          Preparing PDF...
                        </>
                      ) : (
                        <>
                          <FileDown size={14} className="mr-2" />
                          Download PDF
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={saveDocumentation}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={14} className="mr-2" />
                          Save Documentation
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={generateAIDocumentation}
                      disabled={isGeneratingDoc}
                    >
                      {isGeneratingDoc ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={14} className="mr-2" />
                          Regenerate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div 
                  className="border rounded-lg bg-white dark:bg-gray-800 p-6 overflow-auto"
                  ref={docContentRef}
                  style={{ height: 'calc(100vh - 350px)' }}
                >
                  <iframe
                    ref={iframeRef}
                    srcDoc={`
                      <!DOCTYPE html>
                      <html class="light-mode">
                        <head>
                          <style>
                            /* Reset all styles */
                            html, body {
                              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                              color: #333;
                              line-height: 1.5;
                              margin: 0;
                              padding: 0;
                            }
                            
                            * {
                              max-width: 100%;
                              box-sizing: border-box;
                            }
                            
                            /* Light mode styles (default) */
                            html.light-mode {
                              color-scheme: light;
                              background-color: white;
                              color: #333;
                            }
                            
                            /* Dark mode styles */
                            html.dark-mode {
                              color-scheme: dark;
                              background-color: #1e1e1e;
                              color: #e0e0e0;
                            }
                            
                            /* Heading styles */
                            html.light-mode h1 {
                              color: #172B4D;
                              border-bottom-color: #4C9AFF;
                            }
                            
                            html.dark-mode h1 {
                              color: #e0e0e0;
                              border-bottom-color: #3b82f6;
                            }
                            
                            html.light-mode h2, html.light-mode h3, html.light-mode h4 {
                              color: #172B4D;
                            }
                            
                            html.dark-mode h2, html.dark-mode h3, html.dark-mode h4 {
                              color: #e0e0e0;
                            }
                            
                            /* Border styles */
                            html.light-mode h2 {
                              border-bottom-color: #DFE1E6;
                            }
                            
                            html.dark-mode h2 {
                              border-bottom-color: #4b5563;
                            }
                            
                            /* Links */
                            html.light-mode a {
                              color: #0052CC;
                            }
                            
                            html.dark-mode a {
                              color: #60a5fa;
                            }
                            
                            /* Table styles */
                            html.light-mode table, html.light-mode th, html.light-mode td {
                              border-color: #dee2e6;
                            }
                            
                            html.dark-mode table, html.dark-mode th, html.dark-mode td {
                              border-color: #4b5563;
                            }
                            
                            html.light-mode th, html.light-mode tr:nth-child(even) {
                              background-color: #f8f9fa;
                            }
                            
                            html.dark-mode th, html.dark-mode tr:nth-child(even) {
                              background-color: #374151;
                            }
                            
                            /* Code blocks */
                            html.light-mode .diagram, 
                            html.light-mode .code-block, 
                            html.light-mode pre, 
                            html.light-mode .ascii-diagram {
                              background-color: #f8f9fa;
                              border-color: #e9ecef;
                            }
                            
                            html.dark-mode .diagram, 
                            html.dark-mode .code-block, 
                            html.dark-mode pre, 
                            html.dark-mode .ascii-diagram {
                              background-color: #1f2937;
                              border-color: #374151;
                              color: #d1d5db;
                            }
                            
                            /* Note blocks */
                            html.light-mode .note {
                              background-color: #e7f5ff;
                              border-left-color: #4dabf7;
                            }
                            
                            html.dark-mode .note {
                              background-color: #1e3a5f;
                              border-left-color: #3b82f6;
                            }
                            
                            /* Highlights */
                            html.light-mode .highlight {
                              background-color: #fff3bf;
                            }
                            
                            html.dark-mode .highlight {
                              background-color: #92400e;
                            }
                            
                            /* Section dividers */
                            html.light-mode .doc-section {
                              border-bottom-color: #e9ecef;
                            }
                            
                            html.dark-mode .doc-section {
                              border-bottom-color: #4b5563;
                            }
                            
                            h1 {
                              font-size: 2rem;
                              font-weight: 600;
                              margin-top: 1.5rem;
                              margin-bottom: 1rem;
                              padding-bottom: 0.5rem;
                              border-bottom: 2px solid #4C9AFF;
                            }
                            
                            h2 {
                              font-size: 1.6rem;
                              font-weight: 600;
                              margin-top: 1.5rem;
                              margin-bottom: 1rem;
                              padding-bottom: 0.25rem;
                              border-bottom: 1px solid #DFE1E6;
                            }
                            
                            h3 {
                              font-size: 1.3rem;
                              font-weight: 600;
                              margin-top: 1.5rem;
                              margin-bottom: 1rem;
                            }
                            
                            h4 {
                              font-size: 1.1rem;
                              font-weight: 600;
                              margin-top: 1.5rem;
                              margin-bottom: 1rem;
                            }
                            
                            p {
                              margin-bottom: 1rem;
                            }
                            
                            a {
                              text-decoration: none;
                            }
                            
                            a:hover {
                              text-decoration: underline;
                            }
                            
                            table {
                              border-collapse: collapse;
                              width: 100%;
                              margin: 1rem 0;
                            }
                            
                            table, th, td {
                              border: 1px solid #dee2e6;
                            }
                            
                            th, td {
                              padding: 0.75rem;
                              text-align: left;
                            }
                            
                            th {
                              background-color: #f8f9fa;
                              font-weight: 600;
                            }
                            
                            tr:nth-child(even) {
                              background-color: #f8f9fa;
                            }
                            
                            .diagram {
                              font-family: monospace;
                              white-space: pre;
                              line-height: 1.2;
                              background-color: #f8f9fa;
                              border: 1px solid #e9ecef;
                              border-radius: 4px;
                              padding: 1rem;
                              margin: 1.5rem 0;
                              overflow-x: auto;
                            }
                            
                            .code-block, pre {
                              font-family: monospace;
                              white-space: pre;
                              line-height: 1.4;
                              background-color: #f8f9fa;
                              border: 1px solid #e9ecef;
                              border-radius: 4px;
                              padding: 1rem;
                              margin: 1rem 0;
                              overflow-x: auto;
                            }
                            
                            .note {
                              background-color: #e7f5ff;
                              border-left: 4px solid #4dabf7;
                              padding: 0.75rem 1rem;
                              margin: 1rem 0;
                              border-radius: 0 4px 4px 0;
                            }
                            
                            .highlight {
                              background-color: #fff3bf;
                              padding: 0.2rem 0.4rem;
                              border-radius: 4px;
                              font-weight: 500;
                            }
                            
                            .doc-section {
                              margin-bottom: 2rem;
                              padding-bottom: 1rem;
                              border-bottom: 1px solid #e9ecef;
                            }
                            
                            ul, ol {
                              padding-left: 1.5rem;
                              margin-bottom: 1rem;
                            }
                            
                            li {
                              margin-bottom: 0.5rem;
                            }

                            .ascii-diagram {
                              font-family: monospace;
                              white-space: pre;
                              line-height: 1.2;
                              background-color: #f8f9fa;
                              border: 1px solid #e9ecef;
                              border-radius: 4px;
                              padding: 1rem;
                              margin: 1.5rem 0;
                              overflow-x: auto;
                            }
                          </style>
                          <script>
                            // Set dark mode based on parent document
                            function updateTheme() {
                              const isDarkMode = window.parent.document.documentElement.classList.contains('dark');
                              document.documentElement.className = isDarkMode ? 'dark-mode' : 'light-mode';
                            }
                            
                            // Initial theme setup
                            document.addEventListener('DOMContentLoaded', updateTheme);
                            
                            // Listen for theme changes from parent
                            window.addEventListener('message', function(event) {
                              if (event.data === 'theme-changed') {
                                updateTheme();
                              }
                            });
                          </script>
                        </head>
                        <body>
                          ${aiDocumentation.html}
                        </body>
                      </html>
                    `}
                    style={{ border: 'none', width: '100%', height: '100%' }}
                    title="Documentation Content"
                  />
                </div>
              </div>
            ) : (
              <div className="border rounded-lg bg-white dark:bg-gray-800 p-8 text-center">
                <RefreshCw size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                <h3 className="text-lg font-medium mb-2 dark:text-white">No Documentation Generated</h3>
                <p className="text-[#6B778C] dark:text-gray-400 mb-4">
                  Generate AI documentation to get a complete guide for your project.
                </p>
                <Button
                  variant="jira"
                  onClick={generateAIDocumentation}
                  disabled={isGeneratingDoc}
                >
                  {isGeneratingDoc ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText size={16} className="mr-2" />
                      Generate Documentation
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default DocumentationView 