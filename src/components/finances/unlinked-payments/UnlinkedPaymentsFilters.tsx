
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Search, X } from "lucide-react";
import { FilterOptions } from "@/hooks/useUnlinkedPayments";

interface UnlinkedPaymentsFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onRefresh: () => void;
}

const UnlinkedPaymentsFilters: React.FC<UnlinkedPaymentsFiltersProps> = ({
  filters,
  onFiltersChange,
  onRefresh
}) => {
  const { t } = useLanguage();
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm || "");
  
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
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
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
      
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1">
          <div>
            <label className="text-sm font-medium mb-1 block">{t("status")}</label>
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
          
          <div>
            <label className="text-sm font-medium mb-1 block">{t("from")}</label>
            <DatePicker
              date={filters.startDate || undefined}
              setDate={handleStartDateChange}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">{t("to")}</label>
            <DatePicker
              date={filters.endDate || undefined}
              setDate={handleEndDateChange}
            />
          </div>
          
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClearFilters}
            >
              <X className="mr-2 h-4 w-4" />
              {t("clearFilters")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlinkedPaymentsFilters;
