
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FilterOptions } from "@/hooks/unlinked-payments/useUnlinkedPaymentsFilters";
import { 
  Search, 
  CalendarIcon, 
  RefreshCw, 
  X, 
  FilterX 
} from "lucide-react";
import { format } from "date-fns";

interface UnlinkedPaymentsFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const UnlinkedPaymentsFilters: React.FC<UnlinkedPaymentsFiltersProps> = ({
  filters,
  onFiltersChange,
  onRefresh,
  isLoading
}) => {
  const { t } = useLanguage();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchTerm: e.target.value });
  };
  
  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value });
  };
  
  const handleStartDateChange = (date: Date | undefined) => {
    onFiltersChange({ ...filters, startDate: date || null });
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    onFiltersChange({ ...filters, endDate: date || null });
  };
  
  const handleClearFilters = () => {
    onFiltersChange({
      searchTerm: "",
      startDate: null,
      endDate: null,
      status: "unlinked"
    });
  };
  
  const hasActiveFilters = 
    !!filters.searchTerm || 
    !!filters.startDate || 
    !!filters.endDate || 
    filters.status !== "unlinked";
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-8"
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
          {filters.searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1.5 h-7 w-7 p-0"
              onClick={() => onFiltersChange({ ...filters, searchTerm: "" })}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t("clear")}</span>
            </Button>
          )}
        </div>
        
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="unlinked">{t("unlinked")}</SelectItem>
            <SelectItem value="linked">{t("linked")}</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? (
                format(filters.startDate, "PPP")
              ) : (
                <span>{t("from")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.startDate || undefined}
              onSelect={handleStartDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate ? (
                format(filters.endDate, "PPP")
              ) : (
                <span>{t("to")}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.endDate || undefined}
              onSelect={handleEndDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {t("refreshList")}
        </Button>
      </div>
      
      {hasActiveFilters && (
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="h-8 px-2 text-muted-foreground"
          >
            <FilterX className="mr-2 h-4 w-4" />
            {t("clearFilters")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UnlinkedPaymentsFilters;
