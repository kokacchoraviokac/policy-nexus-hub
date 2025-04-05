
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FilterGroup } from "@/types/filters";
import FilterPopover from "./FilterPopover";

interface FilterBarProps {
  filters: FilterGroup[];
  activeFilters?: Record<string, string[]>;
  onFilterChange: (filterId: string, value: string) => void;
  onFilterClear: (filterId: string, value?: string) => void;
  className?: string;
  multiSelect?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  activeFilters = {},
  onFilterChange,
  onFilterClear,
  className = "",
  multiSelect = false
}) => {
  const { t } = useLanguage();
  
  // Check if there are any active filters
  const hasActiveFilters = Object.values(activeFilters).some(values => values.length > 0);
  
  const handleFilterChange = (filterId: string, value: string) => {
    onFilterChange(filterId, value);
  };
  
  const handleClearFilter = (filterId: string, value?: string) => {
    onFilterClear(filterId, value);
  };
  
  const handleClearAll = () => {
    // Clear all active filters
    Object.keys(activeFilters).forEach(filterId => {
      onFilterClear(filterId);
    });
  };
  
  return (
    <Card className={`shadow-sm ${className}`}>
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter buttons */}
          {filters.map((filter) => (
            <FilterPopover key={filter.id} className="min-w-[200px]">
              <div className="p-3">
                <h3 className="font-medium mb-2">{filter.label}</h3>
                <div className="space-y-1">
                  {filter.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center"
                    >
                      <label
                        htmlFor={`filter-${filter.id}-${option.id}`}
                        className="flex items-center w-full cursor-pointer text-sm p-1.5 rounded hover:bg-muted"
                      >
                        <input
                          type={multiSelect ? "checkbox" : "radio"}
                          id={`filter-${filter.id}-${option.id}`}
                          name={filter.id}
                          value={option.value || option.id}
                          checked={
                            activeFilters[filter.id]?.includes(
                              option.value || option.id
                            ) || false
                          }
                          onChange={() =>
                            handleFilterChange(
                              filter.id,
                              option.value || option.id
                            )
                          }
                          className="mr-2"
                        />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </FilterPopover>
          ))}
          
          {/* Clear all button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="gap-1"
            >
              <X className="h-3.5 w-3.5" />
              {t("clearAll")}
            </Button>
          )}
          
          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1 ml-1">
              {Object.entries(activeFilters).map(([filterId, values]) =>
                values.map((value) => {
                  const filterGroup = filters.find((f) => f.id === filterId);
                  const option = filterGroup?.options.find(
                    (o) => o.value === value || o.id === value
                  );
                  
                  if (!option) return null;
                  
                  return (
                    <div
                      key={`${filterId}-${value}`}
                      className="flex items-center bg-muted rounded-full px-2 py-1 text-xs"
                    >
                      <span className="mr-1">{option.label}</span>
                      <button
                        onClick={() => handleClearFilter(filterId, value)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
