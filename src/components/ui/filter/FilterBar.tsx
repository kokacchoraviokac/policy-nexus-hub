
import React, { ReactNode } from 'react';

export interface FilterProps {
  children: ReactNode;
  className?: string;
  searchValue?: string;
  onSearchChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
}

const FilterBar: React.FC<FilterProps> = ({ 
  children, 
  className = '',
  searchValue,
  onSearchChange,
  searchPlaceholder
}) => {
  return (
    <div className={`flex flex-wrap gap-2 p-2 border rounded-md mb-4 ${className}`}>
      {children}
    </div>
  );
};

export default FilterBar;

// Export Filter as an alias for FilterBar for backward compatibility
export const Filter = FilterBar;
