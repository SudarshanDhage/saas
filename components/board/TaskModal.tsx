"use client"

import React, { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  MessageCircle, 
  Link as LinkIcon, 
  ThumbsUp,
  Activity,
  ChevronDown,
  ChevronUp,
  Settings,
  Pin,
  FileEdit,
  Share,
  MoreHorizontal,
  Eye,
  Lock,
  Plus,
  AppWindow,
  Workflow,
  CircleEllipsis,
  TriangleAlert,
  AlertTriangle,
  Loader2,
  UserCircle2,
  Calendar,
  Link,
  Zap, 
  CheckCircle
} from 'lucide-react';
import { TaskModalProps, Task } from './types';

// Instead of extending the module, we'll specify our props properly
// and rely on TypeScript's structural typing

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask
}) => {
  const [editedContent, setEditedContent] = useState(task.content);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [hoveringSeparator, setHoveringSeparator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSaveChanges = () => {
    const updatedTask = {
      ...task,
      content: editedContent,
      description: editedDescription
    };
    onUpdateTask(updatedTask);
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // In a real app, this would save the comment to a database
    setComment('');
  };
  
  if (!isOpen) return null;
  
  // Create a display name for the assignee section
  const displayName = task.taskId ? task.taskId.substring(0, 2).toUpperCase() : 'NA';
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-sm shadow-xl max-w-4xl w-full max-h-full overflow-hidden mt-6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-white dark:bg-gray-800 border-b border-[#DFE1E6] dark:border-gray-700">
          <div className="flex items-center">
            {task.type === 'project' && (
              <div className="w-6 h-6 rounded-sm bg-[#00875A] dark:bg-emerald-600 flex items-center justify-center mr-2">
                <Workflow className="w-4 h-4 text-white" />
              </div>
            )}
            {task.type === 'feature' && (
              <div className="w-6 h-6 rounded-sm bg-[#6554C0] dark:bg-purple-600 flex items-center justify-center mr-2">
                <Zap className="w-4 h-4 text-white" />
              </div>
            )}
            {task.type === 'task' && (
              <div className="w-6 h-6 rounded-sm bg-[#0052CC] dark:bg-blue-600 flex items-center justify-center mr-2">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="text-sm text-[#6B778C] dark:text-gray-400 font-medium">{task.id}</span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#6B778C] dark:text-gray-400 hover:text-[#42526E] dark:hover:text-gray-300 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <input 
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full text-xl font-medium mb-4 border-b border-transparent hover:border-[#DFE1E6] dark:hover:border-gray-700 focus:border-[#4C9AFF] dark:focus:border-blue-500 focus:outline-none pb-1 bg-transparent text-[#172B4D] dark:text-white"
            />
            
            <div className="flex flex-wrap gap-2 mb-4">
              <button className="text-xs flex items-center border border-[#6554C0] dark:border-purple-500 bg-white dark:bg-gray-700 text-[#6554C0] dark:text-purple-400 hover:bg-[#F4F5F7] dark:hover:bg-gray-600 mr-2">
                <Plus size={14} className="mr-1" /> Labels
              </button>
              <button className="text-xs flex items-center border border-[#DFE1E6] dark:border-gray-600 bg-white dark:bg-gray-700 text-[#42526E] dark:text-gray-300 hover:bg-[#F4F5F7] dark:hover:bg-gray-600">
                <UserCircle2 size={14} className="mr-1" /> Assign
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#6B778C] dark:text-gray-400 mb-2">Description</h3>
              <div className="p-3 bg-[#F4F5F7] dark:bg-gray-700 border border-[#DFE1E6] dark:border-gray-600 rounded-sm">
                <textarea 
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full min-h-[100px] text-sm bg-transparent border-none outline-none resize-none text-[#172B4D] dark:text-white"
                  placeholder="Add a more detailed description..."
                />
              </div>
            </div>
            
            <div className="flex mb-4 border-b border-[#DFE1E6] dark:border-gray-700">
              <button 
                className={`py-1 px-3 text-sm bg-white dark:bg-gray-700 text-[#42526E] dark:text-gray-300 ${activeTab === 'all' ? 'font-medium' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`py-1 px-3 text-sm bg-white dark:bg-gray-700 ${activeTab === 'comments' ? 'text-[#0052CC] dark:text-blue-400 border-b-2 border-[#0052CC] dark:border-blue-400' : 'text-[#42526E] dark:text-gray-300'}`}
                onClick={() => setActiveTab('comments')}
              >
                Comments
              </button>
              <button 
                className={`py-1 px-3 text-sm bg-white dark:bg-gray-700 text-[#42526E] dark:text-gray-300 ${activeTab === 'history' ? 'font-medium' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
              <button 
                className={`py-1 px-3 text-sm bg-white dark:bg-gray-700 text-[#42526E] dark:text-gray-300 ${activeTab === 'worklog' ? 'font-medium' : ''}`}
                onClick={() => setActiveTab('worklog')}
              >
                Work Log
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#6B778C] dark:text-gray-400 mb-2">Comments</h3>
              <div className="mb-4">
                {/* This would contain comments list */}
                <div className="text-sm text-[#6B778C] dark:text-gray-400 italic">No comments yet</div>
              </div>
              
              <form onSubmit={handleSubmitComment}>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-sm text-[#172B4D] dark:text-white bg-white dark:bg-gray-800 border-none outline-none resize-none mb-2 min-h-[80px]"
                  placeholder="Add a comment..."
                />
                <div>
                  <button className="text-sm bg-[#FAFBFC] dark:bg-gray-700 text-[#42526E] dark:text-gray-300 border border-[#DFE1E6] dark:border-gray-600 rounded py-1.5 px-3 hover:bg-[#F4F5F7] dark:hover:bg-gray-600 mr-2 mb-2">
                    <span className="font-medium">@</span> Mention
                  </button>
                  <button className="text-sm bg-[#FAFBFC] dark:bg-gray-700 text-[#42526E] dark:text-gray-300 border border-[#DFE1E6] dark:border-gray-600 rounded py-1.5 px-3 hover:bg-[#F4F5F7] dark:hover:bg-gray-600 mr-2 mb-2">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" /> Date
                  </button>
                  <button className="text-sm bg-[#FAFBFC] dark:bg-gray-700 text-[#42526E] dark:text-gray-300 border border-[#DFE1E6] dark:border-gray-600 rounded py-1.5 px-3 hover:bg-[#F4F5F7] dark:hover:bg-gray-600 mb-2">
                    <Link className="w-3.5 h-3.5 inline mr-1" /> Attach
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-[#6B778C] dark:text-gray-400">
                    Pro tip: press <span className="inline-block px-1.5 py-0.5 bg-[#F4F5F7] dark:bg-gray-700 border border-[#DFE1E6] dark:border-gray-600 rounded text-[#42526E] dark:text-gray-300 font-medium">M</span> to comment
                  </div>
                  <button 
                    type="submit" 
                    disabled={!comment.trim()}
                    className="py-1.5 px-3 text-sm bg-[#0052CC] dark:bg-blue-600 text-white hover:bg-[#0065FF] dark:hover:bg-blue-500 rounded disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Resizable separator */}
          <div 
            className="hidden md:block w-1 bg-[#F4F5F7] dark:bg-gray-700 cursor-col-resize flex-shrink-0"
            onMouseEnter={() => setHoveringSeparator(true)}
            onMouseLeave={() => setHoveringSeparator(false)}
          >
            <div className={`w-full h-full ${hoveringSeparator ? 'bg-[#0052CC] dark:bg-blue-500' : 'bg-transparent'} transition-colors duration-150`}></div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-[300px] p-4 flex-shrink-0 border-t md:border-t-0 md:border-l border-[#DFE1E6] dark:border-gray-700 overflow-y-auto">
            <h3 className="text-sm font-medium text-[#6B778C] dark:text-gray-400 mb-4">Details</h3>
            
            {/* Status */}
            <div className="mb-4">
              <div className="text-xs text-[#6B778C] dark:text-gray-400 mb-1">STATUS</div>
              <select className="w-full text-sm border border-[#DFE1E6] dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-700 text-[#172B4D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] dark:focus:ring-blue-500">
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
            
            {/* Assignee */}
            <div className="mb-4">
              <div className="text-xs text-[#6B778C] dark:text-gray-400 mb-1">ASSIGNEE</div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-[#EBECF0] dark:bg-gray-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-[10px] text-[#42526E] dark:text-gray-300">
                    {displayName}
                  </span>
                </div>
                <span className="text-sm text-[#172B4D] dark:text-white">
                  {displayName === 'NA' ? 'Unassigned' : displayName}
                </span>
              </div>
            </div>
            
            {/* Priority */}
            <div className="mb-4">
              <div className="text-xs text-[#6B778C] dark:text-gray-400 mb-1">PRIORITY</div>
              <select className="w-full text-sm border border-[#DFE1E6] dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-700 text-[#172B4D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] dark:focus:ring-blue-500">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            
            {/* Due date */}
            <div className="mb-4">
              <div className="text-xs text-[#6B778C] dark:text-gray-400 mb-1">DUE DATE</div>
              <input 
                type="date" 
                className="w-full text-sm border border-[#DFE1E6] dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-700 text-[#172B4D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] dark:focus:ring-blue-500"
              />
            </div>
            
            {/* Labels */}
            <div className="mb-4">
              <div className="text-xs text-[#6B778C] dark:text-gray-400 mb-1">LABELS</div>
              <button className="w-full text-sm flex items-center justify-center border border-[#DFE1E6] dark:border-gray-600 rounded p-1 text-[#42526E] dark:text-gray-300 hover:bg-[#F4F5F7] dark:hover:bg-gray-600">
                <Plus size={14} className="mr-1" /> Add label
              </button>
            </div>
            
            {/* Warning for task edits */}
            <div className="my-2 flex items-center p-2 bg-[#FFFAE6] dark:bg-yellow-900/30 rounded border border-[#FFC400] dark:border-yellow-700 text-[#172B4D] dark:text-yellow-100">
              <AlertTriangle size={16} className="text-[#FF8B00] dark:text-yellow-400 mr-2 flex-shrink-0" />
              <span className="text-xs">Changes are saved automatically</span>
            </div>
            
            {/* Save changes button */}
            <button 
              onClick={handleSaveChanges}
              className="w-full mt-4 py-2 bg-[#0052CC] dark:bg-blue-600 text-white hover:bg-[#0065FF] dark:hover:bg-blue-500 rounded flex items-center justify-center"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal; 