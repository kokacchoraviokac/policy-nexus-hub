
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Search, X, RefreshCw, DollarSign, Filter } from "lucide-react";
import { FilterOptions } from "@/hooks/useUnlinkedPayments";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm || "");
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  
  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value });
  };
  
  const handleStartDateChange = (date: Date | undefined) => {
    onFiltersChange({ ...filters, startDate: date || null });
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    onFiltersChange({ ...filters, endDate: date || null });
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, searchTerm: localSearchTerm });
  };
  
  const handleClearFilters = () => {
    setLocalSearchTerm("");
    onFiltersChange({
      searchTerm: "",
      startDate: null,
      endDate: null,
      status: "unlinked"
    });
    setIsAdvancedFiltersOpen(false);
  };

  // Check if any filters are applied
  const hasActiveFilters = 
    !!filters.searchTerm || 
    !!filters.startDate || 
    !!filters.endDate || 
    filters.status !== "unlinked";

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button type="submit" variant="default">
            {t("search")}
          </Button>
        </form>
        
        <div className="flex gap-2">
          <Popover open={isAdvancedFiltersOpen} onOpenChange={setIsAdvancedFiltersOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={hasActiveFilters ? "border-primary text-primary hover:text-primary" : ""}
              >
                <Filter className="mr-2 h-4 w-4" />
                {t("filters")}
                {hasActiveFilters && (
                  <span className="ml-1 w-4 h-4 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                    {(!!filters.searchTerm ? 1 : 0) + 
                     (!!filters.startDate ? 1 : 0) + 
                     (!!filters.endDate ? 1 : 0) + 
                     (filters.status !== "unlinked" ? 1 : 0)}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4 p-1">
                <h4 className="font-medium">{t("advancedFilters")}</h4>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("status")}</label>
                  <Select
                    value={filters.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("all")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("all")}</SelectItem>
                      <SelectItem value="linked">{t("linked")}</SelectItem>
                      <SelectItem value="unlinked">{t("unlinked")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("dateRange")}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{t("from")}</label>
                      <DatePicker
                        date={filters.startDate || undefined}
                        setDate={handleStartDateChange}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">{t("to")}</label>
                      <DatePicker
                        date={filters.endDate || undefined}
                        setDate={handleEndDateChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                  >
                    <X className="mr-2 h-3 w-3" />
                    {t("clearFilters")}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    onClick={() => setIsAdvancedFiltersOpen(false)}
                  >
                    {t("applyFilters")}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            onClick={onRefresh} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">{t("refresh")}</span>
          </Button>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm p-2 bg-muted/30 rounded-md">
          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{t("activeFilters")}:</span>
          
          {filters.status !== "unlinked" && (
            <div className="bg-background border px-2 py-1 rounded-md flex items-center gap-1">
              <span>{t(filters.status)}</span>
              <button 
                onClick={() => handleStatusChange("unlinked")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.searchTerm && (
            <div className="bg-background border px-2 py-1 rounded-md flex items-center gap-1">
              <span className="max-w-[100px] truncate">{filters.searchTerm}</span>
              <button 
                onClick={() => {
                  setLocalSearchTerm("");
                  onFiltersChange({ ...filters, searchTerm: "" });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.startDate && (
            <div className="bg-background border px-2 py-1 rounded-md flex items-center gap-1">
              <span>{t("from")}: {new Date(filters.startDate).toLocaleDateString()}</span>
              <button 
                onClick={() => handleStartDateChange(undefined)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {filters.endDate && (
            <div className="bg-background border px-2 py-1 rounded-md flex items-center gap-1">
              <span>{t("to")}: {new Date(filters.endDate).toLocaleDateString()}</span>
              <button 
                onClick={() => handleEndDateChange(undefined)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto" 
            onClick={handleClearFilters}
          >
            {t("clearAll")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UnlinkedPaymentsFilters;
