
import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CodebookFilterState } from "@/types/codebook";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";

interface ActiveFiltersProps {
  filters: CodebookFilterState;
  onClearFilter: (key: keyof CodebookFilterState) => void;
  filterLabels?: {
    status?: string;
    city?: string;
    country?: string;
    category?: string;
    insurer?: string;
    createdAfter?: string;
    createdBefore?: string;
  };
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onClearFilter,
  filterLabels = {}
}) => {
  const { t } = useLanguage();
  
  // Check if there are any active filters
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'status') return value && value !== 'all';
    if (typeof value === 'string') return value && value.trim() !== '';
    return value !== null && value !== undefined;
  });
  
  if (!hasActiveFilters) return null;
  
  return (
    <div className="flex flex-wrap gap-2 my-2">
      <span className="text-sm text-muted-foreground pt-1">
        {t("activeFilters")}:
      </span>
      
      {filters.status && filters.status !== 'all' && (
        <Badge variant="outline" className="flex items-center gap-1">
          {filterLabels.status || t("status")}: {filters.status === 'active' ? t("active") : t("inactive")}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onClearFilter('status')}
          />
        </Badge>
      )}
      
      {filters.city && filters.city.trim() !== '' && (
        <Badge variant="outline" className="flex items-center gap-1">
          {filterLabels.city || t("city")}: {filters.city}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onClearFilter('city')}
          />
        </Badge>
      )}
      
      {filters.country && filters.country.trim() !== '' && (
        <Badge variant="outline" className="flex items-center gap-1">
          {filterLabels.country || t("country")}: {filters.country}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onClearFilter('country')}
          />
        </Badge>
      )}
      
      {filters.category && filters.category.trim() !== '' && (
        <Badge variant="outline" className="flex items-center gap-1">
          {filterLabels.category || t("category")}: {filters.category}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onClearFilter('category')}
          />
        </Badge>
      )}
      
      {filters.insurer && filters.insurer.trim() !== '' && (
        <Badge variant="outline" className="flex items-center gap-1">
          {filterLabels.insurer || t("insurer")}: {filters.insurer}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onClearFilter('insurer')}
          />
        </Badge>
      )}
      
      {filters.createdAfter && (
        <Badge variant="outline" className="flex items-center gap-1">
          {filterLabels.createdAfter || t("createdAfter")}: {format(filters.createdAfter, "PPP")}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onClearFilter('createdAfter')}
          />
        </Badge>
      )}
      
      {filters.createdBefore && (
        <Badge variant="outline" className="flex items-center gap-1">
          {filterLabels.createdBefore || t("createdBefore")}: {format(filters.createdBefore, "PPP")}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onClearFilter('createdBefore')}
          />
        </Badge>
      )}
    </div>
  );
};

export default ActiveFilters;
