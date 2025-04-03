
import React from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export interface FilterOption<T = string> {
  id: string;
  label: string;
  value: T;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  multiSelect?: boolean;
}

export interface ActiveFilter {
  groupId: string;
  optionId: string;
}

interface FilterBarProps {
  filterGroups: FilterGroup[];
  activeFilters: ActiveFilter[];
  onFilterChange: (filters: ActiveFilter[]) => void;
  onClearFilters: () => void;
  className?: string;
  renderFilterContent?: (
    group: FilterGroup,
    activeFilters: ActiveFilter[],
    onChange: (groupId: string, optionId: string, isActive: boolean) => void
  ) => React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterGroups,
  activeFilters,
  onFilterChange,
  onClearFilters,
  className,
  renderFilterContent,
}) => {
  const { t } = useLanguage();
  
  const handleFilterToggle = (groupId: string, optionId: string, isActive: boolean) => {
    let newFilters: ActiveFilter[];
    
    const group = filterGroups.find(g => g.id === groupId);
    const isMultiSelect = group?.multiSelect ?? false;
    
    if (isActive) {
      // Remove filter if it's already active
      newFilters = activeFilters.filter(
        filter => !(filter.groupId === groupId && filter.optionId === optionId)
      );
    } else {
      if (isMultiSelect) {
        // Add to existing filters for multi-select groups
        newFilters = [...activeFilters, { groupId, optionId }];
      } else {
        // Replace existing filter for the group for single-select groups
        newFilters = [
          ...activeFilters.filter(filter => filter.groupId !== groupId),
          { groupId, optionId }
        ];
      }
    }
    
    onFilterChange(newFilters);
  };
  
  const handleRemoveFilter = (groupId: string, optionId: string) => {
    const newFilters = activeFilters.filter(
      filter => !(filter.groupId === groupId && filter.optionId === optionId)
    );
    onFilterChange(newFilters);
  };

  const getActiveFilterLabels = () => {
    return activeFilters.map(filter => {
      const group = filterGroups.find(g => g.id === filter.groupId);
      const option = group?.options.find(o => o.id === filter.optionId);
      return {
        groupId: filter.groupId,
        optionId: filter.optionId,
        label: `${group?.label}: ${option?.label || filter.optionId}`
      };
    });
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2 items-center">
        {filterGroups.map((group) => (
          <DropdownMenu key={group.id}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                {group.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {renderFilterContent ? (
                renderFilterContent(
                  group,
                  activeFilters,
                  handleFilterToggle
                )
              ) : (
                <div className="p-2 space-y-2">
                  {group.options.map((option) => {
                    const isActive = activeFilters.some(
                      filter => filter.groupId === group.id && filter.optionId === option.id
                    );
                    return (
                      <div 
                        key={option.id} 
                        className="flex items-center p-1.5 text-sm rounded-md cursor-pointer hover:bg-muted"
                        onClick={() => handleFilterToggle(group.id, option.id, isActive)}
                      >
                        <div className={cn(
                          "w-4 h-4 border mr-2 rounded flex items-center justify-center",
                          isActive ? "bg-primary border-primary text-white" : "border-input"
                        )}>
                          {isActive && <span className="text-[10px]">✓</span>}
                        </div>
                        <span>{option.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
        
        {activeFilters.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground" 
            onClick={onClearFilters}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            {t("clearFilters")}
          </Button>
        )}
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {getActiveFilterLabels().map((filter) => (
            <Badge 
              key={`${filter.groupId}-${filter.optionId}`}
              variant="outline"
              className="pr-1 bg-muted/50"
            >
              <span className="mr-1">{filter.label}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveFilter(filter.groupId, filter.optionId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
