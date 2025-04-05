
import React from "react";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";

interface FilterButtonProps {
  onClick: () => void;
  count?: number;
  variant?: "default" | "outline" | "ghost";
}

export const FilterButton: React.FC<FilterButtonProps> = ({ 
  onClick, 
  count, 
  variant = "outline"
}) => {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className="flex items-center space-x-1"
    >
      <FilterIcon className="h-4 w-4" />
      <span>Filters</span>
      {count && count > 0 && (
        <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
          {count}
        </span>
      )}
    </Button>
  );
};

export default FilterButton;
