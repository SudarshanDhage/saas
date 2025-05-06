import React from 'react';
import { 
  ArrowUpRight,
  Clock,
  CalendarCheck,
  MoreHorizontal,
  CheckCircle,
  TriangleAlert,
  ClipboardList,
  Workflow,
  Zap,
  UserCircle2
} from 'lucide-react';
import { TaskCardProps } from './types';

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onDragStart, 
  onDragEnd, 
  onTaskClick 
}) => {
  const handleCardClick = () => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  // Determine card border and background colors based on status and type
  const getCardStyle = () => {
    // Base card style for all cards
    let baseStyle = "group bg-white dark:bg-gray-800 rounded-sm shadow-sm dark:shadow-gray-900 p-3 cursor-pointer hover:bg-[#F4F5F7] dark:hover:bg-gray-700 relative";
    
    // Add border styling based on type
    if (task.type === 'project') {
      baseStyle += ' border-l-4 border-l-[#00875A] border-t border-r border-b border-[#DFE1E6] dark:border-gray-700';
    } else if (task.type === 'feature') {
      baseStyle += ' border-l-4 border-l-[#6554C0] border-t border-r border-b border-[#DFE1E6] dark:border-gray-700';
    } else {
      baseStyle += ' border border-[#DFE1E6] dark:border-gray-700';
    }
    
    // Add status-based styling
    if (task.isCompleted) {
      baseStyle += ' bg-[#F4F5F7] dark:bg-gray-700';
    }
    
    return baseStyle;
  };

  return (
    <div 
      draggable
      onDragStart={() => onDragStart(task)}
      onDragEnd={onDragEnd}
      onClick={handleCardClick}
      className={getCardStyle()}
    >
      {/* Card content */}
      <div className="mb-2 flex items-start justify-between">
        {/* Task type indicator */}
        <div className="flex items-center">
          {task.type === 'project' && (
            <div className="w-5 h-5 rounded-sm bg-[#00875A] flex items-center justify-center mr-2">
              <Workflow className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          {task.type === 'feature' && (
            <div className="w-5 h-5 rounded-sm bg-[#6554C0] flex items-center justify-center mr-2">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          {task.type === 'task' && (
            <div className="w-5 h-5 rounded-sm bg-[#0052CC] flex items-center justify-center mr-2">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          
          {/* Priority indicator */}
          {task.priority === 'high' && (
            <TriangleAlert className="text-[#CD3D3D] dark:text-red-400 w-4 h-4" />
          )}
        </div>
        
        {/* More options button - only visible on hover */}
        <button className="opacity-0 group-hover:opacity-100 text-[#6B778C] dark:text-gray-400 hover:text-[#42526E] dark:hover:text-gray-300">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      {/* Task title */}
      <div className="mb-2">
        <h3 className={`text-sm ${task.isCompleted ? 'text-[#6B778C] dark:text-gray-400 line-through' : 'text-[#172B4D] dark:text-white font-medium'}`}>
          {task.title}
        </h3>
      </div>
      
      {/* Task metadata */}
      <div className="flex items-center justify-between text-xs text-[#6B778C] dark:text-gray-400">
        <div className="flex items-center">
          {task.assignee && (
            <div className="w-5 h-5 rounded-full bg-[#0052CC] dark:bg-blue-500 flex items-center justify-center mr-1.5">
              <span className="text-[9px] text-white">{task.assignee.substring(0, 2).toUpperCase()}</span>
            </div>
          )}
          <span>{task.id}</span>
        </div>
        
        {/* Count of subtasks */}
        {task.subtaskCount > 0 && (
          <div className="flex items-center">
            <ClipboardList className="w-3.5 h-3.5 mr-1" />
            <span>{task.subtaskCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard; 