
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import FilterPopover from "./FilterPopover";

export interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filterGroups?: FilterGroup[];
  className?: string;
}

export interface FilterGroup {
  title: string;
  filters: Filter[];
  selectedValues?: string[];
  onFilterChange?: (values: string[]) => void;
}

export interface Filter {
  value: string;
  label: string;
  count?: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filterGroups,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0", className)}>
      {filterGroups?.map((group, index) => (
        <FilterPopover
          key={`${group.title}-${index}`}
          title={group.title}
          filters={group.filters}
          selectedValues={group.selectedValues}
          onFilterChange={group.onFilterChange}
        />
      ))}
    </div>
  );
};

export default FilterBar;
