
import React, { ReactNode } from 'react';

export interface FilterProps {
  children: ReactNode;
  className?: string;
}

const FilterBar: React.FC<FilterProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 p-2 border rounded-md mb-4 ${className}`}>
      {children}
    </div>
  );
};

export default FilterBar;
