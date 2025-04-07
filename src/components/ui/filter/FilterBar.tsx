
import React, { ReactNode } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
      {onSearchChange && (
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder || "Search..."}
            value={searchValue}
            onChange={onSearchChange}
            className="pl-8"
          />
        </div>
      )}
      {children}
    </div>
  );
};

export default FilterBar;

// Export Filter as an alias for FilterBar for backward compatibility
export const Filter = FilterBar;
