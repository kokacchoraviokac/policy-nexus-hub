
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";
import { WorkflowPolicyFilters } from "@/hooks/useWorkflowPolicies";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface PolicyWorkflowFiltersProps {
  filters: WorkflowPolicyFilters;
  onFiltersChange: (filters: WorkflowPolicyFilters) => void;
}

const PolicyWorkflowFilters: React.FC<PolicyWorkflowFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const { t } = useLanguage();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFiltersChange({
      ...filters,
      dateFrom: range?.from,
      dateTo: range?.to,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      dateFrom: undefined,
      dateTo: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPolicies")}
            className="pl-8"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="w-full md:w-auto">
          <DatePickerWithRange
            dateRange={{ from: filters.dateFrom, to: filters.dateTo }}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
        
        {(filters.search || filters.status !== "all" || filters.dateFrom || filters.dateTo) && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-1" />
            {t("clearFilters")}
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.status === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => handleStatusChange("all")}
          className="text-xs px-3"
        >
          {t("allStatuses")}
        </Button>
        <Button
          variant={filters.status === "draft" ? "default" : "outline"}
          size="sm"
          onClick={() => handleStatusChange("draft")}
          className="text-xs px-3"
        >
          {t("draft")}
        </Button>
        <Button
          variant={filters.status === "in_review" ? "default" : "outline"}
          size="sm"
          onClick={() => handleStatusChange("in_review")}
          className="text-xs px-3"
        >
          {t("inReview")}
        </Button>
        <Button
          variant={filters.status === "ready" ? "default" : "outline"}
          size="sm"
          onClick={() => handleStatusChange("ready")}
          className="text-xs px-3"
        >
          {t("ready")}
        </Button>
        <Button
          variant={filters.status === "complete" ? "default" : "outline"}
          size="sm"
          onClick={() => handleStatusChange("complete")}
          className="text-xs px-3"
        >
          {t("complete")}
        </Button>
      </div>
    </div>
  );
};

export default PolicyWorkflowFilters;
