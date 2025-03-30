
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, RefreshCw, FileDown } from "lucide-react";
import { ClaimsFilterOptions } from "@/hooks/useClaims";

interface ClaimsFiltersProps {
  filters: ClaimsFilterOptions;
  onFilterChange: (filters: ClaimsFilterOptions) => void;
  onRefresh: () => void;
  onExport: () => void;
  isExporting: boolean;
}

const ClaimsFilters: React.FC<ClaimsFiltersProps> = ({
  filters,
  onFilterChange,
  onRefresh,
  onExport,
  isExporting
}) => {
  const { t } = useLanguage();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value === "all" ? "" : value });
  };

  const handleStartDateChange = (date: Date | null) => {
    onFilterChange({ ...filters, startDate: date });
  };

  const handleEndDateChange = (date: Date | null) => {
    onFilterChange({ ...filters, endDate: date });
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <Label htmlFor="search">{t("search")}</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              className="pl-8"
              placeholder={t("searchClaimsByPolicyOrReference")}
              value={filters.searchTerm || ""}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="w-full md:w-40">
          <Label htmlFor="status">{t("status")}</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder={t("allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
              <SelectItem value="in processing">{t("inProcessing")}</SelectItem>
              <SelectItem value="reported">{t("reported")}</SelectItem>
              <SelectItem value="accepted">{t("accepted")}</SelectItem>
              <SelectItem value="rejected">{t("rejected")}</SelectItem>
              <SelectItem value="partially accepted">{t("partiallyAccepted")}</SelectItem>
              <SelectItem value="appealed">{t("appealed")}</SelectItem>
              <SelectItem value="withdrawn">{t("withdrawn")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
          <div>
            <Label htmlFor="startDate">{t("startDate")}</Label>
            <DatePicker
              date={filters.startDate || undefined}
              setDate={handleStartDateChange}
            />
          </div>
          <div>
            <Label htmlFor="endDate">{t("endDate")}</Label>
            <DatePicker
              date={filters.endDate || undefined}
              setDate={handleEndDateChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="text-muted-foreground"
        >
          {t("clearFilters")}
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t("refresh")}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center gap-1"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>{isExporting ? t("exporting") : t("export")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClaimsFilters;
