
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { FilterOptions } from "@/hooks/unlinked-payments/useUnlinkedPaymentsFilters";

export interface UnlinkedPaymentsFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

export const UnlinkedPaymentsFilters: React.FC<UnlinkedPaymentsFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const { t } = useLanguage();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };
  
  const handleStatusChange = (value: string) => {
    // Make sure we use "all" rather than empty string
    onFilterChange({ ...filters, status: value });
  };
  
  const handleStartDateChange = (date: Date | null) => {
    onFilterChange({ ...filters, dateFrom: date, startDate: date });
  };
  
  const handleEndDateChange = (date: Date | null) => {
    onFilterChange({ ...filters, dateTo: date, endDate: date });
  };
  
  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search">{t("search")}</Label>
          <Input
            id="search"
            placeholder={t("searchPlaceholder")}
            value={filters.searchTerm || ""}
            onChange={handleSearchChange}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="status">{t("status")}</Label>
          <Select 
            value={filters.status || "all"} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status" className="mt-1">
              <SelectValue placeholder={t("all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="unlinked">{t("unlinked")}</SelectItem>
              <SelectItem value="linked">{t("linked")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>{t("from")}</Label>
          <DatePicker
            date={filters.dateFrom || filters.startDate}
            setDate={handleStartDateChange}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>{t("to")}</Label>
          <DatePicker
            date={filters.dateTo || filters.endDate}
            setDate={handleEndDateChange}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground"
        >
          {t("clearFilters")}
        </Button>
      </div>
    </div>
  );
};
