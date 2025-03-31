
import React from "react";
import SearchInput from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FilterButton from "../filters/FilterButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { CodebookFilterState } from "@/types/codebook";

interface ProductsFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: CodebookFilterState;
  onFilterChange: (filters: CodebookFilterState) => void;
  activeFilterCount: number;
  onOpenFilterDialog: () => void;
}

const ProductsFilterBar: React.FC<ProductsFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  onFilterChange,
  activeFilterCount,
  onOpenFilterDialog
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={t("searchProducts")}
        className="w-full sm:max-w-xs"
      />
      
      <div className="flex gap-2 items-center">
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
        
        <FilterButton
          activeFilterCount={activeFilterCount}
          onClick={onOpenFilterDialog}
        />
      </div>
    </div>
  );
};

export default ProductsFilterBar;
