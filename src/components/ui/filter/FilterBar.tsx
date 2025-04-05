
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FilterButton from "./FilterButton"; // Update import
import FilterPopover from "./FilterPopover";

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  multiSelect?: boolean; // Add optional property
}

export interface ActiveFilter {
  groupId: string;
  optionId: string;
}

export interface FilterBarProps {
  filterGroups: FilterGroup[];
  activeFilters: ActiveFilter[];
  onFilterChange: (filters: ActiveFilter[]) => void;
  onSearch?: (term: string) => void; // Make onSearch optional
  searchPlaceholder?: string;
  searchQuery?: string;
  rightSection?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterGroups,
  activeFilters,
  onFilterChange,
  onSearch,
  searchPlaceholder = "Search...",
  searchQuery = "",
  rightSection,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleRemoveFilter = (groupId: string, optionId: string) => {
    const newFilters = activeFilters.filter(
      (f) => !(f.groupId === groupId && f.optionId === optionId)
    );
    onFilterChange(newFilters);
  };

  const handleClearAllFilters = () => {
    onFilterChange([]);
  };

  const getFilterLabel = (filter: ActiveFilter) => {
    const group = filterGroups.find((g) => g.id === filter.groupId);
    const option = group?.options.find((o) => o.id === filter.optionId);
    return option ? option.label : "";
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="pl-8 pr-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="flex items-center gap-2">
          <FilterButton 
            onClick={handleFilterToggle} 
            count={activeFilters.length} 
          />
          {rightSection}
        </div>
      </div>

      {isFilterOpen && (
        <FilterPopover
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center mt-2">
          {activeFilters.map((filter) => (
            <Badge
              key={`${filter.groupId}-${filter.optionId}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {getFilterLabel(filter)}
              <button
                onClick={() => handleRemoveFilter(filter.groupId, filter.optionId)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAllFilters}
            className="h-auto py-1 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
