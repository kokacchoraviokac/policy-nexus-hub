
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Search, X, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { InvoiceFilterOptions } from "@/hooks/finances/useInvoices";

interface InvoicesFiltersProps {
  filters: InvoiceFilterOptions;
  onFilterChange: (filters: InvoiceFilterOptions) => void;
  onClearFilters: () => void;
}

const InvoicesFilters: React.FC<InvoicesFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, searchTerm });
  };
  
  const handleStatusChange = (status: string) => {
    onFilterChange({ ...filters, status });
  };
  
  const handleStartDateChange = (date: Date | null) => {
    onFilterChange({ ...filters, startDate: date });
  };
  
  const handleEndDateChange = (date: Date | null) => {
    onFilterChange({ ...filters, endDate: date });
  };
  
  const activeFilterCount = [
    filters.status !== "all",
    !!filters.startDate,
    !!filters.endDate,
  ].filter(Boolean).length;
  
  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchInvoices")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button type="submit">{t("search")}</Button>
      </form>
      
      <div className="flex items-center flex-wrap gap-2">
        <Select
          value={filters.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder={t("selectStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="draft">{t("draft")}</SelectItem>
            <SelectItem value="issued">{t("issued")}</SelectItem>
            <SelectItem value="paid">{t("paid")}</SelectItem>
            <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              {t("advancedFilters")}
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5 text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[220px]">
            <DropdownMenuLabel>{t("dateRange")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="text-xs mb-1">{t("from")}</span>
                <DatePicker
                  date={filters.startDate}
                  setDate={handleStartDateChange}
                  placeholder={t("selectDate")}
                />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start mt-2">
                <span className="text-xs mb-1">{t("to")}</span>
                <DatePicker
                  date={filters.endDate}
                  setDate={handleEndDateChange}
                  placeholder={t("selectDate")}
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {(filters.status !== "all" ||
          filters.startDate ||
          filters.endDate) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9"
            onClick={onClearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            {t("clearFilters")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InvoicesFilters;
