"use client"

import React from 'react';
import { Plus } from 'lucide-react';

interface CreateButtonProps {
  onClick: () => void;
  isInTodoColumn: boolean;
}

const CreateButton: React.FC<CreateButtonProps> = ({ 
  onClick, 
  isInTodoColumn 
}) => {
  return (
    <div 
      className={`flex items-center py-1 px-2 text-[#42526E] dark:text-gray-300 text-sm cursor-pointer hover:text-[#0052CC] dark:hover:text-blue-400 hover:bg-[#F4F5F7] dark:hover:bg-gray-700 rounded
        ${!isInTodoColumn ? 'invisible group-hover:visible' : ''}`}
      onClick={onClick}
    >
      <Plus size={16} className="mr-2" />
      <span>Create</span>
    </div>
  );
};

export default CreateButton; 