
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchInput from "@/components/ui/search-input";
import FilterButton from "@/components/codebook/filters/FilterButton";
import SavedFiltersMenu from "@/components/codebook/filters/SavedFiltersMenu";
import ActiveFilters from "@/components/codebook/filters/ActiveFilters";
import { CodebookFilterState, SavedFilter } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: CodebookFilterState;
  onFilterChange: (filters: CodebookFilterState) => void;
  onClearFilter: (key: keyof CodebookFilterState) => void;
  onOpenFilterDialog: () => void;
  activeFilterCount: number;
  // Saved filters props
  savedFilters?: SavedFilter[];
  onOpenSaveFilterDialog?: () => void;
  onDeleteFilter?: (filterId: string) => Promise<void>;
}

const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilter,
  onOpenFilterDialog,
  activeFilterCount,
  savedFilters = [],
  onOpenSaveFilterDialog,
  onDeleteFilter
}) => {
  const { t } = useLanguage();
  
  const showSavedFilters = !!onOpenSaveFilterDialog && !!onDeleteFilter;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={t("searchProducts")}
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
            <SavedFiltersMenu
              savedFilters={savedFilters}
              onApplyFilter={onFilterChange}
              onDeleteFilter={onDeleteFilter!}
              onOpenSaveDialog={onOpenSaveFilterDialog!}
              entityType="products"
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
        filterLabels={{
          category: t("category"),
          insurer: t("insurer")
        }}
      />
    </>
  );
};

export default ProductsFilters;
