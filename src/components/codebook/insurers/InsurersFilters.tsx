
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchInput from "@/components/ui/search-input";
import FilterButton from "@/components/codebook/filters/FilterButton";
import SimpleSavedFiltersButton from "@/components/codebook/filters/SimpleSavedFiltersButton";
import ActiveFilters from "@/components/codebook/filters/ActiveFilters";
import { CodebookFilterState } from "@/types/codebook";
import { SavedFilter } from "@/types/savedFilters";
import { useLanguage } from "@/contexts/LanguageContext";

interface InsurersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: CodebookFilterState;
  onFilterChange: (filters: CodebookFilterState) => void;
  onClearFilter: (key: keyof CodebookFilterState) => void;
  onOpenFilterDialog: () => void;
  activeFilterCount: number;
  // Saved filters props
  savedFilters: SavedFilter[];
  onSaveFilter: (name: string) => void;
  onDeleteFilter: (filterId: string) => void;
  isSaving?: boolean;
  isDeleting?: boolean;
  parseFilterData: (filter: SavedFilter) => CodebookFilterState;
  showSavedFilters?: boolean;
}

const InsurersFilters: React.FC<InsurersFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilter,
  onOpenFilterDialog,
  activeFilterCount,
  // Saved filters props
  savedFilters,
  onSaveFilter,
  onDeleteFilter,
  isSaving,
  isDeleting,
  parseFilterData,
  showSavedFilters = true
}) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={t("searchInsuranceCompanies")}
          className="w-full sm:max-w-xs"
        />
        
        <div className="flex flex-wrap gap-2 items-center">
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => onFilterChange({ ...filters, status: value as 'all' | 'active' | 'inactive' })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatus")}</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="inactive">{t("inactive")}</SelectItem>
            </SelectContent>
          </Select>
          
          {showSavedFilters && (
            <SimpleSavedFiltersButton
              savedFilters={savedFilters}
              onApplyFilter={onFilterChange}
              onSaveFilter={onSaveFilter}
              onDeleteFilter={onDeleteFilter}
              currentFilters={filters}
              isSaving={isSaving}
              isDeleting={isDeleting}
              parseFilterData={parseFilterData}
              entityType="insurers"
            />
          )}
          
          <FilterButton
            activeFilterCount={activeFilterCount}
            onClick={onOpenFilterDialog}
          />
        </div>
      </div>
      
      <ActiveFilters 
        filters={filters} 
        onClearFilter={onClearFilter}
      />
    </>
  );
};

export default InsurersFilters;
