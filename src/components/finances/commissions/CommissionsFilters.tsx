
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, X, Filter } from "lucide-react";
import { CommissionFilterOptions } from "@/hooks/commissions/useCommissionFilters";

export interface CommissionsFiltersProps {
  filters: CommissionFilterOptions;
  onFilterChange: (filters: CommissionFilterOptions) => void;
}

const CommissionsFilters: React.FC<CommissionsFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const { t } = useLanguage();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    onFilterChange({ ...filters, startDate: date || null });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    onFilterChange({ ...filters, endDate: date || null });
  };

  const handleClearFilters = () => {
    onFilterChange({
      searchTerm: "",
      startDate: null,
      endDate: null,
      status: "all",
    });
  };

  return (
    <div className="flex flex-wrap items-end gap-4 mb-4">
      <div className="flex-1">
        <Input
          placeholder={t("searchCommissions")}
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>

      <div>
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCommissions")}</SelectItem>
            <SelectItem value="due">{t("dueCommissions")}</SelectItem>
            <SelectItem value="paid">{t("paidCommissions")}</SelectItem>
            <SelectItem value="partially_paid">{t("partiallyPaid")}</SelectItem>
            <SelectItem value="calculating">{t("calculatingCommissions")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[160px] pl-3 pr-0">
              <span className="flex-1 text-left">
                {filters.startDate ? (
                  format(filters.startDate, "PPP")
                ) : (
                  <span>{t("from")}</span>
                )}
              </span>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
              {filters.startDate && (
                <X
                  className="ml-1 h-4 w-4 hover:opacity-100 opacity-60"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartDateChange(undefined);
                  }}
                />
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
      </div>

      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[160px] pl-3 pr-0">
              <span className="flex-1 text-left">
                {filters.endDate ? (
                  format(filters.endDate, "PPP")
                ) : (
                  <span>{t("to")}</span>
                )}
              </span>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
              {filters.endDate && (
                <X
                  className="ml-1 h-4 w-4 hover:opacity-100 opacity-60"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEndDateChange(undefined);
                  }}
                />
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
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleClearFilters}
        className="h-10"
      >
        <X className="h-4 w-4 mr-2" />
        {t("clearFilters")}
      </Button>
    </div>
  );
};

export default CommissionsFilters;
