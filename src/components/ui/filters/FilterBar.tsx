
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import FilterButton from "../filter/FilterButton";

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface ActiveFilter {
  groupId: string;
  optionId: string;
  label: string;
  value: string;
}

export interface FilterBarProps {
  filterGroups: FilterGroup[];
  activeFilters: ActiveFilter[];
  onFilterChange: (filters: ActiveFilter[]) => void;
  onClearFilters?: () => void;
  searchPlaceholder?: string;
  searchQuery?: string;
  rightSection?: React.ReactNode;
  onSearch?: (term: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterGroups,
  activeFilters,
  onFilterChange,
  onClearFilters,
  searchPlaceholder = "Search...",
  searchQuery = "",
  rightSection,
  onSearch,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [selectedFilters, setSelectedFilters] = useState<ActiveFilter[]>(activeFilters || []);

  // Set of active filter IDs for quick lookup
  const activeFilterIds = new Set(
    activeFilters?.map((filter) => `${filter.groupId}-${filter.optionId}`)
  );

  const handleToggleFilter = (
    groupId: string,
    optionId: string,
    label: string,
    value: string
  ) => {
    const filterKey = `${groupId}-${optionId}`;
    const isActive = activeFilterIds.has(filterKey);

    let newFilters: ActiveFilter[];

    if (isActive) {
      // Remove filter if already active
      newFilters = selectedFilters.filter(
        (f) => !(f.groupId === groupId && f.optionId === optionId)
      );
    } else {
      // Add filter if not active
      newFilters = [
        ...selectedFilters,
        { groupId, optionId, label, value },
      ];
    }

    setSelectedFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(selectedFilters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
    if (onClearFilters) {
      onClearFilters();
    }
    setIsOpen(false);
  };

  const handleRemoveFilter = (groupId: string, optionId: string) => {
    const newFilters = activeFilters.filter(
      (f) => !(f.groupId === groupId && f.optionId === optionId)
    );
    onFilterChange(newFilters);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(localSearchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(localSearchQuery);
    }
  };

  return (
    <div className="bg-card rounded-md border p-4 mb-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {localSearchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
                onClick={() => {
                  setLocalSearchQuery("");
                  if (onSearch) onSearch("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-2 items-center">
            {onSearch && (
              <Button 
                className="whitespace-nowrap" 
                onClick={handleSearch}
              >
                <Search className="mr-2 h-4 w-4" />
                {t("search")}
              </Button>
            )}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <div>
                  <FilterButton
                    count={activeFilters?.length}
                    onClick={() => setIsOpen(true)}
                  />
                </div>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{t("filters")}</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {filterGroups.map((group) => (
                    <div key={group.id} className="mb-4">
                      <h3 className="text-sm font-medium mb-2">{group.label}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((option) => {
                          const isActive = activeFilterIds.has(
                            `${group.id}-${option.id}`
                          );
                          return (
                            <Badge
                              key={option.id}
                              variant={isActive ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() =>
                                handleToggleFilter(
                                  group.id,
                                  option.id,
                                  option.label,
                                  option.value
                                )
                              }
                            >
                              {option.label}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    disabled={selectedFilters.length === 0}
                  >
                    {t("clearAll")}
                  </Button>
                  <Button onClick={handleApplyFilters}>
                    {t("applyFilters")}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {rightSection}
          </div>
        </div>

        {/* Active filters */}
        {activeFilters && activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center mt-2">
            <span className="text-sm text-muted-foreground">
              {t("activeFilters")}:
            </span>
            {activeFilters.map((filter) => (
              <Badge
                key={`${filter.groupId}-${filter.optionId}`}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {filter.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemoveFilter(filter.groupId, filter.optionId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={onClearFilters}
              >
                {t("clearAll")}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
