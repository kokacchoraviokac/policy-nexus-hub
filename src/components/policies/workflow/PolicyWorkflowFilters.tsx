
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Search, X } from "lucide-react";
import StatusSelector from "@/components/common/StatusSelector";
import { WorkflowPolicyFilters } from "@/hooks/useWorkflowPolicies";

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

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value });
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    onFiltersChange({
      ...filters,
      dateFrom: range.from,
      dateTo: range.to,
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
        <div className="flex-1 flex relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPoliciesByNumber")}
            className="pl-8"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <StatusSelector
          value={filters.status}
          onValueChange={handleStatusChange}
          showAllOption
          allOptionText={t("allWorkflowStatuses")}
          statusOptions={["draft", "review", "approved", "finalized"]}
          className="w-full md:w-[250px]"
        />

        <DatePickerWithRange
          dateRange={{
            from: filters.dateFrom,
            to: filters.dateTo,
          }}
          onDateRangeChange={handleDateRangeChange}
          className="w-full md:w-[300px]"
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="flex items-center"
        >
          <X className="h-4 w-4 mr-1" />
          {t("clearFilters")}
        </Button>
      </div>
    </div>
  );
};

export default PolicyWorkflowFilters;
