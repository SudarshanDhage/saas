"use client"

import React from 'react';
import { ColumnHeaderProps } from './types';

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  title,
  taskCount,
  isDone = false
}) => {
  return (
    <div className="flex items-center mb-3">
      <div className="flex items-center">
        <h3 className="text-sm font-medium text-[#42526E] dark:text-white">{title}</h3>
        {isDone && <div className="text-[#4EB550] dark:text-green-400 ml-1">✓</div>}
        {taskCount > 0 && (
          <div className="text-sm text-[#42526E] dark:text-gray-300 bg-[#DFE1E6] dark:bg-gray-600 px-2 py-0.5 rounded ml-2">
            {taskCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColumnHeader; 