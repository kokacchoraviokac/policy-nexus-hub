
import React, { ChangeEvent, useState } from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import FilterButton from "./FilterButton";

export interface FilterGroup {
  id: string;
  label: string;
  options: {
    id: string;
    label: string;
    value: string;
  }[];
}

export interface ActiveFilter {
  groupId: string;
  optionId: string;
  value: string;
}

export interface FilterBarProps {
  filterGroups: FilterGroup[];
  activeFilters: ActiveFilter[];
  onFilterChange: (filters: ActiveFilter[]) => void;
  onSearch?: (term: string) => void; // Add onSearch prop
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
  rightSection
}) => {
  const { t } = useLanguage();
  const [searchValue, setSearchValue] = useState(searchQuery);
  
  const handleRemoveFilter = (indexToRemove: number) => {
    const newFilters = [...activeFilters];
    newFilters.splice(indexToRemove, 1);
    onFilterChange(newFilters);
  };
  
  const handleClearAllFilters = () => {
    onFilterChange([]);
  };
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Only call onSearch if it exists
    if (onSearch) {
      onSearch(value);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-8 w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 sm:flex-none flex gap-2">
            {filterGroups.map((group) => (
              <FilterButton
                key={group.id}
                group={group}
                activeFilters={activeFilters}
                onFilterChange={onFilterChange}
              />
            ))}
          </div>
          
          {rightSection && (
            <div className="flex-none">{rightSection}</div>
          )}
        </div>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <div className="text-sm text-muted-foreground">
            {t("activeFilters")}:
          </div>
          {activeFilters.map((filter, index) => {
            const group = filterGroups.find((g) => g.id === filter.groupId);
            const option = group?.options.find((o) => o.id === filter.optionId);
            return (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {group?.label}: {option?.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveFilter(index)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">{t("removeFilter")}</span>
                </Button>
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground h-7 px-2 text-xs"
            onClick={handleClearAllFilters}
          >
            {t("clearAll")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
