"use client"

import React from 'react';
import { ChevronRight, Edit2, Plus, Link, MoveRight, Copy, Trash } from 'lucide-react';
import { Task } from './types';

interface TaskMenuProps {
  taskId: string;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onDelete: (taskId: string) => void;
  onChangeStatus: (taskId: string, newStatus: string) => void;
}

const TaskMenu: React.FC<TaskMenuProps> = ({
  taskId,
  menuRef,
  onDelete,
  onChangeStatus
}) => {
  return (
    <div 
      ref={menuRef}
      className="absolute z-10 top-12 right-0 bg-white dark:bg-gray-800 shadow-lg border border-[#DFE1E6] dark:border-gray-700 rounded-sm w-[240px] overflow-hidden"
    >
      <div className="py-2">
        <button 
          className="w-full px-4 py-2 text-left text-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700 text-[#42526E] dark:text-gray-300 flex items-center"
          onClick={() => {}}
        >
          <Edit2 size={14} className="mr-2" />
          Edit
        </button>
        <button 
          className="w-full px-4 py-2 text-left text-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700 text-[#42526E] dark:text-gray-300 flex items-center"
          onClick={() => console.log('Add subtask')}
        >
          <Plus size={14} className="mr-2" />
          Add subtask
        </button>
        <button 
          className="w-full px-4 py-2 text-left text-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700 text-[#42526E] dark:text-gray-300 flex items-center"
          onClick={() => console.log('Copy link')}
        >
          <Link size={14} className="mr-2" />
          Copy link
        </button>
        <div className="my-1 border-b border-[#DFE1E6] dark:border-gray-700"></div>
        <button 
          className="w-full px-4 py-2 text-left text-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700 text-[#42526E] dark:text-gray-300 flex items-center"
          onClick={() => console.log('Move')}
        >
          <MoveRight size={14} className="mr-2" />
          Move
        </button>
        <button 
          className="w-full px-4 py-2 text-left text-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700 text-[#42526E] dark:text-gray-300 flex items-center"
          onClick={() => console.log('Clone')}
        >
          <Copy size={14} className="mr-2" />
          Clone
        </button>
        <div className="my-1 border-b border-[#DFE1E6] dark:border-gray-700"></div>
        <button 
          className="w-full px-4 py-2 text-left text-sm hover:bg-[#F4F5F7] dark:hover:bg-gray-700 text-[#EF5350] dark:text-red-400 flex items-center"
          onClick={() => onDelete(taskId)}
        >
          <Trash size={14} className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskMenu; 