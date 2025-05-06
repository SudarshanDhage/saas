"use client"

import React from 'react';
import { CheckSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface CreateTaskFormProps {
  value: string;
  formRef: React.RefObject<HTMLDivElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  value,
  formRef,
  onChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div 
      ref={formRef}
      className="bg-white dark:bg-gray-800 border border-[#4C9AFF] dark:border-blue-500 rounded-sm shadow-sm mb-3"
    >
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={value}
          onChange={onChange}
          className="w-full p-2 text-sm text-[#172B4D] dark:text-white bg-white dark:bg-gray-800 placeholder:text-[#7A869A] dark:placeholder:text-gray-400 focus:outline-none"
          autoFocus
        />
        <div className="flex items-center border-t border-[#F4F5F7] dark:border-gray-700 p-2">
          <div className="flex-1 flex items-center space-x-2">
            <button type="button" className="text-[#42526E] dark:text-gray-300 hover:bg-[#F4F5F7] dark:hover:bg-gray-700 p-1 rounded">
              <CheckSquare size={16} />
            </button>
            <ChevronDown size={16} className="text-[#42526E] dark:text-gray-300" />
          </div>
          <div className="flex items-center space-x-2">
            <button 
              type="button" 
              onClick={onCancel}
              className="text-[#42526E] dark:text-gray-300 hover:bg-[#F4F5F7] dark:hover:bg-gray-700 p-1 rounded"
            >
              <ChevronUp size={16} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm; 